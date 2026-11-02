import { describe, expect, it } from 'vitest';
import batch007 from '@/content/intake/thiruppugazh-batch-007.json';

describe('R2.11 Thiruppugazh intake batch 007', () => {
  it('locks the exact 126-150 source-number sequence', () => {
    expect(batch007).toHaveLength(25);
    expect(batch007.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => index + 126),
    );
    expect(batch007.map((song) => song.id)).toEqual(
      Array.from({ length: 25 }, (_, index) => `thiruppugazh-${String(index + 126).padStart(4, '0')}`),
    );
  });

  it('locks reviewed source-backed opening labels for 126-150', () => {
    expect(batch007.map((song) => song.openingWords)).toEqual([
      'கடலைச் சிறை',
      'கடலை பொரியவரை',
      'கதியை விலக்கு',
      'கரிய பெரிய',
      'கரிய மேகமதோ',
      'கரியிணை கோடென',
      'கருகி அகன்று',
      'கருப்புவிலில்',
      'கருவின் உருவாகி',
      'கலக வாள்விழி',
      'கலகக் கயல்விழி',
      'கலவியி லிச்சி',
      'கலை கொடு',
      'களப முலையை',
      'கறுத்த குழலணி',
      'கனக கும்பம்',
      'கனத்திறுகி',
      'கனமாய் எழுந்து',
      'கார் அணிந்த',
      'குரம்பை மலசலம்',
      'குருதி மலசலம்',
      'குழல் அடவி',
      'குழல்கள் சரிய',
      'குறித்தமணி',
      'குன்றுங் குன்றும்',
    ]);
  });

  it('keeps every row metadata-only and fail-closed', () => {
    for (const song of batch007) {
      expect(song.titleTa).toBe(song.openingWords);
      expect(song.canonicalText).toBeNull();
      expect(song.canonicalTextStatus).toBe('SOURCE_LINKED_TEXT_NOT_IMPORTED');
      expect(song.attribution).toBe('SOURCE_VERIFIED_METADATA_ONLY');
      expect(song.sourceId).toBe('MHS1');
      expect(song.edition).toBe('Project Madurai Part I, verses 1–330');
      expect(song.sourceNumbering.system).toBe('Project Madurai Part I');
      expect(song.rightsStatus).toBe('HEADER_PRESERVATION_CONDITION_STATED');
      expect(song.verificationState).toBe('SOURCE_VERIFIED_METADATA_ONLY');
      expect(song.meaningState).toBe('NOT_PUBLISHED');
      expect(song.transliterationState).toBe('NOT_PUBLISHED');
      expect(song.audioState).toBe('NO_APPROVED_AUDIO');
      expect(song.publicationState).toBe('INTAKE_VALIDATED_NOT_YET_PUBLIC');
    }
  });

  it('starts immediately after the qualified 125-record runtime boundary', () => {
    expect(batch007[0]?.id).toBe('thiruppugazh-0126');
    expect(batch007[0]?.openingWords).toBe('கடலைச் சிறை');
    expect(batch007.at(-1)?.id).toBe('thiruppugazh-0150');
    expect(batch007.at(-1)?.openingWords).toBe('குன்றுங் குன்றும்');
  });
});
