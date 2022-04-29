import { GetbibleBibleApi } from 'src/bible/bible-api/getbible-bible-api.class';
import { BibleApi } from 'src/bible/bible-api/bible-api.class';

export type BibleApiName = 'getbible';

export function getBibleApi(name: BibleApiName): BibleApi {
  return name.toLowerCase() === 'getbible' ? new GetbibleBibleApi() : new GetbibleBibleApi();
}
