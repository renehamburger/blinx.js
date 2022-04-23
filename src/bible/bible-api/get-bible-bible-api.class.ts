import { BibleApi } from 'src/bible/bible-api/bible-api.class';
import { request } from 'src/helpers/request';
import { BibleBooks } from '../models/bible-books.const';

interface VerseResponse {
  type: 'verse';
  version: string;
  direction: 'LTR' | 'RTL';
  book: [
    {
      book_ref: string;
      book_name: string;
      book_nr: number | string;
      chapter_nr: number | string;
      chapter: {
        [key: string]: {
          verse_nr: number | string;
          verse: string;
        };
      };
    }
  ];
}

interface ChapterResponse {
  type: 'chapter';
  version: string;
  book_name: string;
  book_nr: number | string;
  chapter_nr: number | string;
  direction: 'LTR' | 'RTL';
  chapter: {
    [key: string]: {
      verse_nr: number | string;
      verse: string;
    };
  };
}

type Response = VerseResponse | ChapterResponse;

const bibleVersionMap = {
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
};

export class GetBibleBibleApi extends BibleApi {
  public readonly title = 'getBible.net';
  public readonly url = 'https://getbible.net/v2';

  protected readonly bibleVersionMap = bibleVersionMap;

  public async getPassage(
    osis: string,
    bibleVersionCode: keyof typeof bibleVersionMap
  ): Promise<string> {
    const bibleVersion = this.bibleVersionMap[bibleVersionCode];
    if (!bibleVersion) {
      throw new Error(`Bible version ${bibleVersionCode} not supported by getBible.net`);
    }
    const [book, chapter] = osis.split('.');
    const bookIndex = Object.keys(new BibleBooks()).indexOf(book) + 1;
    const result = await request<Response>(
      `${this.url}/${bibleVersion}/${bookIndex}/${chapter}.json?_=${Date.now()}`
    );
    let output = '';
    if (result.type === 'verse') {
      for (const bookObject of result.book) {
        if (bookObject.chapter) {
          const chapterOutput = this.getOutputForChapter(bookObject.chapter);
          output += `
<span class="bxChapter">
<span class="bxChapterNumber">
  ${bookObject.chapter_nr}
</span>
${chapterOutput.trim()}
</span>`;
        }
      }
    } else if (result.type === 'chapter' && result.chapter) {
      output = this.getOutputForChapter(result.chapter);
    }
    return output;
  }

  private getOutputForChapter(chapterObject: ChapterResponse['chapter']): string {
    let output = '';
    for (const verseIndex in chapterObject) {
      if (chapterObject.hasOwnProperty(verseIndex)) {
        const verseObject = chapterObject[verseIndex];
        output += `
<span class="bxVerse">
  <span class="bxVerseNumber">${verseObject.verse_nr}</span>&nbsp;${verseObject.verse.trim()}
</span>`;
      }
    }
    return output;
  }
}
