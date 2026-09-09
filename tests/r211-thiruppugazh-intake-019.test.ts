import { describe, expect, it } from 'vitest';
import batch019Raw from '@/content/intake/thiruppugazh-batch-019.json';

const batch019 = batch019Raw;
const expectedOpenings = [
  'இருவினை அஞ்ச', 'இருவினை ஊண்', 'இருளளகம் அவிழ', 'இறுகு மணி முலை', 'உலையிலனல்',
  'கடல்பரவு தரங்க', 'கமலமுகப் பிறை', 'கமல மொட்டை', 'கரிமுகக் கடகளிறு', 'கரு நிறம் சிறந்து',
  'காணாத தூர நீள்', 'காராடக் குழல்', 'காரும் மருவும்', 'கீத விநோத மெச்சு', 'குரவ நறும் அளக',
  'குழவியுமாய் மோகம்', 'கேதகையபூ முடித்த', 'கோடு ஆன மடவார்கள்', 'கோடு செறி', 'சிலைநுதல் வைத்து',
  'சிவமாதுடனே', 'சினமுடுவல் நரிகழுகு', 'சுக்கிலச் சுரொணித', 'செஞ்சொற் பண்', 'செயசெய அருணா',
] as const;

describe('R2.11 Thiruppugazh intake batch 019 — Project Madurai Part II 401–425', () => {
  it('contains exactly the governed contiguous 401–425 sequence', () => {
    expect(batch019).toHaveLength(25);
    expect(batch019.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 401 + index),
    );
    expect(batch019.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch019.at(0)?.id).toBe('thiruppugazh-0401');
    expect(batch019.at(-1)?.id).toBe('thiruppugazh-0425');
    expect(batch019.at(-1)?.openingWords).toBe('செயசெய அருணா');
  });

  it('stays on the dedicated Project Madurai Part II provenance lane', () => {
    expect(batch019.every((song) => song.sourceId === 'MHS12')).toBe(true);
    expect(batch019.every((song) => song.sourceNumbering.system === 'Project Madurai Part II')).toBe(true);
    expect(batch019.every((song) => song.edition === 'Project Madurai Part II, verses 331–670')).toBe(true);
    expect(batch019.some((song) => song.sourceId === 'MHS1')).toBe(false);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch019) {
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

  it('starts after the qualified 400 runtime and does not overrun this batch', () => {
    expect(batch019.every((song) => song.sourceNumbering.number > 400)).toBe(true);
    expect(batch019.every((song) => song.sourceNumbering.number <= 425)).toBe(true);
  });
});
