import { describe, expect, it } from 'vitest';
import batch036Raw from '@/content/intake/thiruppugazh-batch-036.json';

const batch036 = batch036Raw;
const expectedOpenings = [
  'கன்ன லொத்த', 'புலவரை ரக்ஷி', 'ஓலமிட்டிரைத்து', 'மார்பு ரம்பினளி', 'விழுதாதெனவே',
  'உரமுற் றிரு', 'ஓங்கும் ஐம்புல', 'கடல் ஒத்த விடம்', 'மைக்குழல் ஒத்த', 'சந்தனந்திமிர்ந்து',
  'அயிலார் மைக்கடு', 'சுருதியாய்', 'தொடுத்த நாள்முதல்', 'சூழும்வினை', 'சேலை உடுத்து',
  'நூலினை ஒத்த', 'நீல முகில் ஆன', 'இரத்த முஞ்சி', 'வரித்த குங்குமம்', 'முகர வண்டெழு',
  'மலைக் கனத்தென', 'எருவாய் கருவாய்', 'சொற்பிழை வராமல்', 'கருத் திதப்படு', 'இதசந்தன புழுகு',
] as const;

describe('R2.11 Thiruppugazh intake batch 036 — Project Madurai Part III 826–850', () => {
  it('contains exactly the governed contiguous 826–850 sequence', () => {
    expect(batch036).toHaveLength(25);
    expect(batch036.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 826 + index),
    );
    expect(batch036.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch036.at(0)?.id).toBe('thiruppugazh-0826');
    expect(batch036.at(-1)?.id).toBe('thiruppugazh-0850');
    expect(batch036.at(-1)?.openingWords).toBe('இதசந்தன புழுகு');
  });

  it('keeps every record on the governed Project Madurai Part III source lane', () => {
    expect(batch036.every((song) => song.sourceId === 'MHS13')).toBe(true);
    expect(batch036.every((song) => song.edition === 'Project Madurai Part III, verses 671–1000')).toBe(true);
    expect(batch036.every((song) => song.sourceNumbering.system === 'Project Madurai Part III')).toBe(true);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch036) {
      expect(song.canonicalText).toBeNull();
      expect(song.canonicalTextStatus).toBe('SOURCE_LINKED_TEXT_NOT_IMPORTED');
      expect(song.attribution).toBe('SOURCE_VERIFIED_METADATA_ONLY');
      expect(song.verificationState).toBe('SOURCE_VERIFIED_METADATA_ONLY');
      expect(song.meaningState).toBe('NOT_PUBLISHED');
      expect(song.transliterationState).toBe('NOT_PUBLISHED');
      expect(song.audioState).toBe('NO_APPROVED_AUDIO');
      expect(song.publicationState).toBe('INTAKE_VALIDATED_NOT_YET_PUBLIC');
      expect(song.rightsStatus).toBe('HEADER_PRESERVATION_CONDITION_STATED');
      expect('venue' in song).toBe(false);
      expect('audioUrl' in song).toBe(false);
      expect('mediaUrl' in song).toBe(false);
    }
  });

  it('starts after the qualified 825 runtime and does not overrun this batch', () => {
    expect(batch036.every((song) => song.sourceNumbering.number > 825)).toBe(true);
    expect(batch036.every((song) => song.sourceNumbering.number <= 850)).toBe(true);
  });
});
