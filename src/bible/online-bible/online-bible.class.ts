import { Bible } from 'src/bible/bible.class';
import { BibleVersionCode } from 'src/bible/versions/bible-versions.const';

export abstract class OnlineBible extends Bible {
  public abstract buildPassageLink(osis: string, bibleVersion: BibleVersionCode): string;
}
