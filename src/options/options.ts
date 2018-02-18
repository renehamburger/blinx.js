import { Languages, LanguageCode } from './languages';
import { u } from 'umbrellajs';

export class Options {
  [key: string]: any;
  language: keyof Languages = 'en';
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
    if (window.bcv_parser) {
      const parser: BCV.Parser = new window.bcv_parser();
      if (parser['languages'] && parser['languages'].length === 1) {
        opts.language = parser['languages'][0] as LanguageCode;
      }
    }
  }
  for (const key in opts) {
    options[key] = opts[key];
  }
}
