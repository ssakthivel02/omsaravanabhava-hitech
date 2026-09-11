import { describe, expect, it } from 'vitest';
import batch049Raw from '@/content/intake/thiruppugazh-batch-049.json';
import sources from '@/content/sources.json';

const batch049 = batch049Raw;
const expectedOpenings = [
  'கறுத்து நீவிடு', 'குறிப்பரிய குழல்', 'குனகியொரு மயில்', 'கொலைவிழி சுழல', 'கோழையாய் ஆணவம்', 'சந்தனம் கலந்த', 'சுருதி வெகுமுக', 'சுற்றத்தவர்களும்', 'செம் கனல் புகை', 'சேலை அடர்த்து ஆலம்', 'சொக்குப் பொட்டு', 'ஞானா விபூஷணி', 'தரணிமிசை', 'தனஞ் சற்றுக் குலுங்க', 'நகரம் இரு பாதமாகி', 'நரையொடு பல்', 'நிமிர்ந்த முதுகு', 'நிருதரார்க்கு ஒரு', 'ஆரவாரமாய்', 'நீரும் என்பு', 'பகல்மட்க', 'பத்தித் தரள', 'பரதவித புண்டரிக', 'பழுது அற ஓதி', 'பாணிக்கு உட்படாது',
] as const;

describe('R2.11 Thiruppugazh intake batch 049 — Project Madurai Part IV 1151–1175', () => {
  it('contains exactly the governed contiguous 1151–1175 sequence', () => {
    expect(batch049).toHaveLength(25);
    expect(batch049.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 1151 + index),
    );
    expect(batch049.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch049.at(0)?.id).toBe('thiruppugazh-1151');
    expect(batch049.at(-1)?.id).toBe('thiruppugazh-1175');
    expect(batch049.at(-1)?.openingWords).toBe('பாணிக்கு உட்படாது');
  });

  it('remains on the governed Project Madurai Part IV source lane', () => {
    expect(batch049.every((song) => song.sourceId === 'MHS14')).toBe(true);
    expect(batch049.every((song) => song.edition === 'Project Madurai Part IV, verses 1001–1326')).toBe(true);
    expect(batch049.every((song) => song.sourceNumbering.system === 'Project Madurai Part IV')).toBe(true);
    const source = sources.find((entry) => entry.id === 'MHS14');
    expect(source).toMatchObject({
      reference: 'Project Madurai Thiruppugazh Part IV, verses 1001–1326',
      type: 'PUBLIC_UNICODE_EDITION',
      confidence: 'HIGH',
      url: 'https://www.projectmadurai.org/pm_etexts/utf8/pmuni0191.html',
      rights: 'HEADER_PRESERVATION_CONDITION_STATED',
    });
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch049) {
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

  it('starts immediately after the qualified 1150 runtime and remains inside Part IV', () => {
    expect(batch049.every((song) => song.sourceNumbering.number > 1150)).toBe(true);
    expect(batch049.every((song) => song.sourceNumbering.number <= 1326)).toBe(true);
  });
});
