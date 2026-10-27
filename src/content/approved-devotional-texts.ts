/**
 * First-party Tamil devotional text publication registry.
 * Do not paste the owner's PDFs, third-party modern transcriptions or commentary.
 * Add only reviewed works with documented reproduction rights and edition provenance.
 */
export interface ApprovedDevotionalText {
  workId: string;
  sourceId: string;
  editionId: string;
  canonicalTamil: string;
  sourceVerification: 'SOURCE_VERIFIED';
  rightsState: 'PUBLISHABLE' | 'OWNER_SUPPLIED_RIGHTS_CONFIRMED';
  publicationState: 'PUBLISHED_CANONICAL_TEXT';
  attribution: string;
  rightsEvidenceId: string;
}

/** Empty until the specific *edition* is verified and rights-cleared. */
export const approvedDevotionalTexts: readonly ApprovedDevotionalText[] = [];

export function canRenderDevotionalText(
  work: { id: string | null; rightsState?: string },
  text: ApprovedDevotionalText | undefined,
): text is ApprovedDevotionalText {
  return Boolean(
    work.id && text &&
    work.id === text.workId &&
    work.rightsState === 'PUBLISHABLE' &&
    text.rightsState === 'PUBLISHABLE' &&
    text.sourceVerification === 'SOURCE_VERIFIED' &&
    text.publicationState === 'PUBLISHED_CANONICAL_TEXT' &&
    text.canonicalTamil.trim() &&
    text.editionId.trim() &&
    text.sourceId.trim() &&
    text.attribution.trim() &&
    text.rightsEvidenceId.trim(),
  );
}
