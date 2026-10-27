import { describe, expect, it } from 'vitest';
import { thiruppugazh } from '@/content';
import { findSongByReferenceNumber } from '@/features/thiruppugazh/findSongByNumber';

describe('Exact internal song number navigation', () => {
  it('finds a known source-indexed song without leaving the site', () => {
    expect(findSongByReferenceNumber(thiruppugazh, '6')?.id).toBe('thiruppugazh-0006');
  });
  it('allows leading zeros and whitespace', () => {
    expect(findSongByReferenceNumber(thiruppugazh, ' 0006 ')?.id).toBe('thiruppugazh-0006');
  });
  it.each(['', '0', '-1', '1327', '1.2', 'abc', '6abc', '9999999'])(
    'rejects invalid number input %s', (input) => {
      expect(findSongByReferenceNumber(thiruppugazh, input)).toBeUndefined();
    },
  );
  it('does not manufacture an entry for an absent number', () => {
    expect(findSongByReferenceNumber([], '93')).toBeUndefined();
  });
});
