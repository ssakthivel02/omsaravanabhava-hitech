# Phase 0 — R6 recovery and root-cause report

## Source verification

| Archive | Calculated SHA-256 | Expected | Result |
|---|---|---|---|
| `OmSaravanaBhava_R6_FINAL_MANUS_MASTER_SOURCE.zip` | `3477dd375e9545bd51482f9cacabe851adc6a841cdf111ffd5eb408f76c26585` | same | **MATCH** |
| `MANUS_ALL_WEBSITES_LATEST_EXPORT_2026-08-27.zip` | `47eef4cb07a6d466ad370d3923ec972ae43a916b18081ed85182d2b32da3ddfc` | same | **MATCH** (recovery evidence only; not extracted) |

## Root cause of the recurring reversion

The reversion was never a CI, DNS or Cloudflare fault. It is a property of the
R6 archive itself.

1. `client/index.html` contains **no module entry**. It mounts `<div id="app">`
   and loads the legacy vanilla bundle (`app.js`, `rc1.js`, `rc2.js`,
   `phase2l`–`phase2v.js`) from `client/public/`.
2. `client/src/main.tsx` renders into `#root`, which **does not exist** in that
   HTML. Even if the module were loaded it would throw.
3. `client/src/App.tsx` declares **two routes** (`/` and 404) and is untouched
   scaffold. No songs, temples, Thiruppugazh or search routes exist in React.
4. `client/public/` holds a **complete legacy static website**: 82 HTML pages, a
   151 KB `app.js`, and `sw.js` using cache `osb-r5-contract-v3-v1` with
   cache-first navigation.

Running R6's canonical contract, `pnpm run build`, exits 0 and reports:

```
✓ 1 modules transformed.
../dist/public/index.html  1.54 kB
```

One module. Zero JS bundles. Zero React chunks. Output: 464 files, 119 HTML
pages, legacy `app.js` and legacy `sw.js` shipped verbatim.

**The entire OmSaravanaBhava website is the legacy vanilla bundle; the React
layer is unwired dead code.** Anyone who imports R6 and runs `pnpm run build`
deploys the old website by construction. The legacy service worker then pins
that shell on returning devices even after a correct deploy.

## Decision

R6 is treated as **content, provenance and reference evidence only**. The
application shell is not imported. The new clean-room React application in this
repository is the sole deployment authority.

For the same reason, `verify-build.mjs` asserts that the build emits real JS
chunks — a zero-chunk build is the exact signature of the failure above.

## Clean-room check

`KirthiVerse`, `RamaVerse`, `DivyaNexus`, `SakthiAI`, `SaravanAI`,
`OSB Training Academy`: **0 hits**.

`Kandan` returned 30 hits and was investigated: every occurrence is
`form:kandan` / `MURUGAN_FORM` / `HAS_LEXICAL_NAME`, sourced from DSAL. It is
the Tamil epithet for Murugan, not the Kandan project. **Not contamination.**
