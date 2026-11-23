import { describe, expect, it } from 'vitest';
import { benchmarkEngine, type BenchmarkReference } from '../src/features/panchangam/engine-benchmark';
// Synthetic values verify comparison logic; not independent astronomical evidence.
const rise = Date.parse('2026-11-20T01:00:00Z');
const set = rise + 43200000;
const interval = (n: number) => ({ startUtc: rise + n * 5400000, endUtc: rise + (n + 1) * 5400000 });
const candidate = () => ({ dateLocal: '2026-11-20', sunriseUtc: rise, sunsetUtc: set,
  sunriseFallback: false, sunsetFallback: false,
  tithi: { index: 1, endTimeUtc: set }, nakshatra: { index: 2, endTimeUtc: set },
  yoga: { index: 3, endTimeUtc: set }, karana: { index: 4, endTimeUtc: set },
  periods: { rahuKalam: interval(3), yamaganda: interval(0) },
  engine: { ayanamsa: 'lahiri', version: '1.0.0' } });
const reference = (): BenchmarkReference => {
  const c = candidate();
  return { dateLocal: c.dateLocal, location: 'Chennai', latitude: 13.0827, longitude: 80.2707,
    timezone: 'Asia/Kolkata', monthSystem: 'amanta', ayanamsa: 'lahiri',
    independentlyReviewed: true, referenceId: 'synthetic-only', referenceUrl: 'https://example.org/synthetic',
    sunriseUtc: c.sunriseUtc, sunsetUtc: c.sunsetUtc, tithi: c.tithi, nakshatra: c.nakshatra,
    yoga: c.yoga, karana: c.karana, rahuKalam: c.periods.rahuKalam, yamaganda: c.periods.yamaganda };
};
describe('Benchmark comparison contract (synthetic, not astronomy)', () => {
  it('compares matching synthetic values', () => expect(benchmarkEngine(candidate(), reference())).toEqual([]));
  it('rejects unreviewed evidence', () =>
    expect(benchmarkEngine(candidate(), { ...reference(), independentlyReviewed: false })).toContain('reference-provenance'));
  it('rejects mismatched coordinates and calendar convention', () => {
    expect(benchmarkEngine(candidate(), { ...reference(), latitude: 13.1 as 13.0827 })).toContain('reference-provenance');
    expect(benchmarkEngine(candidate(), { ...reference(), monthSystem: 'purnimanta' as 'amanta' })).toContain('reference-provenance');
  });
  it('rejects unsafe source URLs', () => {
    for (const referenceUrl of ['https://user:pass@example.org/a', 'https://example.org:8443/a',
      'http://example.org/a', 'https://example.org/a#frag', 'not-a-url', 'https://localhost/a']) {
      expect(benchmarkEngine(candidate(), { ...reference(), referenceUrl })).toContain('reference-provenance');
    }
  });
  it('rejects wrong limb index', () =>
    expect(benchmarkEngine(candidate(), { ...reference(), tithi: { index: 2, endTimeUtc: set } })).toContain('tithi-index'));
  it('detects transition discrepancies', () =>
    expect(benchmarkEngine(candidate(), { ...reference(), yoga: { index: 3, endTimeUtc: set + 121000 } })).toContain('yoga-transition'));
  it('rejects invalid tolerance and invalid candidate', () => {
    expect(benchmarkEngine(candidate(), reference(), Infinity)).toContain('tolerance');
    expect(benchmarkEngine({ ...candidate(), sunriseFallback: true }, reference())).toContain('candidate-validation');
  });
});
