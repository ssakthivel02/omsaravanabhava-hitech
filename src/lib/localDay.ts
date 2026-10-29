/**
 * A stable day number derived from the *visitor's local* calendar date.
 *
 * R2-CODE-007: the previous implementation used
 * `Math.floor(Date.now() / 86_400_000)`, which rotates on the UTC day
 * boundary — 5:30pm in India, 7pm in the UK, 4pm on the US west coast, never
 * at the visitor's own midnight. Building the day number from
 * `getFullYear()/getMonth()/getDate()` (which JavaScript already resolves in
 * the runtime's local timezone) and feeding those into `Date.UTC` gives a
 * number that only changes once per *local* calendar day, regardless of the
 * visitor's UTC offset.
 */
export function localDayNumber(date: Date = new Date()): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;
}

/** Non-negative modulo, since `localDayNumber` can be negative before 1970. */
export function localDayIndex(length: number, date: Date = new Date()): number {
  if (length <= 0) return 0;
  const n = localDayNumber(date);
  return ((n % length) + length) % length;
}
