import { describe, expect, it } from 'vitest';
import arupadaiRaw from '../src/content/arupadai-veedu.json';
import {
  evaluateCoordinatePublication,
  type CoordinatePublicationCandidate,
  type GeographicEvidence,
} from '../src/lib/geographicProvenance';

const verifiedEvidence: GeographicEvidence = {
  sourceAuthority: 'Tamil Nadu Government geospatial service',
  sourceUrl: 'https://example.gov.in/temple-coordinate-record',
  evidenceClass: 'GOVERNMENT_GEOSPATIAL',
  retrievedAt: '2026-09-12T12:00:00+05:30',
  lastVerifiedAt: '2026-09-12T12:00:00+05:30',
  state: 'VERIFIED_AUTHORITATIVE_COORDINATES',
};

const verifiedCandidate: CoordinatePublicationCandidate = {
  latitude: 9.8815,
  longitude: 78.0731,
  coordinateConfidence: 'COORDINATES_VERIFIED_AUTHORITATIVE',
  geographicEvidence: verifiedEvidence,
};

describe('R2.12 geographic provenance gate', () => {
  it('keeps every governed Arupadai Veedu record fail-closed while coordinates remain unverified', () => {
    expect(arupadaiRaw).toHaveLength(6);

    for (const temple of arupadaiRaw) {
      expect(temple.latitude).toBeNull();
      expect(temple.longitude).toBeNull();
      expect(temple.coordinateConfidence).toBe('COORDINATES_PENDING_VERIFICATION');

      const decision = evaluateCoordinatePublication({
        latitude: temple.latitude,
        longitude: temple.longitude,
        coordinateConfidence: temple.coordinateConfidence,
      });

      expect(decision.publishable).toBe(false);
      expect(decision.state).toBe('COORDINATES_PENDING_VERIFICATION');
      expect(decision.reason).toBe('MISSING_OR_INVALID_COORDINATES');
    }
  });

  it('rejects a plausible numeric pair when authoritative evidence is absent', () => {
    const decision = evaluateCoordinatePublication({
      latitude: 9.8815,
      longitude: 78.0731,
      coordinateConfidence: 'COORDINATES_VERIFIED_AUTHORITATIVE',
    });

    expect(decision).toEqual({
      publishable: false,
      state: 'COORDINATES_PENDING_VERIFICATION',
      reason: 'MISSING_OR_UNVERIFIED_EVIDENCE',
    });
  });

  it('rejects evidence that is only pending even when a coordinate pair exists', () => {
    const decision = evaluateCoordinatePublication({
      ...verifiedCandidate,
      geographicEvidence: {
        ...verifiedEvidence,
        state: 'PENDING_AUTHORITATIVE_COORDINATE_SOURCE',
      },
    });

    expect(decision.publishable).toBe(false);
    expect(decision.reason).toBe('MISSING_OR_UNVERIFIED_EVIDENCE');
  });

  it('rejects non-HTTPS or incomplete provenance', () => {
    const decision = evaluateCoordinatePublication({
      ...verifiedCandidate,
      geographicEvidence: {
        ...verifiedEvidence,
        sourceUrl: 'http://example.gov.in/temple-coordinate-record',
      },
    });

    expect(decision.publishable).toBe(false);
    expect(decision.reason).toBe('INVALID_SOURCE_URL');
  });

  it('rejects out-of-range coordinate values before evaluating provenance', () => {
    const decision = evaluateCoordinatePublication({
      ...verifiedCandidate,
      latitude: 91,
    });

    expect(decision.publishable).toBe(false);
    expect(decision.reason).toBe('MISSING_OR_INVALID_COORDINATES');
  });

  it('rejects evidence when verification predates retrieval', () => {
    const decision = evaluateCoordinatePublication({
      ...verifiedCandidate,
      geographicEvidence: {
        ...verifiedEvidence,
        retrievedAt: '2026-09-12T12:00:00+05:30',
        lastVerifiedAt: '2026-09-12T11:59:59+05:30',
      },
    });

    expect(decision.publishable).toBe(false);
    expect(decision.reason).toBe('INVALID_EVIDENCE_TIMESTAMP_ORDER');
  });

  it('allows publication only when coordinate data and authoritative evidence are both complete', () => {
    expect(evaluateCoordinatePublication(verifiedCandidate)).toEqual({
      publishable: true,
      state: 'COORDINATES_VERIFIED_FOR_PUBLICATION',
      reason: 'AUTHORITATIVE_EVIDENCE_COMPLETE',
    });
  });
});
