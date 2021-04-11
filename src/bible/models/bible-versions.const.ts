import { BibleVersion, BibleSection } from 'src/bible/models/bible-version.interface';

// tslint:disable:max-line-length
export type BibleVersionCode = keyof BibleVersions;

export type BibleVersionsInterface = {
  [P in BibleVersionCode]: BibleVersion;
};

/**
 * All Bible versions supported by one of the online Bibles or Bible APIs.
 * If the user has not specified a Bible version, the first one available for that language in the order given below will be chosen.
 */
export class BibleVersions implements BibleVersionsInterface {
  // Afrikaans
  'af.AOV' = {
    title: 'Ou Vertaling',
    languageCode: 'af',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Arabic
  'ar.ALAB' = {
    title: 'التفسير التطبيقي للكتاب المقدس',
    languageCode: 'ar',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'ar.ArabicSV' = {
    title: 'Smith and Van Dyke',
    languageCode: 'ar',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Aramaic
  'arc.Peshitta' = {
    title: 'Peshitta NT',
    languageCode: 'arc',
    availableSections: ['NT'] as BibleSection[]
  };

  // Bulgarian
  'bg.BGV' = {
    title: 'Veren',
    languageCode: 'bg',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'bg.CBT' = {
    title: 'Библия, нов превод от оригиналните езици',
    languageCode: 'bg',
    availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[]
  };

  // Breton
  'br.Breton' = {
    title: 'Breton',
    languageCode: 'br',
    availableSections: ['Gospels'] as BibleSection[]
  };

  // Chamorro (GUam, Northern Mariana Islands)
  'ch.Chamorro' = {
    title: 'Chamorro',
    languageCode: 'ch',
    availableSections: ['Ps', 'Gospels', 'Acts'] as BibleSection[]
  };

  // Coptic
  'cop.Coptic' = {
    title: 'Coptic NT',
    languageCode: 'cop',
    availableSections: ['NT'] as BibleSection[]
  };
  'cop.Sahidic' = {
    title: 'Sahidic NT',
    languageCode: 'cop',
    availableSections: ['NT'] as BibleSection[]
  };

  // Czech
  'cs.B21' = {
    title: 'Bible, překlad 21. století',
    languageCode: 'cs',
    availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[]
  };
  'cs.BKR' = {
    title: 'Bible Kralická',
    languageCode: 'cs',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'cs.CEP' = {
    title: 'Český ekumenický překlad',
    languageCode: 'cs',
    availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[]
  };

  // Danish
  'da.DK' = {
    title: 'Bibelen på hverdagsdansk',
    languageCode: 'da',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'da.Danish' = {
    title: 'Danish',
    languageCode: 'da',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // German
  'de.ELB' = {
    title: 'Elberfelder Bibel',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.ZB' = {
    title: 'Zürcher Bibel',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.LUT' = {
    title: 'Lutherbibel (2017)',
    languageCode: 'de',
    availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[]
  };
  'de.NeÜ' = {
    title: 'Neue evangelistische Übersetzung',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.SLT' = {
    title: 'Schlachter 2000',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.EU' = {
    title: 'Einheitsübersetzung (2016)',
    languageCode: 'de',
    availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[]
  };
  'de.MENG' = {
    title: 'Menge Bibel',
    languageCode: 'de',
    availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[]
  };
  'de.NLB' = {
    title: 'Neues Leben. Die Bibel',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.GNB' = {
    title: 'Gute Nachricht Bibel',
    languageCode: 'de',
    availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[]
  };
  'de.HFA' = {
    title: 'Hoffnung für Alle',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.NGÜ' = {
    title: 'Neue Genfer Übersetzung',
    languageCode: 'de',
    availableSections: ['Psalms', 'NT'] as BibleSection[]
  };
  'de.SLT1951' = {
    title: 'Schlachter (1951)',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.ELB1905' = {
    title: 'Elberfelder (1905)',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.ELB1871' = {
    title: 'Elberfelder (1871)',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.LUT1545' = {
    title: 'Luther (1545)',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Modern Greek
  'el.ModernGreek' = {
    title: 'Modern Greek',
    languageCode: 'el',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // English
  'en.ESV' = {
    title: 'English Standard Version',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.NIV' = {
    title: 'New International Version',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.WEB' = {
    title: 'World English Bible',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.KJV' = {
    title: 'King James Version',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.NIRV' = {
    title: 'New Int. Readers Version',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.AKJV' = {
    title: 'KJV Easy Read',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.ASV' = {
    title: 'American Standard Version',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.BasicEnglish' = {
    title: 'Basic English Bible',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.YLT' = {
    title: `Young's Literal Translation`,
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.WB' = {
    title: `Webster's Bible`,
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.DouayRheims' = {
    title: 'Douay Rheims',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.Weymouth' = {
    title: 'Weymouth NT',
    languageCode: 'en',
    availableSections: ['NT'] as BibleSection[]
  };

  // Esperanto
  'eo.Esperanto' = {
    title: 'Esperanto',
    languageCode: 'eo',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Spanish
  'es.BTX' = {
    title: 'La Biblia Textual',
    languageCode: 'es',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'es.CST' = {
    title: 'Nueva Versión Internacional (Castilian)',
    languageCode: 'es',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'es.NVI' = {
    title: 'Nueva Versión Internacional',
    languageCode: 'es',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'es.Valera' = {
    title: 'Reina Valera (1909)',
    languageCode: 'es',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'es.RV1858' = {
    title: 'Reina Valera NT (1858)',
    languageCode: 'es',
    availableSections: ['NT'] as BibleSection[]
  };
  'es.SSE' = {
    title: 'Sagradas Escrituras (1569)',
    languageCode: 'es',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Estonian
  'et.Estonian' = {
    title: 'Estonian',
    languageCode: 'et',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Basque
  'eu.Basque' = {
    title: 'Navarro Labourdin NT',
    languageCode: 'eu',
    availableSections: ['NT'] as BibleSection[]
  };

  // Persian/Farsi
  'fa.FCB' = {
    title: 'کتاب مقدس، ترجمه تفسیری',
    languageCode: 'fa',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Finnish
  'fi.Finnish1776' = {
    title: 'Finnish Bible (1776)',
    languageCode: 'fi',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'fi.PyhaRaamattu1933' = {
    title: 'Pyha Raamattu (1933, 1938)',
    languageCode: 'fi',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'fi.PyhaRaamattu1992' = {
    title: 'Pyha Raamattu (1992)',
    languageCode: 'fi',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // French
  'fr.BDS' = {
    title: 'Bible du Semeur',
    languageCode: 'fr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'fr.LSG' = {
    title: 'Louis Segond (1910)',
    languageCode: 'fr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'fr.S21' = {
    title: 'Segond 21',
    languageCode: 'fr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'fr.Martin' = {
    title: 'Martin (1744)',
    languageCode: 'fr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'fr.LS1910' = {
    title: 'Louis Segond (1910)',
    languageCode: 'fr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'fr.Darby' = {
    title: 'Bible J.N.Darby en français (1975)',
    languageCode: 'fr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Scottish Gaelic
  'gd.Gaelic' = {
    title: 'Scots Gaelic Gospel of Mark',
    languageCode: 'gd',
    availableSections: ['Mark'] as BibleSection[]
  };

  // Gothic
  'got.Gothic' = {
    title: 'Gothic',
    languageCode: 'got',
    availableSections: ['Neh', 'NT'] as BibleSection[]
  };

  // Koine Greek
  'grc.TextusReceptus' = {
    title: 'NT Textus Receptus (1550 1894) Parsed',
    languageCode: 'grc',
    availableSections: ['NT'] as BibleSection[]
  };
  'grc.Tischendorf' = {
    title: 'NT Tischendorf 8th Ed',
    languageCode: 'grc',
    availableSections: ['NT'] as BibleSection[]
  };
  'grc.WestcottHort' = {
    title: 'NT Westcott Hort UBS4 variants Parsed',
    languageCode: 'grc',
    availableSections: ['NT'] as BibleSection[]
  };

  // Manx Gaelic (Isle of Man)
  'gv.ManxGaelic' = {
    title: 'Manx Gaelic',
    languageCode: 'gv',
    availableSections: ['Esth', 'Jonah', 'Gospels'] as BibleSection[]
  };

  // Modern Hebrew
  'he.ModernHebrew' = {
    title: 'Hebrew Modern',
    languageCode: 'he',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'he.OT' = {
    title: 'Hebrew OT',
    languageCode: 'he',
    availableSections: ['OT'] as BibleSection[]
  };

  // Ancient Hebrew
  'hbo.Aleppo' = {
    title: 'Aleppo Codex',
    languageCode: 'hbo',
    availableSections: ['OT'] as BibleSection[]
  };
  'hbo.WLC' = {
    title: 'OT Westminster Leningrad Codex',
    languageCode: 'hbo',
    availableSections: ['OT'] as BibleSection[]
  };

  // Hungarian
  'hu.Karoli' = {
    title: 'Hungarian Karoli',
    languageCode: 'hu',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Croatian
  'hr.CKK' = {
    title: 'Knjiga O Kristu',
    languageCode: 'hr',
    availableSections: ['NT'] as BibleSection[]
  };
  'hr.Croatian' = {
    title: 'Croatian',
    languageCode: 'hr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Hungarian
  'hu.HUN' = {
    title: 'Hungarian',
    languageCode: 'hu',
    availableSections: ['NT'] as BibleSection[]
  };
  'hu.KAR' = {
    title: 'IBS-fordítás (Új Károli)',
    languageCode: 'hu',
    availableSections: ['OT'] as BibleSection[]
  };

  // Armenian
  'hy.EasternArmenian' = {
    title: 'Eastern',
    languageCode: 'hy',
    availableSections: ['Gen', 'Exod', 'Gospels'] as BibleSection[]
  };
  'hy.WesternArmenian' = {
    title: 'Western NT',
    languageCode: 'hy',
    availableSections: ['NT'] as BibleSection[]
  };

  // Italian
  'it.ITA' = {
    title: 'La Parola è Vita',
    languageCode: 'it',
    availableSections: ['NT'] as BibleSection[]
  };
  'it.NRS' = {
    title: 'Nuova Riveduta (2006)',
    languageCode: 'it',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'it.Giovanni' = {
    title: 'Giovanni Diodati Bible (1649)',
    languageCode: 'it',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'it.Riveduta' = {
    title: 'Riveduta Bible (1927)',
    languageCode: 'it',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Korean
  'ko.Korean' = {
    title: 'Korean',
    languageCode: 'ko',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Latin
  'la.VUL' = {
    title: 'Vulgata Clementina',
    languageCode: 'la',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Lithuanian
  'lt.Lithuanian' = {
    title: 'Lithuanian',
    languageCode: 'lt',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Latvian
  'lv.Latvian' = {
    title: 'Latvian NT',
    languageCode: 'lv',
    availableSections: ['NT'] as BibleSection[]
  };

  // Maori (New Zealand)
  'mi.Maori' = {
    title: 'Maori',
    languageCode: 'mi',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Burmese (Myanmar)
  'my.Judson' = {
    title: 'Judson (1835)',
    languageCode: 'my',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Dutch
  'nl.HTB' = {
    title: 'Het Boek',
    languageCode: 'nl',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'nl.StatenVertaling' = {
    title: 'Dutch Staten Vertaling',
    languageCode: 'nl',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Norwegian
  'no.NOR' = {
    title: 'En Levende Bok',
    languageCode: 'no',
    availableSections: ['NT'] as BibleSection[]
  };
  'no.Bibelselskap' = {
    title: 'Bibelselskap (1930)',
    languageCode: 'no',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Potawatomi (Indigenous North American)
  'pot.Potawatomi' = {
    title: 'Potawatomi (Lykins 1844)',
    languageCode: 'pot',
    availableSections: ['Matt', 'Acts'] as BibleSection[]
  };

  // Uma (Indonesia)
  'ppk.Uma' = { title: 'Uma NT', languageCode: 'ppk', availableSections: ['NT'] as BibleSection[] };

  // Portuguese
  'pt.PRT' = {
    title: 'O Livro',
    languageCode: 'pt',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'pt.Almeida' = {
    title: 'Almeida Atualizada',
    languageCode: 'pt',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Romanian
  'ro.NTR' = {
    title: 'Noua traducere în limba românã',
    languageCode: 'ro',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'ro.Cornilescu' = {
    title: 'Cornilescu',
    languageCode: 'ro',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Russian
  'ru.CARS' = {
    title: 'Священное Писание, Восточный перевод',
    languageCode: 'ru',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'ru.RSZ' = {
    title: 'Новый перевод на русский язык',
    languageCode: 'ru',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'ru.Synodal' = {
    title: 'Synodal Translation (1876)',
    languageCode: 'ru',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'ru.Zhuromsky' = {
    title: 'Victor Zhuromsky NT',
    languageCode: 'ru',
    availableSections: ['NT'] as BibleSection[]
  };

  // Slovak
  'sk.NPK' = {
    title: 'Nádej pre kazdého',
    languageCode: 'sk',
    availableSections: ['NT'] as BibleSection[]
  };

  // Swedish
  'sv.BSV' = {
    title: 'Nya Levande Bibeln',
    languageCode: 'sv',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'sv.Swedish' = {
    title: 'Swedish (1917)',
    languageCode: 'sv',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Swahili (East Africa)
  'sw.Swahili' = {
    title: 'Swahili',
    languageCode: 'sw',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Thai
  'th.Thai' = {
    title: 'Thai from KJV',
    languageCode: 'th',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Tagalog (Philippines)
  'tl.Tagalog' = {
    title: 'Ang Dating Biblia (1905)',
    languageCode: 'tl',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Turkish
  'tr.TR' = {
    title: 'Türkçe',
    languageCode: 'tr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'tr.Turkish' = {
    title: 'Turkish',
    languageCode: 'tr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Ukrainian
  'uk.Ukranian' = {
    title: 'Ukranian NT (P Kulish 1871)',
    languageCode: 'uk',
    availableSections: ['NT'] as BibleSection[]
  };

  // Vietnamese
  'vi.Vietnamese' = {
    title: 'Vietnamese (1934)',
    languageCode: 'vi',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Chinese
  'za.CCBT' = {
    title: '聖經當代譯本修訂版',
    languageCode: 'za',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'za.CUVS' = {
    title: '中文和合本（简体）',
    languageCode: 'za',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'za.CNT' = {
    title: 'NCV Traditional',
    languageCode: 'za',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'za.CUS' = {
    title: 'Union Simplified',
    languageCode: 'za',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'za.CNS' = {
    title: 'NCV Simplified',
    languageCode: 'za',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'za.CUT' = {
    title: 'Union Traditional',
    languageCode: 'za',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
}

export const bibleVersions = new BibleVersions();
