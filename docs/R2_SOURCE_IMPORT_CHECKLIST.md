# R2 Clean Source Import Checklist

Use this checklist when the real R2 candidate is ready to land in `build/native-r6-flagship`.

## 1. Candidate identity

Record before import:

- candidate ZIP filename;
- SHA-256;
- file count;
- source report filename;
- Claude/Cowork session output summary;
- local exact build/test status;
- known unresolved blockers.

## 2. Archive hygiene

Reject the candidate if it contains:

- `.git`;
- `node_modules`;
- `dist`/build output;
- `.env` or secrets;
- private keys/certificates;
- old R6 `client/public` shell;
- legacy `app.js`;
- `rc*.js` / `phase2*.js`;
- old static HTML corpus;
- old service worker/cache namespace;
- another project;
- large archives nested inside source without explicit reason.

## 3. Required clean application identity

The imported app must resolve to:

- React + TypeScript + Vite;
- correct `#root` mount;
- module entry wired;
- deterministic pnpm workflow;
- strict TypeScript;
- real hashed Vite chunks after build;
- `release.json` generation from repository/SHA/environment;
- new service-worker/cache namespace only.

## 4. Authority merge

Do not overwrite stronger/current repo authorities with stale copies from the candidate.

Before import compare candidate copies of:

- `CURRENT_PROJECT_AUTHORITY.md`;
- Claude override/addendum files;
- `docs/**` contracts;
- `release/**` policy/schema files;
- `.github/**` governance files.

Prefer the newest/equivalent-or-stronger authority. Application code must conform to repo authority, not replace it.

## 5. Content-state validation

Before import confirm:

- temple identity state independent from coordinates/media/visitor state;
- canonical text independent from easy Tamil/transliteration/meaning;
- rights independent from completeness;
- search uses governed/source-tracked language;
- zero-result search does not generate devotional facts;
- raw research-state keys are not primary user-facing labels;
- no fabricated corpus completion.

## 6. Build and dependency validation

On the imported branch:

- frozen install;
- exact pnpm version check;
- dependency graph consistency;
- strict typecheck;
- lint;
- unit/integration tests;
- production build;
- verify-build/anti-reversion;
- contamination scan;
- secret scan.

## 7. Browser qualification

Require exact-head evidence for:

- 320px;
- 390px;
- 768px;
- 1440px;
- 1920px spot check;
- keyboard/focus;
- 200% zoom/reflow;
- reduced motion;
- Tamil rendering;
- direct deep-link refresh;
- 404;
- search result/zero-result;
- service-worker install/update/offline/legacy-cache migration;
- fresh/private browser.

## 8. Preview qualification

Only after GitHub CI is green:

- deploy to new `omsaravanabhava-hitech-preview` Cloudflare project;
- explicit `dist` only;
- SPA fallback;
- preview noindex/nofollow/noarchive;
- no production sitemap/canonical collision;
- exact `/release.json` SHA;
- no legacy network request/cache shell.

## 9. Import result

Classify final result as one of:

- `IMPORT_ACCEPTED_CI_PENDING`
- `IMPORT_ACCEPTED_PREVIEW_PENDING`
- `IMPORT_REJECTED_HYGIENE`
- `IMPORT_REJECTED_LEGACY_CONTAMINATION`
- `IMPORT_REJECTED_TRUTH_MODEL`
- `IMPORT_REJECTED_BUILD`

Never mark production GO during source import.
