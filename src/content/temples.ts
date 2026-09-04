/**
 * Temple corpus, deliberately kept OUT of the main content barrel.
 *
 * This is the largest content chunk (376 records). Importing it from the
 * barrel made it a static dependency of every route, so the home page
 * modulepreloaded ~295 kB it never used. Only temple/search routes — all of
 * which are lazy — import from here.
 */
import templesRaw from './temples.json';
import type { Temple } from './index';
import { normalizeSources } from './index';

export const temples = (templesRaw as Temple[]).map((t) => ({
  ...t,
  sources: normalizeSources(t.sources),
}));

export const templeById = (id: string): Temple | undefined =>
  temples.find((t) => t.id === id);

/**
 * A temple record carries several genuinely independent verification
 * dimensions. Historically the UI derived a single badge from
 * `coordinateConfidence` and let readers assume it described the whole
 * record (R2-CODE-005). This computes each dimension explicitly so a
 * caller can never accidentally present one as a stand-in for another.
 */
export interface TempleCompletenessSummary {
  documentedFields: number;
  totalFields: number;
  hasCoordinates: boolean;
  hasVisitorInformation: boolean;
}

export function templeCompleteness(t: Temple): TempleCompletenessSummary {
  const fields: (string | null)[] = [t.history, t.architecture, t.visitorInformation];
  return {
    documentedFields: fields.filter(Boolean).length,
    totalFields: fields.length,
    hasCoordinates: t.latitude !== null && t.longitude !== null,
    hasVisitorInformation: Boolean(t.visitorInformation),
  };
}
