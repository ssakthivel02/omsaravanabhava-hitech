import { describe, expect, it } from 'vitest';
import batch011 from '@/content/intake/thiruppugazh-batch-011.json';

describe('R2.11 Thiruppugazh intake batch 011', () => {
  const expectedOpenings = [
    'பரவரிதாகி', 'பலகாதல் பெற்றிட', 'பாதி மதிநதி', 'மகர கேதனத்தன்', 'மருவே செறித்த',
    'முறுகு காள', 'வாதமொடு சூலை', 'வாரம் உற்ற', 'வார்குழலை', 'வார்குழல் விரித்து',
    'விடமும் வடிவேலும்', 'விரித்த பைங்குழல்', 'விழியால் மருட்டி', 'அமைவுற்று அடைய', 'அரகர சிவன் அரி',
    'அருக்கி மெத்தென', 'இருப்பவல் திருப்புகழ்', 'இருமலு ரோக', 'உடலி னூடு', 'உடையவர்கள் ஏவர்',
    'உய்யஞானத்து நெறி', 'எத்தனை கலாதி', 'எலுப்பு நாடிகள்', 'எனக்கென யாவும்', 'எனை அடைந்த',
  ];

  it('locks the exact contiguous 226-250 normalized source-number sequence', () => {
    expect(batch011).toHaveLength(25);
    expect(batch011.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 226 + index),
    );
    expect(batch011.map((song) => song.id)).toEqual(
      Array.from({ length: 25 }, (_, index) => `thiruppugazh-${String(226 + index).padStart(4, '0')}`),
    );
    expect(batch011.map((song) => song.openingWords)).toEqual(expectedOpenings);
  });

  it('preserves Project Madurai song 231 heading whitespace as formatting-only evidence', () => {
    const song231 = batch011.find((song) => song.id === 'thiruppugazh-0231');
    expect(song231?.openingWords).toBe('முறுகு காள');
    expect(song231?.sourceNumbering.number).toBe(231);
    expect(song231?.sourceNumberingVariant?.primaryPrintedLabel).toBe('23 1');
    expect(song231?.sourceNumberingVariant?.normalizedCatalogueNumber).toBe(231);
    expect(song231?.sourceNumberingVariant?.state).toBe('PRIMARY_WHITESPACE_FORMATTING_VARIANT_ONLY');
    expect(song231?.verificationState).toBe('SOURCE_VERIFIED_METADATA_ONLY_NUMBERING_FORMAT_VARIANT');
  });

  it('keeps every intake row metadata-only and fail-closed', () => {
    for (const song of batch011) {
      expect(song.sourceId).toBe('MHS1');
      expect(song.edition).toBe('Project Madurai Part I, verses 1–330');
      expect(song.sourceNumbering.system).toBe('Project Madurai Part I');
      expect(song.rightsStatus).toBe('HEADER_PRESERVATION_CONDITION_STATED');
      expect(song.canonicalTextStatus).toBe('SOURCE_LINKED_TEXT_NOT_IMPORTED');
      expect(song.canonicalText).toBeNull();
      expect(song.meaningState).toBe('NOT_PUBLISHED');
      expect(song.transliterationState).toBe('NOT_PUBLISHED');
      expect(song.audioState).toBe('NO_APPROVED_AUDIO');
      expect(song.publicationState).toBe('INTAKE_VALIDATED_NOT_YET_PUBLIC');
    }
  });
});
