import { loadScript } from 'src/helpers/dom';

/** Load polyfills if required */
export function loadPolyfills(callback: (successful: boolean) => void) {
  if ('Promise' in window) {
    if (callback) {
      callback(true);
    }
  } else {
    loadScript(`https://cdn.polyfill.io/v2/polyfill.js?features=Promise|gated`, callback);
  }
}
