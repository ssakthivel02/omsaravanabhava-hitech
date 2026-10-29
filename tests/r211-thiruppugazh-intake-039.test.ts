import { describe, expect, it } from 'vitest';
import batch039Raw from '@/content/intake/thiruppugazh-batch-039.json';

const batch039 = batch039Raw;
const expectedOpenings = [
  'ஆரம் முலை காட்டி', 'இகல்கடின முகபடவி', 'இலகு முலைவிலை', 'என்னால் பிறக்கவும்', 'கடல்போற் கணைவிழி',
  'கமலத்தே குலாவும்', 'கமை அற்ற சீர்', 'குருதி கிருமிகள்', 'குயிலோ மொழி', 'கோவை வாயிதழ்',
  'தாமரையின் மட்டு', 'திரு உரூப நேராக', 'நெய்த்த சுரி', 'முலை மறைக்கவும்', 'மேகலை நெகிழ்த்து',
  'வாளின் முனை', 'விகட பரிமளம்', 'கார் அணியும் குழல்', 'நிரைத்த நித்தில', 'காலன் வேல் கணை',
  'வாசனை மங்கையர்', 'புணரியும்', 'மதியால் வித்தகன்', 'இளநிர்க் குவட்டு', 'தசையாகிய',
] as const;

describe('R2.11 Thiruppugazh intake batch 039 — Project Madurai Part III 901–925', () => {
  it('contains exactly the governed contiguous 901–925 sequence', () => {
    expect(batch039).toHaveLength(25);
    expect(batch039.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 901 + index),
    );
    expect(batch039.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch039.at(0)?.id).toBe('thiruppugazh-0901');
    expect(batch039.at(-1)?.id).toBe('thiruppugazh-0925');
    expect(batch039.at(-1)?.openingWords).toBe('தசையாகிய');
  });

  it('keeps every record on the governed Project Madurai Part III source lane', () => {
    expect(batch039.every((song) => song.sourceId === 'MHS13')).toBe(true);
    expect(batch039.every((song) => song.edition === 'Project Madurai Part III, verses 671–1000')).toBe(true);
    expect(batch039.every((song) => song.sourceNumbering.system === 'Project Madurai Part III')).toBe(true);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch039) {
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

  it('starts after the qualified 900 runtime and does not overrun this batch', () => {
    expect(batch039.every((song) => song.sourceNumbering.number > 900)).toBe(true);
    expect(batch039.every((song) => song.sourceNumbering.number <= 925)).toBe(true);
  });
});
