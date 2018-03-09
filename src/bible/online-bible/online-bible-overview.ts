import { OnlineBible } from 'src/bible/online-bible/online-bible.class';
import { BibleServerOnlineBible } from 'src/bible/online-bible/bible-server-online-bible.class';

export type OnlineBibleName = 'BibleServer';

export function getOnlineBible(name: OnlineBibleName): OnlineBible {
  return name === 'BibleServer' ? new BibleServerOnlineBible() : new BibleServerOnlineBible();
}
