import { describe, expect, it } from 'vitest';
import batch031Raw from '@/content/intake/thiruppugazh-batch-031.json';

const batch031 = batch031Raw;
const expectedOpenings = [
  'தோடு உறும் குழை', 'விலையறுக்கவும்', 'ஆதிமுதன் நாளில்', 'சாலநெடு நாள்', 'ஏறு ஆனாலே',
  'ஞால மெங்கும்', 'தோழமை கொண்டு', 'தோள் தப்பாமல்', 'வாசித்த நூல்', 'அனுத்தே னேர்மொழி',
  'உருக்கு ஆர் வாளி', 'சீர் உலாவிய', 'திமிர மாமன', 'சுருதி மறைகள்', 'தோல் எலும்பு',
  'நீள் புயல் குழல்', 'மாதர் கொங்கையில்', 'குதிபாய்ந்தி ரத்தம்', 'சயில அங்கனைக்கு', 'மனைமாண்சுத ரான',
  'முகிலாமெனும் வார்', 'கலகலெனச் சில', 'பச்சிலை இட்டு', 'அண்டர்பதி குடியேற', 'சீதள வாரிஜ',
] as const;

describe('R2.11 Thiruppugazh intake batch 031 — Project Madurai Part III 701–725', () => {
  it('contains exactly the governed contiguous 701–725 sequence', () => {
    expect(batch031).toHaveLength(25);
    expect(batch031.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 701 + index),
    );
    expect(batch031.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch031.at(0)?.id).toBe('thiruppugazh-0701');
    expect(batch031.at(-1)?.id).toBe('thiruppugazh-0725');
    expect(batch031.at(-1)?.openingWords).toBe('சீதள வாரிஜ');
  });

  it('keeps every record on the governed Project Madurai Part III source lane', () => {
    expect(batch031.every((song) => song.sourceId === 'MHS13')).toBe(true);
    expect(batch031.every((song) => song.edition === 'Project Madurai Part III, verses 671–1000')).toBe(true);
    expect(batch031.every((song) => song.sourceNumbering.system === 'Project Madurai Part III')).toBe(true);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch031) {
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

  it('starts after the qualified 700 runtime and does not overrun this batch', () => {
    expect(batch031.every((song) => song.sourceNumbering.number > 700)).toBe(true);
    expect(batch031.every((song) => song.sourceNumbering.number <= 725)).toBe(true);
  });
});
