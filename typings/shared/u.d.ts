declare namespace Umbrella {
  type Selector = string | Node | NodeList | Node[] | Instance;

  interface Dimensions {
    left: number;
    right: number;
    top: number;
    height: number;
    bottom: number;
    width: number;
  }

  type Filter = string | Instance | ((node: Node, index: number) => boolean);

  interface Instance {
    length: number;
    nodes: HTMLElement[];

    addClass(...names: any[]): Instance;

    adjacent(a: any, b: any, c: any): Instance;

    after(a: any, b: any): Instance;

    ajax(a: any, b: any): void;

    append(a: any, b?: any): Instance;

    args(a: any, b: any, c: any): Instance;

    array<T = string>(callback?: (node: Node) => T | T[] | null | void): T[];

    attr(name: string): string;
    attr(attributes: { [name: string]: string }): Instance;
    attr(name: string, value: string): Instance;

    before(a: any, b: any): Instance;

    children(a: any): Instance;

    clone(): Instance;

    closest(criterion: Filter): Instance;

    data(name: string): string;
    data(attributes: { [name: string]: string }): Instance;
    data(name: string, value: string): Instance;

    each(iterator: (node: Node, index: number) => void): Instance;

    eacharg(a: any, b: any): Instance;

    empty(): Instance;

    filter(criterion: Filter): Instance;

    find(a: any): Instance;

    first(): Node | false;

    generate(a: any): Instance;

    getAll(a: any): Instance;

    handle(...args: any[]): Instance;

    hasClass(...args: any[]): Instance;

    html(): string;
    html(html: string): Instance;

    is(a: any): boolean;

    isInPage(a: any): Instance;

    last(): Node | false;

    map(
      iterator: (node: Node, index: number) => false | Node | string | Node[] | string[] | Instance
    ): Instance;

    not(a: any): Instance;

    off(events: string | string[], handler?: Function): void;

    on(a?: any, b?: any, c?: any, ...args: any[]): Instance;

    pairs(a: any, b: any, c: any, d: any): Instance;

    param(a: any): Instance;

    parent(a: any): Instance;

    prepend(a: any, callback?: any): Instance;

    remove(): Instance;

    removeClass(...names: any[]): Instance;

    replace(a: any, b: any): Instance;

    scroll(): void;

    select(a: any, b: any): Instance;

    serialize(): void;

    siblings(a: any): Instance;

    size(): Dimensions;

    slice(a: any): Instance;

    str(a: any, b: any): Instance;

    text(): string;
    text(text: string): Instance;

    toggleClass(a: any, b: any): Instance;

    trigger(a: any, ...args: any[]): Instance;

    unique(): Instance;

    uri(a: any): Instance;

    wrap(a: any): Instance;
  }

  interface AjaxOptions {
    method?: 'GET' | 'POST';
    body?: string;
    headers?: { [key: string]: string };
  }

  type AjaxAfter = (err: Error | null, data: object | string | null, xhr?: XMLHttpRequest) => void;

  type AjaxBefore = (xhr: XMLHttpRequest) => void;

  type Ajax = (
    url: string,
    options?: AjaxOptions,
    after?: AjaxAfter,
    before?: AjaxBefore
  ) => XMLHttpRequest;
}

declare module 'src/lib/u.js' {
  export const u: (selector?: Umbrella.Selector, scope?: Umbrella.Selector) => Umbrella.Instance;
}
