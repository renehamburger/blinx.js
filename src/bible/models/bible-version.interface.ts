import { BibleBook } from 'src/bible/models/bible-book.interface';

export type BibleSection = 'OT' | 'NT' | 'Apocrypha' | 'Gospels' | BibleBook;

export interface BibleVersion {
  title: string;
  languageCode: string;
  availableSections: BibleSection[];
}
