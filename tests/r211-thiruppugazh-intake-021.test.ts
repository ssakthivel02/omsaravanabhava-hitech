import { describe, expect, it } from 'vitest';
import batch021Raw from '@/content/intake/thiruppugazh-batch-021.json';

const batch021 = batch021Raw;
const expectedOpenings = [
  'இருவினையின் மதி', 'குகனே குருபரனே', 'வண்டையொத்து', 'கங்குலின் குழல்', 'கொந்தளம் புழு',
  'மந்தரமென் குவடார்', 'வந்து வந்துவித்தூறி', 'கதித்துப் பொங்கலு', 'சிரித்துச் சங்கொளி', 'தத்தையென்று',
  'தனத்தில் குங்குமத்தை', 'திருடிகள் இணக்கி', 'கொந்தரம் குழல்', 'தியங்கும் சஞ்சலம்', 'பருவம் பணை',
  'மதவெம் கரி', 'முகசந்திர புருவம்', 'சந்திர வோலை', 'காய மாய வீடு', 'அவகுண விரகனை',
  'கட்டி முண்டக', 'நஞ்சினைப் போலுமன', 'செம் கலச', 'கரிய மேகமெனும்', 'கூந்தலாழ விரிந்து',
] as const;

describe('R2.11 Thiruppugazh intake batch 021 — Project Madurai Part II 451–475', () => {
  it('contains exactly the governed contiguous 451–475 sequence', () => {
    expect(batch021).toHaveLength(25);
    expect(batch021.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 451 + index),
    );
    expect(batch021.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch021.at(0)?.id).toBe('thiruppugazh-0451');
    expect(batch021.at(-1)?.id).toBe('thiruppugazh-0475');
    expect(batch021.at(-1)?.openingWords).toBe('கூந்தலாழ விரிந்து');
  });

  it('stays on the dedicated Project Madurai Part II provenance lane', () => {
    expect(batch021.every((song) => song.sourceId === 'MHS12')).toBe(true);
    expect(batch021.every((song) => song.sourceNumbering.system === 'Project Madurai Part II')).toBe(true);
    expect(batch021.every((song) => song.edition === 'Project Madurai Part II, verses 331–670')).toBe(true);
    expect(batch021.some((song) => song.sourceId === 'MHS1')).toBe(false);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch021) {
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

  it('starts after the qualified 450 runtime and does not overrun this batch', () => {
    expect(batch021.every((song) => song.sourceNumbering.number > 450)).toBe(true);
    expect(batch021.every((song) => song.sourceNumbering.number <= 475)).toBe(true);
  });
});
