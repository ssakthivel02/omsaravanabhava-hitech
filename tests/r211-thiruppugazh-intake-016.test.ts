import { describe, expect, it } from 'vitest';
import batch016Raw from '@/content/intake/thiruppugazh-batch-016.json';
import sourcesRaw from '@/content/sources.json';

const batch016 = batch016Raw;
const expectedOpenings = [
  'அற்றைக் கற்றை', 'சுத்தச் சித்த', 'கொக்குக்கு ஒக்க', 'தத்தித் தத்தி', 'பொக்குப்பை',
  'அயில் அப்பு', 'கச்சு இட்ட அணி', 'கமலரு சோகாம்பர', 'கருமமான பிறப்பற', 'கலகலென',
  'கொத்தார் பற் கால்', 'கோவைச் சுத்த', 'சீசி முப்புர', 'நச்சு அரவம் என்று', 'படிறொழுக்கமும்',
  'மகுடக் கொப்பாட', 'மக்கட்குக் கூற', 'மயல் ஓதும்', 'முத்து ரத்ந சூத்ர', 'வம்பறாச்சில',
] as const;

describe('R2.11 Thiruppugazh intake batch 016 — Project Madurai Part II opening lane', () => {
  it('contains exactly the governed 331–350 sequence', () => {
    expect(batch016).toHaveLength(20);
    expect(batch016.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 20 }, (_, index) => 331 + index),
    );
    expect(batch016.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch016.at(0)?.id).toBe('thiruppugazh-0331');
    expect(batch016.at(-1)?.id).toBe('thiruppugazh-0350');
  });

  it('uses the dedicated Part II provenance lane and never reuses the Part I source id', () => {
    expect(batch016.every((song) => song.sourceId === 'MHS12')).toBe(true);
    expect(batch016.every((song) => song.sourceNumbering.system === 'Project Madurai Part II')).toBe(true);
    expect(batch016.every((song) => song.edition === 'Project Madurai Part II, verses 331–670')).toBe(true);
    expect(batch016.some((song) => song.sourceId === 'MHS1')).toBe(false);

    const partOneSource = sourcesRaw.find((source) => source.id === 'MHS1');
    const partTwoSource = sourcesRaw.find((source) => source.id === 'MHS12');
    expect(partOneSource?.url).toContain('pmuni0180.html');
    expect(partTwoSource?.url).toBe('https://www.projectmadurai.org/pm_etexts/utf8/pmuni0187.html');
    expect(partTwoSource?.url).not.toBe(partOneSource?.url);
    expect(partTwoSource?.type).toBe('PUBLIC_UNICODE_EDITION');
    expect(partTwoSource?.rights).toBe('HEADER_PRESERVATION_CONDITION_STATED');
  });

  it('keeps every new record fail-closed and metadata-only', () => {
    for (const song of batch016) {
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

  it('starts strictly after Part I and does not overrun this intake batch', () => {
    expect(batch016.every((song) => song.sourceNumbering.number > 330)).toBe(true);
    expect(batch016.every((song) => song.sourceNumbering.number <= 350)).toBe(true);
  });
});
