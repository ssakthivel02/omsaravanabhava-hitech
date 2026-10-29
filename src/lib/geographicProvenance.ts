export type GeographicEvidenceClass =
  | 'GOVERNMENT_GEOSPATIAL'
  | 'OFFICIAL_TEMPLE_PUBLISHED';

export type GeographicVerificationState =
  | 'PENDING_AUTHORITATIVE_COORDINATE_SOURCE'
  | 'VERIFIED_AUTHORITATIVE_COORDINATES';

export interface GeographicEvidence {
  sourceAuthority: string | null;
  sourceUrl: string | null;
  evidenceClass: GeographicEvidenceClass | null;
  retrievedAt: string | null;
  lastVerifiedAt: string | null;
  state: GeographicVerificationState;
}

export interface CoordinatePublicationCandidate {
  latitude: number | null;
  longitude: number | null;
  coordinateConfidence: string | null | undefined;
  geographicEvidence?: GeographicEvidence | null;
}

export type CoordinatePublicationState =
  | 'COORDINATES_PENDING_VERIFICATION'
  | 'COORDINATES_VERIFIED_FOR_PUBLICATION';

export interface CoordinatePublicationDecision {
  publishable: boolean;
  state: CoordinatePublicationState;
  reason:
    | 'MISSING_OR_INVALID_COORDINATES'
    | 'MISSING_OR_UNVERIFIED_EVIDENCE'
    | 'UNACCEPTED_EVIDENCE_CLASS'
    | 'MISSING_SOURCE_AUTHORITY'
    | 'INVALID_SOURCE_URL'
    | 'INVALID_EVIDENCE_TIMESTAMPS'
    | 'INVALID_EVIDENCE_TIMESTAMP_ORDER'
    | 'COORDINATE_CONFIDENCE_NOT_AUTHORITATIVE'
    | 'AUTHORITATIVE_EVIDENCE_COMPLETE';
}

const ACCEPTED_EVIDENCE_CLASSES = new Set<GeographicEvidenceClass>([
  'GOVERNMENT_GEOSPATIAL',
  'OFFICIAL_TEMPLE_PUBLISHED',
]);

function hasValidCoordinatePair(latitude: number | null, longitude: number | null): boolean {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function isValidHttpsUrl(value: string | null): boolean {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

function isValidTimestamp(value: string | null): boolean {
  return Boolean(value) && Number.isFinite(Date.parse(value as string));
}

/**
 * Coordinates fail closed. A numeric latitude/longitude pair alone is never
 * sufficient for publication: the pair must be backed by explicit authoritative
 * geographic evidence with a traceable HTTPS source and verification timestamps.
 */
export function evaluateCoordinatePublication(
  candidate: CoordinatePublicationCandidate,
): CoordinatePublicationDecision {
  if (!hasValidCoordinatePair(candidate.latitude, candidate.longitude)) {
    return {
      publishable: false,
      state: 'COORDINATES_PENDING_VERIFICATION',
      reason: 'MISSING_OR_INVALID_COORDINATES',
    };
  }

  const evidence = candidate.geographicEvidence;
  if (!evidence || evidence.state !== 'VERIFIED_AUTHORITATIVE_COORDINATES') {
    return {
      publishable: false,
      state: 'COORDINATES_PENDING_VERIFICATION',
      reason: 'MISSING_OR_UNVERIFIED_EVIDENCE',
    };
  }

  if (!evidence.evidenceClass || !ACCEPTED_EVIDENCE_CLASSES.has(evidence.evidenceClass)) {
    return {
      publishable: false,
      state: 'COORDINATES_PENDING_VERIFICATION',
      reason: 'UNACCEPTED_EVIDENCE_CLASS',
    };
  }

  if (!evidence.sourceAuthority?.trim()) {
    return {
      publishable: false,
      state: 'COORDINATES_PENDING_VERIFICATION',
      reason: 'MISSING_SOURCE_AUTHORITY',
    };
  }

  if (!isValidHttpsUrl(evidence.sourceUrl)) {
    return {
      publishable: false,
      state: 'COORDINATES_PENDING_VERIFICATION',
      reason: 'INVALID_SOURCE_URL',
    };
  }

  if (!isValidTimestamp(evidence.retrievedAt) || !isValidTimestamp(evidence.lastVerifiedAt)) {
    return {
      publishable: false,
      state: 'COORDINATES_PENDING_VERIFICATION',
      reason: 'INVALID_EVIDENCE_TIMESTAMPS',
    };
  }

  if (Date.parse(evidence.lastVerifiedAt as string) < Date.parse(evidence.retrievedAt as string)) {
    return {
      publishable: false,
      state: 'COORDINATES_PENDING_VERIFICATION',
      reason: 'INVALID_EVIDENCE_TIMESTAMP_ORDER',
    };
  }

  if (candidate.coordinateConfidence !== 'COORDINATES_VERIFIED_AUTHORITATIVE') {
    return {
      publishable: false,
      state: 'COORDINATES_PENDING_VERIFICATION',
      reason: 'COORDINATE_CONFIDENCE_NOT_AUTHORITATIVE',
    };
  }

  return {
    publishable: true,
    state: 'COORDINATES_VERIFIED_FOR_PUBLICATION',
    reason: 'AUTHORITATIVE_EVIDENCE_COMPLETE',
  };
}
