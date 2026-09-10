import { describe, expect, it } from 'vitest';
import batch034Raw from '@/content/intake/thiruppugazh-batch-034.json';

const batch034 = batch034Raw;
const expectedOpenings = [
  'மதனச்சொற் கார', 'விடம் என மிகுத்த', 'அளிசுழ லளக', 'உரத்துறை போத', 'எத்தனை கோடி',
  'பாட கச்சிலம்போடு', 'மாலினால் எடுத்த', 'மூல ஆதாரமோடு', 'மேக வார்குழல', 'ஏட்டின் விதிப்படி',
  'சூலம் என ஓடு', 'அருக்கி மெத்தென சிரித்துமை', 'அமுதினை மெத்த', 'ஆடல் மாமத ராஜன்', 'ஈளை சுரங்குளிர்',
  'குவளை பொருதிரு', 'அனல் அப்பு அரி', 'இரக்கும் அவர்க்கு', 'பகரு முத்தமிழ்', 'படி புனல் நெருப்பு',
  'பழியுறு சட்டகமான', 'பெருக்க மாகிய', 'மருக்குலாவிய', 'முலை குலுக்கிகள்', 'சூழ்ந்து ஏன்ற துக்க',
] as const;

describe('R2.11 Thiruppugazh intake batch 034 — Project Madurai Part III 776–800', () => {
  it('contains exactly the governed contiguous 776–800 sequence', () => {
    expect(batch034).toHaveLength(25);
    expect(batch034.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 776 + index),
    );
    expect(batch034.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch034.at(0)?.id).toBe('thiruppugazh-0776');
    expect(batch034.at(-1)?.id).toBe('thiruppugazh-0800');
    expect(batch034.at(-1)?.openingWords).toBe('சூழ்ந்து ஏன்ற துக்க');
  });

  it('keeps every record on the governed Project Madurai Part III source lane', () => {
    expect(batch034.every((song) => song.sourceId === 'MHS13')).toBe(true);
    expect(batch034.every((song) => song.edition === 'Project Madurai Part III, verses 671–1000')).toBe(true);
    expect(batch034.every((song) => song.sourceNumbering.system === 'Project Madurai Part III')).toBe(true);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch034) {
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

  it('starts after the qualified 775 runtime and does not overrun this batch', () => {
    expect(batch034.every((song) => song.sourceNumbering.number > 775)).toBe(true);
    expect(batch034.every((song) => song.sourceNumbering.number <= 800)).toBe(true);
  });
});
