import { Options, applyScriptTagOptions } from 'src/options/options';
import { Parser } from 'src/parser/parser.class';
import { u } from 'umbrellajs';
import { OnlineBible } from 'src/bible/online-bible/online-bible.class';
import isString = require('lodash/isString');
import { getOnlineBible } from 'src/bible/online-bible/online-bible-overview';
import { BibleVersionCode, BibleVersions } from 'src/bible/versions/bible-versions.const';
import { loadScript, loadCSS } from 'src/helpers/dom';
import { Deferred } from 'src/helpers/deferred.class';
import { BibleApi } from 'src/bible/bible-api/bible-api.class';
import { getBibleApi } from 'src/bible/bible-api/bible-api-overview';
import { Bible } from 'src/bible/bible.class';
import { transformOsis } from 'src/helpers/osis';
import { loadPolyfills } from 'src/helpers/polyfills';
import 'src/css/blinx.css';

const bibleVersions = new BibleVersions();

export class Blinx {

  private options = new Options();
  private parser = new Parser();
  private onlineBible: OnlineBible;
  private bibleApi: BibleApi;
  private tippyObjects: Tippy.Object[] = [];
  private tippyLoaded = new Deferred<void>();

  /** Initialise blinx. */
  constructor() {
    applyScriptTagOptions(this.options);
    this.onlineBible = getOnlineBible(this.options.onlineBible);
    // TODO: Later on, the best Bible API containing a certain translation should rather be used automatically
    this.bibleApi = getBibleApi(this.options.bibleApi);
    // Load dependencies required for link creation
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
    // Load dependencies required for tooltip display
    this.loadTippy();
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
    // Once tippy.js is loaded, add tooltips
    this.tippyLoaded.promise
      .then(() => this.addTooltips());
  }

  private addTooltips() {
    const versionCode = this.getVersionCode(this.onlineBible);
    // Loop through all nodes in order to create a unique template for each
    u('[data-osis]')
      .each((node, index) => {
        const osis = u(node).data('osis');
        const template = u('<div />')
          .html(`
<div class="bxTippy">
  <div class="bxTippyBody">
    <span class="bxPassageText">
      <div class="bxLoader"></div>
    </span>
  </div>
  <div class="bxTippyFooter">
    <a class="bxPassageLink" href="${this.onlineBible.buildPassageLink(osis, versionCode)}" target="_blank">
      ${this.convertOsisToContext(osis)}</a>
    <span class="bxCredits">
      retrieved from
      <a href="${this.bibleApi.url}">${this.bibleApi.title}</a>
      by
      <a href="https://github.com/renehamburger/blinx.js">blinx.js</a>.
    </span>
  </div>
</div>
          `).attr('id', `bxTippyTemplate${index}`);
        this.tippyObjects.push(
          tippy(node as Element, {
            placement: 'top',
            arrow: true,
            arrowType: 'round',
            maxWidth: '800px',
            theme: 'light',
            interactive: true,
            html: template.nodes[0],
            onShow: (tippyInstance) => {
              const osis = u(tippyInstance.reference).data('osis');
              this.getTooltipContent(osis)
                .then((text: string) => {
                  u(template).find('.bxPassageText').html(text);
                });
            }
          })
        );
      });
  }

  /** Second step of initialisation after parser & polyfills are loaded. */
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
    const chapterVerse = this.options.parserOptions && this.options.parserOptions.punctuation_strategy === 'eu' ?
      ',' : ':';
    return transformOsis(osis, { bookChapter: ' ', chapterVerse });
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
    const versionCode = this.getVersionCode(this.onlineBible);
    u(node)
      .wrap(`<a></a>`)
      .attr('href', this.onlineBible.buildPassageLink(ref.osis, versionCode))
      .attr('target', '_blank')
      .data('osis', ref.osis);
  }

  private getVersionCode(bible: Bible): BibleVersionCode {
    let versionCode = isString(this.options.bibleVersion) ? this.options.bibleVersion :
      this.options.bibleVersion.bibleText;
    const availableVersions = Object.keys(bible.getAvailableVersions(this.options.language)) as BibleVersionCode[];
    // If the versionCode does not match the given language or is not supported by the given Bible,
    // find the first version available for the given online Bible for this language
    if (versionCode.indexOf(this.options.language) !== 0 || availableVersions.indexOf(versionCode) === -1) {
      if (availableVersions.length) {
        versionCode = availableVersions[0];
      }
    }
    return versionCode;
  }

  private getTooltipContent(osis: string): Promise<string> {
    const versionCode = this.getVersionCode(this.bibleApi);
    return this.bibleApi.getPassage(osis, versionCode)
      .then(text => `${text} <span class="bxPassageVersion">${bibleVersions[versionCode].title}</span>`);
  }

  private loadTippy() {
    let counter = 2;
    const callback = () => {
      counter--;
      if (counter === 0) {
        this.tippyLoaded.resolve();
      }
    };
    loadScript(`https://unpkg.com/tippy.js/dist/tippy.all.js`).then(callback);
    loadCSS('https://unpkg.com/tippy.js/dist/themes/light.css').then(callback);
  }

}
