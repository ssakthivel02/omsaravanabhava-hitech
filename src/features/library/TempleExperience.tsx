import TempleDetail from '@/features/temples/TempleDetail';

/**
 * Route boundary kept as a separate lazy chunk so the 376-record temple
 * corpus remains off the home bundle. R2.6's local Save/Recent/read-aloud
 * controls now live inside TempleDetail itself, avoiding duplicate controls
 * when this boundary renders the detail page.
 */
export default function TempleExperience() {
  return <TempleDetail />;
}
