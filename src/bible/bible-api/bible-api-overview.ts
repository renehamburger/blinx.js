import { GetBibleBibleApi } from 'src/bible/bible-api/get-bible-bible-api.class';
import { BibleApi } from 'src/bible/bible-api/bible-api.class';

export type BibleApiName = 'getBible';

export function getBibleApi(name: BibleApiName): BibleApi {
  return name === 'getBible' ? new GetBibleBibleApi() : new GetBibleBibleApi();
}
