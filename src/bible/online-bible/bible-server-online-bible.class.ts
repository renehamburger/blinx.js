import { OnlineBible } from 'src/bible/online-bible/online-bible.class';
import { BibleVersionCode } from 'src/bible/models/bible-versions.const';
import { transformOsis } from 'src/helpers/osis';

export class BibleServerOnlineBible extends OnlineBible {
  public readonly title = 'BibleServer';
  public readonly url = 'https://www.bibleserver.com';
  public readonly docsUrl = this.url;

  protected readonly bibleVersionMap = {
    'ar.alab': 'ALAB',
    'bg.bgv': 'BGV',
    'bg.cbt': 'CBT',
    'cs.b21': 'B21',
    'cs.bkr': 'BKR',
    'cs.cep': 'CEP',
    'cs.snc': 'SNC',
    'da.dk': 'DK',
    'de.elb': 'ELB',
    'de.eu': 'EU',
    'de.gnb': 'GNB',
    'de.hfa': 'HFA',
    'de.lut': 'LUT',
    'de.meng': 'MENG',
    'de.neü': 'NeÜ',
    'de.ngü': 'NGÜ',
    'de.nlb': 'NLB',
    'de.slt': 'SLT',
    'de.zb': 'ZB',
    'en.esv': 'ESV',
    'en.kjv': 'KJV',
    'en.nirv': 'NIRV',
    'en.niv': 'NIV',
    'es.btx': 'BTX',
    'es.cst': 'CST',
    'es.nvi': 'NVI',
    'fa.fcb': 'FCB',
    'fr.bds': 'BDS',
    'fr.lsg': 'LSG',
    'fr.s21': 'S21',
    'he.ot': 'OT',
    'hr.ckk': 'CKK',
    'hu.hun': 'HUN',
    'hu.kar': 'KAR',
    'it.ita': 'ITA',
    'it.nrs': 'NRS',
    'grc.lxx': 'LXX',
    'la.vul': 'VUL',
    'nl.htb': 'HTB',
    'no.nor': 'NOR',
    'pl.psz': 'PSZ',
    'pt.prt': 'PRT',
    'ro.ntr': 'NTR',
    'ru.cars': 'CARS',
    'ru.rsz': 'RSZ',
    'sk.npk': 'NPK',
    'sv.bsv': 'BSV',
    'tr.tr': 'TR',
    'za.ccbt': 'CCBT',
    'za.cuvs': 'CUVS'
  };

  public buildPassageLink(osis: string, bibleVersion: BibleVersionCode): string {
    osis = transformOsis(osis);
    return `https://www.bibleserver.com/${bibleVersion.split('.')[1]}/${osis}`;
  }
}
