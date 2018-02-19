import { LanguageCode } from '../options/languages';
import { loadScript } from '../helpers/dom';
import { Options } from '../options/options';

export class Parser {
  private parser: BCV.Parser | undefined;

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
      if (callback) {
        callback(true);
      }
    } else {
      loadScript(`https://rawgit.com/openbibleinfo/Bible-Passage-Reference-Parser/master/js/${options.language}_bcv_parser.js`, successful => {
        if (successful) {
          this.parser = new window.bcv_parser();
          if (options.parserOptions) {
            this.parser.set_options(options.parserOptions);
          }
        }
        if (callback) {
          callback(successful);
        }
      });
    }
  }

}
