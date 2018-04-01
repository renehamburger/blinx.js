# blinx.js

[![Build Status](https://travis-ci.org/renehamburger/blinx.js.svg?branch=master)](https://travis-ci.org/renehamburger/blinx.js)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=NDFySHJvMm5tYU9TR2R6ckx3V1VPVEE2RWVaeUQwZkF4VUM4YWZXcmRDbz0tLVc0MmI0VTBxRWowTnZRcmw4WCswamc9PQ==--860f7ea93b85417a113f565e070df60691fd0097)](https://www.browserstack.com/automate/public-build/NDFySHJvMm5tYU9TR2R6ckx3V1VPVEE2RWVaeUQwZkF4VUM4YWZXcmRDbz0tLVc0MmI0VTBxRWowTnZRcmw4WCswamc9PQ==--860f7ea93b85417a113f565e070df60691fd0097)
[![codecov](https://codecov.io/gh/renehamburger/blinx.js/branch/master/graph/badge.svg)](https://codecov.io/gh/renehamburger/blinx.js)

A multi-language client-side library to automatically convert Bible references to Bible links with passage pop-ups.

There are several other tools out there that do something similar (e.g. [Logos' Reftagger](https://reftagger.com), [Bible Gateway's Ref Tag Tool](https://www.biblegateway.com/share/), [bib.ly](http://bib.ly/), [Blue Letter Bible's ScriptTagger](https://www.blueletterbible.org/webtools/BLB_ScriptTagger.cfm), [BibleServer's linker](https://www.bibleserver.com/webmasters/#jslinks)). But they all have serious limitations:
- None of them are open source.
- With the notable exception of bib.ly, all of them link to a single online Bible.
- None of them has a large language support. All of them work for English Bible references and online Bibles, some support Spanish, Reftagger also supports French and (almost) supports German (with `:` instead of the usual `,`). The BibleServer tool supports 22 languages (!), but unfortunately it can only provide a hyperlink and no passage pop-up.

That is why I decided to create this library which will hopefully one day tick all these boxes. I named it __blinx.js__ after its older brother, the MS Word Add-in [Blinx](https://github.com/renehamburger/blinx), as both of them create __Bible-Links__ with passage pop-ups.

This library is __work in progress__: see the [preliminary roadmap](../projects/1). I am looking for one or two developers to join this project.

## Usage

For now, the script can be included directly from GitHub via RawGit, either through a script tag or dynamically.

### Script tag

```html
<script src="https://cdn.rawgit.com/renehamburger/blinx.js/v0.1.2/dist/blinx.js" defer data-blinx="{
  language: 'de'
}"></script>
```

The `data-blinx` attribute contains the options for blinx.js. For now, look at the definitions of the [blinx.js Options](src/options/options.ts#L7) and the related classes & types such as the [available Languages](src/options/languages.ts) or [the Bible Passage Reference Parser's Options](typings/bible-passage-reference-parser/index.d.ts#L35).

blinx.js loads several resources it requires dynamically and asynchronously. To speed up the identification and linking of Bible references on the page, the following script can already be loaded in parallel to blinx.js:

```html
<script src="https://cdn.rawgit.com/openbibleinfo/Bible-Passage-Reference-Parser/537560a7/js/<LANGUAGE_CODE>_bcv_parser.js" defer></script>
<script src="https://cdn.rawgit.com/renehamburger/blinx.js/v0.1.2/dist/blinx.js" defer></script>
```

The string entered for the `<LANGUAGE_CODE>`, e.g. 'de', will then also determine the language for blinx.js. ('537560a7' is the current [latest commit of the Bible Passage Reference Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser/commits/master) and may need to be updated at a later stage.

### Dynamically

```js
var blinxScript = document.createElement("script");
blinxScript.type = 'text/javascript';
blinxScript.src = 'https://cdn.rawgit.com/renehamburger/blinx.js/v0.1.2/dist/blinx.js';
document.documentElement.appendChild(blinxScript);
blinxScript.setAttribute('data-blinx', '{ language: "de" }');
```

You can add the dynamic version as a bookmarklet to load and start the script on any page with Bible references. But note, that this may not work for websites with restrictive [Content Security Policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).

## The underlying Bible passage parser

blinx.js is based on the amazingly comprehensive [Bible Passage Reference Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser). It's shorter, internal name is 'BCV (=BookChapterVerse) Parser'. It is apparently able to parse Bible references for currently 23 different languages, covered by tests, and support for further languages can be added easily in that repository.

## Known issues

- Right-to-left languages are (almost certainly) not working out-of-the-box.

## Browser Compatibility & Test

<a href="https://www.browserstack.com/start" style="margin:-20px 0;">
  <img src="./assets/browserstack-logo.png" alt="Browser Stack Logo" height="105">
</a>

[BrowserStack](https://www.browserstack.com/start) is used to ensure a wide browser compatibility by running unit tests on multiple devices.

If you want to run those unit tests locally in a clone of blinx.js, it's easiest to change the `browsers` array in karma.conf.js to `[PhantomJS]`. Alternatively, you can add your BrowserStack credentials via the environment variables `BROWSER_STACK_USERNAME` and `BROWSER_STACK_ACCESS_KEY`. (If the BrowserStack tunnel is [not executed automatically](https://github.com/karma-runner/karma-browserstack-launcher/issues/42), e.g. on Windows, you may need to start it manually with  `./node_modules/browserstacktunnel-wrapper/bin/win32/BrowserStackLocal.exe --key $BROWSER_STACK_ACCESS_KEY`.)
