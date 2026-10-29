import { describe, expect, it } from 'vitest';
import batch037Raw from '@/content/intake/thiruppugazh-batch-037.json';

const batch037 = batch037Raw;
const expectedOpenings = [
  'இருவினையஞ்ச', 'எகினி னம்பழி', 'கும்பமு நிகர்த்த', 'கெண்டைகள் பொரும்', 'தேனிருந்த இதழார்',
  'மதியஞ் சத்திரு', 'கொந்தார் மைக்குழல்', 'அறுகுநுனி பனி', 'இலகு குழைகிழிய', 'படியை அளவிடு',
  'புழுகொடுபனி', 'தனுநுதல் வெயர்', 'இந்துகதிர்', 'தும்பி முகத்தானை', 'கெண்டை நேரொத்தவிழி',
  'பஞ்சுசேர் நிர்த்த', 'மாலைதனில் வந்து', 'கறுத்த குஞ்சியும்', 'செனித்திடும் சலம்', 'கரியகுழல் சரிய',
  'பட்டுமணிக் கச்சி', 'மனமெனும் பொருள்', 'ஆசார வீனக்கு', 'தரையினில் வெகுவழி', 'கடகரிம ருப்பிற்க',
] as const;

describe('R2.11 Thiruppugazh intake batch 037 — Project Madurai Part III 851–875', () => {
  it('contains exactly the governed contiguous 851–875 sequence', () => {
    expect(batch037).toHaveLength(25);
    expect(batch037.map((song) => song.sourceNumbering.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => 851 + index),
    );
    expect(batch037.map((song) => song.openingWords)).toEqual(expectedOpenings);
    expect(batch037.at(0)?.id).toBe('thiruppugazh-0851');
    expect(batch037.at(-1)?.id).toBe('thiruppugazh-0875');
    expect(batch037.at(-1)?.openingWords).toBe('கடகரிம ருப்பிற்க');
  });

  it('keeps every record on the governed Project Madurai Part III source lane', () => {
    expect(batch037.every((song) => song.sourceId === 'MHS13')).toBe(true);
    expect(batch037.every((song) => song.edition === 'Project Madurai Part III, verses 671–1000')).toBe(true);
    expect(batch037.every((song) => song.sourceNumbering.system === 'Project Madurai Part III')).toBe(true);
  });

  it('keeps every record fail-closed and metadata-only', () => {
    for (const song of batch037) {
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

  it('starts after the qualified 850 runtime and does not overrun this batch', () => {
    expect(batch037.every((song) => song.sourceNumbering.number > 850)).toBe(true);
    expect(batch037.every((song) => song.sourceNumbering.number <= 875)).toBe(true);
  });
});
