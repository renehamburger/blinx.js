import { Blinx } from 'src/blinx.class';
import * as PromisePolyfill from 'src/lib/promise.js';

// --- Apply required polyfills
if (!('Promise' in window)) {
  (window as any).Promise = PromisePolyfill;
}

if (!('requestAnimationFrame' in window)) {
  import('src/lib/request-animation-frame.js');
}

import('src/lib/class-list.js');

window.blinx = new Blinx();
