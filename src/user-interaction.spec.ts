import { u } from 'src/lib/u.js';
import { testRecognition } from './test-helpers/test-helpers';

describe('User interaction', () => {
  describe('passage hover', () => {
    it('shows tooltip with text', async () => {
      const passageContent = 'Passage content';
      const bibleVersion = 'World English Bible';

      const [links, blinx] = await testRecognition('Gen 1:3', ['Gen 1:3'], ['Gen.1.3']);

      // tslint:disable-next-line: no-string-literal
      jest.spyOn(blinx['bibleApi'], 'getPassage').mockResolvedValue(passageContent);

      u(links.first() as Node).trigger('mouseenter');
      await blinx.testability.passageDisplayed;

      const text = u('.bxPassageText').text();
      expect(text).toBe(`${passageContent} ${bibleVersion}`);
    });
  });
});
