import { LanguageCode } from './options/languages';
import { Options, applyScriptTagOptions } from './options/options';

export class Blinx {

  private options = new Options();

  public init(): void {
    applyScriptTagOptions(this.options);
    let pending = 2;
    const callback = (successful: boolean) => {
      if (successful) {
        pending--;
        if (pending === 0) {
          this.initComplete();
        }
      }
    };
    this.loadParser(this.options.language, callback);
    this.loadPolyfills(callback);
  }

  private initComplete() {
    debugger;
  }

  /** Load bcv parser script for the given language */
  private loadParser(language: LanguageCode, callback?: (successful: boolean) => void) {
    this.loadScript(`https://rawgit.com/openbibleinfo/Bible-Passage-Reference-Parser/master/js/${language}_bcv_parser.js`, callback);
  }

  /** Load polyfills if required */
  private loadPolyfills(callback?: (successful: boolean) => void) {
    if ('Promise' in window && this.classListSupported()) {
      if (callback) {
        callback(true);
      }
    } else {
      this.loadScript(`https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.classList|always|gated,Promise|gated|always`, callback);
    }
  }

  // Taken from polyfill.io guards
  private classListSupported(): boolean {
    return 'DOMTokenList' in window &&
      (x => 'classList' in x ? !x.classList.toggle('x', false) && !x.className : true)(document.createElement('x')) &&
      'document' in window &&
      'classList' in document.documentElement &&
      'Element' in window &&
      'classList' in Element.prototype &&
      (() => {
        const e = document.createElement('span');
        e.classList.add('a', 'b');
        return e.classList.contains('b');
      })();
  }

  /** Load script for the given src dynamicaly & asynchronously */
  private loadScript(src: string, callback?: (successful: boolean) => void) {
    const script = document.createElement('script');
    script.src = src;
    if (callback) {
      script.onload = () => callback(true);
      script.onerror = () => callback(false);
    }
    document.body.appendChild(script);
  }

}
