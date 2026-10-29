import { describe, expect, it } from 'vitest';
import batch023Raw from '@/content/intake/thiruppugazh-batch-023.json';

const batch023 = batch023Raw;
const expectedOpenings = [
  'சாந்துடனே புழுகு', 'சுடரனைய திருமேனி', 'தத்தை மயில்', 'துத்தி பொற்றன', 'நாடா பிறப்பு',
  'நாலு சதுரத்த பஞ்ச', 'நீலக் குழலார்', 'பனி போலத் துளி', 'மகரமொடுறு குழை', 'மச்ச மெச்சு',
  'மதிய மண்குண', 'மருவு கடல்முகில்', 'மனமே உனக்குறுதி', 'முத்த மோகன', 'பரமகுரு நாத',
  'வஞ்சமே கோடி', 'திரு நிலம் மருவி', 'தேனுந்து முக்கனிகள்', 'நகைத்து உருக்கி', 'பனியின் விந்துளி',
  'புமி அதனில்', 'முகத்தைப் பிலுக்கி', 'ஒருபதும் இருபதும்', 'கறுத்ததலை வெளிறு', 'சரவண பவநிதி',
] as const;

describe('R2.11 Thiruppugazh intake batch 023 — Project Madurai Part II 501–525', () => {
  it('contains exactly the governed contiguous 501–525 sequence', () => {
    expect(batch023).toHaveLength(25);
    expect(batch023.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 501 + index),
    );
    expect(batch023.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch023.at(0)?.id).toBe('thiruppugazh-0501');
    expect(batch023.at(-1)?.id).toBe('thiruppugazh-0525');
    expect(batch023.at(-1)?.openingWords).toBe('சரவண பவநிதி');
  });

  it('stays on the dedicated Project Madurai Part II provenance lane', () => {
    expect(batch023.every((song) => song.sourceId === 'MHS12')).toBe(true);
    expect(batch023.every((song) => song.sourceNumbering.system === 'Project Madurai Part II')).toBe(true);
    expect(batch023.every((song) => song.edition === 'Project Madurai Part II, verses 331–670')).toBe(true);
    expect(batch023.some((song) => song.sourceId === 'MHS1')).toBe(false);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch023) {
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

  it('starts after the qualified 500 runtime and does not overrun this batch', () => {
    expect(batch023.every((song) => song.sourceNumbering.number > 500)).toBe(true);
    expect(batch023.every((song) => song.sourceNumbering.number <= 525)).toBe(true);
  });
});
