import { describe, expect, it } from 'vitest';
import { chennaiToday, isPublishablePanchangam } from './validation';

const now = new Date('2026-11-12T06:00:00.000Z');
const valid = () => ({
  schemaVersion: '1.0', date: '2026-11-12', timezone: 'Asia/Kolkata',
  location: { name: 'Chennai' }, status: 'verified',
  source: { provider: 'Licensed provider', citation: 'source-ref', licence: 'licensed' },
  calculation: { method: 'declared', verifiedAt: '2026-11-12T05:00:00.000Z' },
  fields: { tithi: 'a', nakshatra: 'b', yoga: 'c', karana: 'd', rahuKalam: 'e', yamagandam: 'f', nallaNeram: 'g' },
  noticeTa: '',
});
describe('Panchangam publication gate', () => {
  it('uses Chennai calendar date across UTC boundary', () => {
    expect(chennaiToday(new Date('2026-11-11T20:00:00.000Z'))).toBe('2026-11-12');
  });
  it('accepts a complete, sourced same-day record', () => expect(isPublishablePanchangam(valid(), now)).toBe(true));
  it('rejects stale records', () => expect(isPublishablePanchangam({ ...valid(), date: '2026-11-11' }, now)).toBe(false));
  it('rejects pending records', () => expect(isPublishablePanchangam({ ...valid(), status: 'pending' }, now)).toBe(false));
  it('rejects missing licences', () => expect(isPublishablePanchangam({ ...valid(), source: { ...valid().source, licence: null } }, now)).toBe(false));
  it('rejects missing time fields', () => expect(isPublishablePanchangam({ ...valid(), fields: { ...valid().fields, rahuKalam: null } }, now)).toBe(false));
  it('rejects future verification timestamps', () => expect(isPublishablePanchangam({ ...valid(), calculation: { ...valid().calculation, verifiedAt: '2026-11-13T00:00:00Z' } }, now)).toBe(false));
});
