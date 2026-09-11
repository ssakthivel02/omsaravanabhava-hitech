import { describe, expect, it } from 'vitest';
import batch054Raw from '@/content/intake/thiruppugazh-batch-054.json';
import sources from '@/content/sources.json';

const batch054 = batch054Raw;
const expectedOpenings = [
  'வரிபரந் திரண்டு', 'வரிவிழி பூசலாட', 'விழையும் மனிதரை', 'வீணை இசை', 'வேலை வாளை',
  'இத்தரணி மீதில்', 'என்பந்த வினை', 'கருப்பற்று ஊறி', 'கருப்பையில்', 'கொடிய மதவேள்',
  'கோடான மேருமலை', 'சமய பத்தி', 'சருவிய சாத்திர', 'சினத்துச் சீறிய', 'தீது உற்றே எழு',
  'துள்ளு மதவேள்', 'தேன் இயல் சொற்', 'நாரியர்கள் ஆசை', 'நாளு மிகுத்த', 'நித்தம் உற்றுனை',
  'நீலங்கொள்', 'பட்டுப் படாத', 'பரவைக்கு எத்தனை', 'பிறவியலை', 'புத்தகத்து ஏட்டில்',
] as const;

describe('R2.11 Thiruppugazh intake batch 054 — Project Madurai Part IV 1276–1300', () => {
  it('contains exactly the governed contiguous 1276–1300 sequence', () => {
    expect(batch054).toHaveLength(25);
    expect(batch054.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 1276 + index),
    );
    expect(batch054.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch054.at(0)?.id).toBe('thiruppugazh-1276');
    expect(batch054.at(0)?.openingWords).toBe('வரிபரந் திரண்டு');
    expect(batch054.at(-1)?.id).toBe('thiruppugazh-1300');
    expect(batch054.at(-1)?.openingWords).toBe('புத்தகத்து ஏட்டில்');
  });

  it('remains on the governed Project Madurai Part IV source lane', () => {
    expect(batch054.every((song) => song.sourceId === 'MHS14')).toBe(true);
    expect(batch054.every((song) => song.edition === 'Project Madurai Part IV, verses 1001–1326')).toBe(true);
    expect(batch054.every((song) => song.sourceNumbering.system === 'Project Madurai Part IV')).toBe(true);
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
    for (const song of batch054) {
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
    const song1276 = batch054.find((song) => song.id === 'thiruppugazh-1276');
    const song1300 = batch054.find((song) => song.id === 'thiruppugazh-1300');
    expect(song1276?.sourceNumbering.number).toBe(1276);
    expect(song1276?.openingWords).toBe('வரிபரந் திரண்டு');
    expect(song1300?.sourceNumbering.number).toBe(1300);
    expect(song1300?.openingWords).toBe('புத்தகத்து ஏட்டில்');
  });

  it('starts immediately after the qualified 1275 runtime and remains inside Part IV', () => {
    expect(batch054.every((song) => song.sourceNumbering.number > 1275)).toBe(true);
    expect(batch054.every((song) => song.sourceNumbering.number <= 1326)).toBe(true);
  });
});