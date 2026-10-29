import { describe, expect, it } from 'vitest';
import batch020Raw from '@/content/intake/thiruppugazh-batch-020.json';

const batch020 = batch020Raw;
const expectedOpenings = [
  'தமரம் குரங்களும்', 'தமிழோதிய குயிலோ', 'தலையை மழித்து', 'திருட்டு வாணிப', 'தேதென வாச முற்ற',
  'தோதகப் பெரும்', 'பாண மலரது', 'பாலாய் நூலாய்', 'புணர்முலை மடந்தை', 'புலையனான',
  'போக கற்ப', 'மானை விடத்தை', 'முகத் துலக்கிகள்', 'மேக மொத்தகுழலார்', 'மொழிய நிறம்',
  'வலிவாத பித்தமொடு', 'விடு மதவேள்', 'விதி அதாகவே', 'விந்துப் புளகித', 'வீறு புழுகான பனி',
  'சரக்கு ஏறி இத்த', 'சிரத்தானத்தி', 'பங்கயனார்', 'கனகசபை மேவும்', 'கைத்தருண சோதி',
] as const;

describe('R2.11 Thiruppugazh intake batch 020 — Project Madurai Part II 426–450', () => {
  it('contains exactly the governed contiguous 426–450 sequence', () => {
    expect(batch020).toHaveLength(25);
    expect(batch020.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 426 + index),
    );
    expect(batch020.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch020.at(0)?.id).toBe('thiruppugazh-0426');
    expect(batch020.at(-1)?.id).toBe('thiruppugazh-0450');
    expect(batch020.at(-1)?.openingWords).toBe('கைத்தருண சோதி');
  });

  it('stays on the dedicated Project Madurai Part II provenance lane', () => {
    expect(batch020.every((song) => song.sourceId === 'MHS12')).toBe(true);
    expect(batch020.every((song) => song.sourceNumbering.system === 'Project Madurai Part II')).toBe(true);
    expect(batch020.every((song) => song.edition === 'Project Madurai Part II, verses 331–670')).toBe(true);
    expect(batch020.some((song) => song.sourceId === 'MHS1')).toBe(false);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch020) {
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

  it('starts after the qualified 425 runtime and does not overrun this batch', () => {
    expect(batch020.every((song) => song.sourceNumbering.number > 425)).toBe(true);
    expect(batch020.every((song) => song.sourceNumbering.number <= 450)).toBe(true);
  });
});
