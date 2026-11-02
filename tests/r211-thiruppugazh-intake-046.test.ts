import { describe, expect, it } from 'vitest';
import batch046Raw from '@/content/intake/thiruppugazh-batch-046.json';
import sources from '@/content/sources.json';

const batch046 = batch046Raw;
const expectedOpenings = [
  'புழுககில் களபம்', 'முழு மதி அனைய', 'கொடியன பிணி', 'சுடரொளி கதிரவன்', 'குடம் என ஒத்த',
  'மடவியர் எச்சில்', 'கரு மயல் ஏறி', 'குடல் இடை தீது', 'கருதியே மெத்த', 'கொலையிலே மெத்த',
  'அகிலநறுஞ் சேறு', 'கலக மதன் காதும்', 'குருதி சலம் தோலும்', 'இருவினைகள் ஈட்டும்', 'உறவின் முறையோர்',
  'அளகநிரை குலைய', 'அனகனென அதிகனென', 'குடருமல சலமுமிடை', 'குதறும் முனை அறிவு', 'வதை பழக மறலி',
  'விடமளவி யரிபரவு', 'எழுபிறவி நீர்நில', 'நடை உடையிலே', 'மடல் அவிழ் சரோருக', 'அங்கதன் கண்டகன்',
] as const;

describe('R2.11 Thiruppugazh intake batch 046 — Project Madurai Part IV 1076–1100', () => {
  it('contains exactly the governed contiguous 1076–1100 sequence', () => {
    expect(batch046).toHaveLength(25);
    expect(batch046.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 1076 + index),
    );
    expect(batch046.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch046.at(0)?.id).toBe('thiruppugazh-1076');
    expect(batch046.at(-1)?.id).toBe('thiruppugazh-1100');
    expect(batch046.at(-1)?.openingWords).toBe('அங்கதன் கண்டகன்');
  });

  it('remains on the governed Project Madurai Part IV source lane', () => {
    expect(batch046.every((song) => song.sourceId === 'MHS14')).toBe(true);
    expect(batch046.every((song) => song.edition === 'Project Madurai Part IV, verses 1001–1326')).toBe(true);
    expect(batch046.every((song) => song.sourceNumbering.system === 'Project Madurai Part IV')).toBe(true);
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
    for (const song of batch046) {
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

  it('starts immediately after the qualified 1075 runtime and remains inside Part IV', () => {
    expect(batch046.every((song) => song.sourceNumbering.number > 1075)).toBe(true);
    expect(batch046.every((song) => song.sourceNumbering.number <= 1326)).toBe(true);
  });
});
