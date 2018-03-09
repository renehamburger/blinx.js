/**
 * Based on https://github.com/shogogg/ts-deferred ((c) 2016 shogogg, MIT)
 */
export type Resolver<T> = (value?: T | PromiseLike<T>) => void;

export type Rejecter = (reason?: any) => void;

export class Deferred<T> {
  private _promise: Promise<T>;
  private _resolve?: Resolver<T>;
  private _reject?: Rejecter;

  constructor() {
    this._promise = new Promise<T>((resolve: Resolver<T>, reject: Rejecter) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  get promise(): Promise<T> {
    return this._promise;
  }

  resolve = (value?: T | PromiseLike<T>): void => {
    this._resolve && this._resolve(value);
  }

  reject = (reason?: any): void => {
    this._reject && this._reject(reason);
  }
}
