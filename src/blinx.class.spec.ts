import { Testability } from './blinx.class';
declare var require: any;

describe('Blinx', () => {

  beforeEach(() => {
    document.body.innerHTML = '<p>Check out Gen 1:3 and II Cor 4:5-6.</p>';
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  it('links single passage & shows tooltip', done => {
    require('./main');
    const testability: Testability = window.blinx.testability;
    const u = testability.u;
    // Wait until links & tooltips are applied & check linked passages
    testability.linksApplied = () => {
      const links: Umbrella.Instance = u('[data-osis]');
      const passages: string[] = [];
      links.each(node => passages.push(u(node).data('osis')));
      expect(links.array()).toEqual(['Gen 1:3', 'II Cor 4:5-6']);
      expect(passages).toEqual(['Gen.1.3', '2Cor.4.5-2Cor.4.6']);
      u(links.first() as Node).trigger('mouseenter');
      // Wait until passage is displayed & checked displayed passage
      testability.passageDisplayed = () => {
        const text = u('.bxPassageText').text().trim().replace(/\s+/g, ' ');
        expect(text).toBe('3 God said, "Let there be light," and there was light. World English Bible');
        done();
      };
    };
  });

});