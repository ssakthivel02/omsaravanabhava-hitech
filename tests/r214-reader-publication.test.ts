import { describe, expect, it } from 'vitest';
import { canPublishCanonicalSong } from '@/features/thiruppugazh/canPublishCanonicalSong';
import type { ThiruppugazhSong } from '@/content';

const ready: ThiruppugazhSong = {
  id: 'test-1', titleTa: 'சோதனை', openingWords: 'சோதனை',
  canonicalText: 'சோதனை வரி 1\nசோதனை வரி 2',
  canonicalTextStatus: 'VERIFIED_CANONICAL_TEXT',
  attribution: 'test witness', sourceId: 'test-witness',
  edition: 'test edition', sourceNumbering: { number: 1 },
  rightsStatus: 'PUBLISHABLE', verificationState: 'SOURCE_VERIFIED',
  meaningState: 'NOT_PUBLISHED', transliterationState: 'NOT_PUBLISHED',
  audioState: 'NO_APPROVED_AUDIO', publicationState: 'PUBLISHED_CANONICAL_TEXT',
};
const variant = (patch: Partial<ThiruppugazhSong>) => ({ ...ready, ...patch });

describe('R2.14 Tamil canonical reading publication gate', () => {
  it('allows explicitly verified and publishable on-site Tamil verse', () => {
    expect(canPublishCanonicalSong(ready)).toBe(true);
  });
  it.each([
    [{ canonicalText: null }, 'absent body'],
    [{ canonicalText: '  ' }, 'blank body'],
    [{ rightsStatus: 'PERMISSION_PENDING' }, 'rights pending'],
    [{ rightsStatus: 'HEADER_PRESERVATION_CONDITION_STATED' }, 'header condition unresolved'],
    [{ rightsStatus: null }, 'missing rights evidence'],
    [{ verificationState: 'SOURCE_VERIFIED_METADATA_ONLY' }, 'metadata-only source'],
    [{ canonicalTextStatus: 'SOURCE_LINKED_TEXT_NOT_IMPORTED' }, 'unverified canonical layer'],
    [{ publicationState: 'PUBLISHED_METADATA_ONLY_SOURCE_LINKED' }, 'metadata-only publication'],
    [{ sourceId: null }, 'missing source reference'],
    [{ edition: null }, 'missing edition'],
  ] as Array<[Partial<ThiruppugazhSong>, string]>)('blocks %s (%s)', (patch) => {
    expect(canPublishCanonicalSong(variant(patch))).toBe(false);
  });
  it('accepts explicit owner-confirmed reproduction rights with all other gates met', () => {
    expect(canPublishCanonicalSong(variant({ rightsStatus: 'OWNER_SUPPLIED_RIGHTS_CONFIRMED' }))).toBe(true);
  });
});
