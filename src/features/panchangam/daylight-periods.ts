export type DaylightInterval = { startUtc: number; endUtc: number };
export type DaylightPeriods = { rahuKalam: DaylightInterval; yamaganda: DaylightInterval };

/**
 * Calculate weekday daylight eighths using externally established sunrise/sunset.
 * This is NOT a sunrise algorithm, independent astronomy verification, or approval to publish.
 */
export function calculateDaylightPeriods(
  dateLocal: string, sunriseUtc: number, sunsetUtc: number,
): DaylightPeriods | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateLocal) ||
      !Number.isFinite(sunriseUtc) || !Number.isFinite(sunsetUtc) ||
      Math.abs(sunriseUtc) > 8.64e15 || Math.abs(sunsetUtc) > 8.64e15 ||
      sunsetUtc <= sunriseUtc || sunsetUtc - sunriseUtc >= 86400000) return null;
  const date = new Date(dateLocal + 'T00:00:00Z');
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dateLocal) return null;
  // The caller must provide solar events for the requested Chennai civil date.
  const chennaiDate = (timestamp: number): string => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(timestamp));
  if (chennaiDate(sunriseUtc) !== dateLocal || chennaiDate(sunsetUtc) !== dateLocal) return null;
  const weekday = date.getUTCDay();
  // Sunday=0. These are zero-based daylight eighths for the evaluated convention.
  const rahuSegments = [7, 1, 6, 4, 5, 3, 2];
  const yamaSegments = [4, 6, 3, 1, 2, 0, 7];
  const rahu = rahuSegments[weekday];
  const yama = yamaSegments[weekday];
  if (rahu === undefined || yama === undefined) return null;
  const duration = (sunsetUtc - sunriseUtc) / 8;
  const interval = (segment: number): DaylightInterval => ({
    startUtc: sunriseUtc + segment * duration,
    endUtc: sunriseUtc + (segment + 1) * duration,
  });
  return { rahuKalam: interval(rahu), yamaganda: interval(yama) };
}
