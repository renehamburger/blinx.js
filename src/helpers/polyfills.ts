import { loadScript } from './dom';

/** Load polyfills if required */
export function loadPolyfills(callback?: (successful: boolean) => void) {
  if ('Promise' in window && classListSupported()) {
    if (callback) {
      callback(true);
    }
  } else {
    loadScript(`https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.classList|gated,Promise|gated`, callback);
  }
}

// Taken from polyfill.io guards
function classListSupported(): boolean {
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
