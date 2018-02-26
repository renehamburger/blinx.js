export type BibleSection = 'OT' | 'Psalms' | 'NT' | 'Apocrypha';

export interface BibleVersion {
  title: string;
  languageCode: string;
  availableSections: BibleSection[];
}
