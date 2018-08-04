import { Blinx } from 'src/blinx.class';
import * as PromisePolyfill from 'src/lib/promise.js';
import { Options } from 'src/options/options';

if (!('Promise' in window)) {
  (window as any).Promise = PromisePolyfill;
}

// Execute for app
if (!('__karma__' in window)) {
  loadBlinx();
}

// Export function for specs
export function loadBlinx(customOptions?: Partial<Options>): Blinx {
  window.blinx = new Blinx(customOptions);
  return window.blinx;
}
