import { Blinx } from 'src/blinx.class';
import * as PromisePolyfill from 'src/lib/promise.js';

if (!('Promise' in window)) {
  (window as any).Promise = PromisePolyfill;
}
window.blinx = new Blinx();
