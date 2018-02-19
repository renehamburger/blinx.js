import { Options, applyScriptTagOptions } from './options/options';
import { loadPolyfills } from './helpers/polyfills';
import { Parser } from './parser/parser.class';
import { u } from 'umbrellajs';

export class Blinx {

  private options = new Options();
  private parser = new Parser();

  /** Initialise blinx. */
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
    this.parser.load(this.options, callback);
    loadPolyfills(callback);
  }

  /** Execute a parse for the given options. */
  public parse() {
  }

  /** Second step of initialisation after parser & polyfills loaded. */
  private initComplete() {
    if (this.options.parseAutomatically) {
      const handler = () => {
        u(document).off('DOMContentLoaded', handler);
        this.parse();
      };
      u(document).on('DOMContentLoaded', handler);
    }
  }
}
