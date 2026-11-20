export type PanchangamRecord = {
  schemaVersion: string;
  date: string;
  timezone: string;
  location: { name: string };
  status: string;
  source: { provider: string | null; citation: string | null; licence: string | null };
  calculation: { method: string | null; verifiedAt: string | null };
  fields: Record<string, string | null>;
  fieldEvidence?: Record<string, { value: string; citation: string; verifiedAt: string }>;
  noticeTa: string;
};

export const PANCHANGAM_FIELDS = [
  'tithi', 'nakshatra', 'yoga', 'karana', 'rahuKalam', 'yamagandam', 'nallaNeram',
] as const;

export function chennaiToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function isPublishablePanchangam(value: unknown, now = new Date(), approvals: readonly ApprovedPanchangamSource[] = APPROVED_PANCHANGAM_SOURCES): value is PanchangamRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<PanchangamRecord>;
  const nonEmpty = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0;
  if (record.schemaVersion !== '1.0' || record.status !== 'verified' ||
      record.date !== chennaiToday(now) || record.timezone !== 'Asia/Kolkata' ||
      !nonEmpty(record.location?.name) || record.location.name.trim().toLowerCase() !== 'chennai' || !nonEmpty(record.source?.provider) ||
      !nonEmpty(record.source?.citation) || !nonEmpty(record.source?.licence) ||
      !nonEmpty(record.calculation?.method) || !nonEmpty(record.calculation?.verifiedAt)) return false;
  // A free-form "licensed" claim is not provenance. Require an auditable HTTPS source.
  // Human review of the actual publication rights remains mandatory.
  try {
    const citation = new URL(record.source.citation);
    if (citation.protocol !== 'https:' || !citation.hostname.includes('.') ||
        citation.username || citation.password || citation.port) return false;
  } catch {
    return false;
  }
  const verifiedAt = Date.parse(record.calculation.verifiedAt);
  if (!Number.isFinite(verifiedAt) || verifiedAt > now.getTime() + 300000 ||
      chennaiToday(new Date(verifiedAt)) !== record.date) return false;
  if (!matchesApprovedSource(record.source, approvals)) return false;
  return PANCHANGAM_FIELDS.every((key) => {
    const field = record.fields?.[key];
    const evidence = record.fieldEvidence?.[key];
    if (!nonEmpty(field) || !evidence || evidence.value !== field ||
        !nonEmpty(evidence.citation) || !nonEmpty(evidence.verifiedAt)) return false;
    const timestamp = Date.parse(evidence.verifiedAt);
    return Number.isFinite(timestamp) && timestamp <= verifiedAt &&
      chennaiToday(new Date(timestamp)) === record.date &&
      matchesApprovedSource({ ...record.source, citation: evidence.citation }, approvals);
  });
}

/** Independently reviewed publication approval; never populate from daily JSON. */
export type ApprovedPanchangamSource = Readonly<{
  provider: string;
  origin: string;
  licence: string;
  rightsEvidence: string;
}>;

// Empty until documentary publication rights have been reviewed.
export const APPROVED_PANCHANGAM_SOURCES: readonly ApprovedPanchangamSource[] = Object.freeze([]);

/** Match independently approved publication sources. */
export function matchesApprovedSource(
  source: unknown,
  approvals: readonly ApprovedPanchangamSource[] = APPROVED_PANCHANGAM_SOURCES,
): boolean {
  if (!source || typeof source !== 'object') return false;
  const candidate = source as Partial<PanchangamRecord['source']>;
  if (typeof candidate.provider !== 'string' || typeof candidate.licence !== 'string' ||
      typeof candidate.citation !== 'string') return false;
  try {
    const url = new URL(candidate.citation);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return false;
    return approvals.some((approval) =>
      approval.provider === candidate.provider &&
      approval.licence === candidate.licence &&
      approval.origin === url.origin &&
      approval.rightsEvidence.trim().length > 0);
  } catch {
    return false;
  }
}

/** Prepare a publication candidate without I/O or implicit source approval. */
export function prepareDailyPanchangam(candidate: unknown, now = new Date()): PanchangamRecord {
  if (isPublishablePanchangam(candidate, now)) return candidate;
  return {
    schemaVersion: '1.0',
    date: chennaiToday(now),
    timezone: 'Asia/Kolkata',
    location: { name: 'Chennai' },
    status: 'pending',
    source: { provider: null, citation: null, licence: null },
    calculation: { method: null, verifiedAt: null },
    fields: Object.fromEntries(PANCHANGAM_FIELDS.map((key) => [key, null])),
    fieldEvidence: {},
    noticeTa: 'சரிபார்ப்பு நிலுவையில் உள்ளது.',
  };
}
