import { describe, it, expect } from 'vitest';
import { neighboringSongs } from '@/features/thiruppugazh/songNavigation';
import { thiruppugazh } from '@/content';

describe('Internal Tiruppugazh reading navigation', () => {
  it('does not invent missing song records', () => {
    expect(neighboringSongs(thiruppugazh, 'this-song-does-not-exist')).toEqual({});
  });
  it('has no previous entry on the first indexed song', () => {
    const result = neighboringSongs(thiruppugazh, thiruppugazh[0]!.id);
    expect(result.previous).toBeUndefined();
    expect(result.next?.id).toBe(thiruppugazh[1]!.id);
  });
  it('has no next entry after the last indexed song', () => {
    const result = neighboringSongs(thiruppugazh, thiruppugazh[thiruppugazh.length - 1]!.id);
    expect(result.next).toBeUndefined();
    expect(result.previous?.id).toBe(thiruppugazh[thiruppugazh.length - 2]!.id);
  });
  it('navigates to exactly the neighboring existing catalogue entries', () => {
    const middle = Math.floor(thiruppugazh.length / 2);
    const result = neighboringSongs(thiruppugazh, thiruppugazh[middle]!.id);
    expect(result.previous?.id).toBe(thiruppugazh[middle - 1]!.id);
    expect(result.next?.id).toBe(thiruppugazh[middle + 1]!.id);
  });
});
