import { LanguageCode } from 'src/options/languages';
import { loadScript } from 'src/helpers/dom';
import { Options } from 'src/options/options';

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
      // NB: Commit ID needs to match installed NPM package for unit tests
      loadScript(
        'https://cdn.jsdelivr.net/gh/renehamburger/' +
          'Bible-Passage-Reference-Parser@99f0338587acb6eb8365c4ea6b48b9c52040ae90/js/' +
          `${options.language}_bcv_parser.js`,
        (successful) => {
          if (successful) {
            this.initBcvParser(options);
          }
          if (callback) {
            callback(successful);
          }
        }
      );
    }
  }

  /** Wrapper for BCV's reset: @see BCV.reset() */
  public reset() {
    this.bcv.reset();
  }

  /** Wrapper for BCV's parse: @see BCV.parse() */
  public parse(text: string) {
    const transformationInfos = this.transformTextForParsing(text);
    const transformedText = transformationInfos.slice(-1)[0].transformedText;
    this.bcv.parse(transformedText);
    const refs = filterReferences(this.bcv.osis_and_indices(), transformedText);
    return adjustRefsToTransformations(refs, transformationInfos);
  }

  /** Wrapper for BCV's parse_with_context: @see BCV.parse_with_context() */
  public parse_with_context(
    possibleReferenceWithPrefix: string,
    previousPassage: string
  ): BCV.OsisAndIndices[] {
    const transformationInfos = this.transformTextForParsing(possibleReferenceWithPrefix);
    const transformedText = transformationInfos.slice(-1)[0].transformedText;
    this.bcv.parse_with_context(transformedText, previousPassage);
    const refs = filterReferences(this.bcv.osis_and_indices(), transformedText);
    return adjustRefsToTransformations(refs, transformationInfos);
  }

  /** Transform text before parsing to handle parser issues. */
  private transformTextForParsing(text: string): TextTransformationInfo[] {
    const { spaces, chapterVerseSeparator } = this.characters;
    const transformationInfos: TextTransformationInfo[] = [];
    const currentText = () => transformationInfos.slice(-1)[0].transformedText;
    transformationInfos.push(transformUnsupportedCharacters(text));
    transformationInfos.push(
      disambiguateSeparators(currentText(), chapterVerseSeparator, `[${spaces}]`)
    );
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
  originalText: string,
  chapterVerseSeparator: string,
  spaces: string
): TextTransformationInfo {
  const separatorWithSpacesRegex = new RegExp(
    `(\\d)(${spaces}*${chapterVerseSeparator}${spaces}+|${spaces}+${chapterVerseSeparator}${spaces}*)(\\d)`,
    'g'
  );
  let accumulativeDelta = 0;
  const transformations: TextTransformationInfo['transformations'] = [];
  const transformedText = originalText.replace(
    separatorWithSpacesRegex,
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
  refs: BCV.OsisAndIndices[],
  transformationInfos: TextTransformationInfo[]
): BCV.OsisAndIndices[] {
  for (const transformationInfo of transformationInfos) {
    for (const transformation of transformationInfo.transformations.reverse()) {
      for (const ref of refs) {
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

function filterReferences(refs: BCV.OsisAndIndices[], text: string): BCV.OsisAndIndices[] {
  const language = Parser.getCurrentParserLanguage();
  let skipNext = false;
  return refs.filter((ref) => {
    if (skipNext) {
      skipNext = false;
      return false;
    }
    // Filter out references without both chapter and verse, which the parser sometimes returns.
    if (!/[.]/.test(ref.osis)) {
      return false;
    }
    if (language === 'de') {
      // Filter out German references that could be dates, e.g. 'am 3.'
      const extendedLabel = text.slice(ref.indices[0], ref.indices[1] + 4);
      if (/^Amos\.\d+$/.test(ref.osis) && /^am\b\s*\d+\./i.test(extendedLabel)) {
        // If the date looks like 'am 1.2.', the second number is wrongly parsed as another
        // chapter of Amos and needs to be skipped
        if (/^am\b\s*\d+\.\d+/i.test(extendedLabel)) {
          skipNext = true;
        }
        return false;
      }
    }
    return true;
  });
}
