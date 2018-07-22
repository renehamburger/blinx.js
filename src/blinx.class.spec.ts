import { Testability } from './blinx.class';
import { loadBlinx } from './main';

describe('Blinx', () => {

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  describe('automatic recognition', () => {

    beforeEach(() => {
      document.body.innerHTML = '<p>Check out Gen 1:3, II Cor 4:5, and then verse 6.</p>';
    });

    it('links single passage & shows tooltip', done => {
      loadBlinx();
      const testability: Testability = window.blinx.testability;
      const u = testability.u;
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
      const u = testability.u;
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
});
