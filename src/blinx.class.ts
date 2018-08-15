import isString = require('lodash/isString');
import { Options, getScriptTagOptions } from 'src/options/options';
import { Parser } from 'src/parser/parser.class';
import { u } from 'src/lib/u.js';
import { OnlineBible } from 'src/bible/online-bible/online-bible.class';
import { getOnlineBible } from 'src/bible/online-bible/online-bible-overview';
import { BibleVersionCode, bibleVersions } from 'src/bible/models/bible-versions.const';
import { loadScript, loadCSS } from 'src/helpers/dom';
import { Deferred } from 'src/helpers/deferred.class';
import { BibleApi } from 'src/bible/bible-api/bible-api.class';
import { getBibleApi } from 'src/bible/bible-api/bible-api-overview';
import { Bible } from 'src/bible/bible.class';
import { transformOsis, truncateMultiBookOsis } from 'src/helpers/osis';
import { BX_SKIP_SELECTORS, BX_PASSAGE_SELECTORS, BX_CONTEXT_SELECTORS, BX_SELECTORS } from 'src/options/selectors.const';
import './css/blinx.css';

//#region: Closure for debugging constant & timer cache
const isVerbose = window.__karma__.config.args.some((arg: string) => arg === 'verbose');

const DEBUG = {
  performance: isVerbose,
  logging: isVerbose
};

const timers: { [label: string]: number } = {};
//#endregion: Closure for debugging constant & timer cache

//#region: General exports
export interface Testability {
  linksApplied: Promise<void>;
  passageDisplayed: Promise<void>;
}
//#endregion: General exports

//#region Class definition
export class Blinx {

  public static log(...args: any[]) {
    if (DEBUG.logging) {
      console.log(...args);
    }
  }

  public static time(label: string) {
    if (DEBUG.performance) {
      if (timers[label]) {
        console.error(`Timer already started: ${label}`);
      } else {
        timers[label] = Date.now();
      }
    }
  }

  public static timeEnd(label: string) {
    if (DEBUG.performance) {
      if (timers[label]) {
        console.log(`${label}: ${Date.now() - timers[label]}ms`);
        delete timers[label];
      } else {
        console.error(`timer missing: ${label}`);
      }
    }
  }

  public readonly testability: Testability;
  private linksAppliedDeferred = new Deferred<void>();
  private passageDisplayedDeferred = new Deferred<void>();
  private options = new Options();
  private parser = new Parser();
  private onlineBible: OnlineBible;
  private bibleApi: BibleApi;
  private tippyObjects: Tippy.Object[] = [];
  private tippyLoaded = new Deferred<void>();
  private touchStarted = false;
  private tippyPolyfills = false;
  private tippyPolyfillInterval = 0;
  /** Last recognised passage during the DOM traversal. Later on, a threshhold on nodeDistances might make sense. */
  private previousPassage: { ref: BCV.OsisAndIndices, nodeDistance: number } | null = null;

  private get areBlacklistedElementsPresent(): boolean {
    if (this._areBlacklistedElementsPresent === null) {
      const el = document.querySelector(this.getBlacklistSelector());
      this._areBlacklistedElementsPresent = !!el;
    }
    return this._areBlacklistedElementsPresent;
  }
  private _areBlacklistedElementsPresent: boolean | null = null;

  private get areBxContextsPresent(): boolean {
    if (this._areBxContextsPresent === null) {
      const el = document.querySelector(BX_CONTEXT_SELECTORS.join(','));
      this._areBxContextsPresent = !!el;
    }
    return this._areBxContextsPresent;
  }
  private _areBxContextsPresent: boolean | null = null;

  /** Initialise blinx. */
  constructor(customOptions: Partial<Options> = getScriptTagOptions()) {
    this.testability = {
      linksApplied: this.linksAppliedDeferred.promise,
      passageDisplayed: this.passageDisplayedDeferred.promise
    };
    // Apply customOptions
    for (const key in customOptions) {
      if (customOptions.hasOwnProperty(key)) {
        this.options[key] = customOptions[key];
      }
    }
    // Identify touch devices
    window.addEventListener('touchstart', () => {
      this.touchStarted = true;
    });
    this.onlineBible = getOnlineBible(this.options.onlineBible);
    // TODO: Later on, the best Bible API containing a certain translation should rather be used automatically
    this.bibleApi = getBibleApi(this.options.bibleApi);
    // Load dependency required for link creation
    this.parser.load(this.options, () => this.initComplete());
    // Load dependency required for tooltip display
    this.loadTippy();
  }

  /** Execute a parse for the given options. */
  public execute(): void {
    Blinx.time('execute()');
    Blinx.time('execute() - determine textNodes');
    // Search within all whitelisted selectors
    const nodes = u(this.getWhitelistSelector()).nodes;
    // Get all text nodes
    let textNodes = extractOrderedTextNodesFromNodes(nodes);
    // Exclude blacklisted selectors; this could probably be done in a more performant way
    if (this.areBlacklistedElementsPresent) {
      textNodes = textNodes.filter(textNode => {
        if (textNode.parentNode) {
          const el = u(textNode.parentNode)
            .closest(`${this.getWhitelistSelector()}, ${this.getBlacklistSelector()}`);
          return !el.is(this.getBlacklistSelector());
        }
        return true;
      });
    }
    Blinx.timeEnd('execute() - determine textNodes');
    Blinx.time('execute() - parsing');
    this.previousPassage = null;
    for (const textNode of textNodes) {
      this.parseReferencesInTextNode(textNode);
    }
    Blinx.timeEnd('execute() - parsing');
    // Once tippy.js is loaded, add tooltips
    Blinx.time('execute() - loading of tippy');
    this.tippyLoaded.promise
      .then(() => {
        Blinx.timeEnd('execute() - loading of tippy');
        Blinx.time('execute() - adding of tooltips');
        this.addTooltips();
        Blinx.timeEnd('execute() - adding of tooltips');
        this.linksAppliedDeferred.resolve();
        Blinx.timeEnd('execute()');
      });
  }

  private getWhitelistSelector(): string {
    const fixedWhitelist = [
      ...BX_SELECTORS,
      ...BX_PASSAGE_SELECTORS,
      ...BX_CONTEXT_SELECTORS
    ];
    const customisableWhitelist = this.options.whitelist || ['body'];
    return fixedWhitelist.concat(customisableWhitelist).join(',');
  }

  private getBlacklistSelector(): string {
    const fixedBlacklist = BX_SKIP_SELECTORS;
    const customisableBlacklist = this.options.blacklist || [];
    return fixedBlacklist.concat(customisableBlacklist).join(',');
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
      <a href="${this.bibleApi.url}"  target="_blank">${this.bibleApi.title}</a>
      by
      <a href="https://github.com/renehamburger/blinx.js" target="_blank">blinx.js</a>.
    </span>
  </div>
</div>
          `).attr('id', `bxTippyTemplate${index}`);
        this.tippyObjects.push(
          tippy(node as Element, {
            placement: 'top',
            arrow: true,
            arrowType: 'round',
            theme: this.options.theme,
            interactive: true,
            html: template.nodes[0],
            onShow: (tippyInstance) => {
              if (this.tippyPolyfills) {
                this.fixPopperPosition(tippyInstance);
              }
              const osis = u(tippyInstance.reference).data('osis');
              this.getTooltipContent(osis)
                .then((text: string) => {
                  u(template).find('.bxPassageText').html(text);
                  this.passageDisplayedDeferred.resolve();
                });
            },
            onHide: (tippyInstance) => {
              if (this.tippyPolyfills) {
                clearInterval(this.tippyPolyfillInterval);
                this.tippyPolyfillInterval = 0;
                // Not removed automatically for IE9
                setTimeout(() => {
                  const el: any = tippyInstance.popper;
                  if (el.removeNode) {
                    el.removeNode(true);
                  } else if (el.remove) {
                    el.remove();
                  }
                }, 500);
              }
            }
          })
        );
      });
  }

  /** Fix positon of Popper for polyfilled browsers, as Popper won't position them. */
  private fixPopperPosition(tippyInstance: Tippy.Instance) {
    const popper = tippyInstance.popper as HTMLElement;
    const adjustPos = () => {
      // Suppress errors for the sake of IE9 test
      try {
        popper.style.top = popper.getAttribute('x-placement') === 'top' ? '20px' : '10px';
        popper.style.left = '10px';
        popper.style.position = 'fixed';
        const arrow = popper.getElementsByClassName('tippy-roundarrow').item(0) as HTMLElement;
        arrow.style.display = 'none';
      } catch { }
    };
    // A very crude way of correcting the position, but Popper seems to set it several times
    setTimeout(adjustPos, 0);
    clearInterval(this.tippyPolyfillInterval);
    this.tippyPolyfillInterval = setInterval(adjustPos, 10);
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
   * Look for and link all references found in the given text node.
   * @param textNode
   */
  private parseReferencesInTextNode(textNode: Text): void {
    // Look for all complete Bible references
    const refs = this.parser.parse(textNode.textContent || '');
    this.handleReferencesFoundInText(textNode, refs);
  }

  /**
   * Link the given reference and continue looking for further (partial) references in the remaining text.
   * @param node Text node the given reference was found in
   * @param ref bcv_parser reference object
   */
  private handleReferencesFoundInText(node: Text, refs: BCV.OsisAndIndices[]): void {
    // Check for context
    let contextRef: BCV.OsisAndIndices | null = null;
    let attributeContext = '';
    if (this.areBxContextsPresent && node.parentNode) {
      const contextElement = u(node.parentNode).closest(BX_CONTEXT_SELECTORS.join(','));
      if (contextElement) {
        for (const selector of BX_CONTEXT_SELECTORS) {
          attributeContext = attributeContext || contextElement.attr(selector.replace(/^\[(.*)\]$/, '$1'));
        }
      }
    }
    if (attributeContext) {
      contextRef = this.parser.parse(attributeContext)[0];
    } else if (this.previousPassage) {
      contextRef = this.previousPassage.ref;
    }
    for (let i = refs.length - 1; i >= 0; i--) {
      const ref = refs[i];
      const remainder = node.splitText(ref.indices[1]);
      const passage = node.splitText(ref.indices[0]);
      if (passage) { // Always true in this case
        this.addLink(passage, ref);
      }
      const effectiveContextRef = attributeContext && contextRef ? contextRef : ref;
      this.parsePartialReferencesInText(remainder, this.convertOsisToContext(effectiveContextRef.osis));
    }
    if (refs.length) {
      this.previousPassage = { ref: refs[refs.length - 1], nodeDistance: 0 };
    } else if (this.previousPassage) {
      this.previousPassage.nodeDistance++;
    }
    // If an explicit context was provided, check for partial references _preceding_ the first recognised ref
    if (node.textContent && contextRef) {
      this.parsePartialReferencesInText(node, this.convertOsisToContext(contextRef.osis));
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
    const match = text.match(/\d+/);
    if (match && typeof match.index !== 'undefined') {
      this.parser.reset();
      let offset = 0;
      let refs: BCV.OsisAndIndices[] = [];
      const beforeMatch = text.slice(0, match.index);
      const fromMatchOnwards = text.slice(match.index);
      // Check for partial chapter-verse partial references first (e.g. '5:12')
      if (match.index < text.length) {
        const { chapterVerseSeparator } = this.parser.characters;
        const regex = new RegExp(`^\\d+${chapterVerseSeparator}\\d+`);
        const verseMatch = fromMatchOnwards.match(regex);
        if (verseMatch) {
          offset = match.index;
          refs = this.parser.parse_with_context(fromMatchOnwards, previousPassage);
        }
      }
      // Check for prefixed partial reference next (e.g. 'verse 3')
      if (!refs.length && match.index > 0) {
        const prefixMatch = beforeMatch.match(/\w+\.?\s*$/);
        if (prefixMatch) {
          const possibleReferenceWithPrefix = prefixMatch[0] + fromMatchOnwards;
          offset = match.index - prefixMatch[0].length;
          refs = this.parser.parse_with_context(possibleReferenceWithPrefix, previousPassage);
        }
      }
      if (refs.length) {
        // Partial reference recognised for the number found above
        for (const ref of refs) {
          ref.indices[0] += offset;
          ref.indices[1] += offset;
        }
        this.handleReferencesFoundInText(node, refs);
      } else {
        // Skip this (apparently) pure number and try again
        const refCharacters = Object.values<string>(this.parser.characters).join('');
        const matchRefCharacters = fromMatchOnwards.match(new RegExp(`^[\\d${refCharacters}]+`));
        if (matchRefCharacters) {
          const remainder = node.splitText(match.index + matchRefCharacters[0].length);
          this.parsePartialReferencesInText(remainder, previousPassage);
        }
      }
    }
  }

  private addLink(node: Node, ref: BCV.OsisAndIndices): void {
    const versionCode = this.getVersionCode(this.onlineBible);
    u(node)
      .wrap(`<a></a>`)
      .attr('href', this.onlineBible.buildPassageLink(ref.osis, versionCode))
      .attr('target', '_blank')
      .data('osis', ref.osis)
      .on('click', (evt: MouseEvent) => {
        if (this.touchStarted) {
          evt.preventDefault();
        }
      });
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
    const truncatedOsis = truncateMultiBookOsis(osis);
    let info = '';
    if (osis !== truncatedOsis) {
      info = 'Bible references stretching across several books are not yet supported.' +
        ' Only the verses from the first book are displayed above.';
    }
    return this.bibleApi.getPassage(truncatedOsis, versionCode)
      .then(text => `${text} <span class="bxPassageVersion">${bibleVersions[versionCode].title}</span>`)
      .then(text => info ? `${text} <div class="bxInfo">${info}</i>` : text);
  }

  private async loadTippy(): Promise<any> {
    const win: any = window;
    // For websites with require.js support, tippy will try to load through require.js, which fails.
    // Defining a temporary module object is a nasty workaround to force tippy to add itself as module.exports.
    const requireWorkaround = typeof win.define === 'function' && typeof win.module === 'undefined' &&
      typeof win.exports === 'undefined';
    if (requireWorkaround) {
      win.exports = {};
      win.module = {};
    }
    if ('tippy' in window) {
      this.tippyLoaded.resolve();
    } else {
      // Conditions taken from polyfill.io response.
      if (
        !('values' in Object) ||
        !('requestAnimationFrame' in window) ||
        !('DOMTokenList' in this && (function (x) {
          return 'classList' in x ? !x.classList.toggle('x', false) && !x.className : true;
        })(document.createElement('x')))
      ) {
        this.tippyPolyfills = !('requestAnimationFrame' in window);
        await loadScript('https://cdn.polyfill.io/v2/polyfill.js?features=' +
          'requestAnimationFrame|gated,Element.prototype.classList|gated,Object.values|gated');
      }
      await loadScript(`https://unpkg.com/tippy.js/dist/tippy.all.js`);
      if (this.options.theme === 'light') {
        await loadCSS('https://unpkg.com/tippy.js/dist/themes/light.css');
      }
      if (requireWorkaround) {
        win.tippy = win.module.exports;
        delete win.module;
        delete win.exports;
      }
      this.tippyLoaded.resolve();
    }
  }
}
//#endregion: Class definition

//#region: Pure/stateless helper functions
function extractOrderedTextNodesFromNodes(nodes: Node[]): Text[] {
  let textNodes: Text[] = [];
  for (const node of nodes) {
    textNodes = textNodes.concat(extractOrderedTextNodesFromSingleNode(node));
  }
  return textNodes;
}

function extractOrderedTextNodesFromSingleNode(node: Node): Text[] {
  const childNodes = [].slice.call(node.childNodes);
  let textNodes: Text[] = [];
  for (const childNode of childNodes) {
    if (isTextNode(childNode)) {
      textNodes.push(childNode);
    } else {
      textNodes = textNodes.concat(extractOrderedTextNodesFromSingleNode(childNode));
    }
  }
  return textNodes;
}

function isTextNode(node: Node): node is Text {
  return node.nodeType === node.TEXT_NODE;
}
//#endregion: Pure/stateless helper functions
