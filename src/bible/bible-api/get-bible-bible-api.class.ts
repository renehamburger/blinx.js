import { BibleApi } from 'src/bible/bible-api/bible-api.class';
import { BibleVersionCode } from 'src/bible/models/bible-versions.const';
import { executeJsonp } from 'src/helpers/jsonp';
import { BibleVersionMap } from 'src/bible/bible.class';
import { transformOsis, BookNameMap, parseOsis } from 'src/helpers/osis';

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

export class GetBibleBibleApi extends BibleApi {
  public readonly title = 'getBible.net';
  public readonly url = 'https://getbible.net/v2';

  protected readonly bibleVersionMap: BibleVersionMap = {
    'af.AOV': 'aov',
    'ar.ArabicSV': 'arabicsv',
    'arc.Peshitta': 'peshitta',
    'br.Breton': 'breton',
    'ch.Chamorro': 'chamorro',
    'cop.Coptic': 'coptic',
    'cop.Sahidic': 'sahidic',
    'cs.BKR': 'bkr',
    'cs.CEP': 'cep',
    'da.Danish': 'danish',
    'de.ELB1871': 'elberfelder',
    'de.ELB1905': 'elberfelder1905',
    'de.LUT1545': 'luther1545',
    'de.SLT1951': 'schlachter',
    'el.ModernGreek': 'moderngreek',
    'en.AKJV': 'akjv',
    'en.ASV': 'asv',
    'en.BasicEnglish': 'basicenglish',
    'en.DouayRheims': 'douayrheims',
    'en.KJV': 'kjv',
    'en.WB': 'wb',
    'en.Weymouth': 'weymouth',
    'en.WEB': 'web',
    'en.YLT': 'ylt',
    'eo.Esperanto': 'esperanto',
    'es.Valera': 'valera',
    'es.RV1858': 'rv1858',
    'es.SSE': 'sse',
    'et.Estonian': 'estonian',
    'eu.Basque': 'basque',
    'fi.Finnish1776': 'finnish1776',
    'fi.PyhaRaamattu1933': 'pyharaamattu1933',
    'fi.PyhaRaamattu1992': 'pyharaamattu1992',
    'fr.Darby': 'darby',
    'fr.LS1910': 'ls1910',
    'fr.Martin': 'martin',
    'gd.Gaelic': 'gaelic',
    'got.Gothic': 'gothic',
    'grc.TextusReceptus': 'textusreceptus',
    'grc.Tischendorf': 'tischendorf',
    'grc.WestcottHort': 'westcotthort',
    'gv.ManxGaelic': 'manxgaelic',
    'hbo.Aleppo': 'aleppo',
    'hbo.WLC': 'codex',
    'he.ModernHebrew': 'modernhebrew',
    'hr.Croatian': 'croatia',
    'hu.Karoli': 'karoli',
    'hy.EasternArmenian': 'easternarmenian',
    'hy.WesternArmenian': 'westernarmenian',
    'it.Giovanni': 'giovanni',
    'it.Riveduta': 'riveduta',
    'ko.Korean': 'korean',
    'la.VUL': 'vulgate',
    'lt.Lithuanian': 'lithuanian',
    'lv.Latvian': 'latvian',
    'mi.Maori': 'maori',
    'my.Judson': 'judson',
    'nl.StatenVertaling': 'statenvertaling',
    'no.Bibelselskap': 'bibelselskap',
    'pot.Potawatomi': 'potawatomi',
    'ppk.Uma': 'uma',
    'pt.Almeida': 'almeida',
    'ro.Cornilescu': 'cornilescu',
    'ru.Synodal': 'synodal',
    'ru.Zhuromsky': 'zhuromsky',
    'sv.Swedish': 'swedish',
    'sw.Swahili': 'swahili',
    'th.Thai': 'thai',
    'tl.Tagalog': 'tagalog',
    'tr.Turkish': 'turkish',
    'uk.Ukranian': 'ukranian',
    'vi.Vietnamese': 'vietnamese',
    'za.CNS': 'cns',
    'za.CUS': 'cus',
    'za.CNT': 'cnt',
    'za.CUT': 'cut'
  };

  private bookNameMap: BookNameMap = {
    Exod: 'Exo',
    Deut: 'Deu',
    Josh: 'Jos',
    Judg: 'Ju',
    '1Kgs': '1Kg',
    '2Kgs': '2Kg',
    Ezra: 'Ezr',
    Esth: 'Est',
    Prov: 'Pro',
    Eccl: 'Ecc',
    Ezek: 'Eze',
    Matt: 'Mat',
    Jas: 'Jam'
  };

  public async getPassage(osis: string, bibleVersion: BibleVersionCode): Promise<string> {
    const result = await executeJsonp<Response>(
      `https://getbible.net/json?p=${this.getPassageFromOsis(osis)}&v=${
        this.bibleVersionMap[bibleVersion]
      }`,
      'getbible'
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

  private getPassageFromOsis(osis: string): string {
    const ref = parseOsis(osis);
    let passageString: string;
    if (ref.end && ref.start.chapter !== ref.end.chapter) {
      const book = ref.start.book;
      passageString = this.getSinglePassageFromOsis(
        `${book}.${ref.start.chapter}.${ref.start.verse || 1}-${book}.${ref.start.chapter}.999`
      );
      for (let chapter = ref.start.chapter + 1; chapter < ref.end.chapter; chapter++) {
        passageString +=
          ';' + this.getSinglePassageFromOsis(`${book}.${chapter}.1-${book}.${chapter}.999`);
      }
      passageString +=
        ';' +
        this.getSinglePassageFromOsis(
          `${book}.${ref.end.chapter}.1-${book}.${ref.end.chapter}.${ref.end.verse || 999}`
        );
    } else {
      passageString = this.getSinglePassageFromOsis(osis);
    }
    return passageString;
  }

  private getSinglePassageFromOsis(osis: string): string {
    return transformOsis(osis, { bookNameMap: this.bookNameMap });
  }
}
