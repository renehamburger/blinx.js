import { u } from 'src/lib/u.js';
import { testRecognition } from './test-helpers/test-helpers';

describe('User interaction', () => {
  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  describe('passage hover', () => {
    it('shows tooltip with text', async () => {
      const passageContent = 'Passage content';
      const bibleVersion = 'World English Bible';
      const [links, blinx] = await testRecognition('Gen 1:3', ['Gen 1:3'], ['Gen.1.3']);
      spyOn(window.blinx.bibleApi, 'getPassage').and.returnValue(Promise.resolve(passageContent));
      // if (!(window as any).tippy.browser.supported) {
      //   console.warn('Browser does not support tippy. Skipping second part of test');
      //   return done();
      // }
      u(links.first() as Node).trigger('mouseenter');
      // Wait until passage is displayed & checked displayed passage
      await blinx.testability.passageDisplayed;
      const text = u('.bxPassageText').text();
      expect(text).toBe(`${passageContent} ${bibleVersion}`);
    });
  });
});
