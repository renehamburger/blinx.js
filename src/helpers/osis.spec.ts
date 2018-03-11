import { parseOsis, transformOsis } from 'src/helpers/osis';

describe('Osis helpers - ', () => {

  describe('parseOsis()', () => {

    it('works', () => {
      expect(parseOsis('Gen.1')).toEqual({
        start: { book: 'Gen', chapter: 1 }
      });
      expect(parseOsis('Gen.1.2')).toEqual({
        start: { book: 'Gen', chapter: 1, verse: 2 }
      });
      expect(parseOsis('Gen.1.2-Gen.1.3')).toEqual({
        start: { book: 'Gen', chapter: 1, verse: 2 },
        end: { book: 'Gen', chapter: 1, verse: 3 }
      });
      expect(parseOsis('Gen.2-Gen.3')).toEqual({
        start: { book: 'Gen', chapter: 2 },
        end: { book: 'Gen', chapter: 3 }
      });
      expect(parseOsis('Gen.2.1-Gen.3.4')).toEqual({
        start: { book: 'Gen', chapter: 2, verse: 1 },
        end: { book: 'Gen', chapter: 3, verse: 4 }
      });
      expect(parseOsis('Gen.50.2-Exod.1.3')).toEqual({
        start: { book: 'Gen', chapter: 50, verse: 2 },
        end: { book: 'Exod', chapter: 1, verse: 3 }
      });
    });

  });

  describe('transformOsis()', () => {

    it('removes superfluous elements and replaces separators', () => {
      expect(transformOsis('Gen.1')).toEqual('Gen1');
      expect(transformOsis('Gen.1.2')).toEqual('Gen1:2');
      expect(transformOsis('Gen.1.2-Gen.1.3')).toEqual('Gen1:2-3');
      expect(transformOsis('Gen.2-Gen.3')).toEqual('Gen2-3');
      expect(transformOsis('Gen.2.1-Gen.3.4')).toEqual('Gen2:1-3:4');
      expect(transformOsis('Gen.50.2-Exod.1.3')).toEqual('Gen50:2-Exod1:3');
    });

  });

});
