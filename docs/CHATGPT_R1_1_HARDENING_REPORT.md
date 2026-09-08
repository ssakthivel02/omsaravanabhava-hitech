# OmSaravanaBhava Hi-Tech — Independent R1.1 Hardening Report

Date: 2026-09-04

## Scope

Independent hardening pass over Claude's accepted clean-room R1 candidate. This is **not R2** and does not replace Claude's pending R2 work. Its purpose is to remove known release-engineering defects before the next Cowork session and GitHub CI qualification.

Source candidate SHA-256:

`fdc595f3d14fc55b9952cc34eed502c66dfd36da5e70b38b7db93cceae029ee1`

Production remains untouched and **NO-GO**.

## Changes applied

### Dependency consistency
- Removed unused `@vitest/coverage-v8@5` from `package.json` because R1 uses `vitest@2` and the coverage package peers on Vitest 5.
- Updated the lockfile importer to exactly match `package.json` while leaving harmless orphan lock snapshots for pnpm to prune later if desired.
- Static importer comparison: PASS (3 runtime dependencies, 18 dev dependencies; no missing/extra importer entries).

### GitHub Actions modernization
- `actions/checkout@v7`
- `actions/setup-node@v7`
- `actions/upload-artifact@v7`
- pnpm pinned exactly to `10.4.1`
- CI asserts the exact pnpm version before frozen install.
- Added explicit `cache-dependency-path: pnpm-lock.yaml`.
- Cross-project scan now calls a real package script instead of duplicating an inline implementation.

### Preview indexing safety
- Added `scripts/generate-deployment-files.mjs`.
- Development/CI/preview builds generate `robots.txt` with `Disallow: /`.
- Development/CI/preview builds generate Cloudflare `_headers` with `X-Robots-Tag: noindex, nofollow, noarchive`.
- Security headers include nosniff, strict-origin referrer policy, frame denial and a restrictive permissions policy.
- Fingerprinted `/assets/*` receive long immutable browser caching.
- Production remains an explicit environment and generates production robots/sitemap only when `DEPLOY_ENV=production`.

### Sitemap publication quality
- Temple detail URLs are indexable only when a record has at least two substantive public fields among history, architecture, visitor info, official website and verified coordinates.
- Thiruppugazh detail URLs are indexable only when canonical verse text is actually present.
- With today's governed corpus, preview sitemap is intentionally empty and production detail-route indexing remains held back rather than publishing hundreds of thin pages.

### PWA truthfulness
- Manifest no longer claims standalone installability while governed 192/512 icons are absent.
- `display` is temporarily `browser`.
- Release marker records `pwaInstallability: NOT_YET_QUALIFIED`.
- Full installability remains a future gate after new hi-tech icons and browser qualification.

### Service-worker hardening
- New namespace remains `omsaravanabhava-hitech-v1-*`.
- Old-cache deletion is narrowed to known superseded OmSaravanaBhava prefixes rather than all generic `osb-*` caches.
- Navigation remains network-first.
- Only `response.ok` + `text/html` responses can replace the last-known-good cached shell.
- Offline fallback returns the last known-good shell, otherwise an explicit 503.
- Fingerprinted `/assets/*` remain cache-first.
- Added source/E2E assertions for successful-HTML shell caching and offline navigation.

### Release provenance
- `generate-release.mjs` now fails if `GITHUB_REPOSITORY` is not exactly `ssakthivel02/omsaravanabhava-hitech`.
- CI/preview/production require a real commit SHA.
- R6 authority is explicitly recorded as `governed-data-and-provenance-only` and `legacyApplicationShellAuthorized: false`.
- Release marker schema upgraded to v2.

### SEO/runtime metadata foundation
- Added route-specific Tamil titles/descriptions for primary routes.
- Added OpenGraph base metadata.
- Canonical tags are attached only when runtime origin is exactly `https://omsaravanabhava.org`, preventing preview canonical collision.
- This remains an SPA/client-side metadata foundation; pre-render/Worker HTML metadata can be considered later if evidence shows it is needed for production discoverability.

### Accessibility/browser QA
- Skip-link target `main` is programmatically focusable (`tabIndex=-1`) and the E2E test now verifies actual focus transfer.
- Touch-target coverage expanded beyond buttons to primary buttons, nav links, inputs/selects/textareas and role=button controls.
- Added offline navigation and preview robots E2E checks.

### Cloudflare preview preparation
Added `wrangler.preview.jsonc`:
- new project name `omsaravanabhava-hitech-preview`
- `workers_dev: true`
- explicit `dist` asset directory
- `not_found_handling: single-page-application`
- no root-domain route or DNS mutation.

## Independent static validation executed

PASS:
- Node syntax check for all modified `.mjs` scripts
- JSON parsing
- package/lock importer dependency equality
- contamination scan across runtime/public files
- preview-safe robots generation
- preview-safe `_headers` generation
- preview sitemap generation
- release marker generation in development mode

## Not re-executed in this environment

This environment cannot reach npm registry, so dependencies could not be installed and the following R1.1 changes still require GitHub-hosted or Cowork execution:
- TypeScript typecheck
- ESLint
- Vitest suite
- Vite production build
- post-build verifier
- Playwright/axe
- real service-worker/offline browser behavior
- Lighthouse / Core Web Vitals lab evidence

Therefore this hardening copy is **SOURCE-HARDENED / RUNTIME-QUALIFICATION-PENDING**, not R2 and not production-ready.

## Recommended next action

After Claude usage resets, use this hardening report as an independent checklist. Claude should merge equivalent changes into its R2 workspace, run all executable gates, and produce R2. Do not regress any of these controls without evidence.

PRODUCTION STATUS: NO-GO
