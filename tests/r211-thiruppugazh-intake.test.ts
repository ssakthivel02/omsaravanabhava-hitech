import { describe, expect, it } from 'vitest';
import batch from '@/content/intake/thiruppugazh-batch-001.json';

describe('R2.11 Thiruppugazh intake batch 001', () => {
  it('contains exactly songs 1 through 5 in source order', () => {
    expect(batch.map((song) => song.sourceNumbering.number)).toEqual([1, 2, 3, 4, 5]);
    expect(batch.map((song) => song.id)).toEqual([
      'thiruppugazh-0001',
      'thiruppugazh-0002',
      'thiruppugazh-0003',
      'thiruppugazh-0004',
      'thiruppugazh-0005',
    ]);
  });

  it('keeps the intake metadata-only and fail-closed for text, meaning and audio', () => {
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

  it('has non-empty Tamil opening metadata for every intake row', () => {
    for (const song of batch) {
      expect(song.openingWords.trim().length).toBeGreaterThan(0);
      expect(song.titleTa.trim().length).toBeGreaterThan(0);
    }
  });
});
