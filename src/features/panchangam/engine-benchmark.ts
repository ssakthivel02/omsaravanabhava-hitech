import { validateEngineEvaluation } from './engine-evaluation';

type Limb = { index: number; endTimeUtc: number };
type Interval = { startUtc: number; endUtc: number };
export type BenchmarkReference = {
  dateLocal: string;
  referenceId: string;
  referenceUrl: string;
  independentlyReviewed: boolean;
  location: 'Chennai';
  latitude: 13.0827;
  longitude: 80.2707;
  timezone: 'Asia/Kolkata';
  ayanamsa: 'lahiri';
  monthSystem: 'amanta';
  sunriseUtc: number;
  sunsetUtc: number;
  tithi: Limb;
  nakshatra: Limb;
  yoga: Limb;
  karana: Limb;
  rahuKalam: Interval;
  yamaganda: Interval;
};
type Candidate = { sunriseUtc: number; sunsetUtc: number; tithi: Limb; nakshatra: Limb;
  yoga: Limb; karana: Limb; periods: { rahuKalam: Interval; yamaganda: Interval } };
function validReferenceUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password &&
      !url.port && !url.hash && url.hostname !== 'localhost' &&
      !url.hostname.endsWith('.localhost');
  } catch { return false; }
}

/** Benchmark evaluation only. This does not approve a source or publish any Panchangam field. */
export function benchmarkEngine(candidate: unknown, reference: BenchmarkReference, toleranceMs = 120000): string[] {
  const failures: string[] = [];
  if (!reference || !reference.independentlyReviewed || reference.location !== 'Chennai' ||
      reference.latitude !== 13.0827 || reference.longitude !== 80.2707 ||
      reference.timezone !== 'Asia/Kolkata' || reference.monthSystem !== 'amanta' ||
      reference.ayanamsa !== 'lahiri' || !reference.referenceId?.trim() ||
      !validReferenceUrl(reference.referenceUrl)) failures.push('reference-provenance');
  if (!Number.isFinite(toleranceMs) || toleranceMs < 0 || toleranceMs > 120000) failures.push('tolerance');
  if (!reference || !validateEngineEvaluation(candidate, reference.dateLocal)) {
    failures.push('candidate-validation');
    return failures;
  }
  if (failures.length) return failures;
  const actual = candidate as Candidate;
  const compareTime = (name: string, a: number, b: number) => {
    if (!Number.isFinite(b) || Math.abs(a - b) > toleranceMs) failures.push(name);
  };
  compareTime('sunrise', actual.sunriseUtc, reference.sunriseUtc);
  compareTime('sunset', actual.sunsetUtc, reference.sunsetUtc);
  for (const name of ['tithi', 'nakshatra', 'yoga', 'karana'] as const) {
    if (!reference[name] || actual[name].index !== reference[name].index) failures.push(name + '-index');
    if (reference[name]) compareTime(name + '-transition', actual[name].endTimeUtc, reference[name].endTimeUtc);
  }
  for (const name of ['rahuKalam', 'yamaganda'] as const) {
    if (!reference[name]) { failures.push(name + '-missing'); continue; }
    compareTime(name + '-start', actual.periods[name].startUtc, reference[name].startUtc);
    compareTime(name + '-end', actual.periods[name].endUtc, reference[name].endUtc);
  }
  return failures;
}
