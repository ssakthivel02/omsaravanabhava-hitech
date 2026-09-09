import { describe, expect, it } from 'vitest';
import batch018Raw from '@/content/intake/thiruppugazh-batch-018.json';

const batch018 = batch018Raw;
const expectedOpenings = [
  'கயல் விழித்தேன்', 'கறுவு மிக்கு ஆவி', 'பரியகைப் பாசம்', 'தருண மணி', 'முழுகிவட',
  'வடவை அனல் ஊடு', 'ஆலவிழி நீல', 'பேதக விரோத', 'அமுதம் ஊறு சொல்', 'உருகும் மாமெழுகாக',
  'கரி உரி அரவம்', 'கனை கடல் வயிறு', 'இரவியும் மதியும்', 'விரகொடு வளை', 'இடம் அடு சுறவை',
  'கெஜ நடை மடவார்', 'அருக்கார் நலத்தை', 'அருமா மதனை', 'அழுதும் ஆவா', 'ஆனை வரிக் கோடு',
  'இடருக்கு இடர்', 'இமராஜன் நிலாவது', 'இரத சுரதமுலை', 'இரவுபகற் பலகாலும்', 'இருவர் மயலோ',
] as const;

describe('R2.11 Thiruppugazh intake batch 018 — Project Madurai Part II 376–400', () => {
  it('contains exactly the governed contiguous 376–400 sequence', () => {
    expect(batch018).toHaveLength(25);
    expect(batch018.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 376 + index),
    );
    expect(batch018.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch018.at(0)?.id).toBe('thiruppugazh-0376');
    expect(batch018.at(-1)?.id).toBe('thiruppugazh-0400');
    expect(batch018.at(-1)?.openingWords).toBe('இருவர் மயலோ');
  });

  it('stays on the dedicated Project Madurai Part II provenance lane', () => {
    expect(batch018.every((song) => song.sourceId === 'MHS12')).toBe(true);
    expect(batch018.every((song) => song.sourceNumbering.system === 'Project Madurai Part II')).toBe(true);
    expect(batch018.every((song) => song.edition === 'Project Madurai Part II, verses 331–670')).toBe(true);
    expect(batch018.some((song) => song.sourceId === 'MHS1')).toBe(false);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch018) {
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

  it('starts after the qualified 375 runtime and does not overrun this batch', () => {
    expect(batch018.every((song) => song.sourceNumbering.number > 375)).toBe(true);
    expect(batch018.every((song) => song.sourceNumbering.number <= 400)).toBe(true);
  });
});
