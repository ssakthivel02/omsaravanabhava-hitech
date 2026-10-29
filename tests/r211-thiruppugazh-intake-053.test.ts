import { describe, expect, it } from 'vitest';
import batch053Raw from '@/content/intake/thiruppugazh-batch-053.json';
import sources from '@/content/sources.json';

const batch053 = batch053Raw;
const expectedOpenings = [
  'துடித்து எதிர்', 'துத்தி நச்சு அரா', 'தெரிவை மக்கள்', 'தென்றலும் அன்று', 'தோரண கனக',
  'நச்சுவாள் விழி', 'நற்குணம் உளார்', 'நாகாங்க ரோமம்', 'பரிமள மலரடு', 'பற்றநெட்டை',
  'பாதகமான யாக்கை', 'பார நறுங்குழல்', 'பிரமனும் விரகொடு', 'பூத கலாதிகள்', 'பெருங்காரியம் போல்',
  'மக்கள் பிறப்புக்குள்', 'மக்கள் தாயர்', 'மதன் இக்கு அது', 'மதிதனையிலாத', 'மலம் தோல் சலம்',
  'மன நூறு கோடி', 'மாதர் மயல் தனில்', 'முத்து மணி ஆரம்', 'முருக மயூர', 'மூலா நிலமதின்',
] as const;

describe('R2.11 Thiruppugazh intake batch 053 — Project Madurai Part IV 1251–1275', () => {
  it('contains exactly the governed contiguous 1251–1275 sequence', () => {
    expect(batch053).toHaveLength(25);
    expect(batch053.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 1251 + index),
    );
    expect(batch053.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch053.at(0)?.id).toBe('thiruppugazh-1251');
    expect(batch053.at(0)?.openingWords).toBe('துடித்து எதிர்');
    expect(batch053.at(-1)?.id).toBe('thiruppugazh-1275');
    expect(batch053.at(-1)?.openingWords).toBe('மூலா நிலமதின்');
  });

  it('remains on the governed Project Madurai Part IV source lane', () => {
    expect(batch053.every((song) => song.sourceId === 'MHS14')).toBe(true);
    expect(batch053.every((song) => song.edition === 'Project Madurai Part IV, verses 1001–1326')).toBe(true);
    expect(batch053.every((song) => song.sourceNumbering.system === 'Project Madurai Part IV')).toBe(true);
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
    for (const song of batch053) {
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

  it('locks the independently corroborated endpoints for this batch', () => {
    const song1251 = batch053.find((song) => song.id === 'thiruppugazh-1251');
    const song1275 = batch053.find((song) => song.id === 'thiruppugazh-1275');
    expect(song1251?.sourceNumbering.number).toBe(1251);
    expect(song1251?.openingWords).toBe('துடித்து எதிர்');
    expect(song1275?.sourceNumbering.number).toBe(1275);
    expect(song1275?.openingWords).toBe('மூலா நிலமதின்');
  });

  it('starts immediately after the qualified 1250 runtime and remains inside Part IV', () => {
    expect(batch053.every((song) => song.sourceNumbering.number > 1250)).toBe(true);
    expect(batch053.every((song) => song.sourceNumbering.number <= 1326)).toBe(true);
  });
});
