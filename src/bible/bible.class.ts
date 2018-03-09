import { BibleVersions, BibleVersionCode, BibleVersionsInterface } from 'src/bible/versions/bible-versions.const';
import { LanguageCode } from 'src/options/languages';

export type BibleVersionMap = {
  readonly [P in BibleVersionCode]?: string;
};

export abstract class Bible {
  protected readonly abstract bibleVersionMap: BibleVersionMap;

  /** Return all available versions for this bible and (if provided) for the given language. */
  public getAvailableVersions(language?: LanguageCode): Partial<BibleVersionsInterface> {
    const allVersions = new BibleVersions();
    const availableVersions: Partial<BibleVersionsInterface> = {};
    for (const version in allVersions) {
      if (allVersions.hasOwnProperty(version)) {
        if (Object.keys(this.bibleVersionMap).indexOf(version) > -1) {
          if (!language || language === (allVersions as any)[version].languageCode) {
            (availableVersions as any)[version] = (allVersions as any)[version];
          }
        }
      }
    }
    return availableVersions;
  }
}
