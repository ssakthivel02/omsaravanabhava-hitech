import { describe, expect, it } from 'vitest';
import batch044Raw from '@/content/intake/thiruppugazh-batch-044.json';
import sources from '@/content/sources.json';

const batch044 = batch044Raw;
const expectedOpenings = [
  'தொடு பொரு மை', 'தோதகம் மிகுத்த', 'காதி மோதி', 'கூறும் மார வேள்', 'பேரவா அறா',
  'காதில் ஓலை', 'கார் உலாவு குழற்கும்', 'தோடு உற்ற காது', 'தோலத்தியால்', 'ஊனுந் தசையுடல்',
  'தீயும் பவனமும்', 'வாதந் தலைவலி', 'ஊனே தானாய்', 'சாவா மூவா வேளே', 'நாராலே தோல்',
  'மாதா வோடே', 'வாராய் பேதாய்', 'அகல நீளம்', 'அடை படாது', 'அமல வாயு',
  'அயிலின் வாளி', 'இரதமான வாய் ஊறல்', 'குருதி தோலினால்', 'சுருதி ஊடு கேளாது', 'தொட அடாது',
] as const;

describe('R2.11 Thiruppugazh intake batch 044 — Project Madurai Part IV 1026–1050', () => {
  it('contains exactly the governed contiguous 1026–1050 sequence', () => {
    expect(batch044).toHaveLength(25);
    expect(batch044.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 1026 + index),
    );
    expect(batch044.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch044.at(0)?.id).toBe('thiruppugazh-1026');
    expect(batch044.at(-1)?.id).toBe('thiruppugazh-1050');
    expect(batch044.at(-1)?.openingWords).toBe('தொட அடாது');
  });

  it('remains on the governed Project Madurai Part IV source lane', () => {
    expect(batch044.every((song) => song.sourceId === 'MHS14')).toBe(true);
    expect(batch044.every((song) => song.edition === 'Project Madurai Part IV, verses 1001–1326')).toBe(true);
    expect(batch044.every((song) => song.sourceNumbering.system === 'Project Madurai Part IV')).toBe(true);
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
    for (const song of batch044) {
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

  it('starts immediately after the qualified 1025 runtime and remains inside Part IV', () => {
    expect(batch044.every((song) => song.sourceNumbering.number > 1025)).toBe(true);
    expect(batch044.every((song) => song.sourceNumbering.number <= 1326)).toBe(true);
  });
});
