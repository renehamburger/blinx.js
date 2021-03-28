/// <reference path="./bible-passage-reference-parser.d.ts" />
/// <reference path="./tippy.d.ts" />
/// <reference path="./u.d.ts" />
/// <reference path="../../node_modules/typescript/lib/lib.d.ts" />
/// <reference path="../../node_modules/typescript/lib/lib.es2015.promise.d.ts" />

interface Window {
  blinx: any;
  __karma__?: any; // TODO: Remove __karma__-specific code from main code
}

declare module 'src/lib/promise.js' {}

interface ObjectConstructor {
  values<T = any>(obj: {}): T[];
}
