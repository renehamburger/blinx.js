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
  'af.aov' = {
    title: 'Ou Vertaling',
    languageCode: 'af',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Arabic
  'ar.alab' = {
    title: 'التفسير التطبيقي للكتاب المقدس',
    languageCode: 'ar',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'ar.arabicsv' = {
    title: 'Smith and Van Dyke',
    languageCode: 'ar',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Aramaic
  'arc.peshitta' = {
    title: 'Peshitta NT',
    languageCode: 'arc',
    availableSections: ['NT'] as BibleSection[]
  };

  // Bulgarian
  'bg.bgv' = {
    title: 'Veren',
    languageCode: 'bg',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'bg.cbt' = {
    title: 'Библия, нов превод от оригиналните езици',
    languageCode: 'bg',
    availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[]
  };

  // Breton
  'br.breton' = {
    title: 'Breton',
    languageCode: 'br',
    availableSections: ['Gospels'] as BibleSection[]
  };

  // Chamorro (GUam, Northern Mariana Islands)
  'ch.chamorro' = {
    title: 'Chamorro',
    languageCode: 'ch',
    availableSections: ['Ps', 'Gospels', 'Acts'] as BibleSection[]
  };

  // Coptic
  'cop.coptic' = {
    title: 'Coptic NT',
    languageCode: 'cop',
    availableSections: ['NT'] as BibleSection[]
  };
  'cop.sahidic' = {
    title: 'Sahidic NT',
    languageCode: 'cop',
    availableSections: ['NT'] as BibleSection[]
  };

  // Czech
  'cs.b21' = {
    title: 'Bible, překlad 21. století',
    languageCode: 'cs',
    availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[]
  };
  'cs.bkr' = {
    title: 'Bible Kralická',
    languageCode: 'cs',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'cs.cep' = {
    title: 'Český ekumenický překlad',
    languageCode: 'cs',
    availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[]
  };

  // Danish
  'da.dk' = {
    title: 'Bibelen på hverdagsdansk',
    languageCode: 'da',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'da.danish' = {
    title: 'Danish',
    languageCode: 'da',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // German
  'de.elb' = {
    title: 'Elberfelder Bibel',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.zb' = {
    title: 'Zürcher Bibel',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.lut' = {
    title: 'Lutherbibel (2017)',
    languageCode: 'de',
    availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[]
  };
  'de.neü' = {
    title: 'Neue evangelistische Übersetzung',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.slt' = {
    title: 'Schlachter 2000',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.eu' = {
    title: 'Einheitsübersetzung (2016)',
    languageCode: 'de',
    availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[]
  };
  'de.meng' = {
    title: 'Menge Bibel',
    languageCode: 'de',
    availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[]
  };
  'de.nlb' = {
    title: 'Neues Leben. Die Bibel',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.gnb' = {
    title: 'Gute Nachricht Bibel',
    languageCode: 'de',
    availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[]
  };
  'de.hfa' = {
    title: 'Hoffnung für Alle',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.ngü' = {
    title: 'Neue Genfer Übersetzung',
    languageCode: 'de',
    availableSections: ['Psalms', 'NT'] as BibleSection[]
  };
  'de.slt1951' = {
    title: 'Schlachter (1951)',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.elb1905' = {
    title: 'Elberfelder (1905)',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.elb1871' = {
    title: 'Elberfelder (1871)',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'de.lut1545' = {
    title: 'Luther (1545)',
    languageCode: 'de',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Modern Greek
  'el.moderngreek' = {
    title: 'Modern Greek',
    languageCode: 'el',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // English
  'en.esv' = {
    title: 'English Standard Version',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.niv' = {
    title: 'New International Version',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.web' = {
    title: 'World English Bible',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.kjv' = {
    title: 'King James Version',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.nirv' = {
    title: 'New Int. Readers Version',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.akjv' = {
    title: 'KJV Easy Read',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.asv' = {
    title: 'American Standard Version',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.basicenglish' = {
    title: 'Basic English Bible',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.ylt' = {
    title: `Young's Literal Translation`,
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.wb' = {
    title: `Webster's Bible`,
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.douayrheims' = {
    title: 'Douay Rheims',
    languageCode: 'en',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'en.weymouth' = {
    title: 'Weymouth NT',
    languageCode: 'en',
    availableSections: ['NT'] as BibleSection[]
  };

  // Esperanto
  'eo.esperanto' = {
    title: 'Esperanto',
    languageCode: 'eo',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Spanish
  'es.btx' = {
    title: 'La Biblia Textual',
    languageCode: 'es',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'es.cst' = {
    title: 'Nueva Versión Internacional (Castilian)',
    languageCode: 'es',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'es.nvi' = {
    title: 'Nueva Versión Internacional',
    languageCode: 'es',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'es.valera' = {
    title: 'Reina Valera (1909)',
    languageCode: 'es',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'es.rv1858' = {
    title: 'Reina Valera NT (1858)',
    languageCode: 'es',
    availableSections: ['NT'] as BibleSection[]
  };
  'es.sse' = {
    title: 'Sagradas Escrituras (1569)',
    languageCode: 'es',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Estonian
  'et.estonian' = {
    title: 'Estonian',
    languageCode: 'et',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Basque
  'eu.basque' = {
    title: 'Navarro Labourdin NT',
    languageCode: 'eu',
    availableSections: ['NT'] as BibleSection[]
  };

  // Persian/Farsi
  'fa.fcb' = {
    title: 'کتاب مقدس، ترجمه تفسیری',
    languageCode: 'fa',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Finnish
  'fi.finnish1776' = {
    title: 'Finnish Bible (1776)',
    languageCode: 'fi',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'fi.pyharaamattu1933' = {
    title: 'Pyha Raamattu (1933, 1938)',
    languageCode: 'fi',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'fi.pyharaamattu1992' = {
    title: 'Pyha Raamattu (1992)',
    languageCode: 'fi',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // French
  'fr.bds' = {
    title: 'Bible du Semeur',
    languageCode: 'fr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'fr.lsg' = {
    title: 'Louis Segond (1910)',
    languageCode: 'fr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'fr.s21' = {
    title: 'Segond 21',
    languageCode: 'fr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'fr.martin' = {
    title: 'Martin (1744)',
    languageCode: 'fr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'fr.ls1910' = {
    title: 'Louis Segond (1910)',
    languageCode: 'fr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'fr.darby' = {
    title: 'Bible J.N.Darby en français (1975)',
    languageCode: 'fr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Scottish Gaelic
  'gd.gaelic' = {
    title: 'Scots Gaelic Gospel of Mark',
    languageCode: 'gd',
    availableSections: ['Mark'] as BibleSection[]
  };

  // Gothic
  'got.gothic' = {
    title: 'Gothic',
    languageCode: 'got',
    availableSections: ['Neh', 'NT'] as BibleSection[]
  };

  // Koine Greek
  'grc.textusreceptus' = {
    title: 'NT Textus Receptus (1550 1894) Parsed',
    languageCode: 'grc',
    availableSections: ['NT'] as BibleSection[]
  };
  'grc.tischendorf' = {
    title: 'NT Tischendorf 8th Ed',
    languageCode: 'grc',
    availableSections: ['NT'] as BibleSection[]
  };
  'grc.westcotthort' = {
    title: 'NT Westcott Hort UBS4 variants Parsed',
    languageCode: 'grc',
    availableSections: ['NT'] as BibleSection[]
  };

  // Manx Gaelic (Isle of Man)
  'gv.manxgaelic' = {
    title: 'Manx Gaelic',
    languageCode: 'gv',
    availableSections: ['Esth', 'Jonah', 'Gospels'] as BibleSection[]
  };

  // Modern Hebrew
  'he.modernhebrew' = {
    title: 'Hebrew Modern',
    languageCode: 'he',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'he.ot' = {
    title: 'Hebrew OT',
    languageCode: 'he',
    availableSections: ['OT'] as BibleSection[]
  };

  // Ancient Hebrew
  'hbo.aleppo' = {
    title: 'Aleppo Codex',
    languageCode: 'hbo',
    availableSections: ['OT'] as BibleSection[]
  };
  'hbo.wlc' = {
    title: 'OT Westminster Leningrad Codex',
    languageCode: 'hbo',
    availableSections: ['OT'] as BibleSection[]
  };

  // Hungarian
  'hu.karoli' = {
    title: 'Hungarian Karoli',
    languageCode: 'hu',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Croatian
  'hr.ckk' = {
    title: 'Knjiga O Kristu',
    languageCode: 'hr',
    availableSections: ['NT'] as BibleSection[]
  };
  'hr.croatian' = {
    title: 'Croatian',
    languageCode: 'hr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Hungarian
  'hu.hun' = {
    title: 'Hungarian',
    languageCode: 'hu',
    availableSections: ['NT'] as BibleSection[]
  };
  'hu.kar' = {
    title: 'IBS-fordítás (Új Károli)',
    languageCode: 'hu',
    availableSections: ['OT'] as BibleSection[]
  };

  // Armenian
  'hy.easternarmenian' = {
    title: 'Eastern',
    languageCode: 'hy',
    availableSections: ['Gen', 'Exod', 'Gospels'] as BibleSection[]
  };
  'hy.westernarmenian' = {
    title: 'Western NT',
    languageCode: 'hy',
    availableSections: ['NT'] as BibleSection[]
  };

  // Italian
  'it.ita' = {
    title: 'La Parola è Vita',
    languageCode: 'it',
    availableSections: ['NT'] as BibleSection[]
  };
  'it.nrs' = {
    title: 'Nuova Riveduta (2006)',
    languageCode: 'it',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'it.giovanni' = {
    title: 'Giovanni Diodati Bible (1649)',
    languageCode: 'it',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'it.riveduta' = {
    title: 'Riveduta Bible (1927)',
    languageCode: 'it',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Korean
  'ko.korean' = {
    title: 'Korean',
    languageCode: 'ko',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Latin
  'la.vul' = {
    title: 'Vulgata Clementina',
    languageCode: 'la',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Lithuanian
  'lt.lithuanian' = {
    title: 'Lithuanian',
    languageCode: 'lt',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Latvian
  'lv.latvian' = {
    title: 'Latvian NT',
    languageCode: 'lv',
    availableSections: ['NT'] as BibleSection[]
  };

  // Maori (New Zealand)
  'mi.maori' = {
    title: 'Maori',
    languageCode: 'mi',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Burmese (Myanmar)
  'my.judson' = {
    title: 'Judson (1835)',
    languageCode: 'my',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Dutch
  'nl.htb' = {
    title: 'Het Boek',
    languageCode: 'nl',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'nl.statenvertaling' = {
    title: 'Dutch Staten Vertaling',
    languageCode: 'nl',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Norwegian
  'no.nor' = {
    title: 'En Levende Bok',
    languageCode: 'no',
    availableSections: ['NT'] as BibleSection[]
  };
  'no.bibelselskap' = {
    title: 'Bibelselskap (1930)',
    languageCode: 'no',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Potawatomi (Indigenous North American)
  'pot.potawatomi' = {
    title: 'Potawatomi (Lykins 1844)',
    languageCode: 'pot',
    availableSections: ['Matt', 'Acts'] as BibleSection[]
  };

  // Uma (Indonesia)
  'ppk.uma' = { title: 'Uma NT', languageCode: 'ppk', availableSections: ['NT'] as BibleSection[] };

  // Portuguese
  'pt.prt' = {
    title: 'O Livro',
    languageCode: 'pt',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'pt.almeida' = {
    title: 'Almeida Atualizada',
    languageCode: 'pt',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Romanian
  'ro.ntr' = {
    title: 'Noua traducere în limba românã',
    languageCode: 'ro',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'ro.cornilescu' = {
    title: 'Cornilescu',
    languageCode: 'ro',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Russian
  'ru.cars' = {
    title: 'Священное Писание, Восточный перевод',
    languageCode: 'ru',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'ru.rsz' = {
    title: 'Новый перевод на русский язык',
    languageCode: 'ru',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'ru.synodal' = {
    title: 'Synodal Translation (1876)',
    languageCode: 'ru',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'ru.zhuromsky' = {
    title: 'Victor Zhuromsky NT',
    languageCode: 'ru',
    availableSections: ['NT'] as BibleSection[]
  };

  // Slovak
  'sk.npk' = {
    title: 'Nádej pre kazdého',
    languageCode: 'sk',
    availableSections: ['NT'] as BibleSection[]
  };

  // Swedish
  'sv.bsv' = {
    title: 'Nya Levande Bibeln',
    languageCode: 'sv',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'sv.swedish' = {
    title: 'Swedish (1917)',
    languageCode: 'sv',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Swahili (East Africa)
  'sw.swahili' = {
    title: 'Swahili',
    languageCode: 'sw',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Thai
  'th.thai' = {
    title: 'Thai from KJV',
    languageCode: 'th',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Tagalog (Philippines)
  'tl.tagalog' = {
    title: 'Ang Dating Biblia (1905)',
    languageCode: 'tl',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Turkish
  'tr.tr' = {
    title: 'Türkçe',
    languageCode: 'tr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'tr.turkish' = {
    title: 'Turkish',
    languageCode: 'tr',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Ukrainian
  'uk.ukranian' = {
    title: 'Ukranian NT (P Kulish 1871)',
    languageCode: 'uk',
    availableSections: ['NT'] as BibleSection[]
  };

  // Vietnamese
  'vi.vietnamese' = {
    title: 'Vietnamese (1934)',
    languageCode: 'vi',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };

  // Chinese
  'za.ccbt' = {
    title: '聖經當代譯本修訂版',
    languageCode: 'za',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'za.cuvs' = {
    title: '中文和合本（简体）',
    languageCode: 'za',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'za.cnt' = {
    title: 'NCV Traditional',
    languageCode: 'za',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'za.cus' = {
    title: 'Union Simplified',
    languageCode: 'za',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'za.cns' = {
    title: 'NCV Simplified',
    languageCode: 'za',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
  'za.cut' = {
    title: 'Union Traditional',
    languageCode: 'za',
    availableSections: ['OT', 'NT'] as BibleSection[]
  };
}

export const bibleVersions = new BibleVersions();
