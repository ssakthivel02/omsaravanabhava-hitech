import { describe, expect, it } from 'vitest';
import batch014 from '@/content/intake/thiruppugazh-batch-014.json';

const expectedOpenings = [
  'வினைக்கு இனமாகும்', 'வெற்றி செயவுற்ற', 'அதிரும் கழல்', 'எழுதிகழ் புவன', 'தறையின் மானுடர்',
  'வஞ்சக லோப மூடர்', 'அலைகடல் நிகராகிய', 'ஈனமிகுத்துள பிறவி', 'அதி மதம் கக்க', 'கனக தம்பத்தை',
  'செடியுடம் பத்தி', 'கன க்ரவுஞ்சத்தில்', 'தெரியல் அம் செச்சை', 'புன மடந்தைக்கு', 'கறை இலங்கும்',
  'செறிதரும் செப்பத்து', 'அரி அயன் புட்பி', 'கனி தரும் கொக்கு', 'தசைதுறுந் தொக்கு', 'புரைபடுஞ் செற்ற',
  'சலமலம் விட்ட', 'தலை வலையத்து', 'இதத்துப் பற்றி', 'எனக்குச்சற்று', 'இறைச்சிப் பற்று',
] as const;

describe('R2.11 Thiruppugazh intake batch 014', () => {
  it('locks the exact contiguous 301-325 sequence and normalized Tamil openings', () => {
    expect(batch014).toHaveLength(25);
    expect(batch014.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 301 + index),
    );
    expect(batch014.map((song) => song.id)).toEqual(
      Array.from({ length: 25 }, (_, index) => `thiruppugazh-${String(301 + index).padStart(4, '0')}`),
    );
    expect(batch014.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch014.map((song) => song.titleTa)).toEqual(expectedOpenings);
  });

  it('keeps every intake row metadata-only and fail-closed', () => {
    for (const song of batch014) {
      expect(song.sourceId).toBe('MHS1');
      expect(song.edition).toBe('Project Madurai Part I, verses 1–330');
      expect(song.rightsStatus).toBe('HEADER_PRESERVATION_CONDITION_STATED');
      expect(song.canonicalTextStatus).toBe('SOURCE_LINKED_TEXT_NOT_IMPORTED');
      expect(song.canonicalText).toBeNull();
      expect(song.attribution).toBe('SOURCE_VERIFIED_METADATA_ONLY');
      expect(song.verificationState).toBe('SOURCE_VERIFIED_METADATA_ONLY');
      expect(song.meaningState).toBe('NOT_PUBLISHED');
      expect(song.transliterationState).toBe('NOT_PUBLISHED');
      expect(song.audioState).toBe('NO_APPROVED_AUDIO');
      expect(song.publicationState).toBe('INTAKE_VALIDATED_NOT_YET_PUBLIC');
    }
  });
});
