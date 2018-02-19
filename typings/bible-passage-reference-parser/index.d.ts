declare namespace BCV {

  export class Parser {

    private languages: string[];

    /** This function does the parsing. It returns the `bcv` object and is suitable for chaining.*/
    parse(text: string): this;

    /** This function parses a string with a string context as the second argument. As with `.parse()`, it returns the`bcv` object and is suitable for chaining. Use this function if you have a string that starts with what you suspect is a reference and you already know the context. */
    parse_with_context(text: string, context: string): this;

    /** This function returns a single OSIS for the entire input, providing no information about any translations included in the input. */
    osis(): string;

    /** This function returns an array. Each element in the array is an `[OSIS, Translation]` tuple (both are strings). */
    osis_and_translations(): [string, string][];

    /** This function returns an array. Each element in the array is an object with `osis` (a string), `translations` (an array of translation identifiers—an empty string unless a translation is specified), and `indices` (the start and end position in the string). The `indices` key is designed to be consistent with Twitter's implementation (the first character in a string has indices `[0, 1]`). */
    osis_and_indices(): { osis: string, translations: string[], indices: Indices }[];

    /** If you want to know a lot about how the BCV parser handled the input string, use this function. It can include messages if it adjusted the input or had trouble parsing it(e.g., if given an invalid reference). This function returns an array with a fairly complicated structure.The `entities` key can contain nested entities if you're parsing a sequence of references. */
    parsed_entities(): ParsedEntity[];

    /** If you set the value to`false` (the default behavior), it ignores books in the Apocrypha. */
    include_apocrypha(include: boolean): void;

    /** This function takes an object that sets parsing and output options. */
    set_options(options: Options): void;

    /** This function returns an object of data about the requested translation. You can use this data to determine, for example, the previous and next chapters for a given chapter, even when the given chapter is at the beginning or end of a book. */
    translation_info(translation: string): TranslationInfo;
  }

  class Options {
    book_alone_strategy: 'ignore' | 'full' | 'first_chapter' /*= 'ignore'*/;
    book_range_strategy: 'ignore' | 'include' /*= 'ignore'*/;
    book_sequence_strategy: 'ignore' | 'include' /*= 'ignore'*/;
    captive_end_digits_strategy: 'delete' | 'include' /*= 'delete'*/;
    case_sensitive: 'none' | 'books' /*= 'none'*/;
    consecutive_combination_strategy: 'combine' | 'separate' /*= 'combine'*/;
    end_range_digits_strategy: 'verse' | 'sequence' /*= 'verse'*/;
    include_apocrypha: boolean /* = false */;
    invalid_passage_strategy: 'ignore' | 'include' /*= 'ignore'*/;
    invalid_sequence_strategy: 'ignore' | 'include' /*= 'ignore'*/;
    non_latin_digits_strategy: 'ignore' | 'replace' /*= 'ignore'*/;
    osis_compaction_strategy: ReferenceType /*= 'b'*/;
    passage_existence_strategy: string /*= 'bcv'*/;
    ps151_strategy: 'c' | 'b' /*= 'c'*/;
    punctuation_strategy: 'us' | 'eu' /*= 'us'*/;
    sequence_combination_strategy: 'combine' | 'separate' /*= 'combine'*/;
    single_chapter_1_strategy: 'chapter' | 'verse' /*= 'chapter'*/;
    versification_system: Versification;
    zero_chapter_strategy: 'error' | 'upgrade' /*= 'error'*/;
    zero_verse_strategy: 'error' | 'upgrade' | 'allow' /*= 'error'*/;
  }

  type ReferenceType = 'b' | 'bc' | 'bcv';

  type Versification = 'default' | 'ceb' | 'kjv' | 'nab' | 'nlt' | 'nrsv' | 'vulgate';

  interface ParsedEntity {
    "osis": string;
    "indices": Indices;
    "translations": string[];
    "entity_id": number;
    "entities": [{
      "osis": string;
      "type": ReferenceType;
      "indices": Indices;
      "translations": string[];
      "start": ReferencePoint;
      "end": ReferencePoint;
      "enclosed_indices": Indices;
      "entity_id": number;
      "entities": [{
        "start": ReferencePoint;
        "end": ReferencePoint;
        "valid": { "valid": boolean; "messages": object };
        "type": ReferenceType;
        "absolute_indices": Indices;
        "enclosed_absolute_indices": Indices
      }]
    }]
  }

  interface TranslationInfo {
    alias: Versification;
    books: [string];
    chapters: { [book: string]: number[] };
    order: { [book: string]: number };
  }

  type Indices = [number, number];

  interface ReferencePoint { "b": string, "c": number, "v": number }
}

interface Window {
  bcv_parser: typeof BCV.Parser;
}
