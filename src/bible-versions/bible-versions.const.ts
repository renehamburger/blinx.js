import { BibleVersion, BibleSection } from './bible-version.interface';

export type BibleVersionCode = keyof BibleVersions;

export type BibleVersionsInterface = {
  [P in BibleVersionCode]: BibleVersion
};

/**
 * All Bible versions supported by one of the online Bibles or Bible APIs.
 * If the user has not specified a Bible version, the first one available for that language in the order given below will be chosen.
 */
export class BibleVersions implements BibleVersionsInterface {

  'ar.ALAB' = { title: 'التفسير التطبيقي للكتاب المقدس', languageCode: 'ar', availableSections: ['OT', 'NT'] as BibleSection[] };

  'bg.BGV' = { title: 'Veren', languageCode: 'bg', availableSections: ['OT', 'NT'] as BibleSection[] };
  'bg.CBT' = { title: 'Библия, нов превод от оригиналните езици', languageCode: 'bg', availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[] };

  'cs.B21' = { title: 'Bible, překlad 21. století', languageCode: 'cs', availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[] };
  'cs.BKR' = { title: 'Bible Kralická', languageCode: 'cs', availableSections: ['OT', 'NT'] as BibleSection[] };
  'cs.CEP' = { title: 'Český ekumenický překlad', languageCode: 'cs', availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[] };
  'cs.SNC' = { title: 'Slovo na cestu', languageCode: 'cs', availableSections: ['OT', 'NT'] as BibleSection[] };

  'da.DK' = { title: 'Bibelen på hverdagsdansk', languageCode: 'da', availableSections: ['OT', 'NT'] as BibleSection[] };

  'de.ELB' = { title: 'Elberfelder Bibel', languageCode: 'de', availableSections: ['OT', 'NT'] as BibleSection[] };
  'de.ZB' = { title: 'Zürcher Bibel', languageCode: 'de', availableSections: ['OT', 'NT'] as BibleSection[] };
  'de.LUT' = { title: 'Lutherbibel 2017', languageCode: 'de', availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[] };
  'de.NeÜ' = { title: 'Neue evangelistische Übersetzung', languageCode: 'de', availableSections: ['OT', 'NT'] as BibleSection[] };
  'de.SLT' = { title: 'Schlachter 2000', languageCode: 'de', availableSections: ['OT', 'NT'] as BibleSection[] };
  'de.EU' = { title: 'Einheitsübersetzung 2016', languageCode: 'de', availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[] };
  'de.MENG' = { title: 'Menge Bibel', languageCode: 'de', availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[] };
  'de.NLB' = { title: 'Neues Leben. Die Bibel', languageCode: 'de', availableSections: ['OT', 'NT'] as BibleSection[] };
  'de.GNB' = { title: 'Gute Nachricht Bibel', languageCode: 'de', availableSections: ['OT', 'NT', 'Apocrypha'] as BibleSection[] };
  'de.HFA' = { title: 'Hoffnung für Alle', languageCode: 'de', availableSections: ['OT', 'NT'] as BibleSection[] };
  'de.NGÜ' = { title: 'Neue Genfer Übersetzung', languageCode: 'de', availableSections: ['Psalms', 'NT'] as BibleSection[] }; // Very good but unfortunatly not complete

  'en.ESV' = { title: 'English Standard Version', languageCode: 'en', availableSections: ['OT', 'NT'] as BibleSection[] };
  'en.NIV' = { title: 'New International Version', languageCode: 'en', availableSections: ['OT', 'NT'] as BibleSection[] };
  'en.KJV' = { title: 'King James Version', languageCode: 'en', availableSections: ['OT', 'NT'] as BibleSection[] };
  'en.NIRV' = { title: 'New Int. Readers Version', languageCode: 'en', availableSections: ['OT', 'NT'] as BibleSection[] };

  'es.BTX' = { title: 'La Biblia Textual', languageCode: 'es', availableSections: ['OT', 'NT'] as BibleSection[] };
  'es.CST' = { title: 'Nueva Versión Internacional (Castilian)', languageCode: 'es', availableSections: ['OT', 'NT'] as BibleSection[] };
  'es.NVI' = { title: 'Nueva Versión Internacional', languageCode: 'es', availableSections: ['OT', 'NT'] as BibleSection[] };

  'fa.FCB' = { title: 'کتاب مقدس، ترجمه تفسیری', languageCode: 'fa', availableSections: ['OT', 'NT'] as BibleSection[] };

  'fr.BDS' = { title: 'Bible du Semeur', languageCode: 'fr', availableSections: ['OT', 'NT'] as BibleSection[] };
  'fr.LSG' = { title: 'Louis Segond 1910', languageCode: 'fr', availableSections: ['OT', 'NT'] as BibleSection[] };
  'fr.S21' = { title: 'Segond 21', languageCode: 'fr', availableSections: ['OT', 'NT'] as BibleSection[] };

  'he.OT' = { title: 'Hebrew OT', languageCode: 'he', availableSections: ['OT'] as BibleSection[] };

  'hr.CKK' = { title: 'Knjiga O Kristu', languageCode: 'hr', availableSections: ['NT'] as BibleSection[] };

  'hu.HUN' = { title: 'Hungarian', languageCode: 'hu', availableSections: ['NT'] as BibleSection[] };
  'hu.KAR' = { title: 'IBS-fordítás (Új Károli)', languageCode: 'hu', availableSections: ['OT'] as BibleSection[] };

  'it.ITA' = { title: 'La Parola è Vita', languageCode: 'it', availableSections: ['NT'] as BibleSection[] };
  'it.NRS' = { title: 'Nuova Riveduta 2006', languageCode: 'it', availableSections: ['OT', 'NT'] as BibleSection[] };

  'la.LXX' = { title: 'Septuaginta', languageCode: 'la', availableSections: ['OT'] as BibleSection[] };
  'la.VUL' = { title: 'Vulgata', languageCode: 'la', availableSections: ['OT', 'NT'] as BibleSection[] };

  'nl.HTB' = { title: 'Het Boek', languageCode: 'nl', availableSections: ['OT', 'NT'] as BibleSection[] };

  'no.NOR' = { title: 'En Levende Bok', languageCode: 'no', availableSections: ['NT'] as BibleSection[] };

  'pl.PSZ' = { title: 'Słowo Życia', languageCode: 'pl', availableSections: ['NT'] as BibleSection[] };

  'pt.PRT' = { title: 'O Livro', languageCode: 'pt', availableSections: ['OT', 'NT'] as BibleSection[] };

  'ro.NTR' = { title: 'Noua traducere în limba românã', languageCode: 'ro', availableSections: ['OT', 'NT'] as BibleSection[] };

  'ru.CARS' = { title: 'Священное Писание, Восточный перевод', languageCode: 'ru', availableSections: ['OT', 'NT'] as BibleSection[] };
  'ru.RSZ' = { title: 'Новый перевод на русский язык', languageCode: 'ru', availableSections: ['OT', 'NT'] as BibleSection[] };

  'sk.NPK' = { title: 'Nádej pre kazdého', languageCode: 'sk', availableSections: ['NT'] as BibleSection[] };

  'sv.BSV' = { title: 'Nya Levande Bibeln', languageCode: 'sv', availableSections: ['OT', 'NT'] as BibleSection[] };

  'tr.TR' = { title: 'Türkçe', languageCode: 'tr', availableSections: ['OT', 'NT'] as BibleSection[] };

  'za.CCBT' = { title: '聖經當代譯本修訂版', languageCode: 'za', availableSections: ['OT', 'NT'] as BibleSection[] };
  'za.CUVS' = { title: '中文和合本（简体）', languageCode: 'za', availableSections: ['OT', 'NT'] as BibleSection[] };
}
