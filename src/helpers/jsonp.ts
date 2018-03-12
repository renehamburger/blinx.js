import { loadScript } from 'src/helpers/dom';

let jsonpCounter = -1;

export function executeJsonp<T extends object = object>(url: string, callbackParameter: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackName = `blinxJsonpCallbacks_${++jsonpCounter}`;
    (window as any)[callbackName] = (result: object) => {
      delete (window as any)[callbackName];
      resolve(result as T);
    };
    const completeUrl = `${url}${url.indexOf('?') === -1 ? '?' : '&'}${callbackParameter}=${callbackName}`;
    return loadScript(completeUrl)
      .catch(() => {
        delete (window as any)[callbackName];
        reject();
      });
  });
}
