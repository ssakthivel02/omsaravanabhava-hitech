# Daily Panchangam — governed integration candidate

This branch is intentionally isolated from production. It contains a truthful pending-data fixture for Chennai, India. No auspicious times or astronomical values are invented.

## Required acceptance gates
1. Review the current React routes and implement a lazy-loaded `/daily-panchangam` page without replacing the existing application shell.
2. Fetch `/panchangam/today.json`; show a prominent pending state until the provider, calculation method, source citation, rights, location, timezone and date are verified.
3. Reject stale dates, missing field-level provenance and any conflicting calendar calculations. Treat traditional astrological predictions as belief, not factual forecasts.
4. Validate Tamil copy with a human reviewer. Confirm 320px mobile layout, keyboard navigation, reduced motion and screen reader labels.
5. Run repository-specific typecheck, lint, tests, build and browser smoke tests; capture CI evidence.
6. Reconcile concurrent PRs before any merge. Do not merge or deploy automatically.
7. A daily update requires a licensed, reliable provider and a scheduled workflow with fail-closed stale-data behavior.

Status: integration candidate; not live, not a verified Panchangam feed.
