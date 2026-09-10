import { describe, expect, it } from 'vitest';
import batch030Raw from '@/content/intake/thiruppugazh-batch-030.json';
import sourcesRaw from '@/content/sources.json';

const batch030 = batch030Raw;
const expectedOpenings = [
  'வடிவது நீலம்', 'தவர்வாள் தோமர', 'கார்க்கு ஒத்த மேனி', 'பாற்றுக் கணங்கள்', 'ஆலம் போல் எழு',
  'கார்ச் சார் குழலார்', 'அணி செவ்வியார்', 'சோதி மாமதி', 'மின் இடை கலாப', 'மருமல்லி யார்',
  'கரிய முகில் போலும்', 'சொருபப் பிரகாச', 'அமரும் அமரர்', 'அயில் ஒத்து எழும்', 'அறமிலா அதி',
  'இகல வருதிரை', 'இணையது இலதாம்', 'களபம் மணி ஆரம்', 'கடிய வேக', 'திரைவார் கடல்',
  'நிரைதரு மணியணி', 'வரும் மயில் ஒத்தவர்', 'குசமாகி யாருமலை', 'ஆதவித பாரமுலை', 'தலங்களில் வரும்',
] as const;

describe('R2.11 Thiruppugazh intake batch 030 — Project Madurai Part III 676–700', () => {
  it('contains exactly the governed contiguous 676–700 sequence', () => {
    expect(batch030).toHaveLength(25);
    expect(batch030.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 676 + index),
    );
    expect(batch030.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch030.at(0)?.id).toBe('thiruppugazh-0676');
    expect(batch030.at(-1)?.id).toBe('thiruppugazh-0700');
    expect(batch030.at(-1)?.openingWords).toBe('தலங்களில் வரும்');
  });

  it('keeps every record governed by Project Madurai Part III / MHS13', () => {
    expect(batch030.every((song) => song.sourceId === 'MHS13')).toBe(true);
    expect(batch030.every((song) => song.edition === 'Project Madurai Part III, verses 671–1000')).toBe(true);
    expect(batch030.every((song) => song.sourceNumbering.system === 'Project Madurai Part III')).toBe(true);

    const source = sourcesRaw.find((entry) => entry.id === 'MHS13');
    expect(source).toEqual(expect.objectContaining({
      reference: 'Project Madurai Thiruppugazh Part III, verses 671–1000',
      type: 'PUBLIC_UNICODE_EDITION',
      confidence: 'HIGH',
      url: 'https://www.projectmadurai.org/pm_etexts/utf8/pmuni0189.html',
      rights: 'HEADER_PRESERVATION_CONDITION_STATED',
    }));
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch030) {
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

  it('starts after the qualified 675 runtime and does not overrun this batch', () => {
    expect(batch030.every((song) => song.sourceNumbering.number > 675)).toBe(true);
    expect(batch030.every((song) => song.sourceNumbering.number <= 700)).toBe(true);
  });
});
