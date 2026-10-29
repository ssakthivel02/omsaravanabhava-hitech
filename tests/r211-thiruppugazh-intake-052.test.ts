import { describe, expect, it } from 'vitest';
import batch052Raw from '@/content/intake/thiruppugazh-batch-052.json';
import sources from '@/content/sources.json';

const batch052 = batch052Raw;
const expectedOpenings = [
  'கடலினும் பெரிய', 'கட்டக் கணப்பறை', 'கண்டு போல்மொழி', 'கப்பரை கைக்கொள', 'கலைகோட்டு வல்லி',
  'களவு கொண்டு', 'கள்ள மீனச் சுறவு', 'கன்னியர் கடு விடம்', 'கிஞ்சுகம் என', 'குடிமை மனையாட்டி',
  'குறைவது இன்றி', 'கோகனகமுகிழ்த்த', 'சந்தம் புனைந்து', 'சலமலம்', 'சாங்கரி பாடியிட',
  'சிவஞான புண்டரிக', 'சீறிட்டு உலாவு', 'சூதினுண வாசை', 'செழும் தாது', 'தத் தனமும்',
  'தலைவலய போகம்', 'தவநெறி', 'திதலை உலாத்து', 'திரைவஞ்ச', 'தீ ஊதை தாத்ரி',
] as const;

describe('R2.11 Thiruppugazh intake batch 052 — Project Madurai Part IV 1226–1250', () => {
  it('contains exactly the governed contiguous 1226–1250 sequence', () => {
    expect(batch052).toHaveLength(25);
    expect(batch052.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 1226 + index),
    );
    expect(batch052.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch052.at(0)?.id).toBe('thiruppugazh-1226');
    expect(batch052.at(0)?.openingWords).toBe('கடலினும் பெரிய');
    expect(batch052.at(-1)?.id).toBe('thiruppugazh-1250');
    expect(batch052.at(-1)?.openingWords).toBe('தீ ஊதை தாத்ரி');
  });

  it('remains on the governed Project Madurai Part IV source lane', () => {
    expect(batch052.every((song) => song.sourceId === 'MHS14')).toBe(true);
    expect(batch052.every((song) => song.edition === 'Project Madurai Part IV, verses 1001–1326')).toBe(true);
    expect(batch052.every((song) => song.sourceNumbering.system === 'Project Madurai Part IV')).toBe(true);
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
    for (const song of batch052) {
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
    const song1226 = batch052.find((song) => song.id === 'thiruppugazh-1226');
    const song1250 = batch052.find((song) => song.id === 'thiruppugazh-1250');
    expect(song1226?.sourceNumbering.number).toBe(1226);
    expect(song1226?.openingWords).toBe('கடலினும் பெரிய');
    expect(song1250?.sourceNumbering.number).toBe(1250);
    expect(song1250?.openingWords).toBe('தீ ஊதை தாத்ரி');
  });

  it('starts immediately after the qualified 1225 runtime and remains inside Part IV', () => {
    expect(batch052.every((song) => song.sourceNumbering.number > 1225)).toBe(true);
    expect(batch052.every((song) => song.sourceNumbering.number <= 1326)).toBe(true);
  });
});
