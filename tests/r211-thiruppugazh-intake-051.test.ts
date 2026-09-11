import { describe, expect, it } from 'vitest';
import batch051Raw from '@/content/intake/thiruppugazh-batch-051.json';
import sources from '@/content/sources.json';

const batch051 = batch051Raw;
const expectedOpenings = [
  'விரை சொரியும்', 'வேல் ஒத்து வென்றி', 'அடியார் மனம்', 'அடி இல் விடாப் பிணம்', 'அப்படி ஏழும் ஏழும்',
  'அயில் விலோசனம்', 'அருக்கி மெத்ததோள்', 'அரும்பினால் தனி', 'அலமலமிப் புலால்', 'அளகபாரமும் குலைந்து',
  'ஆசார வீனன்', 'ஆசைகூர் பத்தன்', 'ஆசைக் கொளுத்தி', 'ஆசை நேச மயக்கி', 'ஆல மேற்ற விழியினர்',
  'ஆலும் மயில் போல்', 'இடை இத்தனை', 'இரு குழை மீது', 'இருநோய் மலத்தை', 'இனமறை விதங்கள்',
  'ஊனேறெலும்பு', 'எதிரொருவர் இலை', 'எழுந்திடும்', 'ஏட்டிலே வரை', 'கச்சுப் பூட்டு',
] as const;

describe('R2.11 Thiruppugazh intake batch 051 — Project Madurai Part IV 1201–1225', () => {
  it('contains exactly the governed contiguous 1201–1225 sequence', () => {
    expect(batch051).toHaveLength(25);
    expect(batch051.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 1201 + index),
    );
    expect(batch051.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch051.at(0)?.id).toBe('thiruppugazh-1201');
    expect(batch051.at(0)?.openingWords).toBe('விரை சொரியும்');
    expect(batch051.at(-1)?.id).toBe('thiruppugazh-1225');
    expect(batch051.at(-1)?.openingWords).toBe('கச்சுப் பூட்டு');
  });

  it('remains on the governed Project Madurai Part IV source lane', () => {
    expect(batch051.every((song) => song.sourceId === 'MHS14')).toBe(true);
    expect(batch051.every((song) => song.edition === 'Project Madurai Part IV, verses 1001–1326')).toBe(true);
    expect(batch051.every((song) => song.sourceNumbering.system === 'Project Madurai Part IV')).toBe(true);
    const source = sources.find((entry) => entry.id === 'MHS14');
    expect(source).toMatchObject({
      reference: 'Project Madurai Thiruppugazh Part IV, verses 1001–1326',
      type: 'PUBLIC_UNICODE_EDITION',
      confidence: 'HIGH',
      url: 'https://www.projectmadurai.org/pm_etexts/utf8/pmuni0191.html',
      rights: 'HEADER_PRESERVATION_CONDITION_STATED',
    });
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch051) {
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

  it('locks the independently corroborated endpoints for this batch', () => {
    const song1201 = batch051.find((song) => song.id === 'thiruppugazh-1201');
    const song1225 = batch051.find((song) => song.id === 'thiruppugazh-1225');
    expect(song1201?.sourceNumbering.number).toBe(1201);
    expect(song1201?.openingWords).toBe('விரை சொரியும்');
    expect(song1225?.sourceNumbering.number).toBe(1225);
    expect(song1225?.openingWords).toBe('கச்சுப் பூட்டு');
  });

  it('starts immediately after the qualified 1200 runtime and remains inside Part IV', () => {
    expect(batch051.every((song) => song.sourceNumbering.number > 1200)).toBe(true);
    expect(batch051.every((song) => song.sourceNumbering.number <= 1326)).toBe(true);
  });
});
