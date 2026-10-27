import type { ThiruppugazhSong } from '@/content';

/**
 * Rendering the sacred text requires independent positive evidence in every
 * relevant dimension. A populated string is never a publication licence.
 * Reference-only and legacy metadata states fail closed.
 */
export function canPublishCanonicalSong(song: ThiruppugazhSong): boolean {
  return Boolean(
    typeof song.canonicalText === 'string' &&
    song.canonicalText.trim().length > 0 &&
    song.sourceId?.trim() &&
    song.edition?.trim() &&
    song.verificationState === 'SOURCE_VERIFIED' &&
    song.canonicalTextStatus === 'VERIFIED_CANONICAL_TEXT' &&
    song.publicationState === 'PUBLISHED_CANONICAL_TEXT' &&
    (song.rightsStatus === 'PUBLISHABLE' ||
      song.rightsStatus === 'OWNER_SUPPLIED_RIGHTS_CONFIRMED'),
  );
}
