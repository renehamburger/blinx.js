/**
 * Based on https://github.com/shogogg/ts-deferred ((c) 2016 shogogg, MIT)
 */
export type Resolver<T> = (value?: T | PromiseLike<T>) => void;

export type Rejecter = (reason?: any) => void;

export class Deferred<T> {
  public readonly promise: Promise<T>;
  private _resolve?: Resolver<T>;
  private _reject?: Rejecter;

  constructor() {
    this.promise = new Promise<T>((resolve: Resolver<T>, reject: Rejecter) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  resolve(value?: T | PromiseLike<T>): void {
    this._resolve?.(value);
  }

  reject(reason?: any): void {
    this._reject?.(reason);
  }
}
