import { describe, expect, it } from 'vitest';
import batch047Raw from '@/content/intake/thiruppugazh-batch-047.json';
import sources from '@/content/sources.json';

const batch047 = batch047Raw;
const expectedOpenings = [
  'தந்தமும் துன்ப', 'உம்பரார் அமுது', 'வண்டுதான் மிக', 'காதல் மோகம் தரும்', 'கோல காலத்தை',
  'ஞாலமோடு ஒப்ப', 'கரவுசேர் மகளிர்', 'வடிவவேல் தனை', 'கட்டம் உறு நோய்', 'பக்கம் உற நேரான',
  'நீரு நிலம் அண்டாத', 'சுட்டதுபோல் ஆசை', 'மைச்சுனமார் மாமன்', 'தத்துவத்துச் செயல்', 'மக்கள் ஒக்கல்',
  'உற்பாதம் பூ', 'எற்றா வற்றா', 'செட்டாகத் தேனை', 'பட்டு ஆடைக்கே', 'பத்து ஏழு எட்டு',
  'பொற்கோ வைக்கே', 'பொற் பூவை', 'மெய்க்கூணைத் தேடி', 'அகர முதலென', 'அரிய வஞ்சகர்',
] as const;

describe('R2.11 Thiruppugazh intake batch 047 — Project Madurai Part IV 1101–1125', () => {
  it('contains exactly the governed contiguous 1101–1125 sequence', () => {
    expect(batch047).toHaveLength(25);
    expect(batch047.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 1101 + index),
    );
    expect(batch047.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch047.at(0)?.id).toBe('thiruppugazh-1101');
    expect(batch047.at(-1)?.id).toBe('thiruppugazh-1125');
    expect(batch047.at(-1)?.openingWords).toBe('அரிய வஞ்சகர்');
  });

  it('remains on the governed Project Madurai Part IV source lane', () => {
    expect(batch047.every((song) => song.sourceId === 'MHS14')).toBe(true);
    expect(batch047.every((song) => song.edition === 'Project Madurai Part IV, verses 1001–1326')).toBe(true);
    expect(batch047.every((song) => song.sourceNumbering.system === 'Project Madurai Part IV')).toBe(true);
    const source = sources.find((entry) => entry.id === 'MHS14');
    expect(source).toMatchObject({
      reference: 'Project Madurai Thiruppugazh Part IV, verses 1001–1326',
      type: 'PUBLIC_UNICODE_EDITION',
      confidence: 'HIGH',
      url: 'https://www.projectmadurai.org/pm_etexts/utf8/pmuni0191.html',
      rights: 'HEADER_PRESERVATION_CONDITION_STATED',
    });
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch047) {
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

  it('starts immediately after the qualified 1100 runtime and remains inside Part IV', () => {
    expect(batch047.every((song) => song.sourceNumbering.number > 1100)).toBe(true);
    expect(batch047.every((song) => song.sourceNumbering.number <= 1326)).toBe(true);
  });
});
