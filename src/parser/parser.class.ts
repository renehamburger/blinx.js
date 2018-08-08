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
      if (parser['languages'] && parser['languages'].length === 1) {
        return parser['languages'][0] as LanguageCode;
      }
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
      loadScript('https://cdn.rawgit.com/renehamburger/Bible-Passage-Reference-Parser/0f5485de/js/' +
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
  public reset(): void {
    this.bcv.reset();
  }

  /** Wrapper for BCV's parse: @see BCV.parse() */
  public parse(text: string): BCV.OsisAndIndices[] {
    const transformation = this.transformTextForParsing(text);
    this.bcv.parse(transformation.transformedText);
    const refs = this.bcv.osis_and_indices();
    return convertRefsBasedOnTransformedTextToOriginalText(refs, transformation);
  }

  /** Wrapper for BCV's parse_with_context: @see BCV.parse_with_context() */
  public parse_with_context(possibleReferenceWithPrefix: string, previousPassage: string) {
    const transformation = this.transformTextForParsing(possibleReferenceWithPrefix);
    this.bcv.parse_with_context(transformation.transformedText, previousPassage);
    const refs = this.bcv.osis_and_indices();
    return convertRefsBasedOnTransformedTextToOriginalText(refs, transformation);
  }

  /** Transform text before parsing to handle parser issues. */
  private transformTextForParsing(text: string) {
    const { spaces, chapterVerseSeparator } = this.characters;
    return transformTextForParsing(text, chapterVerseSeparator, `[${spaces}]`);
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

/** Transform text and store all transformations */
export function transformTextForParsing(
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

/** Convert references based on transformed text back to references in original text  */
export function convertRefsBasedOnTransformedTextToOriginalText(
  refs: BCV.OsisAndIndices[], transformationInfo: TextTransformationInfo
): BCV.OsisAndIndices[] {
  for (const ref of refs) {
    for (const transformation of transformationInfo.transformations) {
      for (let i = 0; i < 2; i++) {
        if (ref.indices[i] >= transformation.newStart + transformation.newString.length) {
          ref.indices[i] += transformation.oldString.length - transformation.newString.length;
        }
      }
    }
  }
  return refs;
}
