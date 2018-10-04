import { BibleVersionCode, BibleVersionsInterface, bibleVersions } from 'src/bible/models/bible-versions.const';
import { LanguageCode } from 'src/options/languages';

export type BibleVersionMap = {
  readonly [P in BibleVersionCode]?: string;
};

export abstract class Bible {
  public readonly abstract title: string;
  public readonly abstract url: string;
  protected readonly abstract bibleVersionMap: BibleVersionMap;

  /** Return all available versions for this bible and (if provided) for the given language. */
  public getAvailableVersions(language?: LanguageCode): Partial<BibleVersionsInterface> {
    const availableVersions: Partial<BibleVersionsInterface> = {};
    for (const version in bibleVersions) {
      if (bibleVersions.hasOwnProperty(version)) {
        // TODO: Use 'in' operator?
        // Also: this is called for every link and iterates through all versions: can be improved.
        if (Object.keys(this.bibleVersionMap).indexOf(version) > -1) {
          if (!language || language === bibleVersions[version as BibleVersionCode].languageCode) {
            availableVersions[version as BibleVersionCode] = bibleVersions[version as BibleVersionCode];
          }
        }
      }
    }
    return availableVersions;
  }
}
