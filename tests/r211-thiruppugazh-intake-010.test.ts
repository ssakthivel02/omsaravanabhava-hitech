import { describe, expect, it } from 'vitest';
import batch010 from '@/content/intake/thiruppugazh-batch-010.json';

describe('R2.11 Thiruppugazh intake batch 010', () => {
  it('locks the normalized contiguous 201-225 sequence', () => {
    expect(batch010).toHaveLength(25);
    expect(batch010.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 201 + index),
    );
  });

  it('preserves the duplicate-202 primary-source anomaly on normalized song 203', () => {
    const song203 = batch010.find((song) => song.id === 'thiruppugazh-0203');
    expect(song203?.openingWords).toBe('ஆனாத பிருதி');
    expect(song203?.sourceNumbering.number).toBe(203);
    expect(song203?.sourceNumberingVariant?.primaryPrintedLabel).toBe(202);
    expect(song203?.sourceNumberingVariant?.normalizedCatalogueNumber).toBe(203);
    expect(song203?.sourceNumberingVariant?.state).toBe('PRIMARY_DUPLICATE_LABEL_SECONDARY_SEQUENCE_CORROBORATED');
    expect(song203?.verificationState).toBe('SOURCE_VERIFIED_METADATA_ONLY_NUMBERING_VARIANT');
  });

  it('keeps every intake row metadata-only and fail-closed', () => {
    for (const song of batch010) {
      expect(song.sourceId).toBe('MHS1');
      expect(song.edition).toBe('Project Madurai Part I, verses 1–330');
      expect(song.rightsStatus).toBe('HEADER_PRESERVATION_CONDITION_STATED');
      expect(song.canonicalTextStatus).toBe('SOURCE_LINKED_TEXT_NOT_IMPORTED');
      expect(song.canonicalText).toBeNull();
      expect(song.meaningState).toBe('NOT_PUBLISHED');
      expect(song.transliterationState).toBe('NOT_PUBLISHED');
      expect(song.audioState).toBe('NO_APPROVED_AUDIO');
      expect(song.publicationState).toBe('INTAKE_VALIDATED_NOT_YET_PUBLIC');
    }
  });
});
