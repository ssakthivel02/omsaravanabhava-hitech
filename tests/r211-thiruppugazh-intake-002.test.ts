import { describe, expect, it } from 'vitest';
import batch from '@/content/intake/thiruppugazh-batch-002.json';

const expectedOpenings = [
  'மன்றலங் கொந்துமிசை',
  'வடத்தை மிஞ்சிய',
  'வரைத்தடங் கொங்கை',
  'அங்கை மென்குழல்',
  'அந்தகன் வருந்தினம்',
  'அமுத உததி விடம்',
  'அம்பொத்த விழி',
  'அருணமணி மேவு',
  'அவனி பெறுந்தோடு',
  'அளக பாரமலைந்து',
  'அறிவழிய மயல்பெருக',
  'அனிச்சம் கார்முகம்',
  'அனைவரும் மருண்டு',
] as const;

describe('R2.11 Thiruppugazh intake batch 002', () => {
  it('contains exactly songs 18 through 30 in source order', () => {
    expect(batch.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 13 }, (_, index) => index + 18),
    );
    expect(batch.map((song) => song.id)).toEqual(
      Array.from({ length: 13 }, (_, index) => `thiruppugazh-${String(index + 18).padStart(4, '0')}`),
    );
  });

  it('locks the reviewed Tamil opening labels for this intake', () => {
    expect(batch.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch.map((song) => song.titleTa)).toEqual(expectedOpenings);
  });

  it('keeps every row metadata-only and fail-closed for text, meaning and audio', () => {
    for (const song of batch) {
      expect(song.sourceId).toBe('MHS1');
      expect(song.edition).toBe('Project Madurai Part I, verses 1–330');
      expect(song.sourceNumbering.system).toBe('Project Madurai Part I');
      expect(song.rightsStatus).toBe('HEADER_PRESERVATION_CONDITION_STATED');
      expect(song.verificationState).toBe('SOURCE_VERIFIED_METADATA_ONLY');
      expect(song.canonicalTextStatus).toBe('SOURCE_LINKED_TEXT_NOT_IMPORTED');
      expect(song.canonicalText).toBeNull();
      expect(song.meaningState).toBe('NOT_PUBLISHED');
      expect(song.transliterationState).toBe('NOT_PUBLISHED');
      expect(song.audioState).toBe('NO_APPROVED_AUDIO');
      expect(song.publicationState).toBe('INTAKE_VALIDATED_NOT_YET_PUBLIC');
    }
  });

  it('does not overlap batch 001 numbering', () => {
    expect(Math.min(...batch.map((song) => song.sourceNumbering.number))).toBe(18);
  });
});
