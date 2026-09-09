import { describe, expect, it } from 'vitest';
import batch012 from '@/content/intake/thiruppugazh-batch-012.json';

describe('R2.11 Thiruppugazh intake batch 012', () => {
  const expectedOpenings = [
    'ஏது புத்தி', 'ஓலை இட்ட', 'கச்சணி இளமுலை', 'கடற்செகத் தடக்கி', 'கரிக்குழல் விரித்தும்',
    'கலை மடவார்தம்', 'கவடுற்ற சித்தர்', 'கனத்த அற', 'கனைத்து அதிர்க்கும்', 'கிரி உலாவிய',
    'கிறி மொழி', 'குயில் ஒன்று', 'குருவி என', 'குலைத்து மயிர்', 'குவளைக் கணை',
    'கூந்தல் அவிழ்த்து', 'கூர்வேல் பழித்த', 'கொந்துவார் குரவடி', 'சினத்தவர் முடிக்கும்', 'சினத் திலத் தினை',
    'சொரியும் முகிலை', 'தாக்கு அமருக்கு', 'திருட்டு நாரிகள்', 'துப் பார் அப்பு', 'தொக்கறாக் குடில்',
  ];

  it('locks the exact contiguous 251-275 source-number sequence', () => {
    expect(batch012).toHaveLength(25);
    expect(batch012.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 251 + index),
    );
    expect(batch012.map((song) => song.id)).toEqual(
      Array.from({ length: 25 }, (_, index) => `thiruppugazh-${String(251 + index).padStart(4, '0')}`),
    );
    expect(batch012.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch012.map((song) => song.titleTa)).toEqual(expectedOpenings);
  });

  it('keeps every intake row metadata-only and fail-closed', () => {
    for (const song of batch012) {
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
