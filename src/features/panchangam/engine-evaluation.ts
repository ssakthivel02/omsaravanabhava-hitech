import { chennaiToday } from './validation';

type Interval = { startUtc: number; endUtc: number };
type Limb = { index: number; endTimeUtc: number };
type Evaluation = {
  dateLocal: string;
  sunriseUtc: number;
  sunsetUtc: number;
  sunriseFallback: boolean;
  sunsetFallback: boolean;
  tithi: Limb;
  nakshatra: Limb;
  yoga: Limb;
  karana: Limb;
  periods: { rahuKalam: Interval; yamaganda: Interval };
  engine: { ayanamsa: string; version: string };
};

/** Structural evaluation only. Never grants publication approval or supplies Nalla Neram. */
export function validateEngineEvaluation(value: unknown, expectedDate: string): boolean {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<Evaluation>;
  const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= 8.64e15;
  const rise = v.sunriseUtc;
  const set = v.sunsetUtc;
  if (v.dateLocal !== expectedDate || !/^\d{4}-\d{2}-\d{2}$/.test(expectedDate) ||
      v.sunriseFallback !== false || v.sunsetFallback !== false ||
      !finite(rise) || !finite(set) || set <= rise || set - rise >= 86400000 ||
      chennaiToday(new Date(rise)) !== expectedDate || chennaiToday(new Date(set)) !== expectedDate ||
      v.engine?.ayanamsa !== 'lahiri' || v.engine.version !== '1.0.0') return false;
  const limb = (x: Limb | undefined, max: number) => !!x && Number.isInteger(x.index) &&
    x.index >= 1 && x.index <= max && finite(x.endTimeUtc) &&
    x.endTimeUtc > rise && x.endTimeUtc <= rise + 40 * 3600000;
  const period = (x: Interval | undefined) => !!x && finite(x.startUtc) && finite(x.endUtc) &&
    x.startUtc >= rise && x.endUtc <= set && x.endUtc > x.startUtc &&
    Math.abs(x.endUtc - x.startUtc - (set - rise) / 8) <= 1;
  const rahu = v.periods?.rahuKalam;
  const yama = v.periods?.yamaganda;
  return limb(v.tithi, 30) && limb(v.nakshatra, 27) && limb(v.yoga, 27) && limb(v.karana, 60) &&
    period(rahu) && period(yama) && !!rahu && !!yama &&
    (rahu.endUtc <= yama.startUtc || yama.endUtc <= rahu.startUtc);
}
