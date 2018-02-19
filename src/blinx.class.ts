import { Options, applyScriptTagOptions } from './options/options';
import { loadPolyfills } from './helpers/polyfills';
import { Parser } from './parser/parser.class';
import { u } from 'umbrellajs';

export class Blinx {

  private options = new Options();
  private parser = new Parser();

  /** Initialise blinx. */
  public init(): void {
    applyScriptTagOptions(this.options);
    let pending = 2;
    const callback = (successful: boolean) => {
      if (successful) {
        pending--;
        if (pending === 0) {
          this.initComplete();
        }
      }
    };
    this.parser.load(this.options, callback);
    loadPolyfills(callback);
    this.initComplete();
  }

  /** Execute a parse for the given options. */
  public execute(): void {
    // Search within all whitelisted selectors
    u(this.options.whitelist.length ? `${this.options.whitelist.join(' *, ')} *` : 'body')
      // Exclude blacklisted selectors
      .not(this.options.blacklist.join(', '))
      .not(this.options.blacklist.length ? `${this.options.blacklist.join(' *, ')} *` : '')
      // Go one level deeper to get text nodes; NB: This does not keep the order or nodes
      // .map(node => node.hasChildNodes() && Array.prototype.slice.call(node.childNodes))
      .each(node => this.parseReferencesInNode(node));
  }

  /** Second step of initialisation after parser & polyfills loaded. */
  private initComplete(): void {
    if (this.options.parseAutomatically) {
      const handler = () => {
        u(document).off('DOMContentLoaded', handler);
        this.execute();
      };
      u(document).on('DOMContentLoaded', handler);
    }
  }

  /**
   * Look for and link all references found in the text node children of the given node.
   * @param node Any
   */
  private parseReferencesInNode(node: Node): void {
    const childNodes = Array.prototype.slice.call(node.childNodes);
    for (const childNode of childNodes) {
      if (this.isTextNode(childNode)) {
        // Look for all complete Bible references
        this.parser.bcv.parse(childNode.textContent || '');
        const refs = this.parser.bcv.osis_and_indices();
        for (let i = refs.length - 1; i >= 0; i--) {
          this.handleReferenceFoundInText(childNode, refs[i]);
        }
      }
    }
  }

  /**
   * Link the given reference and continue looking for further (partial) references in the remaining text.
   * @param node Text node the given reference was found in
   * @param ref bcv_parser reference object
   */
  private handleReferenceFoundInText(node: Text, ref: BCV.OsisAndIndices): void {
    const remainder = node.splitText(ref.indices[1]);
    const passage = node.splitText(ref.indices[0]);
    if (passage) { // Always true in this case
      this.addLink(passage, ref);
    }
    this.parsePartialReferencesInText(remainder, ref.osis);
  }

  /**
   * Look for and link partial references in the given text node.
   * Unfortunately, bcv.parse_with_context() only works, if the string
   * *starts* with the partial passage, so the beginning needs to be
   * determined by searching for chapter/verse numbers.
   * @param node Text node
   * @param previousPassage Previous recognized passage as parser context, e.g. an osis reference
   */
  private parsePartialReferencesInText(node: Text, previousPassage: string): void {
    const text = node.textContent || '';
    // Search for first number
    const match = text.match(/\d/);
    // TODO: Check support of match.index
    if (match && typeof match.index !== 'undefined') {
      let possibleReferenceWithPrefix: string = '';
      const possibleReferenceWithoutPrefix = text.slice(match.index);
      let offset = 0;
      if (match.index > 0) {
        // Check if it is preceded by a prefix (which could be 'chapter ' or 'vs.' etc.)
        const preceding = text.slice(0, match.index);
        const matchPrefix = preceding.match(/\w+\.?\s*$/);
        if (matchPrefix) {
          possibleReferenceWithPrefix = matchPrefix[0] + possibleReferenceWithoutPrefix;
          offset = match.index - matchPrefix[0].length;
        } else {
          offset = match.index;
        }
      }
      // Check for possible reference with prefix first
      if (possibleReferenceWithPrefix) {
        this.parser.bcv.parse_with_context(possibleReferenceWithPrefix, previousPassage);
      }
      // If none available or unsuccessful, check for possible reference starting with number(s)
      if (!possibleReferenceWithPrefix || !this.parser.bcv.osis()) {
        this.parser.bcv.parse_with_context(possibleReferenceWithoutPrefix, previousPassage);
      }
      // If either successful, adjust the indices due to the slice above and handle the reference
      const refs = this.parser.bcv.osis_and_indices();
      if (refs.length) {
        const ref = refs[0];
        ref.indices[0] += offset;
        ref.indices[1] += offset;
        this.handleReferenceFoundInText(node, refs[0]);
      }
    }
  }

  private isTextNode(node: Node): node is Text {
    return node.nodeType === node.TEXT_NODE;
  }

  private addLink(node: Node, ref: BCV.OsisAndIndices): void {
    u(node)
      .wrap(`<a></a>`)
      .attr('href', '#')
      .data('osis', ref.osis);
  }
}
