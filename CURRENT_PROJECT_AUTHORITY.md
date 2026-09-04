# OmSaravanaBhava Hi-Tech — Current Project Authority

**Effective date:** 2026-09-04

This file is the current engineering authority when any older prompt, recovery note, or historical R6 instruction conflicts with it.

## 1. New application source of truth

The only repository allowed to contain the new OmSaravanaBhava application is:

`ssakthivel02/omsaravanabhava-hitech`

The legacy repository `ssakthivel02/OmSaravanaBhava` is rollback/reference evidence only. It must not be used as an application, UI, CSS, JavaScript, service-worker, build, deployment, Cloudflare, or Git-history donor.

Never mix KirthiVerse, RamaVerse, DivyaNexus, Kandan, Saravana Bhava Android, OSB Training Academy, SakthiAI/SaravanAI, or any other project into this application.

## 2. R6 role changed after source verification

The two R6 archives remain verified provenance inputs:

- `OmSaravanaBhava_R6_FINAL_MANUS_MASTER_SOURCE.zip`
  - SHA-256: `3477dd375e9545bd51482f9cacabe851adc6a841cdf111ffd5eb408f76c26585`
- `MANUS_ALL_WEBSITES_LATEST_EXPORT_2026-08-27.zip`
  - SHA-256: `47eef4cb07a6d466ad370d3923ec972ae43a916b18081ed85182d2b32da3ddfc`

However, source inspection showed that the R6 application build path reproduces the legacy static/vanilla website shell. Therefore R6 is **not** the new application-shell authority.

R6 may be used only for:

- governed OmSaravanaBhava content/data recovery;
- source/provenance evidence;
- asset provenance/recovery evidence;
- feature/content comparison.

The following legacy R6 runtime material must never be reintroduced into the new application:

- legacy `client/public` site shell;
- legacy `app.js`;
- `rc*.js` / `phase2*.js` runtime files;
- legacy HTML corpus;
- old service worker;
- old `osb-*` cache namespace;
- old generated static build output.

Reintroduction is classified as:

`ANTI-REVERSION FAILURE — NO-GO`

## 3. Accepted application foundation

Accepted engineering foundation:

`OmSaravanaBhava_HITECH_CLEANROOM_CANDIDATE_R1.zip`

Verified SHA-256:

`fdc595f3d14fc55b9952cc34eed502c66dfd36da5e70b38b7db93cceae029ee1`

R1 is the clean-room React + TypeScript + Vite foundation. R2 and later candidates should evolve this application rather than restarting from the legacy shell.

Independent hardening input prepared after R1 review:

`OmSaravanaBhava_HITECH_R1_1_HARDENING_FOR_CLAUDE.zip`

SHA-256:

`357494fa18c00ef7e9da275700eb62d0e93a711fe5b85e86338035d10964ee31`

R1.1 is a hardening input, not a production release and not a competing application branch.

## 4. Design authority

Manus R6 visual quality is a **minimum design floor**, not a runtime-source authority.

The clean React implementation should retain or improve the strongest Sacred-Tech ideas while remaining original and maintainable.

Target qualities:

- unmistakable Murugan / Vel / Arupadai Veedu identity;
- Tamil-first sacred reading experience;
- premium, calm, cinematic visual language;
- excellent mobile/tablet/desktop behavior;
- meaningful motion with full reduced-motion parity;
- strong accessibility and typography;
- fast loading and responsive interaction;
- source transparency and devotional-content integrity.

Do not copy Apple, Tesla, Microsoft, Manus, or any other brand/site literally. Compete on quality, originality, usefulness, and trust.

## 5. Current known content truth

Current accepted governed-data baseline includes approximately:

- 376 temple records;
- 6 Arupadai Veedu records;
- 12 Thiruppugazh records;
- 11 devotional-work records;
- 7 sacred-name records;
- 11 source-ledger records.

Known substantive gaps remain:

- canonical Thiruppugazh verse body: 0/12 currently imported;
- temple coordinates/history/architecture/visitor information: substantially absent;
- governed audio registry: empty/pending;
- Namavali publishable corpus: pending governed source.

These gaps must not be fabricated. Engineering may continue using truthful pending/absent states.

## 6. Infrastructure authority

Use fresh infrastructure only:

- GitHub: `ssakthivel02/omsaravanabhava-hitech`
- preview Cloudflare identity: `omsaravanabhava-hitech-preview`
- future production Cloudflare identity: `omsaravanabhava-hitech`
- new service-worker/cache namespace: `omsaravanabhava-hitech-v1-*`

Do not reuse the old Worker/Pages project, old GitHub deployment workflow, old service-worker cache, or old generated deployment output.

The public domain `https://omsaravanabhava.org/` is reused only after explicit production cutover approval.

## 7. Release sequence

Current sequence:

`R1 -> R2 -> independent source review -> GitHub branch -> GitHub CI + browser QA -> isolated Cloudflare preview -> owner visual/content review -> production approval -> root-domain cutover`

Production remains:

`NO-GO`

until exact-head release evidence, functional/browser/accessibility/performance/content-rights/anti-reversion gates, and explicit owner approval are complete.
