import { describe, expect, it } from 'vitest';
import { approvedDevotionalTexts, canRenderDevotionalText, type ApprovedDevotionalText } from '@/content/approved-devotional-texts';
const eligible: ApprovedDevotionalText = {
  workId: 'test-work', sourceId: 'edition-source', editionId: 'edition-v1',
  canonicalTamil: 'சோதனை தமிழ் பாடல்\nஇரண்டாவது வரி',
  sourceVerification: 'SOURCE_VERIFIED', rightsState: 'PUBLISHABLE',
  publicationState: 'PUBLISHED_CANONICAL_TEXT', attribution: 'Reviewed test fixture',
  rightsEvidenceId: 'test-permission',
};
describe('Tamil devotional book reader publication gate', () => {
  it('starts with no uncleared imported texts', () => {
    expect(approvedDevotionalTexts).toHaveLength(0);
  });
  it('allows a verified, matched, rights-cleared edition', () => {
    expect(canRenderDevotionalText({ id: 'test-work', rightsState: 'PUBLISHABLE' }, eligible)).toBe(true);
  });
  it.each([
    [{ id: 'other-work', rightsState: 'PUBLISHABLE' }, eligible],
    [{ id: 'test-work', rightsState: 'RIGHTS_UNCERTAIN_OR_METADATA_ONLY' }, eligible],
    [{ id: 'test-work', rightsState: 'PUBLISHABLE' }, { ...eligible, canonicalTamil: ' ' }],
    [{ id: 'test-work', rightsState: 'PUBLISHABLE' }, { ...eligible, sourceVerification: 'PENDING' }],
    [{ id: 'test-work', rightsState: 'PUBLISHABLE' }, { ...eligible, rightsState: 'PERMISSION_PENDING' }],
    [{ id: 'test-work', rightsState: 'PUBLISHABLE' }, { ...eligible, rightsEvidenceId: '' }],
  ])('blocks unauthorized or incomplete work', (work, record) => {
    expect(canRenderDevotionalText(work, record as ApprovedDevotionalText)).toBe(false);
  });
});
