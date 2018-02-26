import { OnlineBible } from './online-bible.class';
import { BibleServerOnlineBible } from './bible-server-online-bible.class';

export type OnlineBibleName = 'BibleServer';

export function getOnlineBible(name: OnlineBibleName): OnlineBible {
  return name === 'BibleServer' ? new BibleServerOnlineBible() : new BibleServerOnlineBible();
}
