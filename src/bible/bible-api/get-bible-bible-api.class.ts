import { BibleApi } from 'src/bible/bible-api/bible-api.class';
import { BibleVersionCode } from 'src/bible/models/bible-versions.const';
import { executeJsonp } from 'src/helpers/jsonp';
import { BibleVersionMap } from 'src/bible/bible.class';
import { transformOsis, BookNameMap, parseOsis } from 'src/helpers/osis';

interface VerseResponse {
  type: 'verse';
  version: string;
  direction: 'LTR' | 'RTL';
  book: [{
    book_ref: string;
    book_name: string;
    book_nr: number | string;
    chapter_nr: number | string;
    chapter: {
      [key: string]: {
        verse_nr: number | string;
        verse: string;
      }
    };
  }];
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
    }
  };
}

type Response = VerseResponse | ChapterResponse;

export class GetBibleBibleApi extends BibleApi {

  public readonly title = 'getBible.net';
  public readonly url = 'https://getbible.net/api';

  protected readonly bibleVersionMap: BibleVersionMap = {
    'af.AOV': 'aov',
    'sq.Albanian': 'albanian',
    'am.HSAB': 'hsab',
    'am.Amharic': 'amharic',
    'ar.ArabicSV': 'arabicsv',
    'arc.Peshitta': 'peshitta',
    'hy.EasternArmenian': 'easternarmenian',
    'hy.WesternArmenian': 'westernarmenian',
    'eu.Basque': 'basque',
    'br.Breton': 'breton',
    'bg.Bulgarian1940': 'bulgarian1940',
    'ch.Chamorro': 'chamorro',
    'za.CNT': 'cnt',
    'za.CUS': 'cus',
    'za.CNS': 'cns',
    'za.CUT': 'cut',
    'cop.Bohairic': 'bohairic',
    'cop.Coptic': 'coptic',
    'cop.Sahidic': 'sahidic',
    'hr.Croatian': 'croatia',
    'cs.BKR': 'bkr',
    'cs.CEP': 'cep',
    'cs.KMS': 'kms',
    'cs.NKB': 'nkb',
    'da.Danish': 'danish',
    'nl.StatenVertaling': 'statenvertaling',
    'en.KJV': 'kjv',
    'en.AKJV': 'akjv',
    'en.ASV': 'asv',
    'en.BasicEnglish': 'basicenglish',
    'en.Darby': 'darby',
    'en.YLT': 'ylt',
    'en.WEB': 'web',
    'en.WB': 'wb',
    'en.DouayRheims': 'douayrheims',
    'en.Weymouth': 'weymouth',
    'eo.Esperanto': 'esperanto',
    'et.Estonian': 'estonian',
    'fi.Finnish1776': 'finnish1776',
    'fi.PyhaRaamattu1933': 'pyharaamattu1933',
    'fi.PyhaRaamattu1992': 'pyharaamattu1992',
    'fr.Martin': 'martin',
    'fr.LS1910': 'ls1910',
    'fr.Ostervald1996': 'ostervald',
    'ka.Georgian': 'georgian',
    'de.LUT1912': 'luther1912',
    'de.ELB1871': 'elberfelder',
    'de.ELB1905': 'elberfelder1905',
    'de.LUT1545': 'luther1545',
    'de.SLT1951': 'schlachter',
    'got.Gothic': 'gothic',
    'el.ModernGreek': 'moderngreek',
    'grc.TextusReceptus': 'text',
    'grc.MajorityTextParsed': 'majoritytext',
    'grc.MajorityText': 'byzantine',
    'grc.TextusReceptusParsed': 'textusreceptus',
    'grc.Tischendorf': 'tischendorf',
    'grc.WestcottHortParsed': 'westcotthort',
    'grc.WestcottHort': 'westcott',
    'grc.LXXParsed': 'lxxpar',
    'grc.LXX': 'lxx',
    'grc.LXXUnaccentedParsed': 'lxxunaccentspar',
    'grc.LXXUnaccented': 'lxxunaccents',
    'he.ModernHebrew': 'modernhebrew',
    'hbo.Aleppo': 'aleppo',
    'hbo.BHSUnpointed': 'bhsnovowels',
    'hbo.BHS': 'bhs',
    'hbo.WLCUnpointed': 'wlcnovowels',
    'hbo.WLC': 'wlc',
    'hbo.WLC2': 'codex',
    'hu.Karoli': 'karoli',
    'it.Giovanni': 'giovanni',
    'it.Riveduta': 'riveduta',
    'kab.Kabyle': 'kabyle',
    'ko.Korean': 'korean',
    'la.NewVulgate': 'newvulgate',
    'la.Vulgate': 'vulgate',
    'lv.Latvian': 'latvian',
    'lt.Lithuanian': 'lithuanian',
    'gv.ManxGaelic': 'manxgaelic',
    'mi.Maori': 'maori',
    'my.Judson': 'judson',
    'no.Bibelselskap': 'bibelselskap',
    'pt.Almeida': 'almeida',
    'pot.Potawatomi': 'potawatomi',
    'rom.ROM': 'rom',
    'ro.Cornilescu': 'cornilescu',
    'ru.Synodal': 'synodal',
    'ru.Makarij': 'makarij',
    'ru.Zhuromsky': 'zhuromsky',
    'gd.Gaelic': 'gaelic',
    'es.Valera': 'valera',
    'es.RV1858': 'rv1858',
    'es.SSE': 'sse',
    'sw.Swahili': 'swahili',
    'sv.Swedish': 'swedish',
    'tl.Tagalog': 'tagalog',
    'ttq.Tamajaq': 'tamajaq',
    'th.Thai': 'thai',
    'tr.Turkish': 'turkish',
    'tr.TNT': 'tnt',
    'uk.Ukranian': 'ukranian',
    'ppk.Uma': 'uma',
    'vi.Vietnamese': 'vietnamese',
    'wo.Wolof': 'wolof',
    'xh.Xhosa': 'xhosa'
  };

  private bookNameMap: BookNameMap = {
    Exod: 'Exo',
    Deut: 'Deu',
    Josh: 'Jos',
    Judg: 'Jud',
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

  public getPassage(osis: string, bibleVersion: BibleVersionCode): Promise<string> {
    return executeJsonp<Response>(
      `https://getbible.net/json?p=${this.getPassageFromOsis(osis)}&v=${this.bibleVersionMap[bibleVersion]}`, 'getbible'
    ).then(result => {
      let output = '';
      if (result.type === 'verse') {
        for (let bookObject of result.book) {
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
    });
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
        passageString += ';' + this.getSinglePassageFromOsis(
          `${book}.${chapter}.1-${book}.${chapter}.999`
        );
      }
      passageString += ';' + this.getSinglePassageFromOsis(
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
