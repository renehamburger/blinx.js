import { Languages } from './languages';
import { u } from 'umbrellajs';
import { Parser } from '../parser/parser.class';

export class Options {
  [key: string]: any;

  /** Language code of the language to be used for the parser. */
  language: keyof Languages = 'en';
  /**
   * Futher options for the parser.
   * @see https://github.com/openbibleinfo/Bible-Passage-Reference-Parser#options
   */
  parserOptions?: BCV.Options;
  /** By default, the parse will start automatically once the page is loaded. If false, it needs to be triggered manually. */
  parseAutomatically: boolean = true;
  /** Automatic parsing will happen within the elements with the following whitelisted selectors. */
  whitelist: string[] = ['body'];
  /** Automatic parsing can be disabled with the following whitelisted selectors. */
  blacklist: string[] = ['a'];
}

export function applyScriptTagOptions(options: Options): void {
  // Parse options object from data-blinx attribute on script tag
  const tagOptionsString = u('script[data-blinx]').data('blinx');
  let opts: Partial<Options> = {};
  try {
    // tslint:disable-next-line:no-eval
    const evalOpts = eval(`(${tagOptionsString})`);
    if (evalOpts instanceof Object) {
      opts = evalOpts;
    } else {
      throw new Error();
    }
  } catch (e) {
    console.error(`Blinx: Invalid options: '${tagOptionsString}'`);
  }
  // If user does not specify language in script tag, check whether he has inlcude a bcv_parser with a single language already
  if (!(opts.language)) {
    const language = Parser.getCurrentParserLanguage();
    if (language) {
      opts.language = language;
    }
  }
  for (const key in opts) {
    options[key] = opts[key];
  }
}
