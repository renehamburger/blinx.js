import { BibleBook } from 'src/bible/models/bible-books.const';

export type BibleSection = 'OT' | 'NT' | 'Apocrypha' | 'Gospels' | BibleBook;

export interface BibleVersion {
  title: string;
  languageCode: string;
  availableSections: BibleSection[];
}
