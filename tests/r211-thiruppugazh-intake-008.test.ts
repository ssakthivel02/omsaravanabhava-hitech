import { describe, expect, it } from 'vitest';
import batch008 from '@/content/intake/thiruppugazh-batch-008.json';

describe('R2.11 Thiruppugazh intake batch 008', () => {
  const expectedOpenings = [
    'கொந்துத் தரு',
    'கோல குங்கும',
    'கோல மதிவதனம்',
    'சகடத்திற் குழை',
    'சிந்துர கூரம',
    'சிவனார் மனங்குளிர',
    'சிறு பறையும்',
    'சீ உதிரம் எங்கும்',
    'சீறல் அசடன்',
    'சுருதி முடி மோனம்',
    'சுருளளக பார',
    'ஞானங்கொள்',
    'தகர நறுமலர்',
    'தகைமைத் தனியில்',
    'தமரும் அமரும்',
    'தலைவலி மருத்தீடு',
    'திடமிலி சற்குணமிலி',
    'திமிர உததி',
    'தோகைமயிலே கமல',
    'நாத விந்து',
    'நிகமம் எனில்',
    'நெற்றி வெயர்த்துளி',
    'பகர்தற்கு அரிதான',
    'பஞ்ச பாதகன்',
    'பாரியான கொடை',
  ];

  it('locks the exact contiguous 151-175 source-number sequence', () => {
    expect(batch008).toHaveLength(25);
    expect(batch008.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 151 + index),
    );
    expect(batch008.at(0)?.sourceNumbering.number).toBe(151);
    expect(batch008.at(-1)?.sourceNumbering.number).toBe(175);
  });

  it('locks zero-padded IDs and reviewed Tamil opening labels', () => {
    expect(batch008.map((song) => song.id)).toEqual(
      Array.from({ length: 25 }, (_, index) => `thiruppugazh-${String(151 + index).padStart(4, '0')}`),
    );
    expect(batch008.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch008.map((song) => song.titleTa)).toEqual(expectedOpenings);
  });

  it('keeps every intake row metadata-only and fail-closed', () => {
    for (const song of batch008) {
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
