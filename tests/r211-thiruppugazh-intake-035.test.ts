import { describe, expect, it } from 'vitest';
import batch035Raw from '@/content/intake/thiruppugazh-batch-035.json';

const batch035 = batch035Raw;
const expectedOpenings = [
  'எந்தன்சடலங்கம்', 'இறையத்தனையோ', 'பனகப் படமிசைந்த', 'மகரக் குழைக்குளுந்து', 'சோதி மந்திரம்',
  'காதோடு தோடிகலி', 'குங்கும கற்பூர', 'பச்சை யொண்கிரி', 'தருவூரிசை', 'தலை நாளில் பதம்',
  'அன்னம் மிசை', 'இபமாந்தர் சக்ர', 'வங்கார மார்பிலணி', 'சித்தி ரத்திலுமி', 'குடல்நிண மென்பு',
  'கூசாதே பார்', 'கூர்வாய் நாராய்', 'பாலோ தேனோ பாகோ', 'நீதானெத்தனை', 'மகரம துகெட',
  'கரமு முளரியின்', 'பாலோ தேனோ பலவுறு', 'கலகவிழி மாமகளிர்', 'ஒருவழிபடாது', 'உரை ஒழிந்து',
] as const;

describe('R2.11 Thiruppugazh intake batch 035 — Project Madurai Part III 801–825', () => {
  it('contains exactly the governed contiguous 801–825 sequence', () => {
    expect(batch035).toHaveLength(25);
    expect(batch035.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 801 + index),
    );
    expect(batch035.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch035.at(0)?.id).toBe('thiruppugazh-0801');
    expect(batch035.at(-1)?.id).toBe('thiruppugazh-0825');
    expect(batch035.at(-1)?.openingWords).toBe('உரை ஒழிந்து');
  });

  it('keeps every record on the governed Project Madurai Part III source lane', () => {
    expect(batch035.every((song) => song.sourceId === 'MHS13')).toBe(true);
    expect(batch035.every((song) => song.edition === 'Project Madurai Part III, verses 671–1000')).toBe(true);
    expect(batch035.every((song) => song.sourceNumbering.system === 'Project Madurai Part III')).toBe(true);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch035) {
      expect(song.canonicalText).toBeNull();
      expect(song.canonicalTextStatus).toBe('SOURCE_LINKED_TEXT_NOT_IMPORTED');
      expect(song.attribution).toBe('SOURCE_VERIFIED_METADATA_ONLY');
      expect(song.verificationState).toBe('SOURCE_VERIFIED_METADATA_ONLY');
      expect(song.meaningState).toBe('NOT_PUBLISHED');
      expect(song.transliterationState).toBe('NOT_PUBLISHED');
      expect(song.audioState).toBe('NO_APPROVED_AUDIO');
      expect(song.publicationState).toBe('INTAKE_VALIDATED_NOT_YET_PUBLIC');
      expect(song.rightsStatus).toBe('HEADER_PRESERVATION_CONDITION_STATED');
      expect('venue' in song).toBe(false);
      expect('audioUrl' in song).toBe(false);
      expect('mediaUrl' in song).toBe(false);
    }
  });

  it('starts after the qualified 800 runtime and does not overrun this batch', () => {
    expect(batch035.every((song) => song.sourceNumbering.number > 800)).toBe(true);
    expect(batch035.every((song) => song.sourceNumbering.number <= 825)).toBe(true);
  });
});
