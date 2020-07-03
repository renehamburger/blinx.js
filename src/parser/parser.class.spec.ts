import {
  TextTransformationInfo,
  adjustRefsToTransformations,
  disambiguateSeparators,
  transformUnsupportedCharacters
} from 'src/parser/parser.class';

describe('Parser', () => {
  describe('transformTextForParsing()', () => {
    it('disambiguates separators', () => {
      const theOriginalText = '1,2|1 ,2|1, 2|21  ,  23|1 \xa0, 2';
      //                       012345678901234567890123456   789
      const transformedText = '1,2|1;2|1;2|21;23|1;2';
      const transformationInfo = disambiguateSeparators(theOriginalText, ',', '[\\s\\xa0]');
      expect(transformationInfo.transformedText).toBe(transformedText);
      expect(transformationInfo.transformations).toEqual([
        { oldStart: 5, newStart: 5, oldString: ' ,', newString: ';' },
        { oldStart: 10, newStart: 9, oldString: ', ', newString: ';' },
        { oldStart: 16, newStart: 14, oldString: '  ,  ', newString: ';' },
        { oldStart: 25, newStart: 19, oldString: ' \xa0, ', newString: ';' }
      ]);
    });

    it('removes unsupported characters', () => {
      const theOriginalText = '1\xad2\xad3';
      //                       01   23   4
      //                       012
      const transformedText = '123';
      const transformationInfo = transformUnsupportedCharacters(theOriginalText);
      expect(transformationInfo.transformedText).toBe(transformedText);
      expect(transformationInfo.transformations).toEqual([
        { oldStart: 1, newStart: 1, oldString: '\xad', newString: '' },
        { oldStart: 3, newStart: 2, oldString: '\xad', newString: '' }
      ]);
    });
  });

  describe('convertRefsBasedOnTransformedTextToOriginalText()', () => {
    it('works', () => {
      const transformationInfo: TextTransformationInfo = {
        //     oldText:  'abbbcbbbd'
        //     positions: 012345678
        transformedText: 'aBcBBBBd',
        transformations: [
          { oldStart: 1, newStart: 1, oldString: 'bbb', newString: 'B' },
          { oldStart: 5, newStart: 3, oldString: 'bbb', newString: 'BBBB' }
        ]
      };
      const refs: BCV.OsisAndIndices[] = [
        { indices: [0, 1], osis: '', translations: [] },
        { indices: [0, 2], osis: '', translations: [] },
        { indices: [2, 3], osis: '', translations: [] },
        { indices: [4, 7], osis: '', translations: [] }
      ];
      expect(adjustRefsToTransformations(refs, [transformationInfo])).toEqual([
        { indices: [0, 1], osis: '', translations: [] },
        { indices: [0, 4], osis: '', translations: [] },
        { indices: [4, 5], osis: '', translations: [] },
        { indices: [6, 8], osis: '', translations: [] }
      ]);
    });
  });
});
