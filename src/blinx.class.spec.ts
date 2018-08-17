import { Blinx } from 'src/blinx.class';
import { loadBlinx } from 'src/main';
import { u } from 'src/lib/u.js';
import { Options } from 'src/options/options';

let blinx: Blinx;

describe('Blinx', () => {

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  describe('node iteration', () => {

    it('uses custom whitelist & blacklist correctly', () => {
      document.body.innerHTML = `
        ...
        <p>1</p>
        <div>
          ...
          <p>2</p>
        </div>
        <p><span class="skip">...</span></p>
        <p class="skip"> <!-- blacklist trumps whitelist -->
          ...
        </p>
      `;
      const blinx = new Blinx({ parseAutomatically: false, whitelist: ['p'], blacklist: ['.skip'] });
      const textContents: string[] = [];
      spyOn(blinx, 'parseReferencesInTextNode' as any).and.callFake((node: Node) => {
        textContents.push(node.textContent || '');
      });
      blinx.execute();
      expect(textContents).toEqual(['1', '2']);
    });

    it('uses default whitelist & blacklist correctly', () => {
      document.body.innerHTML =
        `<div>1</div>` +
        `<bx-skip>2</bx-skip>` +
        `<span class="bx-skip">
          <div>3</div>
        </span>`;
      const blinx = new Blinx({ parseAutomatically: false });
      const textContents: string[] = [];
      spyOn(blinx, 'parseReferencesInTextNode' as any).and.callFake((node: Node) => {
        textContents.push(node.textContent || '');
      });
      blinx.execute();
      expect(textContents).toEqual(['1']);
    });

    it('lets bx selectors trump the blacklist or a non-matching white-list', () => {
      document.body.innerHTML = `
        <bx-skip>
          0
          <span bx-passage>1</span>
          <span data-bx-passage>2</span>
          <span bx-context>3</span>
          <span data-bx-context>4</span>
          <bx>5</bx>
        </bx-skip>`;
      const blinx = new Blinx({ parseAutomatically: false, whitelist: [] });
      const textContents: string[] = [];
      spyOn(blinx, 'parseReferencesInTextNode' as any).and.callFake((node: Node) => {
        textContents.push(node.textContent || '');
      });
      blinx.execute();
      expect(textContents).toEqual(['1', '2', '3', '4', '5']);
    });

    it('lets bx selectors trump the blacklist or a non-matching white-list', () => {
      document.body.innerHTML = `
        <div bx-skip>
          0
          <span bx-passage>1</span>
          <span data-bx-passage>2</span>
          <span bx-context>3</span>
          <span data-bx-context>4</span>
          <bx>5<bx-skip>6<bx>7</bx></bx-skip></bx>
          <bx><a>8</a></bx>
        </span>`;
      const blinx = new Blinx({ parseAutomatically: false, whitelist: [], blacklist: ['a'] });
      const textContents: string[] = [];
      spyOn(blinx, 'parseReferencesInTextNode' as any).and.callFake((node: Node) => {
        textContents.push(node.textContent || '');
      });
      blinx.execute();
      expect(textContents).toEqual(['1', '2', '3', '4', '5', '7']);
    });

    it('iterates through elements in DOM-order', () => {
      document.body.innerHTML = '<div>a<i>b<u>c<br>d<b>e</b>f</u>g</i></div>...<div>h</div>';
      const blinx = new Blinx({ parseAutomatically: false, whitelist: ['div'] });
      const textContents: string[] = [];
      spyOn(blinx, 'parseReferencesInTextNode' as any).and.callFake((node: Node) => {
        textContents.push(node.textContent || '');
      });
      blinx.execute();
      expect(textContents).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
    });

  });

  describe('parsing', () => {

    describe('within a single textNode', () => {

      describe('without further attributes', () => {

        it('recognises absolute references', () =>
          testRecognition(
            'Check out Gen 1:2-3:4 and II Cor 4:5ff',
            ['Gen 1:2-3:4', 'II Cor 4:5ff'],
            ['Gen.1.2-Gen.3.4', '2Cor.4.5-2Cor.4.18']
          )
        );

        it('recognises partial references', () =>
          testRecognition(
            'Gen 1:1.2 and 3 and then verse 4 and also 2:3-5.',
            ['Gen 1:1.2 and 3', 'verse 4', '2:3-5'],
            ['Gen.1.1-Gen.1.3', 'Gen.1.4', 'Gen.2.3-Gen.2.5']
          )
        );

        it('skips pure numbers', () =>
          testRecognition(
            'Gen 1 and 3 are 2 of those.',
            ['Gen 1', '3'],
            ['Gen.1', 'Gen.3']
          )
        );

        it('continues recognising partial references after a pure number', () =>
          testRecognition(
            '1) Gen 1:1 ... 2) verse 2',
            ['Gen 1:1', 'verse 2'],
            ['Gen.1.1', 'Gen.1.2']
          )
        );

        it('continues recognising partial references after an uncrecognised reference', () =>
          // This one would often lead to wrong results, if the unrecognised reference
          // introduced a new book or chapter. In any case, a manual correction is needed.
          testRecognition(
            'Gen 1:1, verz 2 and verse 5',
            ['Gen 1:1', 'verse 5'],
            ['Gen.1.1', 'Gen.1.5']
          )
        );

        it('disregards partial references if they would be invalid after another reference', () =>
          testRecognition(
            `Romans 5:1–5; chapters 1–39 of Isaiah`,
            ['Romans 5:1–5'],
            ['Rom.5.1-Rom.5.5']
          )
        );

      });

      describe('workarounds for parser', () => {

        describe('spaces around chapter-verse separator', () => {

          it('are interpreted correctly for comma and new verse expression', () =>
            testRecognition(
              'In Mt 1 &nbsp;, 3 und Verse 4, 5',
              ['Mt 1', '3', 'Verse 4, 5'],
              ['Matt.1', 'Matt.3', 'Matt.3.4-Matt.3.5'],
              { language: 'de' }
            )
          );

        });

      });

      describe('with bx-passage', () => {

        it('works for single reference', () =>
          testRecognition(
            `The <span bx-passage="Gen 1:1">next verse</span> shows...`,
            ['next verse'],
            ['Gen.1.1']
          )
        );

        it('provides context for next partial reference', () =>
          testRecognition(
            `<span bx-passage="Gen 1:1">1:1</span> and verse 2...`,
            ['1:1', 'verse 2'],
            ['Gen.1.1', 'Gen.1.2']
          )
        );

      });

      describe('with bx-context', () => {

        it('recognises partial references correctly', () =>
          testRecognition(
            `<p data-bx-context="Matt 6">
              Check out verse 9 and then verse 10 (cf. Luke 11:2)
              and verse 11.
            </p>`,
            ['verse 9', 'verse 10', 'Luke 11:2', 'verse 11'],
            ['Matt.6.9', 'Matt.6.10', 'Luke.11.2', 'Matt.6.11']
          )
        );

      });

      describe('with bx-skip', () => {

        it('skips all variations of bx-skip and the default a', () =>
          testRecognition(
            `Gen 1
            <a>Gen 2</a>
            <bx-skip>Gen 3</bx-skip>
            <span class="bx-skip">Gen 4</span>
            <span>Gen 5</span>
            `,
            ['Gen 1', 'Gen 5'],
            ['Gen.1', 'Gen.5']
          )
        );

      });

    });

    describe('across nodes', () => {

      describe('without further attributes', () => {

        it('works for node siblings with prefixed partial reference', () =>
          testRecognition(
            'Gen 1:2 <i>and</i> verse 3.',
            ['Gen 1:2', 'verse 3'],
            ['Gen.1.2', 'Gen.1.3']
          )
        );

        it('works for higher level nodes with chapter-verse partial reference', () =>
          testRecognition(
            '<b><i>Gen 1:2</i></b> and 3:4.',
            ['Gen 1:2', '3:4'],
            ['Gen.1.2', 'Gen.3.4']
          )
        );

        it('skips pure numbers', () =>
          // This one would be nice to have, as 'Gen 1:2; 3' is recognised, but difficult to implement
          testRecognition(
            '<i>Gen 1:2</i>; 3.',
            ['Gen 1:2'],
            ['Gen.1.2']
          )
        );

      });

      describe('with bx-context', () => {

        it('works for bx-context and data-bx-context & allows nesting', () =>
          testRecognition(
            `<p data-bx-context="Matt 6">
              Check out verse 9 and then verse 10 (cf. Luke 11:2 and <span bx-context="Lk 11">verse 3</span>)
              and verse 11.
            </p>`,
            ['verse 9', 'verse 10', 'Luke 11:2', 'verse 3', 'verse 11'],
            ['Matt.6.9', 'Matt.6.10', 'Luke.11.2', 'Luke.11.3', 'Matt.6.11']
          )
        );

      });

    });

    describe('for example articles', () => {

      if (isIE9()) {
        console.warn('Skipping example article tests on IE9, as html cannot be parsed easily.');
        return;
      }

      it('works for example-article-1', () =>
        testRecognition(
          getBodyHtml(require('./fixtures/example-article-1.html')),
          [
            'Offb\n    5,9-10', 'Offenbarung 5,9-10', 'Röm 5,19', 'Hebr 1,3', '9,14', '10,10', '14',
            'Röm 3,25', 'Röm 5,10', 'Mt 20,28', 'Röm 3,24-25', '1Kor 1,30', 'Gal 3,13', 'Kol 1,13-14',
            'Hebr 9,12', '1Petr 1,18-19', 'Offenbarung 5,9-10', 'Offb 5,10', 'Lk 19,10', 'Röm 5,10', '2Kor 5,21',
            'Gal 1,4', 'Eph 1,7', 'Mt 1,21', 'Lk 1,68', 'Gal 2,20', 'Joh 10,11', '14-15',
            'Mt 20,28', 'Mt 26,28', 'Apg 20,28', 'Eph 5,25-27', 'Röm 8,32-35', 'Joh 17,9',
            'Offenbarung 5,9-10', 'Johannes 3,16-17', 'Vers 16', 'Vers 17', 'John 1,10', 'Joh 4,42',
            '11,51-52', '12,32', 'Offb 5,9', 'Joh 3,16-17', '1. Johannes 2,1-2',
            'Johannes\n    3,16-17', 'Johannes 17,20', '1. Timotheus 2,4-6', 'Vers 1'
          ],
          [
            'Rev.5.9-Rev.5.10', 'Rev.5.9-Rev.5.10', 'Rom.5.19', 'Heb.1.3', 'Heb.9.14', 'Heb.10.10', 'Heb.10.14',
            'Rom.3.25', 'Rom.5.10', 'Matt.20.28', 'Rom.3.24-Rom.3.25', '1Cor.1.30', 'Gal.3.13', 'Col.1.13-Col.1.14',
            'Heb.9.12', '1Pet.1.18-1Pet.1.19', 'Rev.5.9-Rev.5.10', 'Rev.5.10', 'Luke.19.10', 'Rom.5.10', '2Cor.5.21',
            'Gal.1.4', 'Eph.1.7', 'Matt.1.21', 'Luke.1.68', 'Gal.2.20', 'John.10.11', 'John.10.14-John.10.15',
            'Matt.20.28', 'Matt.26.28', 'Acts.20.28', 'Eph.5.25-Eph.5.27', 'Rom.8.32-Rom.8.35', 'John.17.9',
            'Rev.5.9-Rev.5.10', 'John.3.16-John.3.17', 'John.3.16', 'John.3.17', 'John.1.10', 'John.4.42',
            'John.11.51-John.11.52', 'John.12.32', 'Rev.5.9', 'John.3.16-John.3.17', '1John.2.1-1John.2.2',
            'John.3.16-John.3.17', 'John.17.20', '1Tim.2.4-1Tim.2.6', '1Tim.2.1'
          ],
          { language: 'de' }
        )
      );

      it('works for article-with-potential-false-positives', () =>
        testRecognition(
          getBodyHtml(require('./fixtures/article-with-potential-false-positives.html')),
          [
            'Genesis 1', 'Genesis 1', 'Genesis 1', 'Genesis 1 und 2', 'Genesis 1', 'Genesis 2',
            'Genesis 1', 'Genesis 1', '1. Korinther 15,21-22'
          ],
          [
            'Gen.1', 'Gen.1', 'Gen.1', 'Gen.1-Gen.2', 'Gen.1', 'Gen.2',
            'Gen.1', 'Gen.1', '1Cor.15.21-1Cor.15.22'
          ],
          { language: 'de' }
        )
      );

      it('works for article-with-many-partial-references', () =>
        testRecognition(
          getBodyHtml(require('./fixtures/article-with-many-partial-references.html')),
          [
            'Römer 7', 'Römer 7', 'Verse\n    7', '12', 'Vers 4', 'Vers 6', 'Römer 7', 'Verse 1-4',
            'Verse 7-13', 'Vers 14', 'Vers 14', 'Verse 5-6', 'Römer 7', 'Vers 6', 'Römer 2', 'Römer 7',
            'Versen 14-25', 'Vers 22', 'Versen\n    7', '11,', '14,', '16', 'Vers 7',
            'Vers 14', 'Versen 14-25', 'Vers 14', 'Römer 7', 'Vers 14a', 'Vers 14b', 'Kapitel 6',
            '6,1-10', '6,11', '7,23', '8,23', '7,5', '7,14', 'Verse 17',
            '20', 'Vers 23', 'Verse 16', '18, 19,', '21', 'Verse 15',
            '18, 19', 'Verse 18', '23', 'Versen 14', '18,', '21,', '23',
            '6,12', '6,19', '7,7', '7,14-25', '8,1-4', 'Römer 7', '7,18',
            '7,4', 'Phil 3,9', 'Römer 7', 'Römer 7', '6,1-11', 'Phil 3,21', 'Röm 4,18-25',
            '6,12', '19', '7,14-25', '8,10-11', '23-25', 'Römer 7',
            'Römer 7', '2,1-16', '7,7-13', '7,14-25', '12,16', 'Römer\n    7', 'Römer 8'
          ],
          [
            'Rom.7', 'Rom.7', 'Rom.7.7', 'Rom.7.12', 'Rom.7.4', 'Rom.7.6', 'Rom.7', 'Rom.7.1-Rom.7.4',
            'Rom.7.7-Rom.7.13', 'Rom.7.14', 'Rom.7.14', 'Rom.7.5-Rom.7.6', 'Rom.7', 'Rom.7.6', 'Rom.2', 'Rom.7',
            'Rom.7.14-Rom.7.25', 'Rom.7.22', 'Rom.7.7', 'Rom.7.11', 'Rom.7.14', 'Rom.7.16', 'Rom.7.7',
            'Rom.7.14', 'Rom.7.14-Rom.7.25', 'Rom.7.14', 'Rom.7', 'Rom.7.14', 'Rom.7.14', 'Rom.6',
            'Rom.6.1-Rom.6.10', 'Rom.6.11', 'Rom.7.23', 'Rom.8.23', 'Rom.7.5', 'Rom.7.14', 'Rom.7.17',
            'Rom.7.20', 'Rom.7.23', 'Rom.7.16', 'Rom.7.18-Rom.7.19', 'Rom.7.21', 'Rom.7.15',
            'Rom.7.18-Rom.7.19', 'Rom.7.18', 'Rom.7.23', 'Rom.7.14', 'Rom.7.18', 'Rom.7.21', 'Rom.7.23',
            'Rom.6.12', 'Rom.6.19', 'Rom.7.7', 'Rom.7.14-Rom.7.25', 'Rom.8.1-Rom.8.4', 'Rom.7', 'Rom.7.18',
            'Rom.7.4', 'Phil.3.9', 'Rom.7', 'Rom.7', 'Rom.6.1-Rom.6.11', 'Phil.3.21', 'Rom.4.18-Rom.4.25',
            'Rom.6.12', 'Rom.6.19', 'Rom.7.14-Rom.7.25', 'Rom.8.10-Rom.8.11', 'Rom.8.23-Rom.8.25', 'Rom.7',
            'Rom.7', 'Rom.2.1-Rom.2.16', 'Rom.7.7-Rom.7.13', 'Rom.7.14-Rom.7.25', 'Rom.12.16', 'Rom.7', 'Rom.8'
          ],
          { language: 'de' }
        )
      );

    });

  });

  describe('tooltip', () => {

    it('is shown with text from getBible API', () =>
      testRecognition(
        'Gen 1:3',
        ['Gen 1:3'],
        ['Gen.1.3']
      ).then((links) => {
        // if (!(window as any).tippy.browser.supported) {
        //   console.warn('Browser does not support tippy. Skipping second part of test');
        //   return done();
        // }
        u(links.first() as Node).trigger('mouseenter');
        // Wait until passage is displayed & checked displayed passage
        return blinx.testability.passageDisplayed.then(() => {
          const text = u('.bxPassageText').text().trim().replace(/\s+/g, ' ');
          expect(text).toBe('1 3 God said, "Let there be light," and there was light. World English Bible');
        });
      })
    );

  });

});

function getBodyHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.getElementsByTagName('body')[0].innerHTML;
}

function testRecognition(
  html: string, expectedLinkLabels: string[], expectedOsisPassages: string[],
  // Specify default options, as parser is not always destroyed between tests and can lead to wrong language
  options: Partial<Options> = new Options()
): Promise<Umbrella.Instance> {
  document.body.innerHTML = html;
  blinx = loadBlinx(options);
  // Wait until links & tooltips are applied & check linked passages
  return blinx.testability.linksApplied.then(() => {
    const links: Umbrella.Instance = u('[data-osis]');
    const passages: string[] = [];
    links.each(node => passages.push(u(node).data('osis')));
    expect(links.array()).toEqual(expectedLinkLabels);
    expect(passages).toEqual(expectedOsisPassages);
    return links;
  });
}

function isIE9(): boolean {
  return /\bMSIE 9/.test(navigator.userAgent);
}
