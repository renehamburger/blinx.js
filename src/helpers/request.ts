import { ajax } from 'src/lib/u.js';

export async function request<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    ajax(url, undefined, (err, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body as unknown as T);
      }
    });
  });
}
