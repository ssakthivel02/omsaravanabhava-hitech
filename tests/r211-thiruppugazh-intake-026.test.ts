import { describe, expect, it } from 'vitest';
import batch026Raw from '@/content/intake/thiruppugazh-batch-026.json';

const batch026 = batch026Raw;
const expectedOpenings = [
  'கரதல முங்குறி', 'கரிபுராரி காமாரி', 'காம அத்திரமாகி', 'கொடாதவனை', 'மாயா சொரூபம்',
  'மாலாசை கோபம்', 'மேகம் எனும் குழல்', 'மோதி இறுகி', 'சரவண ஜாதா', 'அன்பாக வந்து',
  'பந்து ஆடி அம் கை', 'வண்டார் மதங்கள்', 'கரை அற உருகுதல்', 'இடம் பார்த்து', 'கலக்கும் கோது',
  'துஞ்சு கோட்டி', 'நீலமஞ்சான குழல்', 'பொன்றலைப் பொய்', 'மந்தக் கடைக்கண்', 'மெய்ச் சார்வு அற்றே',
  'வருத்தம் காண', 'ஆலகால படப்பை', 'காலனிடத்து', 'தாமா தாம ஆலாபா', 'அத் துகிரின் நல்',
] as const;

describe('R2.11 Thiruppugazh intake batch 026 — Project Madurai Part II 576–600', () => {
  it('contains exactly the governed contiguous 576–600 sequence', () => {
    expect(batch026).toHaveLength(25);
    expect(batch026.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 576 + index),
    );
    expect(batch026.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch026.at(0)?.id).toBe('thiruppugazh-0576');
    expect(batch026.at(-1)?.id).toBe('thiruppugazh-0600');
    expect(batch026.at(-1)?.openingWords).toBe('அத் துகிரின் நல்');
  });

  it('stays on the dedicated Project Madurai Part II provenance lane', () => {
    expect(batch026.every((song) => song.sourceId === 'MHS12')).toBe(true);
    expect(batch026.every((song) => song.sourceNumbering.system === 'Project Madurai Part II')).toBe(true);
    expect(batch026.every((song) => song.edition === 'Project Madurai Part II, verses 331–670')).toBe(true);
    expect(batch026.some((song) => song.sourceId === 'MHS1')).toBe(false);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch026) {
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

  it('starts after the qualified 575 runtime and does not overrun this batch', () => {
    expect(batch026.every((song) => song.sourceNumbering.number > 575)).toBe(true);
    expect(batch026.every((song) => song.sourceNumbering.number <= 600)).toBe(true);
  });
});
