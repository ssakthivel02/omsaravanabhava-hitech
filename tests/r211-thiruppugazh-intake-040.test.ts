import { describe, expect, it } from 'vitest';
import batch040Raw from '@/content/intake/thiruppugazh-batch-040.json';

const batch040 = batch040Raw;
const expectedOpenings = [
  'நித்தப் பிணிகொடு', 'முட்ட மருட்டி', 'சஞ்சல சரித', 'முகிலள கஞ்சரி', 'குருவும் அடியவர்',
  'வண்டுபோற் சார', 'இருவினைப் பிறவி', 'காந்தட் கரவளை', 'பரிவுறு நாரற்று', 'சங்குவார் முடி',
  'கலக சம்ப்ரம', 'சஞ்சரி உகந்து', 'சந்திதொறும் நாணம்', 'இரு குழை இடறி', 'கத்தூரி யகரு',
  'சங்கைக் கத்தோடு', 'அவசியமுன் வேண்டி', 'இறவாமற் பிறவாமல்', 'பந்தப்பொற் பார', 'மனத்திரைந்தெழு',
  'பக்குவ ஆசார', 'மதப்பட்ட விசால', 'வனப்புற்றெழு', 'தீராப் பிணிதீர', 'மைச் சரோருகம்',
] as const;

describe('R2.11 Thiruppugazh intake batch 040 — Project Madurai Part III 926–950', () => {
  it('contains exactly the governed contiguous 926–950 sequence', () => {
    expect(batch040).toHaveLength(25);
    expect(batch040.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 926 + index),
    );
    expect(batch040.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch040.at(0)?.id).toBe('thiruppugazh-0926');
    expect(batch040.at(-1)?.id).toBe('thiruppugazh-0950');
    expect(batch040.at(-1)?.openingWords).toBe('மைச் சரோருகம்');
  });

  it('keeps every record on the governed Project Madurai Part III source lane', () => {
    expect(batch040.every((song) => song.sourceId === 'MHS13')).toBe(true);
    expect(batch040.every((song) => song.edition === 'Project Madurai Part III, verses 671–1000')).toBe(true);
    expect(batch040.every((song) => song.sourceNumbering.system === 'Project Madurai Part III')).toBe(true);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch040) {
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

  it('starts after the qualified 925 runtime and does not overrun this batch', () => {
    expect(batch040.every((song) => song.sourceNumbering.number > 925)).toBe(true);
    expect(batch040.every((song) => song.sourceNumbering.number <= 950)).toBe(true);
  });
});
