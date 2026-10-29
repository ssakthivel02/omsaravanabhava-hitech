import { describe, expect, it } from 'vitest';
import batch from '@/content/intake/thiruppugazh-batch-003.json';

const expectedOpenings = [
  'இயலிசையில் உசித',
  'இருகுழை யெறிந்த',
  'இருள்விரி குழலை',
  'உததியறல் மொண்டு',
  'உருக்கம் பேசிய',
  'ஏவினை நேர்விழி',
  'ஓராது ஒன்றை',
  'கட்டழகு விட்டு',
  'கண்டுமொழி',
  'கமல மாதுடன்',
  'கரிக்கொம்பம்',
  'கருப்பம் தங்கு',
  'களபம் ஒழுகிய',
  'கனங்கள் கொண்ட',
  'கன்றிலுறு மானை',
  'காலனார் வெங்கொடும்',
  'குகர மேவுமெய்',
  'குடர்நிண மென்பு',
  'குழைக்கும் சந்தன',
  'கொங்கைகள்',
] as const;

describe('R2.11 Thiruppugazh intake batch 003', () => {
  it('contains exactly songs 31 through 50 in source order', () => {
    expect(batch.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 20 }, (_, index) => index + 31),
    );
    expect(batch.map((song) => song.id)).toEqual(
      Array.from({ length: 20 }, (_, index) => `thiruppugazh-${String(index + 31).padStart(4, '0')}`),
    );
  });

  it('locks the reviewed Tamil opening labels for this intake', () => {
    expect(batch.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch.map((song) => song.titleTa)).toEqual(expectedOpenings);
  });

  it('keeps every row metadata-only and fail-closed for text, meaning and audio', () => {
    for (const song of batch) {
      expect(song.sourceId).toBe('MHS1');
      expect(song.edition).toBe('Project Madurai Part I, verses 1–330');
      expect(song.sourceNumbering.system).toBe('Project Madurai Part I');
      expect(song.rightsStatus).toBe('HEADER_PRESERVATION_CONDITION_STATED');
      expect(song.verificationState).toBe('SOURCE_VERIFIED_METADATA_ONLY');
      expect(song.canonicalTextStatus).toBe('SOURCE_LINKED_TEXT_NOT_IMPORTED');
      expect(song.canonicalText).toBeNull();
      expect(song.meaningState).toBe('NOT_PUBLISHED');
      expect(song.transliterationState).toBe('NOT_PUBLISHED');
      expect(song.audioState).toBe('NO_APPROVED_AUDIO');
      expect(song.publicationState).toBe('INTAKE_VALIDATED_NOT_YET_PUBLIC');
    }
  });

  it('begins immediately after the qualified 30-record runtime boundary', () => {
    expect(Math.min(...batch.map((song) => song.sourceNumbering.number))).toBe(31);
    expect(Math.max(...batch.map((song) => song.sourceNumbering.number))).toBe(50);
  });
});
