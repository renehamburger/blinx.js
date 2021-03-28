/// <reference path="./shared/index.d.ts" />

declare const require: (module: string) => any;

declare module 'src/lib/promise.js' {}

interface ObjectConstructor {
  values<T = any>(obj: {}): T[];
}
