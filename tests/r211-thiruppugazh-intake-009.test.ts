import { describe, expect, it } from 'vitest';
import batch009 from '@/content/intake/thiruppugazh-batch-009.json';

describe('R2.11 Thiruppugazh intake batch 009', () => {
  const expectedOpenings = [
    'புடவிக்கு அணி',
    'புடைசெப் பென',
    'பெரியதோர் கரி',
    'போதகம் தரு',
    'மந்தரமதெனவே',
    'மருமலரினன்',
    'மனக்கவலை ஏதும்',
    'மலரணி கொண்டை',
    'முகிலளகத்தில்',
    'முகை முளரி',
    'முதிரவுழையை',
    'முத்துக்கு',
    'மூலம் கிளர் ஓர்',
    'மூல மந்திரம்',
    'முருகுசெறி குழலவிழ',
    'முருகு செறிகுழல் முகில்',
    'வசனமிக ஏற்றி',
    'வஞ்சனை மிஞ்சி',
    'வரதா மணி நீ',
    'வனிதை உடல்',
    'வாதம் பித்தம்',
    'வாரணந் தனை',
    'விதம் இசைந்து',
    'விரை மருவு',
    'வேய் இசைந்து',
  ];

  it('locks the exact contiguous 176-200 source-number sequence', () => {
    expect(batch009).toHaveLength(25);
    expect(batch009.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 176 + index),
    );
    expect(batch009.at(0)?.sourceNumbering.number).toBe(176);
    expect(batch009.at(-1)?.sourceNumbering.number).toBe(200);
  });

  it('locks zero-padded IDs and reviewed Tamil opening labels', () => {
    expect(batch009.map((song) => song.id)).toEqual(
      Array.from({ length: 25 }, (_, index) => `thiruppugazh-${String(176 + index).padStart(4, '0')}`),
    );
    expect(batch009.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch009.map((song) => song.titleTa)).toEqual(expectedOpenings);
  });

  it('keeps every intake row metadata-only and fail-closed', () => {
    for (const song of batch009) {
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
