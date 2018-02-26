import { OnlineBible } from './online-bible.class';
import { BibleVersionCode } from '../bible-versions/bible-versions.const';

export class BibleServerOnlineBible extends OnlineBible {

  protected readonly availableVersionCodes: BibleVersionCode[] = [
    'ar.ALAB', 'bg.BGV', 'bg.CBT', 'cs.B21', 'cs.BKR', 'cs.CEP', 'cs.SNC', 'da.DK', 'de.ELB', 'de.EU', 'de.GNB', 'de.HFA', 'de.LUT', 'de.MENG', 'de.NeÜ', 'de.NGÜ', 'de.NLB', 'de.SLT', 'de.ZB', 'en.ESV', 'en.KJV', 'en.NIRV', 'en.NIV', 'es.BTX', 'es.CST', 'es.NVI', 'fa.FCB', 'fr.BDS', 'fr.LSG', 'fr.S21', 'he.OT', 'hr.CKK', 'hu.HUN', 'hu.KAR', 'it.ITA', 'it.NRS', 'la.LXX', 'la.VUL', 'nl.HTB', 'no.NOR', 'pl.PSZ', 'pt.PRT', 'ro.NTR', 'ru.CARS', 'ru.RSZ', 'sk.NPK', 'sv.BSV', 'tr.TR', 'za.CCBT', 'za.CUVS'];

  public getPassageLink(osis: string, bibleVersion: BibleVersionCode): string {
    // Fixes for sequences
    const sequenceIndex = osis.indexOf('-');
    if (sequenceIndex > 0) {
      // Remove duplicate book from sequences
      const book = osis.split('.')[0];
      osis = osis.replace(new RegExp(`-${book}.`, 'i'), '-');
    }
    return `https://www.bibleserver.com/text/${bibleVersion.split('.')[1]}/${osis}`;
  }
}
