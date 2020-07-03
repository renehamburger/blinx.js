import { OnlineBible } from 'src/bible/online-bible/online-bible.class';
import { BibleVersionCode } from 'src/bible/models/bible-versions.const';
import { transformOsis } from 'src/helpers/osis';

export class BibleServerOnlineBible extends OnlineBible {
  public readonly title = 'BibleServer';
  public readonly url = 'https://www.bibleserver.com';

  protected readonly bibleVersionMap = {
    'ar.ALAB': 'ALAB',
    'bg.BGV': 'BGV',
    'bg.CBT': 'CBT',
    'cs.B21': 'B21',
    'cs.BKR': 'BKR',
    'cs.CEP': 'CEP',
    'cs.SNC': 'SNC',
    'da.DK': 'DK',
    'de.ELB': 'ELB',
    'de.EU': 'EU',
    'de.GNB': 'GNB',
    'de.HFA': 'HFA',
    'de.LUT': 'LUT',
    'de.MENG': 'MENG',
    'de.NeÜ': 'NeÜ',
    'de.NGÜ': 'NGÜ',
    'de.NLB': 'NLB',
    'de.SLT': 'SLT',
    'de.ZB': 'ZB',
    'en.ESV': 'ESV',
    'en.KJV': 'KJV',
    'en.NIRV': 'NIRV',
    'en.NIV': 'NIV',
    'es.BTX': 'BTX',
    'es.CST': 'CST',
    'es.NVI': 'NVI',
    'fa.FCB': 'FCB',
    'fr.BDS': 'BDS',
    'fr.LSG': 'LSG',
    'fr.S21': 'S21',
    'he.OT': 'OT',
    'hr.CKK': 'CKK',
    'hu.HUN': 'HUN',
    'hu.KAR': 'KAR',
    'it.ITA': 'ITA',
    'it.NRS': 'NRS',
    'grc.LXX': 'LXX',
    'la.VUL': 'VUL',
    'nl.HTB': 'HTB',
    'no.NOR': 'NOR',
    'pl.PSZ': 'PSZ',
    'pt.PRT': 'PRT',
    'ro.NTR': 'NTR',
    'ru.CARS': 'CARS',
    'ru.RSZ': 'RSZ',
    'sk.NPK': 'NPK',
    'sv.BSV': 'BSV',
    'tr.TR': 'TR',
    'za.CCBT': 'CCBT',
    'za.CUVS': 'CUVS'
  };

  public buildPassageLink(osis: string, bibleVersion: BibleVersionCode): string {
    osis = transformOsis(osis);
    return `https://www.bibleserver.com/text/${bibleVersion.split('.')[1]}/${osis}`;
  }
}
