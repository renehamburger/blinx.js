/// <reference path="./shared/index.d.ts" />
/// <reference types="node" />
/// <reference types="jest" />

declare module 'src/lib/promise.js' {}

interface ObjectConstructor {
  values<T = any>(obj: {}): T[];
}
