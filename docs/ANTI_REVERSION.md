# Anti-reversion controls

The failure mode: a new hi-tech site later serves the old website again.
Root cause is documented in `PHASE0_RECOVERY_REPORT.md`. These controls make a
repeat structurally impossible rather than merely unlikely.

## Build-time

`scripts/verify-build.mjs` runs inside `pnpm run build` and fails the build on:

| Check | Why |
|---|---|
| `release.json` repository ≠ `ssakthivel02/omsaravanabhava-hitech` | artifact built from the wrong repo |
| `app.js`, `rc1.js`, `rc2.js`, `phase2*.js`, `styles.css` in `dist/` | legacy shell repackaged |
| service worker declaring a superseded namespace | old cache reused |
| **zero JS chunks emitted** | the exact R6 signature — entry not wired |
| `index.html` without a module script, or with `#app` | legacy entry pattern |
| more than 3 `.html` files in `dist/` | legacy multi-page corpus returned |
| banned project strings | cross-project contamination |

## Test-time

`tests/anti-reversion-build.test.ts` asserts the same invariants against both
the source tree and the build output, so the failure surfaces in `pnpm test`
before anyone reaches a deploy.

`tests/e2e/anti-reversion.spec.ts` asserts them against the *served*
application: `/app.js` and friends must 404, `/release.json` must identify this
repository, a superseded cache must be evicted on activation, and a legacy page
path must fall through to the SPA not-found view.

## CI

`.github/workflows/ci.yml` fails closed if `github.repository` is not this
repository, or if any workflow references the legacy repository.

## Service worker

Namespace: `omsaravanabhava-hitech-v1-shell`. Never a generic `osb-*` prefix.

Navigation is **network-first**, so a fresh release always wins and an obsolete
shell can never be pinned. Only immutable hashed `/assets/` are cache-first.
On activation, superseded caches (including legacy `osb-*` keys left on a
returning visitor's device) are deleted.

## Cutover verification checklist

Run against the live domain after cutover, in this order:

1. normal browser
2. private window
3. service worker unregistered
4. caches cleared
5. fresh mobile session

In each, confirm `/release.json` reports the same commit SHA, and that
`/app.js` returns 404.
