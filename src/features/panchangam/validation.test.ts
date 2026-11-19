import { describe, expect, it } from 'vitest';
import { chennaiToday, isPublishablePanchangam, matchesApprovedSource } from './validation';

const now = new Date('2026-11-12T06:00:00.000Z');
const valid = () => ({
  schemaVersion: '1.0', date: '2026-11-12', timezone: 'Asia/Kolkata',
  location: { name: 'Chennai' }, status: 'verified',
  source: { provider: 'Licensed provider', citation: 'https://example.org/panchangam/source', licence: 'licensed' },
  calculation: { method: 'declared', verifiedAt: '2026-11-12T05:00:00.000Z' },
  fields: { tithi: 'a', nakshatra: 'b', yoga: 'c', karana: 'd', rahuKalam: 'e', yamagandam: 'f', nallaNeram: 'g' },
  fieldEvidence: Object.fromEntries(Object.entries({ tithi: 'a', nakshatra: 'b', yoga: 'c', karana: 'd', rahuKalam: 'e', yamagandam: 'f', nallaNeram: 'g' }).map(([key, value]) => [key, { value, citation: 'https://example.org/panchangam/source', verifiedAt: '2026-11-12T05:00:00.000Z' }])),
  noticeTa: '',
});
const testApprovals = [{ provider: 'Licensed provider', origin: 'https://example.org', licence: 'licensed', rightsEvidence: 'synthetic test evidence only' }];

describe('Panchangam publication gate', () => {
  it('uses Chennai calendar date across UTC boundary', () => {
    expect(chennaiToday(new Date('2026-11-11T20:00:00.000Z'))).toBe('2026-11-12');
  });
  it('accepts a complete, sourced same-day record', () => expect(isPublishablePanchangam(valid(), now, testApprovals)).toBe(true));
  it('denies structurally valid records without production approval', () => expect(isPublishablePanchangam(valid(), now)).toBe(false));
  it('rejects stale records', () => expect(isPublishablePanchangam({ ...valid(), date: '2026-11-11' }, now, testApprovals)).toBe(false));
  it('rejects pending records', () => expect(isPublishablePanchangam({ ...valid(), status: 'pending' }, now, testApprovals)).toBe(false));
  it('rejects missing licences', () => expect(isPublishablePanchangam({ ...valid(), source: { ...valid().source, licence: null } }, now, testApprovals)).toBe(false));
  it('rejects missing time fields', () => expect(isPublishablePanchangam({ ...valid(), fields: { ...valid().fields, rahuKalam: null } }, now, testApprovals)).toBe(false));
  it('rejects future verification timestamps', () => expect(isPublishablePanchangam({ ...valid(), calculation: { ...valid().calculation, verifiedAt: '2026-11-13T00:00:00Z' } }, now, testApprovals)).toBe(false));
  it('rejects wrong location', () => expect(isPublishablePanchangam({ ...valid(), location: { name: 'London' } }, now, testApprovals)).toBe(false));
  it('rejects yesterday verification despite a today label', () => expect(isPublishablePanchangam({ ...valid(), calculation: { ...valid().calculation, verifiedAt: '2026-11-11T12:00:00Z' } }, now, testApprovals)).toBe(false));
  it('rejects non-auditable source citations', () => expect(isPublishablePanchangam({ ...valid(), source: { ...valid().source, citation: 'source-ref' } }, now, testApprovals)).toBe(false));
  it('rejects malformed location names without throwing', () => {
    for (const name of [123, true, {}, [], null, undefined]) {
      expect(isPublishablePanchangam({ ...valid(), location: { name } }, now, testApprovals)).toBe(false);
    }
  });

  it('rejects credential-bearing and non-default-port source citations', () => {
    for (const citation of [
      'https://user@example.org/source',
      'https://user:password@example.org/source',
      'https://example.org:8443/source',
      'http://example.org/source',
      'https://localhost/source',
    ]) {
      expect(isPublishablePanchangam({ ...valid(), source: { ...valid().source, citation } }, now, testApprovals)).toBe(false);
    }
  });
});

describe('Reviewed Panchangam source registry', () => {
  const approval = { provider: 'Licensed provider', origin: 'https://example.org', licence: 'licensed', rightsEvidence: 'synthetic test evidence only' };
  it('rejects all providers by default', () => {
    expect(matchesApprovedSource(valid().source)).toBe(false);
  });
  it('accepts exact matches against an explicitly injected test approval', () => {
    expect(matchesApprovedSource(valid().source, [approval])).toBe(true);
  });
  it('rejects mismatched identity, origin, licence and unsafe URLs', () => {
    for (const source of [
      { ...valid().source, provider: 'Unknown' },
      { ...valid().source, licence: 'other' },
      { ...valid().source, citation: 'https://example.org.evil.test/source' },
      { ...valid().source, citation: 'https://user@example.org/source' },
      { ...valid().source, citation: 'https://example.org:8443/source' },
      { ...valid().source, citation: 'http://example.org/source' },
      null, {}, { provider: 123 },
    ]) expect(matchesApprovedSource(source, [approval])).toBe(false);
  });
  it('rejects missing documentary evidence', () => {
    expect(matchesApprovedSource(valid().source, [{ ...approval, rightsEvidence: ' ' }])).toBe(false);
  });
});

describe('Field-level publication evidence', () => {
  it('rejects missing evidence for each required field', () => {
    for (const key of Object.keys(valid().fields)) {
      const record = valid();
      delete record.fieldEvidence[key];
      expect(isPublishablePanchangam(record, now, testApprovals)).toBe(false);
    }
  });
  it('rejects mismatched values, unapproved sources and invalid verification times', () => {
    for (const override of [
      { value: 'different' }, { citation: 'https://other.example/source' },
      { verifiedAt: 'invalid' }, { verifiedAt: '2026-11-11T05:00:00Z' },
      { verifiedAt: '2026-11-12T05:01:00Z' },
    ]) {
      const record = valid();
      record.fieldEvidence.tithi = { value: 'a', citation: 'https://example.org/panchangam/source', verifiedAt: '2026-11-12T05:00:00.000Z', ...override };
      expect(isPublishablePanchangam(record, now, testApprovals)).toBe(false);
    }
  });
});
