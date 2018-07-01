import { Blinx } from 'src/blinx.class';
import * as PromisePolyfill from 'src/lib/promise.js';

if (!('Promise' in window)) {
  (window as any).Promise = PromisePolyfill;
}

// Execute for app
if (!('__karma__' in window)) {
  loadBlinx();
}

// Export function for specs
export function loadBlinx() {
  window.blinx = new Blinx();
}
