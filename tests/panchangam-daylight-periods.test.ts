import { describe, expect, it } from 'vitest';
import { calculateDaylightPeriods } from '../src/features/panchangam/daylight-periods';

// Synthetic twelve-hour daylight; no astronomical sunrise data or publication approval.
const cases = [
  ['2026-11-22', 7, 4], ['2026-11-23', 1, 6],
  ['2026-11-24', 6, 3], ['2026-11-25', 4, 1],
  ['2026-11-26', 5, 2], ['2026-11-27', 3, 0],
  ['2026-11-28', 2, 7],
] as const;
describe('Daylight period calculation', () => {
  it.each(cases)('computes %s from supplied sunrise/sunset', (date, rahu, yama) => {
    const rise = Date.parse(date + 'T01:00:00Z');
    const result = calculateDaylightPeriods(date, rise, rise + 43200000);
    const expected = (n: number) => ({ startUtc: rise + n * 5400000, endUtc: rise + (n + 1) * 5400000 });
    expect(result).toEqual({ rahuKalam: expected(rahu), yamaganda: expected(yama) });
  });
  it('handles noninteger daylight eighths without rounding early', () => {
    const rise = Date.parse('2026-11-27T01:00:00Z');
    const result = calculateDaylightPeriods('2026-11-27', rise, rise + 43199999);
    expect(result?.rahuKalam.startUtc).toBe(rise + 3 * 43199999 / 8);
  });
  it('rejects invalid calendar dates and solar intervals', () => {
    const rise = Date.parse('2026-11-27T01:00:00Z');
    for (const date of ['2026-02-30', '2026-13-01', '2026-11-27T00:00', 'invalid']) {
      expect(calculateDaylightPeriods(date, rise, rise + 43200000)).toBeNull();
    }
    for (const [start, end] of [[NaN, rise], [rise, Infinity], [rise, rise], [rise, rise - 1], [rise, rise + 86400000]]) {
      expect(calculateDaylightPeriods('2026-11-27', start, end)).toBeNull();
    }
  });
});
