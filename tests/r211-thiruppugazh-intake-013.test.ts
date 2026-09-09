import { describe, expect, it } from 'vitest';
import batch013 from '@/content/intake/thiruppugazh-batch-013.json';

describe('R2.11 Thiruppugazh intake batch 013', () => {
  const expectedOpenings = [
    'தொடத்துளக்கிகள்', 'நிலையாத சமுத்திர', 'நினைத்தது எத்தனை', 'பகல் இராவினும்', 'பருத்தபற் சிரத்தினை',
    'பழமை செப்பிய', 'புருவ நெறித்து', 'பூசலிட்டு', 'பெருக்க உபாயம்', 'பொரியப் பொரிய',
    'பொருவிக் கந்தொடு', 'பொற்குடம் ஒத்த', 'பொற் பதத்தினை', 'மருக்குல மேவும்', 'மலை முலைச்சியர்',
    'முகத்தை மினுக்கி', 'முகிலும் இரவியும்', 'முடித்த குழலினர்', 'முத்துத் தெறிக்க', 'முலைபுளகம் எழ',
    'மொகுமொகு என', 'வங்கம் பெறு', 'வட்ட வாள் தன', 'வரிக் கலையின்', 'வார் உற்று எழும்',
  ];

  it('locks the exact contiguous 276-300 source-number sequence', () => {
    expect(batch013).toHaveLength(25);
    expect(batch013.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 276 + index),
    );
    expect(batch013.map((song) => song.id)).toEqual(
      Array.from({ length: 25 }, (_, index) => `thiruppugazh-${String(276 + index).padStart(4, '0')}`),
    );
    expect(batch013.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch013.map((song) => song.titleTa)).toEqual(expectedOpenings);
  });

  it('keeps every intake row metadata-only and fail-closed', () => {
    for (const song of batch013) {
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
});
