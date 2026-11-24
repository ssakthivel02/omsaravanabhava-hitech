import type { AstronomyCalculator, RawAstronomyResult } from './astronomy-adapter';

/**
 * A narrow bridge for the pinned upstream dailyPanchanga calculation function.
 * The caller must supply a reviewed calculation-only import; this module never
 * imports the upstream root barrel or its unverified compatibility tables.
 * Evaluation only: not a source approval, benchmark result, or publishing path.
 */
export type UpstreamDailyPanchanga = (request: {
  dateLocal: string; lat: number; lng: number; tz: string;
  ayanamsa: 'lahiri'; monthSystem: 'amanta';
}) => unknown | Promise<unknown>;

const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const limb = (value: unknown): RawAstronomyResult['tithi'] | null => {
  if (!record(value) || typeof value.index !== 'number' ||
      typeof value.endTimeUtc !== 'number') return null;
  return { index: value.index, endTimeUtc: value.endTimeUtc };
};

/** Adapts upstream output, retaining only calculation fields required by evaluation. */
export function bridgeUpstreamCalculator(upstream: UpstreamDailyPanchanga): AstronomyCalculator {
  return async (input) => {
    const value = await upstream(input);
    if (!record(value) || !record(value.engine)) throw new Error('invalid-upstream-result');
    const tithi = limb(value.tithi);
    const nakshatra = limb(value.nakshatra);
    const yoga = limb(value.yoga);
    const karana = limb(value.karana);
    if (!tithi || !nakshatra || !yoga || !karana ||
        typeof value.dateLocal !== 'string' || typeof value.sunriseUtc !== 'number' ||
        typeof value.sunsetUtc !== 'number' || typeof value.sunriseFallback !== 'boolean' ||
        typeof value.sunsetFallback !== 'boolean' ||
        typeof value.engine.ayanamsa !== 'string' || typeof value.engine.version !== 'string')
      throw new Error('invalid-upstream-result');
    return {
      dateLocal: value.dateLocal, sunriseUtc: value.sunriseUtc, sunsetUtc: value.sunsetUtc,
      sunriseFallback: value.sunriseFallback, sunsetFallback: value.sunsetFallback,
      tithi, nakshatra, yoga, karana,
      engine: { ayanamsa: value.engine.ayanamsa, version: value.engine.version },
    };
  };
}
