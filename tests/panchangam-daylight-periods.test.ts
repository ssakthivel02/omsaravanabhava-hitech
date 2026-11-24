import { describe, expect, it } from 'vitest';
import { calculateDaylightPeriods } from '../src/features/panchangam/daylight-periods';

// Synthetic twelve-hour daylight; no astronomical sunrise data or publication approval.
const cases = [
  ['2026-11-22', 7, 4], ['2026-11-23', 1, 3],
  ['2026-11-24', 6, 2], ['2026-11-25', 4, 1],
  ['2026-11-26', 5, 0], ['2026-11-27', 3, 6],
  ['2026-11-28', 2, 5],
] as const;
describe('Daylight period calculation', () => {
  it.each(cases)('computes %s from supplied sunrise/sunset', (date, rahu, yama) => {
    const rise = Date.parse(date + 'T01:00:00Z');
    const result = calculateDaylightPeriods(date, rise, rise + 43200000);
    const expected = (n: number) => ({ startUtc: rise + n * 5400000, endUtc: rise + (n + 1) * 5400000 });
    expect(result).toEqual({ rahuKalam: expected(rahu), yamaganda: expected(yama) });
  });
  it('matches Rashtriya Panchang Chennai daylight periods for 24 Nov 2026', () => {
    // IMD/Positional Astronomy Centre station table: Chennai sunrise 06:12,
    // sunset 17:40 IST. Tuesday daylight eighths therefore place Yamaganda
    // in segment 2 (09:04–10:30) and Rahu Kalam in segment 6 (14:48–16:14).
    const rise = Date.parse('2026-11-24T00:42:00Z');
    const set = Date.parse('2026-11-24T12:10:00Z');
    expect(calculateDaylightPeriods('2026-11-24', rise, set)).toEqual({
      rahuKalam: {
        startUtc: Date.parse('2026-11-24T09:18:00Z'),
        endUtc: Date.parse('2026-11-24T10:44:00Z'),
      },
      yamaganda: {
        startUtc: Date.parse('2026-11-24T03:34:00Z'),
        endUtc: Date.parse('2026-11-24T05:00:00Z'),
      },
    });
  });
  it('handles noninteger daylight eighths without rounding early', () => {
    const rise = Date.parse('2026-11-27T01:00:00Z');
    const result = calculateDaylightPeriods('2026-11-27', rise, rise + 43199999);
    expect(result?.rahuKalam.startUtc).toBe(rise + 3 * 43199999 / 8);
  });
  it('rejects solar events from another Chennai calendar date', () => {
    const rise = Date.parse('2026-11-27T01:00:00Z');
    expect(calculateDaylightPeriods('2026-11-26', rise, rise + 43200000)).toBeNull();
    expect(calculateDaylightPeriods('2026-11-27', rise - 86400000, rise - 43200000)).toBeNull();
    expect(calculateDaylightPeriods('2026-11-27', rise, rise + 72000000)).toBeNull();
  });
  it('rejects invalid calendar dates and solar intervals', () => {
    const rise = Date.parse('2026-11-27T01:00:00Z');
    for (const date of ['2026-02-30', '2026-13-01', '2026-11-27T00:00', 'invalid']) {
      expect(calculateDaylightPeriods(date, rise, rise + 43200000)).toBeNull();
    }
    for (const [start, end] of ([[NaN, rise], [rise, Infinity], [rise, rise], [rise, rise - 1], [rise, rise + 86400000]] as [number, number][])) {
      expect(calculateDaylightPeriods('2026-11-27', start, end)).toBeNull();
    }
  });
});
