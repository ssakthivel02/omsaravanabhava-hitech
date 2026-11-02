import { describe, expect, it } from 'vitest';
import batch from '@/content/intake/thiruppugazh-batch-005.json';

const expectedOpenings = [
  'படர்புவியின் மீது',
  'பதும இருசரண்',
  'பரிமள களப',
  'பருத்தந்த',
  'பாத நூபுரம்',
  'புகரப் புங்க',
  'பூரண வார கும்ப',
  'பெருக்கச் சஞ்சலித்து',
  'மங்கை சிறுவர்',
  'மஞ்செனுங் குழல்',
  'மனத்தின் பங்கு',
  'மனைகனக மைந்தர்',
  'மாய வாடை',
  'மான்போல் கண்',
  'முகிலாமெனும்',
  'முந்துதமிழ் மாலை',
  'முலை முகம்',
  'மூப்புற்றுச் செவி',
  'மூளும்வினை சேர',
  'வஞ்சங்கொண்டும்',
  'வஞ்சத்துடன் ஒரு',
  'வந்து வந்து முன்',
  'வரியார் கருங்கண்',
  'விதி போலும் உந்து',
  'விந்ததில் ஊறி',
] as const;

describe('R2.11 Thiruppugazh intake batch 005', () => {
  it('contains exactly songs 76 through 100 in source order', () => {
    expect(batch.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => index + 76),
    );
    expect(batch.map((song) => song.id)).toEqual(
      Array.from({ length: 25 }, (_, index) => `thiruppugazh-${String(index + 76).padStart(4, '0')}`),
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

  it('begins immediately after the qualified 75-record runtime boundary', () => {
    expect(Math.min(...batch.map((song) => song.sourceNumbering.number))).toBe(76);
    expect(Math.max(...batch.map((song) => song.sourceNumbering.number))).toBe(100);
  });
});
