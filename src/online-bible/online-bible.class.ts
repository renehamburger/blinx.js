import { BibleVersions, BibleVersionCode, BibleVersionsInterface } from '../bible-versions/bible-versions.const';
import { LanguageCode } from '../options/languages';

export abstract class OnlineBible {
  protected readonly abstract availableVersionCodes: BibleVersionCode[];

  /** Return all available versions for this bible and (if provided) for the given language. */
  public getAvailableVersions(language?: LanguageCode): Partial<BibleVersionsInterface> {
    const allVersions = new BibleVersions();
    const availableVersions: Partial<BibleVersionsInterface> = {};
    for (const version in allVersions) {
      if (allVersions.hasOwnProperty(version)) {
        if (this.availableVersionCodes.indexOf(version as BibleVersionCode) > -1) {
          if (!language || language === (allVersions as any)[version].languageCode) {
            (availableVersions as any)[version] = (allVersions as any)[version];
          }
        }
      }
    }
    return availableVersions;
  }

  public abstract getPassageLink(osis: string, bibleVersion: BibleVersionCode): string;
}
