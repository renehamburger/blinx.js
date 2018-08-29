import { u } from 'src/lib/u.js';
import { Languages } from 'src/options/languages';
import { Parser } from 'src/parser/parser.class';
import { BibleVersionCode } from 'src/bible/models/bible-versions.const';
import { OnlineBibleName } from 'src/bible/online-bible/online-bible-overview';
import { BibleApiName } from 'src/bible/bible-api/bible-api-overview';

export class Options {
  [key: string]: any;

  /** Language code of the language to be used for the parser. */
  language: keyof Languages = 'en';
  /** Code of the bible version to be used, for the displayed Bible text and the online Bible being linked to. */
  bibleVersion: BibleVersionCode | { bibleText: BibleVersionCode, onlineBible: BibleVersionCode } = 'en.ESV';
  /** Online Bible to be linked to. */
  onlineBible: OnlineBibleName = 'BibleServer';
  /** Online Bible to be linked to. */
  bibleApi: BibleApiName = 'getBible';
  /**
   * Futher options for the parser.
   * @see https://github.com/openbibleinfo/Bible-Passage-Reference-Parser#options
   */
  parserOptions?: BCV.Options;
  /** By default, the parse will start automatically once the page is loaded. If false,
   *  it needs to be triggered manually.
   */
  parseAutomatically: boolean = true;
  /** Automatic parsing will happen within the elements with the following whitelisted selectors. */
  whitelist: string[] = ['body'];
  /** Automatic parsing can be disabled with the following whitelisted selectors. */
  blacklist: string[] = ['a'];
  /** Color theme for pop-up */
  theme: 'dark' | 'light' = 'light';
  /** Preferred placement of pop-up; if space is not sufficient, the side will flip dynamically. */
  placement: 'top' | 'bottom' = 'bottom';
}

export function getScriptTagOptions(): Partial<Options> {
  // Parse options object from data-blinx attribute on script tag
  const tagOptionsString = u('script[data-blinx]').data('blinx') || '{}';
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
  // If user does not specify language in script tag, check whether he has inlcude a bcv_parser with a
  // single language already
  if (!(opts.language)) {
    const language = Parser.getCurrentParserLanguage();
    if (language) {
      opts.language = language;
    }
  }
  return opts;
}
