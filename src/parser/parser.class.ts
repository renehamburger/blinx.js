import { LanguageCode } from 'src/options/languages';
import { loadScript } from 'src/helpers/dom';
import { Options } from 'src/options/options';
import { decode } from 'src/helpers/decode';

export interface TextTransformationInfo {
  transformedText: string;
  transformations: {
    oldStart: number;
    newStart: number;
    oldString: string;
    newString: string;
  }[];
}

export class Parser {
  get characters() {
    return {
      spaces: '\\s\xa0',
      dashes: '\\-\u2013\u2014',
      chapterVerseSeparator: this._chapterVerseSeparator,
      itemSeparators: '.,'
    };
  }

  private _bcv?: BCV.Parser;
  private _chapterVerseSeparator: ',' | ':' = ':';

  public static getCurrentParserLanguage(): LanguageCode | false {
    if (window.bcv_parser) {
      const parser: BCV.Parser = new window.bcv_parser();
      if (parser.languages.length === 1) {
        return parser.languages[0] as LanguageCode;
      }
    }
    return false;
  }

  public static isRangeAndExpression(text: string): boolean {
    if (window.bcv_parser) {
      const parser: BCV.Parser = new window.bcv_parser();
      return new RegExp(parser.regexps.range_and).test(text);
    }
    return false;
  }

  private get bcv(): BCV.Parser {
    if (this._bcv) {
      return this._bcv;
    }
    throw new Error('The bcv_parser script has not been loaded successfully yet.');
  }

  /** Load bcv parser script for the given language */
  public load(options: Options, callback?: (successful: boolean) => void) {
    if (Parser.getCurrentParserLanguage() === options.language) {
      this.initBcvParser(options);
      this._bcv = this._bcv || new window.bcv_parser();
      if (callback) {
        callback(true);
      }
    } else {
      loadScript('https://cdn.rawgit.com/renehamburger/Bible-Passage-Reference-Parser/99f03385/js/' +
        `${options.language}_bcv_parser.js`,
        successful => {
          if (successful) {
            this.initBcvParser(options);
          }
          if (callback) {
            callback(successful);
          }
        });
    }
  }

  /** Wrapper for BCV's reset: @see BCV.reset() */
  public reset() {
    this.bcv.reset();
  }

  /** Wrapper for BCV's parse: @see BCV.parse() */
  public parse(text: string) {
    const transformationInfos = this.transformTextForParsing(text);
    this.bcv.parse(transformationInfos.slice(-1)[0].transformedText);
    const refs = filterReferences(this.bcv.osis_and_indices());
    return adjustRefsToTransformations(refs, transformationInfos);
  }

  /** Wrapper for BCV's parse_with_context: @see BCV.parse_with_context() */
  public parse_with_context(possibleReferenceWithPrefix: string, previousPassage: string): BCV.OsisAndIndices[] {
    const transformationInfos = this.transformTextForParsing(possibleReferenceWithPrefix);
    this.bcv.parse_with_context(transformationInfos.slice(-1)[0].transformedText, previousPassage);
    const refs = filterReferences(this.bcv.osis_and_indices());
    return adjustRefsToTransformations(refs, transformationInfos);
  }

  /** Transform text before parsing to handle parser issues. */
  private transformTextForParsing(text: string): TextTransformationInfo[] {
    const { spaces, chapterVerseSeparator } = this.characters;
    const transformationInfos: TextTransformationInfo[] = [];
    const currentText = () => transformationInfos.slice(-1)[0].transformedText;
    transformationInfos.push(decodeHtmlEntities(text));
    transformationInfos.push(transformUnsupportedCharacters(currentText()));
    transformationInfos.push(disambiguateSeparators(currentText(), chapterVerseSeparator, `[${spaces}]`));
    return transformationInfos;
  }

  private initBcvParser(options: Options) {
    this._bcv = this._bcv || new window.bcv_parser();
    options.parserOptions = options.parserOptions || {};
    if (Parser.getCurrentParserLanguage() === 'de') {
      if (!('punctuation_strategy' in options.parserOptions)) {
        options.parserOptions.punctuation_strategy = 'eu';
      }
    }
    if (!('sequence_combination_strategy' in options.parserOptions)) {
      options.parserOptions.sequence_combination_strategy = 'separate';
    }
    if (options.parserOptions) {
      this._bcv.set_options(options.parserOptions);
    }
    this._chapterVerseSeparator = options.parserOptions.punctuation_strategy === 'eu' ? ',' : ':';
  }

}

/**
 * Replace character that is used by chapter-verse-separator by semicolon if it is followed by space(s).
 * The parser ignores the spaces and treats it as a chapter-verse-separator.
 * English example of ':' not being used as chapter-verse-separator: "in Acts 15: 4 days later...".
 * German example of ',' not being used as chapter-verse-separator: "Römer 1, 3, und 5".
 */
export function disambiguateSeparators(
  originalText: string, chapterVerseSeparator: string, spaces: string
): TextTransformationInfo {
  const separatorWithSpacesRegex =
    new RegExp(
      `(\\d)(${spaces}*${chapterVerseSeparator}${spaces}+|${spaces}+${chapterVerseSeparator}${spaces}*)(\\d)`,
      'g');
  let accumulativeDelta = 0;
  const transformations: TextTransformationInfo['transformations'] = [];
  const transformedText = originalText.replace(separatorWithSpacesRegex,
    (_substring, precedingDigit, oldString, followingDigit, offset) => {
      const newString = `;`;
      transformations.push({
        oldStart: offset + 1,
        newStart: offset + 1 + accumulativeDelta,
        oldString,
        newString
      });
      accumulativeDelta += newString.length - oldString.length;
      return precedingDigit + newString + followingDigit;
    }
  );
  return {
    transformedText,
    transformations
  };
}

export function decodeHtmlEntities(originalText: string): TextTransformationInfo {
  const transformations: TextTransformationInfo['transformations'] = [];
  let accumulativeDelta = 0;
  const transformedText = decode(originalText, (oldString, newString, offset) => {
    transformations.push({
      oldStart: offset,
      newStart: offset + accumulativeDelta,
      oldString,
      newString
    });
    accumulativeDelta += newString.length - oldString.length;
    return newString;
  });
  return {
    transformedText,
    transformations
  };
}

/** Transform characters not yet support by the parser, e.g., soft hyphens */
export function transformUnsupportedCharacters(originalText: string): TextTransformationInfo {
  const regex = /\xad/g;
  const transformations: TextTransformationInfo['transformations'] = [];
  let accumulativeDelta = 0;
  const transformedText = originalText.replace(regex, (oldString, offset) => {
    const newString = '';
    transformations.push({
      oldStart: offset,
      newStart: offset + accumulativeDelta,
      oldString,
      newString
    });
    accumulativeDelta += newString.length - oldString.length;
    return newString;
  });
  return {
    transformedText,
    transformations
  };
}

/** Convert references based on transformed text back to references in original text  */
export function adjustRefsToTransformations(
  refs: BCV.OsisAndIndices[], transformationInfos: TextTransformationInfo[]
): BCV.OsisAndIndices[] {
  for (const transformationInfo of transformationInfos) {
    for (const ref of refs) {
      for (const transformation of transformationInfo.transformations) {
        for (let i = 0; i < 2; i++) {
          if (ref.indices[i] >= transformation.newStart + transformation.newString.length) {
            ref.indices[i] += transformation.oldString.length - transformation.newString.length;
          }
        }
      }
    }
  }

  return refs;
}

function filterReferences(refs: BCV.OsisAndIndices[]): BCV.OsisAndIndices[] {
  // The parser sometimes returns references without chapters or verses.
  return refs.filter(ref => /[.]/.test(ref.osis));
}
