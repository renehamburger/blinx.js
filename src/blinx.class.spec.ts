import { Testability } from 'src/blinx.class';
import { loadBlinx } from 'src/main';
import { u } from 'src/lib/u.js';

describe('Blinx', () => {

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  describe('automatic recognition for simple example', () => {

    beforeEach(() => {
      document.body.innerHTML = '<p>Check out Gen 1:3, II Cor 4:5, and then verse 6.</p>';
    });

    it('links single passage & shows tooltip', done => {
      loadBlinx();
      const testability: Testability = window.blinx.testability;
      // Wait until links & tooltips are applied & check linked passages
      testability.linksApplied = () => {
        const links: Umbrella.Instance = u('[data-osis]');
        const passages: string[] = [];
        links.each(node => passages.push(u(node).data('osis')));
        expect(links.array()).toEqual(['Gen 1:3', 'II Cor 4:5', 'verse 6']);
        expect(passages).toEqual(['Gen.1.3', '2Cor.4.5', '2Cor.4.6']);
        // if (!(window as any).tippy.browser.supported) {
        //   console.warn('Browser does not support tippy. Skipping second part of test');
        //   return done();
        // }
        u(links.first() as Node).trigger('mouseenter');
        // Wait until passage is displayed & checked displayed passage
        testability.passageDisplayed = () => {
          const text = u('.bxPassageText').text().trim().replace(/\s+/g, ' ');
          expect(text).toBe('1 3 God said, "Let there be light," and there was light. World English Bible');
          done();
        };
      };
    });

  });

  describe('with data-bx-context attribute', () => {

    beforeEach(() => {
      document.body.innerHTML = `
<p data-bx-context="Matt 6">
  Check out verse 9 and then verse 10 (cf. Luke 11:2 and <span data-bx-context="Lk 11">verse 3</span>) and verse 11.
</p>`;
    });

    it('recognises partial references correctly', done => {
      loadBlinx();
      const testability: Testability = window.blinx.testability;
      // Wait until links & tooltips are applied & check linked passages
      testability.linksApplied = () => {
        const links: Umbrella.Instance = u('[data-osis]');
        const passages: string[] = [];
        links.each(node => passages.push(u(node).data('osis')));
        expect(links.array()).toEqual(['verse 9', 'verse 10', 'Luke 11:2', 'verse 3', 'verse 11']);
        expect(passages).toEqual(['Matt.6.9', 'Matt.6.10', 'Luke.11.2', 'Luke.11.3', 'Matt.6.11']);
        done();
      };
    });

  });

  describe('for simple example article', () => {

    beforeEach(() => {
      const html = require('./fixtures/example-article-1.html');
      document.body.innerHTML = getBodyHtml(html);
    });

    it('works', done => {
      loadBlinx({
        language: 'de'
      });
      const testability: Testability = window.blinx.testability;
      // Wait until links & tooltips are applied & check linked passages
      testability.linksApplied = () => {
        const links: Umbrella.Instance = u('[data-osis]');
        const passages: string[] = [];
        links.each(node => passages.push(u(node).data('osis')));
        expect(links.array()).toEqual([
          'Offb\n    5,9-10',
          'Offenbarung 5,9-10',
          'Röm 5,19',
          'Hebr 1,3',
          '9,14',
          '10,10',
          '14',
          'Röm 3,25',
          'Röm 5,10',
          'Mt 20,28',
          'Röm 3,24-25',
          '1Kor 1,30',
          'Gal 3,13',
          'Kol 1,13-14',
          'Hebr 9,12',
          '1Petr 1,18-19',
          'Offenbarung 5,9-10',
          'Offb 5,10',
          'Lk 19,10',
          'Röm 5,10',
          '2Kor 5,21',
          'Gal 1,4',
          'Eph 1,7',
          'Mt 1,21',
          'Lk 1,68',
          'Gal 2,20',
          'Joh 10,11',
          '14-15',
          'Mt 20,28',
          'Mt 26,28',
          'Apg 20,28',
          'Eph 5,25-27',
          'Röm 8,32-35',
          'Joh 17,9',
          'Offenbarung 5,9-10',
          'Johannes 3,16-17',
          'Vers 16',
          'Vers 17',
          'John 1,10',
          'Joh 4,42',
          '11,51-52',
          '12,32',
          'Offb 5,9',
          'Joh 3,16-17',
          '1. Johannes 2,1-2',
          'Johannes\n    3,16-17',
          'Johannes 17,20',
          '1. Timotheus 2,4-6',
          'Vers 1'
        ]);
        expect(passages).toEqual([
          'Rev.5.9-Rev.5.10',
          'Rev.5.9-Rev.5.10',
          'Rom.5.19',
          'Heb.1.3',
          'Heb.9.14',
          'Heb.10.10',
          'Heb.10.14',
          'Rom.3.25',
          'Rom.5.10',
          'Matt.20.28',
          'Rom.3.24-Rom.3.25',
          '1Cor.1.30',
          'Gal.3.13',
          'Col.1.13-Col.1.14',
          'Heb.9.12',
          '1Pet.1.18-1Pet.1.19',
          'Rev.5.9-Rev.5.10',
          'Rev.5.10',
          'Luke.19.10',
          'Rom.5.10',
          '2Cor.5.21',
          'Gal.1.4',
          'Eph.1.7',
          'Matt.1.21',
          'Luke.1.68',
          'Gal.2.20',
          'John.10.11',
          'John.10.14-John.10.15',
          'Matt.20.28',
          'Matt.26.28',
          'Acts.20.28',
          'Eph.5.25-Eph.5.27',
          'Rom.8.32-Rom.8.35',
          'John.17.9',
          'Rev.5.9-Rev.5.10',
          'John.3.16-John.3.17',
          'John.3.16',
          'John.3.17',
          'John.1.10',
          'John.4.42',
          'John.11.51-John.11.52',
          'John.12.32',
          'Rev.5.9',
          'John.3.16-John.3.17',
          '1John.2.1-1John.2.2',
          'John.3.16-John.3.17',
          'John.17.20',
          '1Tim.2.4-1Tim.2.6',
          '1Tim.2.1'
        ]);
        done();
      };
    });

  });

});

function getBodyHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.getElementsByTagName('body')[0].innerHTML;
}
