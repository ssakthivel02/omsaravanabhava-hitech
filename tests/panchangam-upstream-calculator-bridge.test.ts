import { describe, expect, it, vi } from 'vitest';
import { bridgeUpstreamCalculator } from '../src/features/panchangam/upstream-calculator-bridge';
import { evaluateChennaiAstronomy } from '../src/features/panchangam/astronomy-adapter';
// Synthetic upstream payload only; no independent astronomical verification.
const rise = Date.parse('2026-11-20T01:00:00Z');
const set = rise + 43200000;
const payload = () => ({
  dateLocal: '2026-11-20', sunriseUtc: rise, sunsetUtc: set,
  sunriseFallback: false, sunsetFallback: false,
  tithi: { index: 1, endTimeUtc: set, name: 'not-for-publication' },
  nakshatra: { index: 2, endTimeUtc: set }, yoga: { index: 3, endTimeUtc: set },
  karana: { index: 4, endTimeUtc: set },
  engine: { name: 'vasavi-panchanga', version: '1.0.0', ayanamsa: 'lahiri' },
  unrelatedCompatibilityTable: { forbidden: true },
});
describe('Calculation-only upstream bridge', () => {
  it('passes pinned calculation parameters and strips unrelated fields', async () => {
    const upstream = vi.fn(() => payload());
    const result = await evaluateChennaiAstronomy('2026-11-20', bridgeUpstreamCalculator(upstream));
    expect(upstream).toHaveBeenCalledWith({
      dateLocal: '2026-11-20', lat: 13.0827, lng: 80.2707,
      tz: 'Asia/Kolkata', ayanamsa: 'lahiri', monthSystem: 'amanta',
    });
    expect(result?.tithi).toEqual({ index: 1, endTimeUtc: set });
    expect(result).not.toHaveProperty('unrelatedCompatibilityTable');
  });
  it('rejects missing upstream limbs', async () => {
    const result = await evaluateChennaiAstronomy('2026-11-20',
      bridgeUpstreamCalculator(() => ({ ...payload(), yoga: undefined })));
    expect(result).toBeNull();
  });
  it('rejects upstream fallback and mismatched engine metadata', async () => {
    expect(await evaluateChennaiAstronomy('2026-11-20',
      bridgeUpstreamCalculator(() => ({ ...payload(), sunsetFallback: true })))).toBeNull();
    expect(await evaluateChennaiAstronomy('2026-11-20',
      bridgeUpstreamCalculator(() => ({ ...payload(), engine: { version: '2.0.0', ayanamsa: 'lahiri' } })))).toBeNull();
  });
  it('fails closed on upstream exceptions', async () => {
    expect(await evaluateChennaiAstronomy('2026-11-20',
      bridgeUpstreamCalculator(() => { throw new Error('unavailable'); }))).toBeNull();
  });
});
