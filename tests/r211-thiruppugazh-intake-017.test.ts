import { describe, expect, it } from 'vitest';
import batch017Raw from '@/content/intake/thiruppugazh-batch-017.json';

const batch017 = batch017Raw;
const expectedOpenings = [
  'வாய்ந்தப்பிடை', 'அறிவிலாப் பித்தர்', 'அஞ்சன வேல்விழி இட்டு', 'அம்புலி நீரை', 'அனித்தமான ஊன்',
  'ஆரமணி வாரை', 'ஆலம் வைத்த', 'உரைக் காரிகை', 'ஓல மறைகள்', 'கரு முகில்',
  'காவிப் பூவை', 'குருதி புலால் என்பு', 'நாடித் தேடி', 'நிறைந்த துப்பிதழ்', 'பரிமளம் மிக உள',
  'வேலைப்போல் விழி', 'குமர குருபர குணதர', 'அருவ மிடையென', 'கருணை சிறிதும்', 'துகிலு ம்ருகமத',
  'மகர மெறிகடல்', 'முகிலை யிகல்', 'முருகு செறிகுழல் சொரு', 'விடமும் அமுதமும்', 'கமரி மலர்குழல்',
] as const;

describe('R2.11 Thiruppugazh intake batch 017 — Project Madurai Part II 351–375', () => {
  it('contains exactly the governed contiguous 351–375 sequence', () => {
    expect(batch017).toHaveLength(25);
    expect(batch017.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 351 + index),
    );
    expect(batch017.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch017.at(0)?.id).toBe('thiruppugazh-0351');
    expect(batch017.at(-1)?.id).toBe('thiruppugazh-0375');
    expect(batch017.at(-1)?.openingWords).toBe('கமரி மலர்குழல்');
  });

  it('stays on the dedicated Project Madurai Part II provenance lane', () => {
    expect(batch017.every((song) => song.sourceId === 'MHS12')).toBe(true);
    expect(batch017.every((song) => song.sourceNumbering.system === 'Project Madurai Part II')).toBe(true);
    expect(batch017.every((song) => song.edition === 'Project Madurai Part II, verses 331–670')).toBe(true);
    expect(batch017.some((song) => song.sourceId === 'MHS1')).toBe(false);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch017) {
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

  it('starts after the qualified 350 runtime and does not overrun this batch', () => {
    expect(batch017.every((song) => song.sourceNumbering.number > 350)).toBe(true);
    expect(batch017.every((song) => song.sourceNumbering.number <= 375)).toBe(true);
  });
});
