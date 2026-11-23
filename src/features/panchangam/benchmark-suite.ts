import { benchmarkEngine, type BenchmarkReference } from './engine-benchmark';

/** Minimum benchmark coverage. This is an evaluation gate, not publication authorization. */
export type BenchmarkCase = {
  scenario: 'weekday' | 'new-moon' | 'full-moon' | 'limb-transition' | 'tamil-month-boundary' | 'chennai-midnight';
  reference: BenchmarkReference;
  candidate: unknown;
};
export type BenchmarkSuiteResult = {
  passed: boolean;
  missing: string[];
  failures: { scenario: BenchmarkCase['scenario']; dateLocal: string; reasons: string[] }[];
};
export function evaluateBenchmarkSuite(cases: readonly BenchmarkCase[]): BenchmarkSuiteResult {
  const required = ['weekday', 'new-moon', 'full-moon', 'limb-transition', 'tamil-month-boundary', 'chennai-midnight'] as const;
  const weekdays = new Set<number>();
  const present = new Set<string>();
  const failures: BenchmarkSuiteResult['failures'] = [];
  for (const entry of cases) {
    if (!entry || !required.includes(entry.scenario)) {
      failures.push({ scenario: 'weekday', dateLocal: '', reasons: ['unknown-scenario'] });
      continue;
    }
    present.add(entry.scenario);
    const dateLocal = entry.reference?.dateLocal ?? '';
    const reasons = benchmarkEngine(entry.candidate, entry.reference);
    if (reasons.length) failures.push({ scenario: entry.scenario, dateLocal, reasons });
    // Only independently reviewed, valid weekday cases count toward seven-day coverage.
    if (entry.scenario === 'weekday' && reasons.length === 0) {
      const date = new Date(dateLocal + 'T00:00:00Z');
      if (!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateLocal)
        weekdays.add(date.getUTCDay());
    }
  }
  const missing = required.filter(x => !present.has(x));
  for (let day = 0; day < 7; day++) if (!weekdays.has(day)) missing.push('weekday-' + day);
  return { passed: missing.length === 0 && failures.length === 0, missing, failures };
}
