import { BibleVersions, BibleVersionCode } from '../bible-versions/bible-versions.const';
import { BibleVersion } from '../bible-versions/bible-version.interface';

export abstract class OnlineBible {
  protected readonly abstract availableVersionCodes: BibleVersionCode[];

  public getAvailableVersions(): BibleVersion[] {
    const allVersions: any = new BibleVersions();
    return this.availableVersionCodes.map(code => allVersions[code]);
  }

  public abstract getPassageLink(osis: string, bibleVersion: BibleVersionCode): string;
}
