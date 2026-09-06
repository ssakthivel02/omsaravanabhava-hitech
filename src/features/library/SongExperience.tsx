import SongDetail from '@/features/thiruppugazh/SongDetail';

/**
 * Lazy route boundary retained for bundle separation. R2.6's local
 * Save/Recent and canonical-text read-aloud controls live in SongDetail so
 * the route renders one authoritative set of controls, never duplicates.
 */
export default function SongExperience() {
  return <SongDetail />;
}
