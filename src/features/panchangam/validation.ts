export type PanchangamRecord = {
  schemaVersion: string;
  date: string;
  timezone: string;
  location: { name: string };
  status: string;
  source: { provider: string | null; citation: string | null; licence: string | null };
  calculation: { method: string | null; verifiedAt: string | null };
  fields: Record<string, string | null>;
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

export function isPublishablePanchangam(value: unknown, now = new Date()): value is PanchangamRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<PanchangamRecord>;
  const nonEmpty = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0;
  if (record.schemaVersion !== '1.0' || record.status !== 'verified' ||
      record.date !== chennaiToday(now) || record.timezone !== 'Asia/Kolkata' ||
      !nonEmpty(record.location?.name) || !nonEmpty(record.source?.provider) ||
      !nonEmpty(record.source?.citation) || !nonEmpty(record.source?.licence) ||
      !nonEmpty(record.calculation?.method) || !nonEmpty(record.calculation?.verifiedAt)) return false;
  const verifiedAt = Date.parse(record.calculation.verifiedAt);
  if (!Number.isFinite(verifiedAt) || verifiedAt > now.getTime() + 300000) return false;
  return PANCHANGAM_FIELDS.every((key) => nonEmpty(record.fields?.[key]));
}
