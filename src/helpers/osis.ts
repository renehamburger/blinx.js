import { BibleBook, bibleBooks } from 'src/bible/models/bible-books.const';
import { isEqual } from 'lodash';

export interface BibleReferencePoint {
  book: BibleBook;
  bookNumber: number; // 1-66 for canonical books
  chapter: number;
  verse?: number;
}

export interface BibleReference {
  start: BibleReferencePoint;
  end: BibleReferencePoint;
}

/**
 * Parses given OSIS reference.
 * @param osis OSIS reference
 * @return Object containing all parts of the reference
 */
export function parseOsis(osis: string): BibleReference {
  const referencePoints: BibleReferencePoint[] = [];
  for (let i = 0; i < 2; i++) {
    const segment = osis.split('-')[i];
    if (segment) {
      const parts = segment.split('.');
      const referencePoint: BibleReferencePoint = {
        book: parts[0] as BibleBook,
        bookNumber: Object.keys(bibleBooks).indexOf(parts[0]) + 1,
        chapter: +parts[1]
      };
      if (parts.length > 2) {
        referencePoint.verse = +parts[2];
      }
      referencePoints.push(referencePoint);
    }
  }
  return {
    start: referencePoints[0],
    end: referencePoints[1] ?? referencePoints[0]
  };
}

export type BookNameMap = { [P in BibleBook]?: string };

export class TransformOsisOptions {
  /** Separator between chapter and verse */
  chapterVerse: string = ':';
  /** Separator between book name and chapter number  */
  bookChapter: string = '';
  /** Options for removing superfluous elements: none, duplicate book name, duplicate book name and chapter  */
  removeSuperfluous: 'none' | 'book' | 'bookChapter' = 'bookChapter';
  /** Mapping of book names. Anything not contained in it will remain unchanged. */
  bookNameMap: BookNameMap = {};
}

/**
 * Transform OSIS reference with the given options
 * @param osis OSIS reference
 * @param options Options
 * @returns Transformed reference
 */
export function transformOsis(osis: string, options: Partial<TransformOsisOptions> = {}): string {
  const defaults = new TransformOsisOptions();
  const chapterVerse =
    options.chapterVerse !== void 0 ? options.chapterVerse : defaults.chapterVerse;
  const bookChapter = options.bookChapter !== void 0 ? options.bookChapter : defaults.bookChapter;
  const bookNames = options.bookNameMap !== void 0 ? options.bookNameMap : defaults.bookNameMap;
  const removeSuperfluous =
    options.removeSuperfluous !== void 0 ? options.removeSuperfluous : defaults.removeSuperfluous;
  const ref = parseOsis(osis);
  let transformed = bookNames[ref.start.book] || ref.start.book;
  transformed += bookChapter + ref.start.chapter;
  if (ref.start.verse) {
    transformed += chapterVerse + ref.start.verse;
  }
  if (!isEqual(ref.start, ref.end)) {
    transformed += '-';
    let chapterAdded = false;
    if (ref.end.book !== ref.start.book || removeSuperfluous === 'none') {
      transformed += bookNames[ref.end.book] || ref.end.book;
      transformed += bookChapter + ref.end.chapter;
      chapterAdded = true;
    } else if (ref.end.chapter !== ref.start.chapter || removeSuperfluous === 'book') {
      transformed += ref.end.chapter;
      chapterAdded = true;
    }
    if (ref.end.verse) {
      transformed += (chapterAdded ? chapterVerse : '') + ref.end.verse;
    }
  }
  return transformed;
}

// Truncate multi-book osis string and only return part of first book
export function truncateMultiBookOsis(osis: string): string {
  const ref = parseOsis(osis);
  // Truncate references across several books
  // until infinite scroll is implemented
  if (ref.start.book !== ref.end.book) {
    const numberOfChapters = bibleBooks[ref.start.book].chapters;
    return `${ref.start.book}.${ref.start.chapter}.${ref.start.verse}-${ref.start.book}.${numberOfChapters}.999`;
  }
  return osis;
}
