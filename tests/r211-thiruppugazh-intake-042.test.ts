import { describe, expect, it } from 'vitest';
import batch042Raw from '@/content/intake/thiruppugazh-batch-042.json';

const batch042 = batch042Raw;
const expectedOpenings = [
  'வேதத்திற் கேள்வி', 'முத்தோலை தனை', 'வாட்படச் சேனை', 'கருப்புச் சாப', 'வேலை தோற்க விழி',
  'ஊனாரும் உட்பிணியும்', 'கற்பக ஞானக் கடவுள்', 'வாலவயதாகி', 'வானோர் வழுத்துனது', 'அமல கமல உரு',
  'விரகற நோக்கியும்', 'வழக்குச் சொற்பயில்', 'ஆகத்தே தப்பாமல்', 'மின்னார் பயந்த', 'ஆலையான மொழிக்கு',
  'திருகு செறிந்த', 'போத நிர்க்குண', 'ஓது முத்தமிழ்', 'வேத வித்தகா', 'ஆவி காப்பது',
  'ஏகமாய் பலவாய்', 'தோடு மென்குழை', 'நாலிரண்டிதழாலே', 'போதில் இருந்து', 'வேடர் செழுந்தினை',
] as const;

describe('R2.11 Thiruppugazh intake batch 042 — Project Madurai Part III 976–1000', () => {
  it('contains exactly the governed contiguous 976–1000 sequence', () => {
    expect(batch042).toHaveLength(25);
    expect(batch042.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 976 + index),
    );
    expect(batch042.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch042.at(0)?.id).toBe('thiruppugazh-0976');
    expect(batch042.at(-1)?.id).toBe('thiruppugazh-1000');
    expect(batch042.at(-1)?.openingWords).toBe('வேடர் செழுந்தினை');
  });

  it('keeps every record on the governed Project Madurai Part III source lane', () => {
    expect(batch042.every((song) => song.sourceId === 'MHS13')).toBe(true);
    expect(batch042.every((song) => song.edition === 'Project Madurai Part III, verses 671–1000')).toBe(true);
    expect(batch042.every((song) => song.sourceNumbering.system === 'Project Madurai Part III')).toBe(true);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch042) {
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

  it('starts after the qualified 975 runtime and terminates Part III exactly at 1000', () => {
    expect(batch042.every((song) => song.sourceNumbering.number > 975)).toBe(true);
    expect(batch042.every((song) => song.sourceNumbering.number <= 1000)).toBe(true);
  });
});
