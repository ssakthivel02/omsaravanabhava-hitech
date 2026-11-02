import { describe, expect, it } from 'vitest';
import batch025Raw from '@/content/intake/thiruppugazh-batch-025.json';

const batch025 = batch025Raw;
const expectedOpenings = [
  'இளையவர் நெஞ்ச', 'பகலவன் ஒக்கும்', 'ஒருவரொடு கண்கள்', 'குமுத வாய்க்கனி', 'குவளை பூசல்',
  'சத்தி பாணீ', 'பகலிரவினில்', 'புவனத் தொரு', 'பொருளின் மேற்ப்ரிய', 'பொருள்கவர் சிந்தை',
  'வாசித்து', 'வெருட்டி ஆட்கொளும்', 'குடத்தைத் தகர்த்து', 'நெறித்துப் பொருப்பு', 'கயலைச் சருவி',
  'சுற்ற கபடோடு', 'பத்தியால் யானுனை', 'சீரான கோல கால', 'பாதாள மாதி லோக', 'இலாபமில்',
  'நிராமய புராதன', 'இதமுறு விரைபுனல்', 'உருவேறவே ஜெபித்து', 'எதிரெதிர் கண்டோடி', 'ஐந்து பூதமும்',
] as const;

describe('R2.11 Thiruppugazh intake batch 025 — Project Madurai Part II 551–575', () => {
  it('contains exactly the governed contiguous 551–575 sequence', () => {
    expect(batch025).toHaveLength(25);
    expect(batch025.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 551 + index),
    );
    expect(batch025.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch025.at(0)?.id).toBe('thiruppugazh-0551');
    expect(batch025.at(-1)?.id).toBe('thiruppugazh-0575');
    expect(batch025.at(-1)?.openingWords).toBe('ஐந்து பூதமும்');
  });

  it('stays on the dedicated Project Madurai Part II provenance lane', () => {
    expect(batch025.every((song) => song.sourceId === 'MHS12')).toBe(true);
    expect(batch025.every((song) => song.sourceNumbering.system === 'Project Madurai Part II')).toBe(true);
    expect(batch025.every((song) => song.edition === 'Project Madurai Part II, verses 331–670')).toBe(true);
    expect(batch025.some((song) => song.sourceId === 'MHS1')).toBe(false);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch025) {
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

  it('starts after the qualified 550 runtime and does not overrun this batch', () => {
    expect(batch025.every((song) => song.sourceNumbering.number > 550)).toBe(true);
    expect(batch025.every((song) => song.sourceNumbering.number <= 575)).toBe(true);
  });
});
