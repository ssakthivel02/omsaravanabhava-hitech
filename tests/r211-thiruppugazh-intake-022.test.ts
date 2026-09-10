import { describe, expect, it } from 'vitest';
import batch022Raw from '@/content/intake/thiruppugazh-batch-022.json';

const batch022 = batch022Raw;
const expectedOpenings = [
  'அத்தன் அன்னை', 'இருள் காட்டு', 'முல்லைமலர் போலும்', 'அடப்பக்கம் பிடித்து', 'அக்குப் பீளை',
  'ஆரத்தோடு அணி', 'காதைக் காதி', 'கொள்ளை ஆசை', 'தாது மாமலர்', 'எலுப்புத் தோல்',
  'நீல மாமுகில்', 'வாத பித்தமொடு', 'சுரும்பு உற்ற', 'இணங்கித் தட்பொடு', 'விடுங்கைக்கு ஒத்த',
  'கொந்தள வோலைகள் ஆட', 'நகையா லெத்திகள்', 'எழுகடல் மணலை', 'தறுகணன் மறலி', 'இரசபா கொத்தமொழி',
  'இருளும் ஓர்கதிரணு', 'காவி உடுத்தும்', 'கோதிக் கோதி', 'சகசம்பக் குடைசூழ்', 'சகுட முந்தும்',
] as const;

describe('R2.11 Thiruppugazh intake batch 022 — Project Madurai Part II 476–500', () => {
  it('contains exactly the governed contiguous 476–500 sequence', () => {
    expect(batch022).toHaveLength(25);
    expect(batch022.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 476 + index),
    );
    expect(batch022.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch022.at(0)?.id).toBe('thiruppugazh-0476');
    expect(batch022.at(-1)?.id).toBe('thiruppugazh-0500');
    expect(batch022.at(-1)?.openingWords).toBe('சகுட முந்தும்');
  });

  it('stays on the dedicated Project Madurai Part II provenance lane', () => {
    expect(batch022.every((song) => song.sourceId === 'MHS12')).toBe(true);
    expect(batch022.every((song) => song.sourceNumbering.system === 'Project Madurai Part II')).toBe(true);
    expect(batch022.every((song) => song.edition === 'Project Madurai Part II, verses 331–670')).toBe(true);
    expect(batch022.some((song) => song.sourceId === 'MHS1')).toBe(false);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch022) {
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

  it('starts after the qualified 475 runtime and does not overrun this batch', () => {
    expect(batch022.every((song) => song.sourceNumbering.number > 475)).toBe(true);
    expect(batch022.every((song) => song.sourceNumbering.number <= 500)).toBe(true);
  });
});
