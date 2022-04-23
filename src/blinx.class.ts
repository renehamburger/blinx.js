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
import { transformOsis, truncateMultiBookOsis, TransformOsisOptions } from 'src/helpers/osis';
import {
  BX_SKIP_SELECTORS,
  BX_PASSAGE_SELECTORS,
  BX_CONTEXT_SELECTORS,
  BX_SELECTORS
} from 'src/options/selectors.const';
import './css/blinx.css'; // relative path is needed here!
import { I18n } from 'src/i18n/i18n.class';
import { makePureBookReferencesParseable } from './helpers/blinx.functions';
import {
  extractOrderedTextNodesFromNodes,
  getAttributeBySelectors
} from './helpers/blinx.functions';

//#region: Closure for constants & caches
const isVerbose =
  window.__karma__ && window.__karma__.config.args.some((arg: string) => arg === 'verbose');

const DEBUG = {
  performance: isVerbose,
  logging: isVerbose
};

const timers: { [label: string]: number } = {};

const passageCache: { [bibleApi: string]: { [osis: string]: string } } = {};
//#endregion: Closure for constants & caches

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
  private i18n = new I18n();
  private onlineBible: OnlineBible;
  private bibleApi: BibleApi;
  private tippyObjects: Tippy.Object[] = [];
  private tippyLoaded = new Deferred<void>();
  private touchStarted = false;
  private tippyPolyfills = false;
  private tippyPolyfillInterval = 0;
  /** Last recognised passage during DOM traversal. Later on, a threshhold on nodeDistances might make sense. */
  private previousPassage: { ref: BCV.OsisAndIndices; nodeDistance: number } | null = null;
  private selectorTests: { [selector: string]: boolean } = {};

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
    this.i18n.setLanguage(this.options.language);
    this.onlineBible = getOnlineBible(this.options.onlineBible);
    // TODO: Later on, the best Bible API containing a certain translation should rather be used automatically
    this.bibleApi = getBibleApi(this.options.bibleApi);
    passageCache[this.bibleApi.title] = {};
    // Load dependency required for link creation
    this.parser.load(this.options, () => this.initComplete());
    // Load dependency required for tooltip display
    this.loadTippy();
  }

  /** Execute a parse for the given options. */
  public async execute() {
    Blinx.time('execute()');
    Blinx.time('execute() - determine textNodes');
    // Search within all whitelisted selectors
    const nodes = u(this.getWhitelistSelector()).nodes;
    // Get all text nodes
    let textNodes = extractOrderedTextNodesFromNodes(nodes);
    // Exclude blacklisted selectors; this could probably be done in a more performant way
    if (this.isSelectorPresent(this.getBlacklistSelector())) {
      textNodes = textNodes.filter((textNode) => {
        if (textNode.parentNode) {
          const el = u(textNode.parentNode).closest(
            `${this.getWhitelistSelector()}, ${this.getBlacklistSelector()}`
          );
          return !el.is(this.getBlacklistSelector());
        }
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
    await this.tippyLoaded.promise;
    Blinx.timeEnd('execute() - loading of tippy');
    Blinx.time('execute() - adding of tooltips');
    this.addTooltips();
    Blinx.timeEnd('execute() - adding of tooltips');
    this.linksAppliedDeferred.resolve();
    Blinx.timeEnd('execute()');
  }

  private getWhitelistSelector(): string {
    const fixedWhitelist = [...BX_SELECTORS, ...BX_PASSAGE_SELECTORS, ...BX_CONTEXT_SELECTORS];
    const customisableWhitelist = this.options.whitelist || ['body'];
    return fixedWhitelist.concat(customisableWhitelist).join(',');
  }

  private getBlacklistSelector(): string {
    const fixedBlacklist = BX_SKIP_SELECTORS;
    const customisableBlacklist = this.options.blacklist || [];
    return fixedBlacklist.concat(customisableBlacklist).join(',');
  }

  private isSelectorPresent(selector: string): boolean {
    if (!(selector in this.selectorTests)) {
      const el = document.querySelector(selector);
      this.selectorTests[selector] = !!el;
    }
    return this.selectorTests[selector];
  }

  private addTooltips() {
    const blinxCredits = this.i18n.translate('credits.blinx', {
      blinx: `<a href="https://github.com/renehamburger/blinx.js" target="_blank">blinx.js</a>`
    });
    const apiCredits = this.i18n.translate('credits.api', {
      api: `<a href="${this.bibleApi.url}"  target="_blank">${this.bibleApi.title}</a>`
    });
    const versionCode = this.getVersionCode(this.onlineBible);
    // Loop through all nodes in order to create a unique template for each
    u('[data-osis]').each((node, index) => {
      const osis = u(node).data('osis');
      const template = u('<div />')
        .html(
          `
<div class="bxTippy">
  <div class="bxTippyBody">
    <span class="bxPassageText">
      <div class="bxLoader"></div>
    </span>
  </div>
  <div class="bxTippyFooter">
    <a class="bxPassageLink" href="${this.onlineBible.buildPassageLink(
      osis,
      versionCode
    )}" target="_blank">
      ${this.convertOsisToRegularReference(osis, true)}</a>
    <label for="bxCopyrightTrigger" class="bxCopyrightTriggerLabel">©</label>
    <input type="checkbox" id="bxCopyrightTrigger">
    <div class="bxCopyrightDetails">
      <div>${blinxCredits}</div>
      <div>${apiCredits}</div>
    </div>
  </div>
</div>
          `
        )
        .attr('id', `bxTippyTemplate${index}`);
      this.tippyObjects.push(
        tippy(node as Element, {
          placement: this.options.placement,
          arrow: true,
          arrowType: 'round',
          theme: this.options.theme,
          interactive: true,
          html: template.nodes[0],
          onShow: async (tippyInstance) => {
            if (this.tippyPolyfills) {
              this.fixPopperPosition(tippyInstance);
            }
            const osisRef = u(tippyInstance.reference).data('osis');
            const text = await this.getTooltipContent(osisRef);
            u(template).find('.bxPassageText').html(text);
            this.passageDisplayedDeferred.resolve();
          },
          onHide: (tippyInstance) => {
            const copyrightTrigger = tippyInstance.popper.querySelector(
              '#bxCopyrightTrigger'
            ) as HTMLInputElement;
            copyrightTrigger.checked = false;
            if (this.tippyPolyfills) {
              if (this.tippyPolyfillInterval) {
                clearInterval(this.tippyPolyfillInterval);
              }
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
      } catch {}
    };
    // A very crude way of correcting the position, but Popper seems to set it several times
    setTimeout(adjustPos, 0);
    if (this.tippyPolyfillInterval) {
      clearInterval(this.tippyPolyfillInterval);
    }
    this.tippyPolyfillInterval = setInterval(adjustPos, 10) as unknown as number;
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
   * TODO: Made public temporarily to allow simple testing
   * @param textNode
   */
  parseReferencesInTextNode(textNode: Text): void {
    const bxPassageSelector = BX_PASSAGE_SELECTORS.join(',');
    const parent = textNode.parentNode && u(textNode.parentNode);
    // Check if text node is wrapped by element with [bx-passage] attribute
    if (this.isSelectorPresent(bxPassageSelector) && parent && parent.is(bxPassageSelector)) {
      const passage = getAttributeBySelectors(parent, BX_PASSAGE_SELECTORS);
      const refs = this.parser.parse(passage);
      if (refs.length === 1) {
        this.addLink(textNode, refs[0]);
        this.previousPassage = { ref: refs[0], nodeDistance: 0 };
      }
    } else {
      // Look for all complete Bible references
      const refs = this.parser.parse(textNode.textContent || '');
      this.handleReferencesFoundInText(textNode, refs);
    }
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
    const contextSelector = BX_CONTEXT_SELECTORS.join(',');
    if (this.isSelectorPresent(contextSelector) && node.parentNode) {
      const contextElement = u(node.parentNode).closest(contextSelector);
      if (contextElement.nodes.length === 1) {
        attributeContext = getAttributeBySelectors(contextElement, BX_CONTEXT_SELECTORS);
      }
    }
    if (attributeContext) {
      attributeContext = makePureBookReferencesParseable(attributeContext);
      contextRef = this.parser.parse(attributeContext)[0];
    } else if (this.previousPassage) {
      contextRef = this.previousPassage.ref;
    }
    //--- Split up nodes from back to front (required because of splitText() functionality)
    const nodesBetweenReferences: Text[] = [];
    const nodesWithReference: Text[] = [];
    for (let i = refs.length - 1; i >= 0; i--) {
      const ref = refs[i];
      nodesBetweenReferences.unshift(node.splitText(ref.indices[1]));
      nodesWithReference.unshift(node.splitText(ref.indices[0]));
    }
    //--- Process passages from start to end to ensure correct context for partial references
    // If an explicit context was provided, check for partial references preceding the first recognised ref
    if (node.textContent && contextRef) {
      this.parsePartialReferencesInText(node, this.convertOsisToRegularReference(contextRef.osis));
    }
    refs.forEach((ref, index) => {
      const passage = nodesWithReference[index];
      const remainder = nodesBetweenReferences[index];
      if (passage) {
        // Should always true anyway
        this.addLink(passage, ref);
      }
      const effectiveContextRef = attributeContext && contextRef ? contextRef : ref;
      this.parsePartialReferencesInText(
        remainder,
        this.convertOsisToRegularReference(effectiveContextRef.osis)
      );
    });
    if (refs.length) {
      this.previousPassage = { ref: refs[refs.length - 1], nodeDistance: 0 };
    } else if (this.previousPassage) {
      this.previousPassage.nodeDistance++;
    }
  }

  private convertOsisToRegularReference(osis: string, prettyBookName?: boolean): string {
    const options: Partial<TransformOsisOptions> = {
      bookChapter: ' ',
      chapterVerse: this.parser.characters.chapterVerseSeparator,
      ...(prettyBookName
        ? { bookNameMap: this.i18n.translate<{ [name: string]: string }>('books') }
        : {})
    };
    return transformOsis(osis, options);
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
        // Exclude range prefixes (e.g. 'and'), as they are interpreted by the parser as if they
        // were following the full references immediately. But those that do are already included
        // in the 'full' references found above. (See spec 'only includes conjunction if directly adjacent')
        // We are really only interested in 'chapter' and 'verse' equivalents here, but they are not yet
        // exposed individually by the parser.
        if (prefixMatch && !Parser.isRangeAndExpression(prefixMatch[0].trim())) {
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
    let versionCode = isString(this.options.bibleVersion)
      ? this.options.bibleVersion
      : this.options.bibleVersion.bibleText;
    versionCode = versionCode.toLowerCase() as typeof versionCode; // Support for legacy codes which had capitalised characters
    const availableVersions = Object.keys(
      bible.getAvailableVersions(this.options.language)
    ) as BibleVersionCode[];
    // If the versionCode does not match the given language or is not supported by the given Bible,
    // find the first version available for the given online Bible for this language
    if (
      versionCode.indexOf(this.options.language) !== 0 ||
      availableVersions.indexOf(versionCode) === -1
    ) {
      if (availableVersions.length) {
        versionCode = availableVersions[0];
      }
    }
    return versionCode;
  }

  private async getTooltipContent(osis: string): Promise<string> {
    const versionCode = this.getVersionCode(this.bibleApi);
    const truncatedOsis = truncateMultiBookOsis(osis);
    let info = '';
    if (osis !== truncatedOsis) {
      info = this.i18n.translate('error.multiBookReference');
    }
    let text = await this.getPassage(truncatedOsis, versionCode);
    text = `${text} <span class="bxPassageVersion">${bibleVersions[versionCode].title}</span>`;
    return info ? `${text} <div class="bxInfo">${info}</i>` : text;
  }

  private async getPassage(osis: string, versionCode: BibleVersionCode): Promise<string> {
    if (!passageCache[this.bibleApi.title][osis]) {
      passageCache[this.bibleApi.title][osis] = await this.bibleApi.getPassage(osis, versionCode);
    }
    return passageCache[this.bibleApi.title][osis];
  }

  private async loadTippy(): Promise<any> {
    if ('tippy' in window) {
      this.tippyLoaded.resolve();
    } else {
      // Conditions taken from polyfill.io response.
      if (
        !('values' in Object) ||
        !('requestAnimationFrame' in window) ||
        !(
          'DOMTokenList' in this &&
          ((x) => {
            return 'classList' in x ? !x.classList.toggle('x', false) && !x.className : true;
          })(document.createElement('x'))
        )
      ) {
        this.tippyPolyfills = !('requestAnimationFrame' in window);
        await loadScript(
          'https://cdn.polyfill.io/v2/polyfill.js?features=' +
            'requestAnimationFrame|gated,Element.prototype.classList|gated,Object.values|gated'
        );
      }
      await loadScript(
        `https://cdn.jsdelivr.net/gh/renehamburger/blinx.js@master/assets/tippy.all.min.js`
      );
      if (this.options.theme === 'light') {
        await loadCSS(
          `https://cdn.jsdelivr.net/gh/renehamburger/blinx.js@master/assets/tippy.light.css`
        );
      }
      this.tippyLoaded.resolve();
    }
  }
}
//#endregion: Class definition
