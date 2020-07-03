import { GetBibleBibleApi } from 'src/bible/bible-api/get-bible-bible-api.class';

describe('GetBibleBibleApi - ', () => {
  const api = new GetBibleBibleApi();

  describe('getPassageFromOsis()', () => {
    it('works for single-chapter passages', () => {
      expect(api['getPassageFromOsis']('Gen.1')).toBe('Gen1');
      expect(api['getPassageFromOsis']('Gen.1.2')).toBe('Gen1:2');
      expect(api['getPassageFromOsis']('Gen.1.2-Gen.1.3')).toBe('Gen1:2-3');
    });

    it('works for multip-chapter passages', () => {
      expect(api['getPassageFromOsis']('Gen.1.2-Gen.3.4')).toBe('Gen1:2-999;Gen2:1-999;Gen3:1-4');
      // 'Gen1;Gen2;Gen3' is not supported by API
      expect(api['getPassageFromOsis']('Gen.1-Gen.3')).toBe('Gen1:1-999;Gen2:1-999;Gen3:1-999');
    });
  });
});
