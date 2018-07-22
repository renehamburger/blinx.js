import { Bible } from 'src/bible/bible.class';
import { BibleVersionCode } from 'src/bible/models/bible-versions.const';

export abstract class BibleApi extends Bible {
  public abstract getPassage(osis: string, bibleVersion: BibleVersionCode): Promise<string>;
}
