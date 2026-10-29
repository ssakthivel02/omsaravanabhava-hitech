import { describe, expect, it } from 'vitest';
import batch045Raw from '@/content/intake/thiruppugazh-batch-045.json';
import sources from '@/content/sources.json';

const batch045 = batch045Raw;
const expectedOpenings = [
  'நிலவில் மாரன்', 'மன கபாட', 'அதல சேடனாராட', 'குருதி மூளை', 'சரியும் அவல',
  'மகளு மனைவி தாய்', 'குடரும் நீர் கொழு', 'பொதுவதாய்த் தனி', 'கவடு கோத்தெழும்', 'பருதியாய்ப் பனி',
  'முதலி யாக்கை', 'வருக வீட்டு எனும்', 'மறலி போற்சில', 'குருதி ஒழுகி', 'துயரம் அறு நின்',
  'பணிகள் பணமும்', 'மைந்தர் இனிய', 'ஒழு கூனிரத்தம்', 'கருவாய் வயிற்றில்', 'புரக்க வந்த',
  'பெருக்க நெஞ்சு', 'இருந்த வீடும்', 'கலந்த மாதும்', 'இசைந்த ஏறும்', 'திரிபுரம் அதனை',
] as const;

describe('R2.11 Thiruppugazh intake batch 045 — Project Madurai Part IV 1051–1075', () => {
  it('contains exactly the governed contiguous 1051–1075 sequence', () => {
    expect(batch045).toHaveLength(25);
    expect(batch045.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 1051 + index),
    );
    expect(batch045.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch045.at(0)?.id).toBe('thiruppugazh-1051');
    expect(batch045.at(-1)?.id).toBe('thiruppugazh-1075');
    expect(batch045.at(-1)?.openingWords).toBe('திரிபுரம் அதனை');
  });

  it('remains on the governed Project Madurai Part IV source lane', () => {
    expect(batch045.every((song) => song.sourceId === 'MHS14')).toBe(true);
    expect(batch045.every((song) => song.edition === 'Project Madurai Part IV, verses 1001–1326')).toBe(true);
    expect(batch045.every((song) => song.sourceNumbering.system === 'Project Madurai Part IV')).toBe(true);
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
    for (const song of batch045) {
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

  it('starts immediately after the qualified 1050 runtime and remains inside Part IV', () => {
    expect(batch045.every((song) => song.sourceNumbering.number > 1050)).toBe(true);
    expect(batch045.every((song) => song.sourceNumbering.number <= 1326)).toBe(true);
  });
});
