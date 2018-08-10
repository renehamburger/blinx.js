# blinx.js

[![Build Status](https://travis-ci.org/renehamburger/blinx.js.svg?branch=master)](https://travis-ci.org/renehamburger/blinx.js)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=NDFySHJvMm5tYU9TR2R6ckx3V1VPVEE2RWVaeUQwZkF4VUM4YWZXcmRDbz0tLVc0MmI0VTBxRWowTnZRcmw4WCswamc9PQ==--860f7ea93b85417a113f565e070df60691fd0097)](https://www.browserstack.com/automate/public-build/NDFySHJvMm5tYU9TR2R6ckx3V1VPVEE2RWVaeUQwZkF4VUM4YWZXcmRDbz0tLVc0MmI0VTBxRWowTnZRcmw4WCswamc9PQ==--860f7ea93b85417a113f565e070df60691fd0097)
[![codecov](https://codecov.io/gh/renehamburger/blinx.js/branch/master/graph/badge.svg)](https://codecov.io/gh/renehamburger/blinx.js)
<a href="#browser-compatibility--test"><img src="https://badges.herokuapp.com/browsers?labels=none&googlechrome=latest&firefox=latest&microsoftedge=latest&iexplore=-9,10,11&safari=latest" alt="Browser Support"/></a>

A multi-language client-side library to automatically convert Bible references to Bible links with passage pop-ups.

There are several other tools out there that do something similar (e.g. [Logos' Reftagger](https://reftagger.com), [Bible Gateway's Ref Tag Tool](https://www.biblegateway.com/share/), [bib.ly](http://bib.ly/), [Blue Letter Bible's ScriptTagger](https://www.blueletterbible.org/webtools/BLB_ScriptTagger.cfm), [BibleServer's linker](https://www.bibleserver.com/webmasters/#jslinks)). But they all have serious limitations:
- None of them are open source.
- With the notable exception of bib.ly, all of them link to a single online Bible.
- None of them has a large language support. All of them work for English Bible references and online Bibles, some support Spanish, Reftagger also supports French and (almost) supports German (with `:` instead of the usual `,`). The BibleServer tool supports 22 languages (!), but unfortunately it can only provide a hyperlink and no passage pop-up.

That is why I decided to create this library which will hopefully one day tick all these boxes. I named it __blinx.js__ after its older brother, the MS Word Add-in [Blinx](https://github.com/renehamburger/blinx), as both of them create __Bible-Links__ with passage pop-ups.

This library is __work in progress__: see the [preliminary roadmap](../projects/1). I am looking for one or two developers to join this project.

## Activation

For now, the script can be included directly from GitHub via RawGit, either through a script tag or dynamically.

### Script tag

```html
<script src="https://cdn.rawgit.com/renehamburger/blinx.js/v0.2.6/dist/blinx.js" defer data-blinx="{
  language: 'de'
}"></script>
```

The `data-blinx` attribute contains the options for blinx.js. For now, look at the definitions of the [blinx.js Options](src/options/options.ts#L7) and the related classes & types such as the [available Languages](src/options/languages.ts) or [the Bible Passage Reference Parser's Options](typings/bible-passage-reference-parser/index.d.ts#L35).

blinx.js loads several resources it requires dynamically and asynchronously. To speed up the identification and linking of Bible references on the page, the following script can already be loaded in parallel to blinx.js:

```html
<script src="https://cdn.rawgit.com/renehamburger/Bible-Passage-Reference-Parser/0f5485de/js/<LANGUAGE_CODE>_bcv_parser.js" defer></script>
<script src="https://cdn.rawgit.com/renehamburger/blinx.js/v0.2.6/dist/blinx.js" defer></script>
```

The string entered for the `<LANGUAGE_CODE>`, e.g. 'de', will then also determine the language for blinx.js. ('537560a7' is the current [latest commit of the Bible Passage Reference Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser/commits/master) and may need to be updated at a later stage.

### Dynamically

```js
var blinxScript = document.createElement("script");
blinxScript.type = 'text/javascript';
blinxScript.src = 'https://cdn.rawgit.com/renehamburger/blinx.js/v0.2.6/dist/blinx.js';
document.documentElement.appendChild(blinxScript);
blinxScript.setAttribute('data-blinx', '{ language: "de" }');
```

You can add the dynamic version as a bookmarklet to load and start the script on any page with Bible references. But note, that this may not work for websites with restrictive [Content Security Policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).

## Usage

If the chosen language is supported by the passage parser (see [below](#the-underlying-bible-passage-parser)), most references should be recognised automatically.

In those cases, where the automatic recognition fails, the following markup can be added to assist:

1. Any text that should not be parsed, e.g. because it contains numbers that are wrongly recognised as passages, can be surrounded (at any level) by a `bx-skip` in any of the following flavours:
    - As a custom tag: `<bx-skip>...</bx-skip>`
    - As a regular class: `<span class="bx-skip">...</span>`
    - As a custom attribute: `<span bx-skip>...</span>`
    - As a regular data-attribute: `<span data-bx-skip>...</span>`
  The custom options are shorter, but the regular options may be needed if your editor or linter complains. All supported browsers should be fine with any of them.

2. A context can be provided for partial references in case they are not preceded by a complete references or the preceeding complete reference does not apply to them. This can be done with the `bx-context` or `data-bx-context` attribute set to the correct context and attached to any of the element's ancestors. The context will be parsed according to the set language, but OSIS references will always work. Here is an example:

```html
This article is about Matt 1, (not about Mark 1), <span bx-context="Matt 1">in particular verses 1-20.</span>
```

Without the `bx-context` attribute, 'verses 1-20' would be interpreted as belonging to Mark 1.

For now, this attribute will always trump any preceding complete references, no matter how close they are. That is when wrappers with this attribute may need to be nested to ensure correct parsing of all partial references. Here's such an example taken from the demo chapter of the [PTC course](https://elearning.moore.edu.au/mod/page/view.php?id=707):

```html
<p bx-context="Luke 2">
  In these chapters Luke introduces us to a number of godly Israelites, looking for the 'consolation' or
  'redemption' of Israel (verses 25 and 38). In other words, these people were still waiting for the end
  of the exile (compare Isa 40:1; <span bx-context="Isa">52:9</span>). God reveals to them the presence of
  the Saviour in the person of the baby Jesus. His coming will mean salvation and glory for Israel and
  'a light for revelation to the Gentiles' (verses 29-32)
</p>
```

This paragraph contains mostly partial references within Luke chapter 2, which is provided as the overall context on the p-element. But in order to recognise 52:9 correctly as a chapter in Isaiah, another wrapper was introduced around it.

## The underlying Bible passage parser

blinx.js is based on the amazingly comprehensive [Bible Passage Reference Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser). It's shorter, internal name is 'BCV (=BookChapterVerse) Parser'. It is apparently able to parse Bible references for currently 23 different languages, covered by tests, and support for further languages can be added easily in that repository.

## Known issues

- Right-to-left languages are (almost certainly) not working out-of-the-box.

## Browser Compatibility & Test

<a href="https://www.browserstack.com/start" style="margin:-20px 0;">
  <img src="./assets/browserstack-logo.png" alt="Browser Stack Logo" height="105">
</a>

[BrowserStack](https://www.browserstack.com/start) is used to ensure a wide browser compatibility by running unit tests on multiple devices (cf. latest [test run]()https://www.travis-ci.org/renehamburger/blinx.js):

- **Chrome, Firefox, MS Edge, Safari**: Runs well on latest versions for each of these, but should also run on significantly older versions.
- **Internet Explorer**: Runs well on IE11 and with occasional problems on IE10. On IE9, only the linking of references works for now, but no tooltip is shown.
- **Mobile Browsers**: Not tested systematically yet, but support should be good on recent mobile browsers.

If you want to run those unit tests locally in a clone of blinx.js, it's easiest to change the `browsers` array in karma.conf.js to `[PhantomJS]`. Alternatively, you can add your BrowserStack credentials via the environment variables `BROWSER_STACK_USERNAME` and `BROWSER_STACK_ACCESS_KEY`. (If the BrowserStack tunnel is [not executed automatically](https://github.com/karma-runner/karma-browserstack-launcher/issues/42), e.g. on Windows, you may need to start it manually with  `./node_modules/browserstacktunnel-wrapper/bin/win32/BrowserStackLocal.exe --key $BROWSER_STACK_ACCESS_KEY`.)
