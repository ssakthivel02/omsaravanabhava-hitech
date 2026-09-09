import { describe, expect, it } from 'vitest';
import batch015 from '@/content/intake/thiruppugazh-batch-015.json';

const expectedOpenings = [
  'கடத்தைப் பற்று',
  'கருப் பற்றிப் பருத்து',
  'கறுக்கப் பற்று',
  'அற்றைக்கு இரைதேடி',
  'முட்டுப் பட்டு',
] as const;

describe('R2.11 Thiruppugazh intake batch 015 — Project Madurai Part I closure', () => {
  it('locks the exact contiguous 326-330 sequence and normalized Tamil openings', () => {
    expect(batch015).toHaveLength(5);
    expect(batch015.map((song) => song.sourceNumbering.number)).toEqual([326, 327, 328, 329, 330]);
    expect(batch015.map((song) => song.id)).toEqual([
      'thiruppugazh-0326', 'thiruppugazh-0327', 'thiruppugazh-0328', 'thiruppugazh-0329', 'thiruppugazh-0330',
    ]);
    expect(batch015.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch015.map((song) => song.titleTa)).toEqual(expectedOpenings);
  });

  it('closes Project Madurai Part I at song 330 without crossing into Part II', () => {
    expect(batch015.at(0)?.sourceNumbering.system).toBe('Project Madurai Part I');
    expect(batch015.at(-1)?.sourceNumbering.number).toBe(330);
    expect(batch015.some((song) => song.sourceNumbering.number > 330)).toBe(false);
  });

  it('keeps every intake row metadata-only and fail-closed', () => {
    for (const song of batch015) {
      expect(song.sourceId).toBe('MHS1');
      expect(song.edition).toBe('Project Madurai Part I, verses 1–330');
      expect(song.rightsStatus).toBe('HEADER_PRESERVATION_CONDITION_STATED');
      expect(song.canonicalTextStatus).toBe('SOURCE_LINKED_TEXT_NOT_IMPORTED');
      expect(song.canonicalText).toBeNull();
      expect(song.attribution).toBe('SOURCE_VERIFIED_METADATA_ONLY');
      expect(song.verificationState).toBe('SOURCE_VERIFIED_METADATA_ONLY');
      expect(song.meaningState).toBe('NOT_PUBLISHED');
      expect(song.transliterationState).toBe('NOT_PUBLISHED');
      expect(song.audioState).toBe('NO_APPROVED_AUDIO');
      expect(song.publicationState).toBe('INTAKE_VALIDATED_NOT_YET_PUBLIC');
    }
  });
});
