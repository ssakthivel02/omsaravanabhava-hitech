import { describe, expect, it } from 'vitest';
import batch038Raw from '@/content/intake/thiruppugazh-batch-038.json';

const batch038 = batch038Raw;
const expectedOpenings = [
  'மகர குண்டல மீதே', 'தோடுற்றுக் காதள', 'திட்டெனப் பல', 'அலங்கார முடிக்கிரண', 'குறித்த நெஞ்சாசை',
  'குடங்கள் நிரை', 'மானை நேர்விழி', 'அஞ்சன வேல்விழி மடமாதர்', 'அம்பு ராசியில்', 'கந்த வார்குழல்',
  'மரு உலாவிடும்', 'சொரியு மாமுகில்', 'வீங்கு பச்சிள', 'முகிலைக் காரை', 'விகட சங்கட',
  'சதங்கை மணி', 'பஞ்ச புலனும் பழைய', 'கூரிய கடைக்கணால்', 'நீரிழிவு குட்டம்', 'கருகி அறிவு அகல',
  'தொக்கைக் கழுவி', 'விந்துபேதித்த', 'ஈயெறும்பு நரி', 'ஆங்குடல் வளைந்து', 'அரி மருகோனே',
] as const;

describe('R2.11 Thiruppugazh intake batch 038 — Project Madurai Part III 876–900', () => {
  it('contains exactly the governed contiguous 876–900 sequence', () => {
    expect(batch038).toHaveLength(25);
    expect(batch038.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 876 + index),
    );
    expect(batch038.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch038.at(0)?.id).toBe('thiruppugazh-0876');
    expect(batch038.at(-1)?.id).toBe('thiruppugazh-0900');
    expect(batch038.at(-1)?.openingWords).toBe('அரி மருகோனே');
  });

  it('keeps every record on the governed Project Madurai Part III source lane', () => {
    expect(batch038.every((song) => song.sourceId === 'MHS13')).toBe(true);
    expect(batch038.every((song) => song.edition === 'Project Madurai Part III, verses 671–1000')).toBe(true);
    expect(batch038.every((song) => song.sourceNumbering.system === 'Project Madurai Part III')).toBe(true);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch038) {
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

  it('starts after the qualified 875 runtime and does not overrun this batch', () => {
    expect(batch038.every((song) => song.sourceNumbering.number > 875)).toBe(true);
    expect(batch038.every((song) => song.sourceNumbering.number <= 900)).toBe(true);
  });
});
