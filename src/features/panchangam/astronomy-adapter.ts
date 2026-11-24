import { validateEngineEvaluation } from './engine-evaluation';
import { calculateDaylightPeriods } from './daylight-periods';

/** Calculation-only adapter boundary; no runtime dependency, content publication or provider approval. */
export type RawAstronomyResult = {
  dateLocal: string;
  sunriseUtc: number;
  sunsetUtc: number;
  sunriseFallback: boolean;
  sunsetFallback: boolean;
  tithi: { index: number; endTimeUtc: number };
  nakshatra: { index: number; endTimeUtc: number };
  yoga: { index: number; endTimeUtc: number };
  karana: { index: number; endTimeUtc: number };
  engine: { ayanamsa: string; version: string };
};
export type EvaluationResult = RawAstronomyResult & {
  periods: NonNullable<ReturnType<typeof calculateDaylightPeriods>>;
};
export type AstronomyCalculator = (input: {
  dateLocal: string; lat: 13.0827; lng: 80.2707; tz: 'Asia/Kolkata';
  ayanamsa: 'lahiri'; monthSystem: 'amanta';
}) => RawAstronomyResult | Promise<RawAstronomyResult>;

/**
 * Only accepts an explicitly supplied calculator. Does not fetch, install, or
 * approve astronomical sources. Returns null on invalid or incomplete output.
 */
export async function evaluateChennaiAstronomy(
  dateLocal: string, calculate: AstronomyCalculator,
): Promise<EvaluationResult | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateLocal) || typeof calculate !== 'function') return null;
  const date = new Date(dateLocal + 'T00:00:00Z');
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dateLocal) return null;
  try {
    const raw = await calculate({
      dateLocal, lat: 13.0827, lng: 80.2707, tz: 'Asia/Kolkata',
      ayanamsa: 'lahiri', monthSystem: 'amanta',
    });
    if (!raw || typeof raw !== 'object') return null;
    const periods = calculateDaylightPeriods(dateLocal, raw.sunriseUtc, raw.sunsetUtc);
    if (!periods) return null;
    const result: EvaluationResult = { ...raw, periods };
    return validateEngineEvaluation(result, dateLocal) ? result : null;
  } catch {
    return null;
  }
}
