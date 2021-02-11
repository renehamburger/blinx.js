import { makePureBookReferencesParseable } from './blinx.functions';

describe('blinx.functions', () => {
  describe('makePureBookReferencesParseable()', () => {
    it('does not change reference with chapter', () => {
      const reference = makePureBookReferencesParseable('Matt 1');
      expect(reference).toBe('Matt 1');
    });

    it('does not change complicated reference with chapter', () => {
      const reference = makePureBookReferencesParseable('1 Jn. 1');
      expect(reference).toBe('1 Jn. 1');
    });

    it('does not change reference with chapter ending on a letter ', () => {
      const reference = makePureBookReferencesParseable('Matt 1f');
      expect(reference).toBe('Matt 1f');
    });

    it('adds chapter 1 for pure book reference', () => {
      const reference = makePureBookReferencesParseable('Matt');
      expect(reference).toBe('Matt 1');
    });

    it('adds chapter 1 for pure book reference starting with a number', () => {
      const reference = makePureBookReferencesParseable('1 John');
      expect(reference).toBe('1 John 1');
    });

    it('adds verse 1 for pure single-chapter book reference', () => {
      const reference = makePureBookReferencesParseable('Ob');
      expect(reference).toBe('Ob 1');
    });
  });
});
