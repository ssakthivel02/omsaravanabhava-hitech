import { describe, expect, it } from 'vitest';
import batch033Raw from '@/content/intake/thiruppugazh-batch-033.json';

const batch033 = batch033Raw;
const expectedOpenings = [
  'திருமொழி', 'பசை அற்ற உடல்', 'குரைகடல் உலகினில்', 'அஞ்சுவித பூதமும்', 'நாட்டம் தங்கி',
  'வாட்டியெனை', 'வாருமிங்கே', 'கறுவி மைக்கணி', 'பூத்தார் சூடு', 'கழைமுத்து மாலை',
  'சரம்வெற் றிக்க', 'மூல முண்டகனு பூதி', 'வண்டு அணியும்', 'அலைகடல் சிலை', 'இரதமான தேன்',
  'ஊனத்தசை தோல்கள்', 'ஒய்யா ரச்சிலை', 'கட்காமக்ரோத', 'கொங்கு லாவிய', 'சந்தனம் பரிமள',
  'சருவி இகழ்ந்து', 'சிந்து உற்று எழு', 'செக்கர்வானப் பிறை', 'தினமணி சார்ங்க', 'பூமாது உரமேயணி',
] as const;

describe('R2.11 Thiruppugazh intake batch 033 — Project Madurai Part III 751–775', () => {
  it('contains exactly the governed contiguous 751–775 sequence', () => {
    expect(batch033).toHaveLength(25);
    expect(batch033.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 751 + index),
    );
    expect(batch033.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch033.at(0)?.id).toBe('thiruppugazh-0751');
    expect(batch033.at(-1)?.id).toBe('thiruppugazh-0775');
    expect(batch033.at(-1)?.openingWords).toBe('பூமாது உரமேயணி');
  });

  it('keeps every record on the governed Project Madurai Part III source lane', () => {
    expect(batch033.every((song) => song.sourceId === 'MHS13')).toBe(true);
    expect(batch033.every((song) => song.edition === 'Project Madurai Part III, verses 671–1000')).toBe(true);
    expect(batch033.every((song) => song.sourceNumbering.system === 'Project Madurai Part III')).toBe(true);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch033) {
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

  it('starts after the qualified 750 runtime and does not overrun this batch', () => {
    expect(batch033.every((song) => song.sourceNumbering.number > 750)).toBe(true);
    expect(batch033.every((song) => song.sourceNumbering.number <= 775)).toBe(true);
  });
});
