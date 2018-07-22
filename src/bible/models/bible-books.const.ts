export type BibleBook = keyof BibleBooks;

export type BibleBooksInterface = {
  [P in BibleBook]: BibleBookInfo
};

export interface BibleBookInfo {
  chapters: number;
}

export class BibleBooks implements BibleBooksInterface {
  'Gen' = { chapters: 50 };
  'Exod' = { chapters: 40 };
  'Lev' = { chapters: 27 };
  'Num' = { chapters: 36 };
  'Deut' = { chapters: 34 };
  'Josh' = { chapters: 24 };
  'Judg' = { chapters: 21 };
  'Ruth' = { chapters: 4 };
  '1Sam' = { chapters: 31 };
  '2Sam' = { chapters: 24 };
  '1Kgs' = { chapters: 22 };
  '2Kgs' = { chapters: 25 };
  '1Chr' = { chapters: 29 };
  '2Chr' = { chapters: 36 };
  'Ezra' = { chapters: 10 };
  'Neh' = { chapters: 13 };
  'Esth' = { chapters: 10 };
  'Job' = { chapters: 42 };
  'Ps' = { chapters: 150 };
  'Prov' = { chapters: 31 };
  'Eccl' = { chapters: 12 };
  'Song' = { chapters: 8 };
  'Isa' = { chapters: 66 };
  'Jer' = { chapters: 52 };
  'Lam' = { chapters: 5 };
  'Ezek' = { chapters: 48 };
  'Dan' = { chapters: 12 };
  'Hos' = { chapters: 14 };
  'Joel' = { chapters: 3 };
  'Amos' = { chapters: 9 };
  'Obad' = { chapters: 1 };
  'Jonah' = { chapters: 4 };
  'Mic' = { chapters: 7 };
  'Nah' = { chapters: 3 };
  'Hab' = { chapters: 3 };
  'Zeph' = { chapters: 3 };
  'Hag' = { chapters: 2 };
  'Zech' = { chapters: 14 };
  'Mal' = { chapters: 4 };
  'Matt' = { chapters: 28 };
  'Mark' = { chapters: 16 };
  'Luke' = { chapters: 24 };
  'John' = { chapters: 21 };
  'Acts' = { chapters: 28 };
  'Rom' = { chapters: 16 };
  '1Cor' = { chapters: 16 };
  '2Cor' = { chapters: 13 };
  'Gal' = { chapters: 6 };
  'Eph' = { chapters: 6 };
  'Phil' = { chapters: 4 };
  'Col' = { chapters: 4 };
  '1Thess' = { chapters: 5 };
  '2Thess' = { chapters: 3 };
  '1Tim' = { chapters: 6 };
  '2Tim' = { chapters: 4 };
  'Titus' = { chapters: 3 };
  'Phlm' = { chapters: 1 };
  'Heb' = { chapters: 13 };
  'Jas' = { chapters: 5 };
  '1Pet' = { chapters: 5 };
  '2Pet' = { chapters: 3 };
  '1John' = { chapters: 5 };
  '2John' = { chapters: 1 };
  '3John' = { chapters: 1 };
  'Jude' = { chapters: 1 };
  'Rev' = { chapters: 22 };
}

export const bibleBooks = new BibleBooks();
