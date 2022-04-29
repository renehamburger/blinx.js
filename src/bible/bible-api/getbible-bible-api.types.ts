export const getbibleBibleVersionMap = {
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

export type GetbibleBibleVersionMap = typeof getbibleBibleVersionMap;

export type GetbibleSupportedBibleVersionCode = keyof GetbibleBibleVersionMap;

export type GetbibleBibleVersionAbbreviation = GetbibleBibleVersionMap[GetbibleSupportedBibleVersionCode];

export type GetbibleBibleTranslations = {
  [BibleVersionAbbreviation in GetbibleBibleVersionAbbreviation]?: {
    checksum: string;
    books?: GetbibleBooks;
  };
};

export interface GetbibleBooks {
  [bookNumber: number /** 1-66 */]: {
    checksum: string;
    chapters?: GetbibleChapters;
  };
}

export type GetbibleChapters = {
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
