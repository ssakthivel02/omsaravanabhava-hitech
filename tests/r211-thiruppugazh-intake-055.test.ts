import { describe, expect, it } from 'vitest';
import batch055Raw from '@/content/intake/thiruppugazh-batch-055.json';
import sources from '@/content/sources.json';

const batch055 = batch055Raw;
const expectedOpenings = [
  'பொன்னை விரும்பிய', 'மனைமக்கள் சுற்றம்', 'வாரி மீதே', 'வான் அப்பு', 'குருபர சரவண',
  'கும்பகோணம்', 'அகரமுமாகி', 'இலவிதழ் கோதி', 'காரணமதாக', 'சீலமுள தாயர்',
  'வீர மதன் நூல்', 'வாரண முகம்', 'ஆசை நாலுசதுர', 'கருவாகியெதாய்', 'சீர் சிறக்கும் மேனி',
  'துடிகொள் நோய்', 'பாசத்தால் விலை', 'வாதினை அடர்ந்த', 'வார்குழையை', 'அழகு தவழ்குழல்',
  'தலைமயிர் கொக்கு', 'மலரணை ததும்ப', 'கருவெனு மாயை', 'தங்க மிகுந்த', 'உரையுஞ் சென்றது',
] as const;

describe('R2.11 Thiruppugazh intake batch 055 — Project Madurai Part IV 1301–1325', () => {
  it('contains exactly the governed contiguous 1301–1325 sequence', () => {
    expect(batch055).toHaveLength(25);
    expect(batch055.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 1301 + index),
    );
    expect(batch055.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch055.at(0)?.id).toBe('thiruppugazh-1301');
    expect(batch055.at(0)?.openingWords).toBe('பொன்னை விரும்பிய');
    expect(batch055.at(-1)?.id).toBe('thiruppugazh-1325');
    expect(batch055.at(-1)?.openingWords).toBe('உரையுஞ் சென்றது');
  });

  it('remains on the governed Project Madurai Part IV source lane', () => {
    expect(batch055.every((song) => song.sourceId === 'MHS14')).toBe(true);
    expect(batch055.every((song) => song.edition === 'Project Madurai Part IV, verses 1001–1326')).toBe(true);
    expect(batch055.every((song) => song.sourceNumbering.system === 'Project Madurai Part IV')).toBe(true);
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
    for (const song of batch055) {
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
    const song1301 = batch055.find((song) => song.id === 'thiruppugazh-1301');
    const song1325 = batch055.find((song) => song.id === 'thiruppugazh-1325');
    expect(song1301?.sourceNumbering.number).toBe(1301);
    expect(song1301?.openingWords).toBe('பொன்னை விரும்பிய');
    expect(song1325?.sourceNumbering.number).toBe(1325);
    expect(song1325?.openingWords).toBe('உரையுஞ் சென்றது');
  });

  it('starts immediately after the qualified 1300 runtime and remains inside Part IV', () => {
    expect(batch055.every((song) => song.sourceNumbering.number > 1300)).toBe(true);
    expect(batch055.every((song) => song.sourceNumbering.number <= 1326)).toBe(true);
  });
});