import { Options, applyScriptTagOptions } from './options/options';
import { Parser } from './parser/parser.class';
import { u } from 'umbrellajs';
import { OnlineBible } from './online-bible/online-bible.class';
import isString = require('lodash/isString');
import { getOnlineBible } from './online-bible/online-bible-overview';
import { BibleVersionCode } from './bible-versions/bible-versions.const';

export class Blinx {

  private options = new Options();
  private parser = new Parser();
  private onlineBible: OnlineBible;

  /** Initialise blinx. */
  constructor() {
    applyScriptTagOptions(this.options);
    this.onlineBible = getOnlineBible(this.options.onlineBible);
    this.parser.load(this.options, (successful: boolean) => {
      if (successful) {
        this.initComplete();
      }
    });
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

  /** Second step of initialisation after parser loaded. */
  private initComplete(): void {
    if (this.options.parseAutomatically) {
      if (/^complete|interactive|loaded$/.test(document.readyState)) {
        // DOM already parsed
        this.execute();
      } else {
        // DOM content not yet loaded
        const handler = () => {
          u(document).off('DOMContentLoaded', handler);
          this.execute();
        };
        u(document).on('DOMContentLoaded', handler);
      }
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
        this.handleReferencesFoundInText(childNode, refs);
      }
    }
  }

  /**
   * Link the given reference and continue looking for further (partial) references in the remaining text.
   * @param node Text node the given reference was found in
   * @param ref bcv_parser reference object
   */
  private handleReferencesFoundInText(node: Text, refs: BCV.OsisAndIndices[]): void {
    for (let i = refs.length - 1; i >= 0; i--) {
      const ref = refs[i];
      const remainder = node.splitText(ref.indices[1]);
      const passage = node.splitText(ref.indices[0]);
      if (passage) { // Always true in this case
        this.addLink(passage, ref);
      }
      this.parsePartialReferencesInText(remainder, this.convertOsisToContext(ref.osis));
    }
  }

  private convertOsisToContext(osis: string): string {
    const separator = this.options.parserOptions && this.options.parserOptions.punctuation_strategy === 'eu' ? ',' : ':';
    return osis.replace(/(\d)\.(\d)/, `$1${separator}$2`).replace('.', ' ');
  }

  /**
   * Look for and link partial references in the given text node.
   * Unfortunately, bcv.parse_with_context() only works, if the string
   * *starts* with the partial passage, so the beginning needs to be
   * determined by searching for chapter/verse numbers.
   * @param node Text node
   * @param previousPassage Previous recognized passage as parser context
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
        }
      }
      // Check for possible reference with prefix first
      if (possibleReferenceWithPrefix) {
        this.parser.bcv.parse_with_context(possibleReferenceWithPrefix, previousPassage);
      }
      // If none available or unsuccessful, check for possible reference starting with number(s)
      if (!possibleReferenceWithPrefix || !this.parser.bcv.osis()) {
        this.parser.bcv.parse_with_context(possibleReferenceWithoutPrefix, previousPassage);
        offset = match.index;
      }
      // If either successful, adjust the indices due to the slice above and handle the reference
      const refs = this.parser.bcv.osis_and_indices();
      if (refs.length) {
        for (const ref of refs) {
          ref.indices[0] += offset;
          ref.indices[1] += offset;
        }
        this.handleReferencesFoundInText(node, refs);
      }
    }
  }

  private isTextNode(node: Node): node is Text {
    return node.nodeType === node.TEXT_NODE;
  }

  private addLink(node: Node, ref: BCV.OsisAndIndices): void {
    let versionCode = isString(this.options.bibleVersion) ? this.options.bibleVersion : this.options.bibleVersion.bibleText;
    // If the versionCode does not match the given language, find the first version available for the given online Bible for this language
    if (versionCode.indexOf(this.options.language) !== 0) {
      const availableVersions = Object.keys(this.onlineBible.getAvailableVersions(this.options.language)) as BibleVersionCode[];
      if (availableVersions.length) {
        versionCode = availableVersions[0];
      }
    }
    u(node)
      .wrap(`<a></a>`)
      .attr('href', this.onlineBible.getPassageLink(ref.osis, versionCode))
      .attr('target', '_blank')
      .data('osis', ref.osis);
  }
}
