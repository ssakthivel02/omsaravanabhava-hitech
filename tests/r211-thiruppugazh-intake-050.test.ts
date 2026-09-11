import { describe, expect, it } from 'vitest';
import batch050Raw from '@/content/intake/thiruppugazh-batch-050.json';
import sources from '@/content/sources.json';

const batch050 = batch050Raw;
const expectedOpenings = [
  'பால்மொழி படித்து', 'புகரில் சேவல', 'புருவத்தை நெறித்து', 'புவிக்குன் பாதம்', 'பூசல்தரும் கயலும்', 'பூசல் வந்திரு', 'பொங்கும் கொடிய', 'பொருத கயல்விழி', 'மங்காதிங் காக்கு', 'மதன தனு நிகர்', 'மதனேவிய கணை', 'மாடமதிட் சுற்று', 'மாண்டார் எலும்பு', 'மாறுபொரு காலன்', 'மின்னினில் நடுக்கம்', 'முத்தம் உலாவு', 'முருகு லாவிய மைப்பா', 'முலைமேலிற் கலிங்க', 'முனை அழிந்தது', 'மைக்குக்கை', 'மோது மறலி', 'வடிகட்டிய தேன் என', 'வட்ட முலைக்கச்சு', 'வளைகரம் ஆட்டி', 'வாடையில் மதனை',
] as const;

describe('R2.11 Thiruppugazh intake batch 050 — Project Madurai Part IV 1176–1200', () => {
  it('contains exactly the governed contiguous 1176–1200 sequence', () => {
    expect(batch050).toHaveLength(25);
    expect(batch050.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 1176 + index),
    );
    expect(batch050.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch050.at(0)?.id).toBe('thiruppugazh-1176');
    expect(batch050.at(-1)?.id).toBe('thiruppugazh-1200');
    expect(batch050.at(-1)?.openingWords).toBe('வாடையில் மதனை');
  });

  it('remains on the governed Project Madurai Part IV source lane', () => {
    expect(batch050.every((song) => song.sourceId === 'MHS14')).toBe(true);
    expect(batch050.every((song) => song.edition === 'Project Madurai Part IV, verses 1001–1326')).toBe(true);
    expect(batch050.every((song) => song.sourceNumbering.system === 'Project Madurai Part IV')).toBe(true);
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
    for (const song of batch050) {
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

  it('guards the known Project Madurai numbering typo around song 1199', () => {
    const song1199 = batch050.find((song) => song.id === 'thiruppugazh-1199');
    const song1200 = batch050.find((song) => song.id === 'thiruppugazh-1200');
    expect(song1199?.sourceNumbering.number).toBe(1199);
    expect(song1199?.openingWords).toBe('வளைகரம் ஆட்டி');
    expect(song1200?.sourceNumbering.number).toBe(1200);
    expect(song1200?.openingWords).toBe('வாடையில் மதனை');
  });

  it('starts immediately after the qualified 1175 runtime and remains inside Part IV', () => {
    expect(batch050.every((song) => song.sourceNumbering.number > 1175)).toBe(true);
    expect(batch050.every((song) => song.sourceNumbering.number <= 1326)).toBe(true);
  });
});
