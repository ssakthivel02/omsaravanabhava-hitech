import { describe, expect, it } from 'vitest';
import batch from '@/content/intake/thiruppugazh-batch-006.json';

const expectedOpenings = [
  'விறல்மாரன் ஐந்து',
  'வெங்காளம் பாணம்',
  'வெம் சரோருகமோ',
  'அகல்வினை',
  'அணிபட்டு அணுகி',
  'அதல விதல',
  'அபகார நிந்தை',
  'அரிசன வாடை',
  'அருத்தி வாழ்வொடு',
  'அவனிதனிலே',
  'அறமிலா நிலை',
  'ஆதாளிகள் புரி',
  'ஆலகாலம் என',
  'ஆறுமுகம் ஆறுமுகம்',
  'இத் தாரணிக்குள்',
  'இரவி என',
  'இருகனக மாமேரு',
  'இரு செப்பென',
  'இலகிய களப',
  'இலகுகனி மிஞ்சு',
  'உயிர்க் கூடு',
  'உலகபசு பாச',
  'ஒருபொழுதும் இருசரண',
  'ஒருவரை ஒருவர்',
  'ஓடி ஓடி',
] as const;

describe('R2.11 Thiruppugazh intake batch 006', () => {
  it('contains exactly songs 101 through 125 in source order', () => {
    expect(batch.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => index + 101),
    );
    expect(batch.map((song) => song.id)).toEqual(
      Array.from({ length: 25 }, (_, index) => `thiruppugazh-${String(index + 101).padStart(4, '0')}`),
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

  it('begins immediately after the qualified 100-record runtime boundary', () => {
    expect(Math.min(...batch.map((song) => song.sourceNumbering.number))).toBe(101);
    expect(Math.max(...batch.map((song) => song.sourceNumbering.number))).toBe(125);
  });
});
