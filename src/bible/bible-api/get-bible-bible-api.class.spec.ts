// tslint:disable: no-string-literal
import {
  GetBibleBibleApi,
  convertVersesToHtml
} from 'src/bible/bible-api/get-bible-bible-api.class';

describe('GetBibleBibleApi', () => {
  const api = new GetBibleBibleApi();

  describe('getRawPassage() using the actual API', () => {
    it('works for a single chapter', async () => {
      const verses = await api['getRawPassage']('1John.1', 'en.web');

      expect(verses).toHaveLength(10);
      expect(verses[0]).toStrictEqual({
        chapter: 1,
        verse: 1,
        name: '1 John 1:1',
        text:
          'That which was from the beginning, that which we have heard, that which we have seen with our eyes, that which we saw, and our hands touched, concerning the Word of life'
      });
    });

    it('works for a chapter-range', async () => {
      const verses = await api['getRawPassage']('1John.1-1John.2', 'en.web');

      expect(verses).toHaveLength(10 + 29);
      expect(verses[0]).toMatchObject({ chapter: 1, verse: 1 });
      expect(verses[verses.length - 1]).toMatchObject({ chapter: 2, verse: 29 });
    });

    it('works for a single verse', async () => {
      const verses = await api['getRawPassage']('1John.1.1', 'en.web');

      expect(verses).toStrictEqual([
        {
          chapter: 1,
          verse: 1,
          name: '1 John 1:1',
          text:
            'That which was from the beginning, that which we have heard, that which we have seen with our eyes, that which we saw, and our hands touched, concerning the Word of life'
        }
      ]);
    }, 1e9);

    it('works for a verse range within a chapter', async () => {
      const verses = await api['getRawPassage']('1John.1.1-1John.1.2', 'en.web');

      expect(verses[0]).toMatchObject({ chapter: 1, verse: 1 });
      expect(verses[verses.length - 1]).toMatchObject({ chapter: 1, verse: 2 });
    });

    it('works for a verse range across chapters', async () => {
      const verses = await api['getRawPassage']('1John.1.10-1John.2.1', 'en.web');

      expect(verses[0]).toMatchObject({ chapter: 1, verse: 10 });
      expect(verses[verses.length - 1]).toMatchObject({ chapter: 2, verse: 1 });
    });

    it('works for a verse range across books', async () => {
      const verses = await api['getRawPassage']('1John.5.21-2John.1.1', 'en.web');

      expect(verses).toHaveLength(2);
      expect(verses[0]).toMatchObject({ chapter: 5, verse: 21, name: '1 John 5:21' });
      expect(verses[verses.length - 1]).toMatchObject({ chapter: 1, verse: 1, name: '2 John 1:1' });
    });
  });
});

describe('convertVersesToHtml()', () => {
  it('works for a single verse & trims content', () => {
    const html = convertVersesToHtml([{ chapter: 1, verse: 1, text: '   CONTENT_1:1\n' }]);

    expect(html).toBe(
      `<span class="bxChapter"><span class="bxChapterNumber">1</span><span class="bxVerse"><span class="bxVerseNumber">1</span>&nbsp;CONTENT_1:1</span></span>`
    );
  });

  it('works for a verse range within a chapter', () => {
    const html = convertVersesToHtml([
      { chapter: 1, verse: 1, text: 'CONTENT_1:1' },
      { chapter: 1, verse: 2, text: 'CONTENT_1:2' }
    ]);

    expect(html).toBe(
      `<span class="bxChapter"><span class="bxChapterNumber">1</span><span class="bxVerse"><span class="bxVerseNumber">1</span>&nbsp;CONTENT_1:1</span><span class="bxVerse"><span class="bxVerseNumber">2</span>&nbsp;CONTENT_1:2</span></span>`
    );
  });

  it('works for a verse range across chapters', () => {
    const html = convertVersesToHtml([
      { chapter: 1, verse: 10, text: 'CONTENT_1:10' },
      { chapter: 2, verse: 1, text: 'CONTENT_2:1' }
    ]);

    expect(html).toBe(
      `<span class="bxChapter"><span class="bxChapterNumber">1</span><span class="bxVerse"><span class="bxVerseNumber">10</span>&nbsp;CONTENT_1:10</span></span><span class="bxChapter"><span class="bxChapterNumber">2</span><span class="bxVerse"><span class="bxVerseNumber">1</span>&nbsp;CONTENT_2:1</span></span>`
    );
  });
});
