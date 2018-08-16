/// <reference path="./tippy.d.ts" />
/// <reference path="../../node_modules/typescript/lib/lib.d.ts" />
/// <reference path="../../node_modules/typescript/lib/lib.es2015.promise.d.ts" />

interface Window {
  blinx: any;
  __karma__: any;
}

declare let module: { exports: any };
declare const require: (module: string) => any;

declare module 'src/lib/promise.js' { }

interface ObjectConstructor {
  values<T = any>(obj: {}): T[];
}
