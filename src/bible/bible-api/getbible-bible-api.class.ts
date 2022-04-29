import { BibleApi } from 'src/bible/bible-api/bible-api.class';
import { request } from 'src/helpers/request';
import { parseOsis } from '../../helpers/osis';

const getbibleBibleVersionMap = {
  'af.aov': 'aov',
  'ar.arabicsv': 'arabicsv',
  'br.breton': 'breton',
  'ch.chamorro': 'chamorro',
  'cop.coptic': 'coptic',
  'cop.sahidic': 'sahidic',
  'cs.bkr': 'bkr',
  'cs.cep': 'cep',
  'da.danish': 'danish',
  'de.elb1871': 'elberfelder', // Keep abbreviation on update
  'de.elb1905': 'elberfelder1905', // Keep abbreviation on update
  'de.lut1545': 'luther1545', // Keep abbreviation on update
  'de.slt1951': 'schlachter', // Keep abbreviation on update
  'el.moderngreek': 'moderngreek',
  'en.akjv': 'akjv',
  'en.asv': 'asv',
  'en.basicenglish': 'basicenglish',
  'en.douayrheims': 'douayrheims',
  'en.kjv': 'kjv',
  'en.kjva': 'kjva',
  'en.tyndale': 'tyndale',
  'en.wb': 'wb',
  'en.web': 'web',
  'en.weymouth': 'weymouth',
  'en.ylt': 'ylt',
  'enm.wycliffe': 'wycliffe',
  'eo.esperanto': 'esperanto',
  'es.rv1858': 'rv1858',
  'es.sse': 'sse',
  'es.valera': 'valera',
  'et.estonian': 'estonian',
  'eu.basque': 'basque',
  'fi.finnish1776': 'finnish1776',
  'fi.pyharaamattu1933': 'pyharaamattu1933',
  'fi.pyharaamattu1992': 'pyharaamattu1992',
  'fr.darby': 'darby',
  'fr.ls1910': 'ls1910',
  'fr.martin': 'martin',
  'gd.gaelic': 'gaelic',
  'got.gothic': 'gothic',
  'grc.textusreceptus': 'textusreceptus',
  'grc.tischendorf': 'tischendorf',
  'grc.westcotthort': 'westcotthort',
  'gv.manxgaelic': 'manxgaelic',
  'he.aleppo': 'aleppo',
  'he.wlc': 'codex', // Keep abbreviation on update
  'he.modernhebrew': 'modernhebrew',
  'hr.croatian': 'croatia', // Keep abbreviation on update
  'hu.karoli': 'karoli',
  'hy.easternarmenian': 'easternarmenian',
  'hy.westernarmenian': 'westernarmenian',
  'it.giovanni': 'giovanni',
  'it.riveduta': 'riveduta',
  'ko.korean': 'korean',
  'la.vulgate': 'vulgate',
  'lt.lithuanian': 'lithuanian',
  'lv.latvian': 'latvian',
  'mal.mal1910': 'mal1910',
  'mi.maori': 'maori',
  'my.judson': 'judson',
  'nl.statenvertaling': 'statenvertaling',
  'no.bibelselskap': 'bibelselskap', // Unsure if language code is nb or no
  'pot.potawatomi': 'potawatomi',
  'ppk.uma': 'uma',
  'pt.almeida': 'almeida',
  'ro.cornilescu': 'cornilescu',
  'ru.synodal': 'synodal',
  'ru.zhuromsky': 'zhuromsky',
  'sv.swedish': 'swedish',
  'sw.swahili': 'swahili',
  'syr.peshitta': 'peshitta',
  'th.thai': 'thai',
  'tl.tagalog': 'tagalog',
  'tr.turkish': 'turkish',
  'uk.ukranian': 'ukranian',
  'vi.vietnamese': 'vietnamese',
  'zh-hans.cns': 'cns',
  'zh-hans.cus': 'cus',
  'zh-hant.cnt': 'cnt',
  'zh-hant.cut': 'cut'
} as const;

type GetbibleBibleVersionMap = typeof getbibleBibleVersionMap;

type GetbibleSupportedBibleVersionCode = keyof GetbibleBibleVersionMap;

type GetbibleBibleVersionAbbreviation = GetbibleBibleVersionMap[GetbibleSupportedBibleVersionCode];

type GetbibleBibleTranslations = {
  [BibleVersionAbbreviation in GetbibleBibleVersionAbbreviation]?: {
    checksum: string;
    books?: GetbibleBooks;
  };
};

interface GetbibleBooks {
  [bookNumber: number /** 1-66 */]: {
    checksum: string;
    chapters?: GetbibleChapters;
  };
}

type GetbibleChapters = {
  [chapterNumber: number /** 1-<maxChapterOfBook> */]: {
    checksum: string;
    verses?: GetbibleVerse[];
  };
};

export interface GetbibleVerse {
  chapter: number;
  verse: number;
  text: string;
  // ...
}

export class GetbibleBibleApi extends BibleApi {
  public readonly title = 'getBible.net';
  public readonly url = 'https://getbible.net/v2';

  protected readonly bibleVersionMap = getbibleBibleVersionMap;

  private translations = this.loadBibleVersionChecksums();

  public async getPassage(
    osis: string,
    bibleVersionCode: keyof typeof getbibleBibleVersionMap
  ): Promise<string> {
    return convertVersesToHtml(await this.getRawPassage(osis, bibleVersionCode));
  }

  private async getRawPassage(
    osis: string,
    bibleVersionCode: keyof typeof getbibleBibleVersionMap
  ): Promise<GetbibleVerse[]> {
    // Parse input
    const bibleVersionAbbreviation = this.bibleVersionMap[bibleVersionCode];
    const { start, end } = parseOsis(osis);

    // Load checksum for selected version
    const bibleVersion = (await this.translations)[bibleVersionAbbreviation];

    // Ensure bibleVersionCode is supported
    if (!bibleVersionAbbreviation || !bibleVersion) {
      throw new Error(`${this.title}: Bible version ${bibleVersionCode} not supported!`);
    }

    // Load book checksums
    if (!bibleVersion.books) {
      bibleVersion.books = await this.loadBookChecksums(
        bibleVersionAbbreviation,
        bibleVersion.checksum
      );
    }

    // Retrieve verses for each book (& chapter) within the range
    const verses: GetbibleVerse[] = [];
    for (let bookNumber = start.bookNumber; bookNumber <= end.bookNumber; bookNumber++) {
      // Ensure book is supported
      const book = bibleVersion.books[bookNumber];
      if (!book) {
        throw new Error(
          `${this.title}: Bible book # ${bookNumber} not supported for Bible version ${bibleVersionCode}!`
        );
      }

      // Load chapter checksums
      if (!book.chapters) {
        book.chapters = await this.loadChapterChecksums(
          bibleVersionAbbreviation,
          bookNumber,
          book.checksum
        );
      }

      // Ensure initial and final chapter are supported
      if (bookNumber === start.bookNumber && !book.chapters![start.chapter]) {
        throw new Error(
          `${this.title}: Chapter ${start.chapter} not supported for Bible book # ${bookNumber} and Bible version ${bibleVersionCode}!`
        );
      } else if (bookNumber === end.bookNumber && !book.chapters![end.chapter]) {
        throw new Error(
          `${this.title}: Chapter ${end.chapter} not supported for Bible book # ${bookNumber} and Bible version ${bibleVersionCode}!`
        );
      }

      // Retrieve verses for each chapter within the range
      let chapterNumber = bookNumber === start.bookNumber ? start.chapter : 1;
      while (
        (bookNumber !== end.bookNumber || chapterNumber <= end.chapter) &&
        book.chapters[chapterNumber]
      ) {
        const chapter = book.chapters![chapterNumber];

        // Load chapter content
        if (!chapter.verses) {
          chapter.verses = await this.loadVerses(
            bibleVersionAbbreviation,
            bookNumber,
            chapterNumber,
            chapter.checksum
          );
        }

        // Add verses for range
        let relevantVerses = chapter.verses;
        if (bookNumber === start.bookNumber && chapterNumber === start.chapter && start.verse) {
          relevantVerses = relevantVerses.slice(start.verse - 1);
        }
        if (bookNumber === end.bookNumber && chapterNumber === end.chapter && end.verse) {
          relevantVerses = relevantVerses.slice(0, end.verse);
        }
        verses.push(...relevantVerses);
        chapterNumber++;
      }
    }

    return verses;
  }

  private async loadBibleVersionChecksums(): Promise<GetbibleBibleTranslations> {
    return request<Record<GetbibleBibleVersionAbbreviation, string>>(
      `${this.url}/checksum.json?_=${Date.now()}`
    ).then((response) => {
      const abbreviations = Object.keys(response) as GetbibleBibleVersionAbbreviation[];
      return abbreviations.reduce((obj, abbreviation) => {
        const checksum = response[abbreviation];
        obj[abbreviation] = { checksum };
        return obj;
      }, {} as GetbibleBibleTranslations);
    });
  }

  private async loadBookChecksums(
    bibleVersionAbbreviation: string,
    translationChecksum: string
  ): Promise<GetbibleBooks> {
    return request<Record<string, string>>(
      `${this.url}/${bibleVersionAbbreviation}/checksum.json?${translationChecksum}`
    ).then((response) =>
      Object.keys(response).reduce((obj, bookNumberAsString) => {
        const bookNumber = parseFloat(bookNumberAsString);
        const checksum = response[bookNumberAsString];
        obj[bookNumber] = { checksum };
        return obj;
      }, {} as GetbibleBooks)
    );
  }

  private async loadChapterChecksums(
    bibleVersionAbbreviation: string,
    bookNumber: number,
    bookChecksum: string
  ): Promise<GetbibleBooks> {
    return request<Record<string, string>>(
      `${this.url}/${bibleVersionAbbreviation}/${bookNumber}/checksum.json?${bookChecksum}`
    ).then((response) =>
      Object.keys(response).reduce((obj, chapterNumberAsString) => {
        const chapterNumber = parseFloat(chapterNumberAsString);
        const checksum = response[chapterNumberAsString];
        obj[chapterNumber] = { checksum };
        return obj;
      }, {} as GetbibleBooks)
    );
  }

  private async loadVerses(
    bibleVersionAbbreviation: string,
    bookNumber: number,
    chapterNumber: number,
    chapterChecksum: string
  ): Promise<GetbibleVerse[]> {
    return request<{ verses: GetbibleVerse[] }>(
      `${this.url}/${bibleVersionAbbreviation}/${bookNumber}/${chapterNumber}.json?${chapterChecksum}`
    ).then((response) => response.verses);
  }
}

export function convertVersesToHtml(verses: GetbibleVerse[]): string {
  return verses.reduce((html, verse, index) => {
    if (index === 0 || verses[index - 1].chapter !== verse.chapter) {
      html += `<span class="bxChapter"><span class="bxChapterNumber">${verse.chapter}</span>`;
    }
    html += `<span class="bxVerse"><span class="bxVerseNumber">${
      verse.verse
    }</span>&nbsp;${verse.text.trim()}</span>`;
    if (index === verses.length - 1 || verse.chapter !== verses[index + 1].chapter) {
      html += `</span>`;
    }
    return html;
  }, '');
}
