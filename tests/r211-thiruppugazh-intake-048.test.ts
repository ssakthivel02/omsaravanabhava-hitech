import { describe, expect, it } from 'vitest';
import batch048Raw from '@/content/intake/thiruppugazh-batch-048.json';
import sources from '@/content/sources.json';

const batch048 = batch048Raw;
const expectedOpenings = [
  'ஆராத காதலாகி', 'ஆராதனர் ஆடம்பர', 'ஆலாலத்தை', 'ஆனாத ஞான', 'இடமருவுஞ் சீற்ற', 'இடர் மொய்த்து', 'இரவினிடை வேள்', 'இரவொடும் பகலே', 'இருகுழை மீதோடி', 'இருமுலை மலை', 'இலகிய வேலோ', 'உமை எனும் மயில்', 'உரைத்த பற்றுடன்', 'உலகத்தினில்', 'உறவின்முறை கதறி', 'உறவு சிங்கிகள்', 'ஊனோடு வாது உயிர்', 'எட்டுடன் ஒரு', 'எத்தி இரு குழை', 'ஒக்க வண்டெழு', 'ஓது வித்தவர்', 'ஓலை தரித்த குழை', 'கடைசி வந்தகன்று', 'கதறிய கலைகொடு', 'கலவியி நலமுரை',
] as const;

describe('R2.11 Thiruppugazh intake batch 048 — Project Madurai Part IV 1126–1150', () => {
  it('contains exactly the governed contiguous 1126–1150 sequence', () => {
    expect(batch048).toHaveLength(25);
    expect(batch048.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 1126 + index),
    );
    expect(batch048.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch048.at(0)?.id).toBe('thiruppugazh-1126');
    expect(batch048.at(-1)?.id).toBe('thiruppugazh-1150');
    expect(batch048.at(-1)?.openingWords).toBe('கலவியி நலமுரை');
  });

  it('remains on the governed Project Madurai Part IV source lane', () => {
    expect(batch048.every((song) => song.sourceId === 'MHS14')).toBe(true);
    expect(batch048.every((song) => song.edition === 'Project Madurai Part IV, verses 1001–1326')).toBe(true);
    expect(batch048.every((song) => song.sourceNumbering.system === 'Project Madurai Part IV')).toBe(true);
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
    for (const song of batch048) {
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

  it('starts immediately after the qualified 1125 runtime and remains inside Part IV', () => {
    expect(batch048.every((song) => song.sourceNumbering.number > 1125)).toBe(true);
    expect(batch048.every((song) => song.sourceNumbering.number <= 1326)).toBe(true);
  });
});
