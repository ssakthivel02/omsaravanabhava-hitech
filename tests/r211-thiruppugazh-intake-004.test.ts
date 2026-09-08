import { describe, expect, it } from 'vitest';
import batch from '@/content/intake/thiruppugazh-batch-004.json';

const expectedOpenings = [
  'கொங்கைப் பணை',
  'கொடியனைய இடை',
  'கொம்பனையார்',
  'கொலை மதகரி',
  'சங்குபோல் மென்',
  'சங்கை தான் ஒன்று',
  'சத்தம் மிகு ஏழு',
  'சந்தன சவ்வாது',
  'சேமக் கோமள',
  'தகரநறை',
  'தண் தேனுண்டே',
  'தண்டை அணி',
  'தந்த பசிதனை',
  'தரிக்குங்கலை',
  'துன்பங்கொண்டு அங்கம்',
  'தெருப்புறத்து',
  'தொடரியமன்',
  'தொந்தி சரிய',
  'தோலொடு மூடிய',
  'நாலும் ஐந்து வாசல்',
  'நிதிக்குப் பிங்கலன்',
  'நிலையாப் பொருளை',
  'நிறுக்குஞ் சூதன',
  'பங்கம் மேவும் பிறப்பு',
  'பஞ்ச பாதகம்',
] as const;

describe('R2.11 Thiruppugazh intake batch 004', () => {
  it('contains exactly songs 51 through 75 in source order', () => {
    expect(batch.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => index + 51),
    );
    expect(batch.map((song) => song.id)).toEqual(
      Array.from({ length: 25 }, (_, index) => `thiruppugazh-${String(index + 51).padStart(4, '0')}`),
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

  it('begins immediately after the qualified 50-record runtime boundary', () => {
    expect(Math.min(...batch.map((song) => song.sourceNumbering.number))).toBe(51);
    expect(Math.max(...batch.map((song) => song.sourceNumbering.number))).toBe(75);
  });
});
