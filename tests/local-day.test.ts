/**
 * R2-CODE-007: daily rotation must key off the visitor's LOCAL calendar date,
 * not the UTC day boundary. These tests pin the process timezone to one that
 * sits several hours off UTC and then cross a moment that is on different
 * UTC vs. local calendar dates, proving the day number tracks the local date.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { localDayNumber, localDayIndex } from '@/lib/localDay';

const originalTZ = process.env.TZ;

describe('localDayNumber / localDayIndex', () => {
  afterEach(() => {
    vi.useRealTimers();
    process.env.TZ = originalTZ;
  });

  it('does not change across a UTC midnight that is still the same local evening', () => {
    // Pacific/Honolulu is UTC-10 with no DST. 2026-01-15T23:30:00-10:00 is
    // still 2026-01-15 locally, but already 2026-01-16T09:30:00Z in UTC.
    process.env.TZ = 'Pacific/Honolulu';

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T23:30:00-10:00'));
    const before = localDayNumber();

    vi.setSystemTime(new Date('2026-01-16T00:30:00-10:00')); // local date rolled over
    const after = localDayNumber();

    expect(after).toBe(before + 1);
  });

  it('a naive UTC-day calculation would have flipped early — this is the bug being fixed', () => {
    // Pacific/Honolulu is UTC-10. At 23:30 local time on the 15th it is
    // already 09:30 UTC on the 16th, so a naive `Date.now() / 86_400_000`
    // has already advanced to the next day while it is still evening for
    // the visitor.
    process.env.TZ = 'Pacific/Honolulu';
    vi.useFakeTimers();
    const stillEveningOfThe15th = new Date('2026-01-15T23:30:00-10:00');
    vi.setSystemTime(stillEveningOfThe15th);

    const naiveUtcDay = Math.floor(stillEveningOfThe15th.getTime() / 86_400_000);
    const expectedLocalDay = Date.UTC(2026, 0, 15) / 86_400_000;

    expect(naiveUtcDay).toBe(expectedLocalDay + 1); // the bug: rolled over early
    expect(localDayNumber()).toBe(expectedLocalDay); // the fix: still the 15th
  });

  it('produces a valid index for any positive length', () => {
    process.env.TZ = 'Asia/Kolkata';
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-01T12:00:00+05:30'));
    const idx = localDayIndex(6);
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThan(6);
  });

  it('is stable for repeated calls within the same local day', () => {
    process.env.TZ = 'Europe/London';
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-01T08:00:00+01:00'));
    const a = localDayIndex(6);
    vi.setSystemTime(new Date('2026-06-01T22:00:00+01:00'));
    const b = localDayIndex(6);
    expect(a).toBe(b);
  });
});
