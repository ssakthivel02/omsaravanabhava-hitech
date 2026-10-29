import { describe, expect, it } from 'vitest';
import batch043Raw from '@/content/intake/thiruppugazh-batch-043.json';
import sources from '@/content/sources.json';

const batch043 = batch043Raw;
const expectedOpenings = [
  'இலகி யிருகுழை', 'கடலை பயறொடு', 'கமல குமிளித', 'தசையும் உதிரமும்', 'நெடிய வட',
  'பகிர நினைவொரு', 'முருகு செறிகுழலவிழ் தர', 'இலகு வேலெனு', 'முருகு உலாவிய குழல்', 'அரிசன பரிச',
  'உரை தரு பர சமய', 'இம கிரி மத்தில்', 'முகமும் மினுக்கி', 'படிதனில் உறவெனும்', 'விடம் என அயில்',
  'குகையில் நவநாதர்', 'மழையளக பாரம்', 'கற்பார் மெய்', 'சிற்று ஆயக் கூட்ட', 'இருட் குழலை',
  'வினைத் திரளுக்கு', 'முத்து மணிபணி', 'விட்ட புழுகுபனி', 'ஏடுமலர் உற்ற', 'சீதமலம் வெப்பு',
] as const;

describe('R2.11 Thiruppugazh intake batch 043 — Project Madurai Part IV 1001–1025', () => {
  it('contains exactly the governed contiguous 1001–1025 sequence', () => {
    expect(batch043).toHaveLength(25);
    expect(batch043.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 1001 + index),
    );
    expect(batch043.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch043.at(0)?.id).toBe('thiruppugazh-1001');
    expect(batch043.at(-1)?.id).toBe('thiruppugazh-1025');
    expect(batch043.at(-1)?.openingWords).toBe('சீதமலம் வெப்பு');
  });

  it('switches cleanly to the governed Project Madurai Part IV source lane', () => {
    expect(batch043.every((song) => song.sourceId === 'MHS14')).toBe(true);
    expect(batch043.every((song) => song.edition === 'Project Madurai Part IV, verses 1001–1326')).toBe(true);
    expect(batch043.every((song) => song.sourceNumbering.system === 'Project Madurai Part IV')).toBe(true);
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
    for (const song of batch043) {
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

  it('starts immediately after the qualified 1000 runtime and remains inside Part IV', () => {
    expect(batch043.every((song) => song.sourceNumbering.number > 1000)).toBe(true);
    expect(batch043.every((song) => song.sourceNumbering.number <= 1326)).toBe(true);
  });
});
