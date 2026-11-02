import { describe, expect, it } from 'vitest';
import batch024Raw from '@/content/intake/thiruppugazh-batch-024.json';

const batch024 = batch024Raw;
const expectedOpenings = [
  'நெச்சுப் பிச்சி', 'கோங்கிள நீரிளக', 'சாந்தமில் மோகவெரி', 'வரிசேர்ந்திடு', 'அல்லி விழியாலும்',
  'ஐயுமுறு நோயும்', 'கை ஒத்து வாழும்', 'முல்லைக்கும் மாரன்', 'கள்ளக் குவால் பை', 'வெல்லிக்கு வீக்கும்',
  'ககனமும் அநிலமும்', 'அல் அசல் அடைந்த', 'குடிவாழ்க்கை', 'சிரம் அங்கம் அம் கை', 'வரைவில் பொய்',
  'அகத்தினைக் கொண்டு', 'எழுகு நிறை நாபி', 'ஓல மிட்ட சுரும்பு', 'வேத வெற்பிலே', 'நீல மயில் சேரும்',
  'கொலை கொண்ட', 'அங்கை நீட்டி', 'அந்தோ மனமே', 'அரிவையர் நெஞ்சுரு', 'அழுது அழுது ஆசார',
] as const;

describe('R2.11 Thiruppugazh intake batch 024 — Project Madurai Part II 526–550', () => {
  it('contains exactly the governed contiguous 526–550 sequence', () => {
    expect(batch024).toHaveLength(25);
    expect(batch024.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 526 + index),
    );
    expect(batch024.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch024.at(0)?.id).toBe('thiruppugazh-0526');
    expect(batch024.at(-1)?.id).toBe('thiruppugazh-0550');
    expect(batch024.at(-1)?.openingWords).toBe('அழுது அழுது ஆசார');
  });

  it('stays on the dedicated Project Madurai Part II provenance lane', () => {
    expect(batch024.every((song) => song.sourceId === 'MHS12')).toBe(true);
    expect(batch024.every((song) => song.sourceNumbering.system === 'Project Madurai Part II')).toBe(true);
    expect(batch024.every((song) => song.edition === 'Project Madurai Part II, verses 331–670')).toBe(true);
    expect(batch024.some((song) => song.sourceId === 'MHS1')).toBe(false);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch024) {
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

  it('starts after the qualified 525 runtime and does not overrun this batch', () => {
    expect(batch024.every((song) => song.sourceNumbering.number > 525)).toBe(true);
    expect(batch024.every((song) => song.sourceNumbering.number <= 550)).toBe(true);
  });
});
