import { describe, expect, it, vi } from 'vitest';
import { evaluateChennaiAstronomy } from '../src/features/panchangam/astronomy-adapter';
// Synthetic calculator contract tests only; not independent astronomical data.
const rise = Date.parse('2026-11-20T01:00:00Z');
const set = rise + 43200000;
const raw = () => ({
  dateLocal: '2026-11-20', sunriseUtc: rise, sunsetUtc: set,
  sunriseFallback: false, sunsetFallback: false,
  tithi: { index: 1, endTimeUtc: set }, nakshatra: { index: 2, endTimeUtc: set },
  yoga: { index: 3, endTimeUtc: set }, karana: { index: 4, endTimeUtc: set },
  engine: { ayanamsa: 'lahiri', version: '1.0.0' },
});
describe('Chennai calculation-only adapter', () => {
  it('passes explicit fixed calculation parameters and derives periods', async () => {
    const calculator = vi.fn(async () => raw());
    const result = await evaluateChennaiAstronomy('2026-11-20', calculator);
    expect(calculator).toHaveBeenCalledWith({
      dateLocal: '2026-11-20', lat: 13.0827, lng: 80.2707,
      tz: 'Asia/Kolkata', ayanamsa: 'lahiri', monthSystem: 'amanta',
    });
    expect(result?.periods.rahuKalam).toEqual({ startUtc: rise + 3 * 5400000, endUtc: rise + 4 * 5400000 });
  });
  it('rejects wrong dates before invoking calculator', async () => {
    const calculator = vi.fn(() => raw());
    expect(await evaluateChennaiAstronomy('2026-02-30', calculator)).toBeNull();
    expect(calculator).not.toHaveBeenCalled();
  });
  it('rejects fallback solar events and wrong calculation conventions', async () => {
    expect(await evaluateChennaiAstronomy('2026-11-20', () => ({ ...raw(), sunriseFallback: true }))).toBeNull();
    expect(await evaluateChennaiAstronomy('2026-11-20', () => ({ ...raw(), engine: { ayanamsa: 'raman', version: '1.0.0' } }))).toBeNull();
  });
  it('rejects wrong-day solar events and invalid limb indices', async () => {
    expect(await evaluateChennaiAstronomy('2026-11-20', () => ({ ...raw(), sunriseUtc: rise - 86400000 }))).toBeNull();
    expect(await evaluateChennaiAstronomy('2026-11-20', () => ({ ...raw(), tithi: { index: 31, endTimeUtc: set } }))).toBeNull();
  });
  it('fails closed when calculator throws', async () => {
    expect(await evaluateChennaiAstronomy('2026-11-20', () => { throw new Error('offline'); })).toBeNull();
  });
});
