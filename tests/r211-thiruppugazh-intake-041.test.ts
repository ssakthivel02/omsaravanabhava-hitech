import { describe, expect, it } from 'vitest';
import batch041Raw from '@/content/intake/thiruppugazh-batch-041.json';

const batch041 = batch041Raw;
const expectedOpenings = [
  'கலைஞர் எணும் கற்பு', 'ஈர மோடு சிரித்து', 'தரங்க வார்குழல்', 'இலைச்சுருட் கொடு', 'உரைத்த சம்ப்ரம',
  'அலகு இல் அவுணரை', 'ஆனைமுகவற்கு', 'பரவு நெடுங்கதிர்', 'பழிப்பர் வாழ்த்துவர்', 'சீத வாசனை மலர்',
  'புருவச் செஞ்சிலை', 'முகமெலா நெய்', 'ஏலப் பனி நீர்', 'கலைமேவு ஞான', 'நீதத்துவமாகி',
  'மனநினை சுத்த', 'முத்து நவரத்நமணி', 'ஆடல் மதன் அம்பின்', 'கார் குழல் குலைந்து', 'வேனின் மதன் ஐந்து',
  'கரம் கமலம் மின்', 'கொந்தள வோலை குலு', 'சுரும்பு அணி', 'மாலையில் வந்து', 'ஏடுக்கொத் தாரலர்',
] as const;

describe('R2.11 Thiruppugazh intake batch 041 — Project Madurai Part III 951–975', () => {
  it('contains exactly the governed contiguous 951–975 sequence', () => {
    expect(batch041).toHaveLength(25);
    expect(batch041.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 951 + index),
    );
    expect(batch041.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch041.at(0)?.id).toBe('thiruppugazh-0951');
    expect(batch041.at(-1)?.id).toBe('thiruppugazh-0975');
    expect(batch041.at(-1)?.openingWords).toBe('ஏடுக்கொத் தாரலர்');
  });

  it('keeps every record on the governed Project Madurai Part III source lane', () => {
    expect(batch041.every((song) => song.sourceId === 'MHS13')).toBe(true);
    expect(batch041.every((song) => song.edition === 'Project Madurai Part III, verses 671–1000')).toBe(true);
    expect(batch041.every((song) => song.sourceNumbering.system === 'Project Madurai Part III')).toBe(true);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch041) {
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

  it('starts after the qualified 950 runtime and does not overrun this batch', () => {
    expect(batch041.every((song) => song.sourceNumbering.number > 950)).toBe(true);
    expect(batch041.every((song) => song.sourceNumbering.number <= 975)).toBe(true);
  });
});
