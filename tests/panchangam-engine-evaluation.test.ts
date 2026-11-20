import { describe, expect, it } from 'vitest';
import { validateEngineEvaluation } from '../src/features/panchangam/engine-evaluation';

// Synthetic structural fixtures, not astronomical reference data.
const rise = Date.parse('2026-11-20T01:00:00Z');
const set = rise + 12 * 3600000;
const segment = (n: number) => ({ startUtc: rise + n * 5400000, endUtc: rise + (n + 1) * 5400000 });
const valid = () => ({
  dateLocal: '2026-11-20', sunriseUtc: rise, sunsetUtc: set,
  sunriseFallback: false, sunsetFallback: false,
  tithi: { index: 30, endTimeUtc: set }, nakshatra: { index: 27, endTimeUtc: set },
  yoga: { index: 27, endTimeUtc: set }, karana: { index: 60, endTimeUtc: set },
  periods: { rahuKalam: segment(3), yamaganda: segment(0) },
  engine: { ayanamsa: 'lahiri', version: '1.0.0' },
});
const check = (x: unknown) => validateEngineEvaluation(x, '2026-11-20');
describe('Unapproved calculation output boundary', () => {
  it('accepts structurally plausible synthetic output only', () => expect(check(valid())).toBe(true));
  it('rejects missing solar event evidence', () => {
    for (const x of [{ sunriseFallback: true }, { sunsetFallback: true }, { sunriseFallback: undefined }])
      expect(check({ ...valid(), ...x })).toBe(false);
  });
  it('rejects wrong dates and invalid solar intervals', () => {
    for (const x of [{ dateLocal: '2026-11-19' }, { sunriseUtc: NaN }, { sunsetUtc: rise }, { sunsetUtc: Infinity }, { sunriseUtc: -8.64e15 }])
      expect(check({ ...valid(), ...x })).toBe(false);
  });
  it('rejects invalid limb indices and transitions', () => {
    for (const tithi of [{ index: 31, endTimeUtc: set }, { index: 1.5, endTimeUtc: set }, { index: 1, endTimeUtc: rise }, { index: 1, endTimeUtc: rise + 41 * 3600000 }])
      expect(check({ ...valid(), tithi })).toBe(false);
  });
  it('rejects wrong method or version', () => {
    expect(check({ ...valid(), engine: { ayanamsa: 'raman', version: '1.0.0' } })).toBe(false);
    expect(check({ ...valid(), engine: { ayanamsa: 'lahiri', version: '2.0.0' } })).toBe(false);
  });
  it('rejects overlapping, inverted and out-of-day periods', () => {
    for (const rahuKalam of [segment(0), segment(8), { startUtc: set, endUtc: rise }, { startUtc: rise, endUtc: rise + 1 }])
      expect(check({ ...valid(), periods: { ...valid().periods, rahuKalam } })).toBe(false);
  });
  it('rejects incomplete or malformed output', () => {
    for (const x of [null, {}, [], { ...valid(), periods: null }, { ...valid(), tithi: null }])
      expect(check(x)).toBe(false);
  });
});

describe('Weekday-specific evaluation convention', () => {
  it.each([[22,7,4],[23,1,6],[24,6,3],[25,4,1],[26,5,2],[27,3,0],[28,2,7]])(
    'checks November %i daylight segment allocation', (day, rahu, yama) => {
      const dateLocal = '2026-11-' + day;
      const offset = Date.parse(dateLocal + 'T01:00:00Z') - rise;
      const shift = (n: number) => ({ startUtc: segment(n).startUtc + offset, endUtc: segment(n).endUtc + offset });
      const limb = (index: number) => ({ index, endTimeUtc: set + offset });
      const record = { ...valid(), dateLocal, sunriseUtc: rise + offset, sunsetUtc: set + offset,
        tithi: limb(30), nakshatra: limb(27), yoga: limb(27), karana: limb(60),
        periods: { rahuKalam: shift(rahu), yamaganda: shift(yama) } };
      expect(validateEngineEvaluation(record, dateLocal)).toBe(true);
      expect(validateEngineEvaluation({ ...record, periods: { rahuKalam: shift(yama), yamaganda: shift(rahu) } }, dateLocal)).toBe(false);
    });
});
