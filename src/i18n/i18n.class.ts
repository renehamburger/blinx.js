import get = require('lodash/get');
import { Languages } from 'src/options/languages';

export interface Translations {
  [key: string]: string | Translations;
}

export class I18n {
  private readonly translations: Translations = require('./translations.json');
  private languageCode: keyof Languages = 'en';

  public setLanguage(languageCode: keyof Languages) {
    this.languageCode = languageCode;
  }

  public translate<T extends Translations[string] = string>(
    key: string,
    interpolations?: { [label: string]: string }
  ): T {
    let translation = (get(this.translations, `${this.languageCode}.${key}`) ||
      get(this.translations, `en.${key}`)) as string;
    if (interpolations) {
      translation = translation.replace(/\{\{ *(\w+) *\}\}/gi, (_match, label) => {
        if (label in interpolations) {
          return interpolations[label];
        }
        console.error(`Interpolation '{{${label}}}' missing for translation '${translation}'`);
        return label;
      });
    }
    return translation as T;
  }
}
