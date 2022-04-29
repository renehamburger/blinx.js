# blinx.js

[![Build Status](https://github.com/renehamburger/blinx.js/workflows/CI/badge.svg)](https://github.com/renehamburger/blinx.js/actions?query=workflow%3ACI+branch%3Amaster)
[![BrowserStack Status](https://automate.browserstack.com/badge.svg?badge_key=MTF5OFJYM3dsZTdrVEZtcFFBUzF4OE9aN2V0b2dVTHZyL2lTUVdiZHBpbz0tLVZWN043NGVHY1cwNlkvdGt3QkNoY3c9PQ==--27762cc0861cd25ada2250f14db412650dc47bfe)](https://automate.browserstack.com/public-build/MTF5OFJYM3dsZTdrVEZtcFFBUzF4OE9aN2V0b2dVTHZyL2lTUVdiZHBpbz0tLVZWN043NGVHY1cwNlkvdGt3QkNoY3c9PQ==--27762cc0861cd25ada2250f14db412650dc47bfe)
[![codecov](https://codecov.io/gh/renehamburger/blinx.js/branch/master/graph/badge.svg)](https://codecov.io/gh/renehamburger/blinx.js)
<a href="#browser-compatibility--test"><img src="https://badges.herokuapp.com/browsers?labels=none&googlechrome=latest&firefox=latest&microsoftedge=latest&iexplore=-9,10,11&safari=latest" alt="Browser Support"/></a>

A multi-language client-side library to automatically convert Bible references to Bible links with passage pop-ups.

There are several other tools out there that do something similar (e.g. [Logos' Reftagger](https://reftagger.com), [Bible Gateway's Ref Tag Tool](https://www.biblegateway.com/share/), [bib.ly](http://bib.ly/), [Blue Letter Bible's ScriptTagger](https://www.blueletterbible.org/webtools/BLB_ScriptTagger.cfm), [BibleServer's linker](https://www.bibleserver.com/webmasters/#jslinks)). But they all have serious limitations:

- None of them are open source.
- With the notable exception of bib.ly, all of them link to a single online Bible.
- None of them has a large language support. All of them work for English Bible references and online Bibles, some support Spanish, Reftagger also supports French and (almost) supports German (with `:` instead of the usual `,`). The BibleServer tool supports 22 languages (!), but unfortunately it can only provide a hyperlink and no passage pop-up.

That is why I decided to create this library which will hopefully one day tick all these boxes. I named it **blinx.js** after its older brother, the MS Word Add-in [Blinx](https://github.com/renehamburger/blinx), as both of them create **Bible-Links** with passage pop-ups.

## Demo

Have a look at [this unit of the Bibel-für-alle course](http://kostprobe.bibel-fuer-alle.net) or open [one of the articles on the Evangelium21 website](https://www.evangelium21.net/ressourcen/typ/artikel) to get an idea of what blinx.js does out-of-the-box.

## Activation

For now, the script can be included directly from GitHub via the jsdelivr CDN, either through a script tag or dynamically.

### Script tag

```html
<script
  src="https://cdn.jsdelivr.net/gh/renehamburger/blinx.js@v0.4.14/dist/blinx.js"
  defer
  data-blinx="{
  language: 'de'
}"
></script>
```

The `data-blinx` attribute contains the options for blinx.js. For now, look at the definitions of the [blinx.js-options](src/options/options.ts#L7) and the related classes & types such as the [available Languages](src/options/languages.ts) or [the Bible Passage Reference Parser's Options](typings/bible-passage-reference-parser/index.d.ts#L35).

blinx.js loads several resources it requires dynamically and asynchronously. To speed up the identification and linking of Bible references on the page, the following script can already be loaded in parallel to blinx.js:

```html
<script
  src="https://cdn.jsdelivr.net/gh/renehamburger/Bible-Passage-Reference-Parser@99f0338587acb6eb8365c4ea6b48b9c52040ae90/js/<LANGUAGE_CODE>_bcv_parser.js"
  defer
></script>
<script
  src="https://cdn.jsdelivr.net/gh/renehamburger/blinx.js@v0.4.14/dist/blinx.js"
  defer
></script>
```

The string entered for the `<LANGUAGE_CODE>`, e.g. 'de', will then also determine the language for blinx.js. ('537560a7' is the current [latest commit of the Bible Passage Reference Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser/commits/master) and may need to be updated at a later stage.

### Dynamically

```js
var blinxScript = document.createElement('script');
blinxScript.type = 'text/javascript';
blinxScript.src = 'https://cdn.jsdelivr.net/gh/renehamburger/blinx.js@v0.4.14/dist/blinx.js';
document.documentElement.appendChild(blinxScript);
blinxScript.setAttribute('data-blinx', '{ language: "de" }');
```

You can add the dynamic version as a bookmarklet to load and start the script on any page with Bible references. But note, that this may not work for websites with restrictive [Content Security Policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).

## Usage

If the chosen language is supported by the passage parser (see [below](#the-underlying-bible-passage-parser)), most references should be recognised automatically.

In those cases, where the automatic recognition fails, one of the following solutions will work:

1. **whitelist-selectors** can be used to specifically **activate** parts of the html document for blinx.js' parsing of references.
   The [blinx.js-option](src/options/options.ts#L7) `whitelist` contains a customisable list of such whitelisted query- or css-selectors. By default, this whitelist contains the whole `body` tag of the document. This can be overwritten to only match the element(s) that can contain references.
   In addition, the three selectors `bx`, `bx-context`, and `bx-passage` introduced below (see 3. and 4.) are always whitelist-selectors.

2. **blacklist-selectors** can be used to specifically ***de*activate** parts of the html document for blinx.js' parsing of references.
   The [option](src/options/options.ts#L7) `blacklist` contain a customisable list of blacklisted selectors. By default, it only contains the `a` link tag.
   In addition to this customisable blacklist, the **`bx-skip`-selector** is always available as a built-in blacklist-selector to skip parts of the document. This may be necessary, because they contain numbers that are wrongly recognised as passages. In order to skip them, they can be surrounded (at any level) by a `bx-skip`-element in one of two ways: - As a custom tag: `<bx-skip>...</bx-skip>` - As a regular class: `<span class="bx-skip">...</span>`
   (The custom tag is shorter, but the regular class may be needed if your editor or linter complains. All supported browsers should be fine with both of them.)

whitelist- and blacklist-selectors can be nested. They former activates a section for the parsing and the latter deactives a subsection of this section again for parsing and so on. Here's an example:

```html
<article>
  <!-- `article` is one of the whitelisted elements, so blinx.js will look for references within -->
  Some references
  <!-- ACTIVATED for parsing -->
  <bx-skip>
    <!-- Whole p-element explicitly skipped -->
    Some content that may be wrongly recognised as references
    <!-- DE-ACTIVATED for parsing -->
    <span bx-context="Mt 1">
      <!-- bx-context activates it again -->
      Some partial references
      <!-- ACTIVATED for parsing -->
    </span>
    More problematic content...
    <!-- still DE-ACTIVATED for parsing -->
    <bx>
      <!-- bx also activates it -->
      Some full references
      <!-- ACTIVATED for parsing -->
    </bx>
  </bx-skip>
</article>
<article class="bx-skip">
  <!-- A blacklist-selector always trumps a whitelist-selector on the same element -->
  Some other content
  <!-- DEACTIVATED for parsing -->
</article>
```

3. The **`bx`-selector** is a convenient whitelist selector that is always available for activating a section for parsing. It's the counterpart `bx-skip` and can be used likewise:

   - As a custom tag: `<bx>...</bx>`
   - As a regular class: `<span class="bx">...</span>`

4. The **`bx-context`-attribute** allows to provide the parsing context for partial references, in case they are not preceded by a complete reference or if the preceeding complete reference does not apply to them: - As a custom attribute: `<span bx-context="...">...</span>` - As a regular data-attribute: `<span data-bx-context="...">...</span>` - In combination with `bx`: `<bx context="...">...</bx>`
   (The first two options can be used on existing wrappers. The custom attribute with or without `bx` is shorter, but the regular data-attribute on a regular tag may be needed if your editor or linter complains. All supported browsers should be fine with all of them.)
   The context will be parsed according to the set language, but OSIS-references will always work. Here's an example:

```html
This article is about Matt 1, (not about Mark 1),
<bx context="Matt 1">in particular verses 1-20.</bx>
```

Without the `bx-context`-attribute, 'verses 1-20' would be interpreted as belonging to Mark 1.

For now, this attribute will always trump any preceding complete references, no matter how close they are. That is when wrappers with this attribute may need to be nested to ensure correct parsing of all partial references. Here's such an example taken from the demo chapter of the [PTC course](https://elearning.moore.edu.au/mod/page/view.php?id=707):

```html
<p bx-context="Luke 2">
  In these chapters Luke introduces us to a number of godly Israelites, looking for the
  'consolation' or 'redemption' of Israel (verses 25 and 38). In other words, these people were
  still waiting for the end of the exile (compare Isa 40:1; <span bx-context="Isa">52:9</span>). God
  reveals to them the presence of the Saviour in the person of the baby Jesus. His coming will mean
  salvation and glory for Israel and 'a light for revelation to the Gentiles' (verses 29-32)
</p>
```

This paragraph contains mostly partial references within Luke chapter 2, which is provided as the overall context on the p-element. But in order to recognise 52:9 correctly as a chapter in Isaiah, another wrapper was introduced around it.

5. The final and most powerful and explicit way to enable correct recognition of a passage is the **`bx-passage`-attribute**:
   - As a custom attribute: `<span bx-passage="...">...</span>`
   - As a regular data-attribute: `<span data-bx-passage="...">...</span>`
   - In combination with `bx`: `<bx passage="...">...</bx>`

Similar to the `bx-context`-attribute, it is set to a passage, which will be parsed according to the set language. (OSIS-references will always work here, too.) The html element it is attached to will be converted to an `a`-link like all other recognised passages. _For now, it may only context text._ Here's a short example demonstrating the use (and necessity) of this attribute:

```html
In Genesis 1:1 and in the <bx passage="Gen 1:2">following verse</bx>...
```

## The underlying Bible passage parser

blinx.js is based on the amazingly comprehensive [Bible Passage Reference Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser). It's shorter, internal name is 'BCV (=BookChapterVerse) Parser'. It is apparently able to parse Bible references for currently 23 different languages, covered by tests, and support for further languages can be added easily in that repository.

## Creating a snapshot of all Bible references on a website with the blinx-cli

[blinx-cli](https://github.com/renehamburger/blinx-cli) is a Node.js project that can be used to scan a complete website for all blinx.js-generated Bible links, which are saved as a JSON file per page. This can be very useful for creating a snapshot before upgrading to a signficantly different version of blinx.js.

At a later stage blinx-cli may include the generation of an Bible reference index page with links to the pages where those references are used.

## How to contribute

This library itself is almost feature-complete for the browser. See the [roadmap](https://github.com/renehamburger/blinx.js/projects/1) for possible next steps. PRs are welcome, especially for support for new languages, online Bibles or Bible APIs.

The build process should be straight forward:

1. Clone this repo
2. Run `npm install`.
3. Run `npm start` for a local development server and `npm test.chrome` (or one of the other test scripts) for running the unit tests.

Any PR will also be built and unit-tested by the [Github CI workflow](https://github.com/renehamburger/blinx.js/actions?query=workflow%3ACI).

There is also more work to be done on the underlying [Bible Passage Reference Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser).

## Known issues

- Right-to-left languages are (almost certainly) not working out-of-the-box.

## Browser Compatibility & Test

<a href="https://www.browserstack.com/start" style="margin:-20px 0;">
  <img src="./assets/browserstack-logo.png" alt="Browser Stack Logo" height="105">
</a>

[BrowserStack](https://www.browserstack.com/start) is used to ensure a wide browser compatibility by running unit tests on multiple devices:

- **Chrome, Firefox, MS Edge, Safari**: Runs well on latest versions for each of these, but should also run on significantly older versions.
- **Internet Explorer**: Runs well on IE11 and with occasional problems on IE10. On IE9, only the linking of references works for now, but no tooltip is shown.
- **Mobile Browsers**: Not tested systematically yet, but support should be good on recent mobile browsers.

If you want to run those unit tests locally in a clone of blinx.js, it's easiest to change the `browsers` array in karma.conf.js to `[PhantomJS]`. Alternatively, you can add your BrowserStack credentials via the environment variables `BROWSER_STACK_USERNAME` and `BROWSER_STACK_ACCESS_KEY`. (If the BrowserStack tunnel is [not executed automatically](https://github.com/karma-runner/karma-browserstack-launcher/issues/42), e.g. on Windows, you may need to start it manually with `./node_modules/browserstacktunnel-wrapper/bin/win32/BrowserStackLocal.exe --key $BROWSER_STACK_ACCESS_KEY`.)
