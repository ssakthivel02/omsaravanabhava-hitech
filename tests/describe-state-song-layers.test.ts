import { describe, it, expect } from 'vitest';
import { describeState, thiruppugazh } from '@/content';

describe('describeState for song text status', () => {
  it('maps SOURCE_LINKED_TEXT_NOT_IMPORTED to readable labels in both languages', () => {
    expect(describeState('SOURCE_LINKED_TEXT_NOT_IMPORTED', 'en')).toEqual({
      label: 'Source linked · text not yet imported',
      tone: 'pending',
    });
    const ta = describeState('SOURCE_LINKED_TEXT_NOT_IMPORTED', 'ta');
    expect(ta.label).not.toBe('SOURCE_LINKED_TEXT_NOT_IMPORTED');
    expect(/[\u0B80-\u0BFF]/u.test(ta.label)).toBe(true);
    expect(ta.tone).toBe('pending');
  });

  it('never shows a raw state code for any Thiruppugazh record text status', () => {
    expect(thiruppugazh.length).toBeGreaterThanOrEqual(1326);
    for (const song of thiruppugazh) {
      for (const locale of ['ta', 'en'] as const) {
        const { label } = describeState(song.canonicalTextStatus, locale);
        expect(label, `${song.id} (${locale})`).not.toBe(song.canonicalTextStatus);
        expect(label, `${song.id} (${locale})`).not.toMatch(/[A-Z]{3,}_[A-Z]{3,}/);
      }
    }
  });
});
