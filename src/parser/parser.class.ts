import { LanguageCode } from '../options/languages';
import { loadScript } from '../helpers/dom';
import { Options } from '../options/options';

export class Parser {
  private _bcv?: BCV.Parser;
  public get bcv(): BCV.Parser {
    if (this._bcv) {
      return this._bcv;
    }
    throw new Error('The bcv_parser script has not been loaded successfully yet.');
  }
  static getCurrentParserLanguage(): LanguageCode | false {
    if (window.bcv_parser) {
      const parser: BCV.Parser = new window.bcv_parser();
      if (parser['languages'] && parser['languages'].length === 1) {
        return parser['languages'][0] as LanguageCode;
      }
    }
    return false;
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
      loadScript(`https://rawgit.com/openbibleinfo/Bible-Passage-Reference-Parser/master/js/${options.language}_bcv_parser.js`, successful => {
        if (successful) {
          this.initBcvParser(options);
        }
        if (callback) {
          callback(successful);
        }
      });
    }
  }

  private initBcvParser(options: Options) {
    this._bcv = this._bcv || new window.bcv_parser();
    if (Parser.getCurrentParserLanguage() === 'de') {
      options.parserOptions = options.parserOptions || {};
      if (!('punctuation_strategy' in options.parserOptions)) {
        options.parserOptions.punctuation_strategy = 'eu';
      }
    }
    if (options.parserOptions) {
      this._bcv.set_options(options.parserOptions);
    }
  }
}
