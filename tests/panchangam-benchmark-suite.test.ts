import { describe, expect, it } from 'vitest';
import { evaluateBenchmarkSuite, type BenchmarkCase } from '../src/features/panchangam/benchmark-suite';

// Synthetic fixture generator tests the coverage gate only, not astronomical correctness.
const make = (dateLocal: string, scenario: BenchmarkCase['scenario']): BenchmarkCase => {
  const rise = Date.parse(dateLocal + 'T01:00:00Z');
  const set = rise + 43200000;
  const weekday = new Date(dateLocal + 'T00:00:00Z').getUTCDay();
  const rahu = [7,1,6,4,5,3,2][weekday]!;
  const yama = [4,6,3,1,2,0,7][weekday]!;
  const interval = (n: number) => ({ startUtc: rise + n * 5400000, endUtc: rise + (n + 1) * 5400000 });
  const limb = (index: number) => ({ index, endTimeUtc: set });
  const candidate = { dateLocal, sunriseUtc: rise, sunsetUtc: set,
    sunriseFallback: false, sunsetFallback: false, tithi: limb(1), nakshatra: limb(2),
    yoga: limb(3), karana: limb(4), periods: { rahuKalam: interval(rahu), yamaganda: interval(yama) },
    engine: { ayanamsa: 'lahiri', version: '1.0.0' } };
  return { scenario, candidate, reference: {
    dateLocal, referenceId: 'synthetic-only', referenceUrl: 'https://example.org/synthetic',
    independentlyReviewed: true, location: 'Chennai', latitude: 13.0827, longitude: 80.2707,
    timezone: 'Asia/Kolkata', ayanamsa: 'lahiri', monthSystem: 'amanta',
    sunriseUtc: rise, sunsetUtc: set, tithi: limb(1), nakshatra: limb(2),
    yoga: limb(3), karana: limb(4), rahuKalam: interval(rahu), yamaganda: interval(yama),
  } };
};
const full = (): BenchmarkCase[] => [
  ...[22,23,24,25,26,27,28].map(d => make('2026-11-' + d, 'weekday')),
  make('2026-11-20', 'new-moon'), make('2026-11-20', 'full-moon'),
  make('2026-11-20', 'limb-transition'), make('2026-11-20', 'tamil-month-boundary'),
  make('2026-11-20', 'chennai-midnight'),
];
describe('Benchmark suite coverage gate (synthetic only)', () => {
  it('requires seven weekdays and every edge-case category', () => expect(evaluateBenchmarkSuite(full()).passed).toBe(true));
  it('rejects absent weekday and missing scenario', () => {
    const result = evaluateBenchmarkSuite(full().filter(x => x.reference.dateLocal !== '2026-11-22' && x.scenario !== 'new-moon'));
    expect(result.missing).toContain('weekday-0');
    expect(result.missing).toContain('new-moon');
  });
  it('does not count a failed weekday comparison toward coverage', () => {
    const cases = full();
    cases[0] = { ...cases[0]!, candidate: { ...(cases[0]!.candidate as object), sunriseFallback: true } };
    const result = evaluateBenchmarkSuite(cases);
    expect(result.missing).toContain('weekday-0');
    expect(result.failures[0]?.reasons).toContain('candidate-validation');
  });
  it('rejects an empty suite', () => {
    const result = evaluateBenchmarkSuite([]);
    expect(result.passed).toBe(false);
    expect(result.missing.length).toBe(13);
  });
});
