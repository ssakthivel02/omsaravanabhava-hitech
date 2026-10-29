import { describe, expect, it } from 'vitest';
import batch029Raw from '@/content/intake/thiruppugazh-batch-029.json';
import sourcesRaw from '@/content/sources.json';

const batch029 = batch029Raw;
const expectedOpenings = [
  'தாரணிக் கதி', 'மங்கைக் கணவனும்', 'வேழம் உண்ட', 'சிகரம் அருந்த', 'அருவரை எடுத்த',
  'அடல் அரி மகவு', 'சிகரிகள் இடிய', 'குவலயம் மல்கு', 'பொருவன கள்ள', 'கள்ளம் உள்ள',
  'தொய்யில் செய்யில்', 'இல்லையென நாணி', 'பையரவு போலு', 'வதன சரோருக', 'நசையொடு தோலு',
  'அதிக ராய்ப்பொரு', 'சேல் ஆலம்', 'ஒருவரைச் சிறுமனை', 'குலையமயி ரோதி', 'நிகரில் பஞ்ச',
  'பரவி உனது', 'மருவும் அஞ்சு', 'கனவாலங் கூர்விழி', 'பொன்றா மன்று', 'புவிபுனல் காலும்',
] as const;

describe('R2.11 Thiruppugazh intake batch 029 — Project Madurai boundary 651–675', () => {
  it('contains exactly the governed contiguous 651–675 sequence', () => {
    expect(batch029).toHaveLength(25);
    expect(batch029.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 651 + index),
    );
    expect(batch029.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch029.at(0)?.id).toBe('thiruppugazh-0651');
    expect(batch029.at(-1)?.id).toBe('thiruppugazh-0675');
    expect(batch029.at(-1)?.openingWords).toBe('புவிபுனல் காலும்');
  });

  it('enforces the Project Madurai Part II to Part III source boundary', () => {
    const partII = batch029.filter((song) => song.sourceNumbering.number <= 670);
    const partIII = batch029.filter((song) => song.sourceNumbering.number >= 671);

    expect(partII).toHaveLength(20);
    expect(partIII).toHaveLength(5);
    expect(partII.every((song) => song.sourceId === 'MHS12')).toBe(true);
    expect(partII.every((song) => song.edition === 'Project Madurai Part II, verses 331–670')).toBe(true);
    expect(partII.every((song) => song.sourceNumbering.system === 'Project Madurai Part II')).toBe(true);
    expect(partIII.every((song) => song.sourceId === 'MHS13')).toBe(true);
    expect(partIII.every((song) => song.edition === 'Project Madurai Part III, verses 671–1000')).toBe(true);
    expect(partIII.every((song) => song.sourceNumbering.system === 'Project Madurai Part III')).toBe(true);
  });

  it('registers MHS13 as the governed Project Madurai Part III source', () => {
    const source = sourcesRaw.find((entry) => entry.id === 'MHS13');
    expect(source).toEqual(expect.objectContaining({
      reference: 'Project Madurai Thiruppugazh Part III, verses 671–1000',
      type: 'PUBLIC_UNICODE_EDITION',
      confidence: 'HIGH',
      url: 'https://www.projectmadurai.org/pm_etexts/utf8/pmuni0189.html',
      rights: 'HEADER_PRESERVATION_CONDITION_STATED',
    }));
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch029) {
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

  it('starts after the qualified 650 runtime and does not overrun this batch', () => {
    expect(batch029.every((song) => song.sourceNumbering.number > 650)).toBe(true);
    expect(batch029.every((song) => song.sourceNumbering.number <= 675)).toBe(true);
  });
});
