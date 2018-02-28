# blinx.js

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
<script src="https://cdn.rawgit.com/renehamburger/blinx.js/<RELEASE>/dist/blinx.js" defer data-blinx="{
  language: 'de'
}"></script>
```

Here and below, `<RELEASE>` should be replaced by the [most recent release](https://github.com/renehamburger/blinx.js/releases), e.g. 'v0.0.3'.

The `data-blinx` attribute contains the options for blinx.js. For now, look at the definitions of the [blinx.js Options](src/options/options.ts#L7) and the related classes & types such as the [available Languages](src/options/languages.ts) or [the Bible Passage Reference Parser's Options](typings/bible-passage-reference-parser/index.d.ts#L35).

2 further scripts will be loaded by blinx.js. To speed up load times, these two can already be loaded in parallel to blinx.js:

```html
<script src="https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.classList|gated,Promise|gated" defer></script>
<script src="https://cdn.rawgit.com/openbibleinfo/Bible-Passage-Reference-Parser/537560a7/js/<LANGUAGE_CODE>_bcv_parser.js" defer></script>
<script src="https://cdn.rawgit.com/renehamburger/blinx.js/<RELEASE>/dist/blinx.js" defer></script>
```

The string entered for the `<LANGUAGE_CODE>`, e.g. 'de', will then also determine the language for blinx.js. ('537560a7' is the current [latest commit of the Bible Passage Reference Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser/commits/master) and may need to be updated at a later stage, similar to the blinx.js' `<RELEASE>` placeholder above.

### Dynamically

```js
var blinxScript = document.createElement("script");
blinxScript.type = 'text/javascript';
blinxScript.src = 'https://cdn.rawgit.com/renehamburger/blinx.js/<RELEASE>/dist/blinx.js';
document.documentElement.appendChild(blinxScript);
blinxScript.setAttribute('data-blinx', '{ language: "de" }');
```

You can add the dynamic version as a bookmarklet to load and start the script on any page with Bible references.

## The underlying Bible passage parser

blinx.js is based on the amazingly comprehensive [Bible Passage Reference Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser). It's shorter, internal name is 'BCV (=BookChapterVerse) Parser'. It is apparently able to parse Bible references for currently 23 different languages, covered by tests, and support for further languages can be added easily in that repository.

## Known issues
- Right-to-left languages are (almost certainly) not working out-of-the-box.
