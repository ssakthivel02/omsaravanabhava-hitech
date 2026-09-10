import { describe, expect, it } from 'vitest';
import batch032Raw from '@/content/intake/thiruppugazh-batch-032.json';

const batch032 = batch032Raw;
const expectedOpenings = [
  'பிறவியான சடம்', 'வேல் இரண்டு', 'அடல்வடி வேல்கள்', 'கண்க யற்பிணை', 'கருமுகில் போல்',
  'கால முகில் என', 'அச்சா யிறுக்காணி', 'பாவ நாரிகள்', 'ஆறும் ஆறும்', 'தாரகாசுரன் சரிந்து',
  'காணொணாதது', 'பரவுவரிக் கயல்', 'விடமும் வேலன', 'சீத மதியம்', 'அரியயன் அறியாதவர்',
  'ஆரத்தன பார', 'வெகு மாய வித', 'கோல மறை', 'பலபல தத்துவம்', 'நிணமொடு குருதி',
  'மதிக்கு நேரெனும்', 'சதுரத்தரை நோக்கிய', 'மாத்திரை யாகிலு', 'அறிவிலாதவர்', 'குடத் தாமரையாம்',
] as const;

describe('R2.11 Thiruppugazh intake batch 032 — Project Madurai Part III 726–750', () => {
  it('contains exactly the governed contiguous 726–750 sequence', () => {
    expect(batch032).toHaveLength(25);
    expect(batch032.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 726 + index),
    );
    expect(batch032.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch032.at(0)?.id).toBe('thiruppugazh-0726');
    expect(batch032.at(-1)?.id).toBe('thiruppugazh-0750');
    expect(batch032.at(-1)?.openingWords).toBe('குடத் தாமரையாம்');
  });

  it('keeps every record on the governed Project Madurai Part III source lane', () => {
    expect(batch032.every((song) => song.sourceId === 'MHS13')).toBe(true);
    expect(batch032.every((song) => song.edition === 'Project Madurai Part III, verses 671–1000')).toBe(true);
    expect(batch032.every((song) => song.sourceNumbering.system === 'Project Madurai Part III')).toBe(true);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch032) {
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

  it('starts after the qualified 725 runtime and does not overrun this batch', () => {
    expect(batch032.every((song) => song.sourceNumbering.number > 725)).toBe(true);
    expect(batch032.every((song) => song.sourceNumbering.number <= 750)).toBe(true);
  });
});
