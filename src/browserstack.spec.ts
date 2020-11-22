import { u } from 'src/lib/u.js';
import { testRecognition } from './test-helpers/test-helpers';

describe('Cross-browser Blinx', () => {
  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  describe('tooltip', () => {
    it('is shown with text', async () => {
      const [links, blinx] = await testRecognition('Gen 1:3', ['Gen 1:3'], ['Gen.1.3']);
      // if (!(window as any).tippy.browser.supported) {
      //   console.warn('Browser does not support tippy. Skipping second part of test');
      //   return done();
      // }
      u(links.first() as Node).trigger('mouseenter');
      // Wait until passage is displayed & checked displayed passage
      await blinx.testability.passageDisplayed;
      const text = u('.bxPassageText').text().trim().replace(/\s+/g, ' ');
      expect(text).toBe(
        '1 3 God said, "Let there be light," and there was light. World English Bible'
      );
    });
  });
});
