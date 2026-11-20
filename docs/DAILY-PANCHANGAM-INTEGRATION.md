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

## Publication data contract (schema 1.0)

The runtime validator in `src/features/panchangam/validation.ts` is authoritative for publication eligibility. A verified record must contain:

- Chennai location, Asia/Kolkata timezone, and the current Chennai calendar date.
- Status `verified`, an approved provider and licence, and an HTTPS citation matching the approved origin.
- A declared calculation method and a same-day verification timestamp (at most five minutes ahead of the client clock).
- Non-empty values for tithi, nakshatra, yoga, karana, rahuKalam, yamagandam and nallaNeram.
- A `fieldEvidence` object containing an entry for each of those seven keys. Each entry has `value`, `citation` and `verifiedAt`: the value must exactly match the corresponding field, the citation must match the approved source origin, and the timestamp must be on the record date and no later than overall verification.

The pending fixture deliberately has null field values and an empty evidence object. Its date is a fixture date, not a claim of freshness. Do not advance the date or set verified status solely to make the page display values. The UI uses its own trusted Tamil pending copy.

## Provider approval and daily generation

The production approval registry is intentionally empty. Adding an entry requires independent review of provider identity, origin, licence and documentary publication rights. Test-only approval entries must never enter the production registry.

The local generator validates the complete candidate against the same publication rules before writing it atomically. On provider failure, preserve fail-closed behavior; never relabel yesterday's data or invent values. No scheduled generation is enabled by this contract.

Structural validation does not independently authenticate the source, establish astronomical accuracy or prove that competing calculations agree. Those remain reviewer responsibilities, along with Tamil copy and preview acceptance.

## Local generation runbook

Use Node.js 22 with the repository's pinned pnpm version. From the repository root:

```sh
pnpm run prepare:panchangam ./candidate.json ./prepared-panchangam.json
```

Use distinct input and output paths in an existing writable directory. This command does not fetch data, deploy a website or enable a scheduled job. A missing, malformed or unapproved candidate produces a fresh pending record for Chennai with null values and no evidence. A nonzero exit indicates a filesystem or invocation failure; do not deploy that output. Inspect the generated status, date and provenance before any separately approved publication. The temporary file is created beside the destination and renamed on success. Do not run concurrent writers against the same destination.

Run `pnpm exec vitest run tests/panchangam-validation.test.ts tests/panchangam-generator.test.ts` to exercise the validator and actual subprocess/filesystem paths. Production source approval, accuracy review and independent release acceptance remain mandatory.
