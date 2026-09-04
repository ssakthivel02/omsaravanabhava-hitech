# OmSaravanaBhava Hi-Tech Flagship

This repository is the clean, isolated source of truth for the next-generation OmSaravanaBhava Murugan devotional website.

## Current authority

Read `CURRENT_PROJECT_AUTHORITY.md` first. It overrides older recovery/build assumptions when they conflict.

**NEW flagship application repository:** `ssakthivel02/omsaravanabhava-hitech`

The legacy repository `ssakthivel02/OmSaravanaBhava` is rollback/reference evidence only. Do not copy its application shell, CSS, JavaScript, layouts, workflows, service worker, Cloudflare deployment configuration or Git history into this repository.

Do not mix KirthiVerse, RamaVerse, DivyaNexus, Saravana Bhava Android, OSB Training Academy, SakthiAI/SaravanAI, Kandan or any other project into this repository.

## R6 role

The verified R6 archives remain important governed-data/provenance sources:

- `OmSaravanaBhava_R6_FINAL_MANUS_MASTER_SOURCE.zip`
  - SHA-256 `3477dd375e9545bd51482f9cacabe851adc6a841cdf111ffd5eb408f76c26585`
- `MANUS_ALL_WEBSITES_LATEST_EXPORT_2026-08-27.zip`
  - SHA-256 `47eef4cb07a6d466ad370d3923ec972ae43a916b18081ed85182d2b32da3ddfc`

When the portfolio export is used, inspect only:

`01_OmSaravanaBhava/source/R6_FINAL_MASTER/`

However, source verification established that the R6 application build path reproduces the legacy static/vanilla website. Therefore R6 is **not** the new application-shell authority.

Use R6 only for governed OmSaravanaBhava content/data, source/provenance and asset evidence. Never reintroduce the legacy R6 runtime shell, `app.js`, old static HTML corpus, old service worker or old `osb-*` caches into the new application.

## Accepted application foundation

The accepted clean-room application foundation is:

`OmSaravanaBhava_HITECH_CLEANROOM_CANDIDATE_R1.zip`

SHA-256:

`fdc595f3d14fc55b9952cc34eed502c66dfd36da5e70b38b7db93cceae029ee1`

R1 is a React + TypeScript + Vite clean-room implementation. R2 and later candidates evolve this application instead of redeploying the R6 legacy shell.

## Design standard

Manus R6 visual quality is a **minimum design floor**, not a runtime-source authority. The new React implementation should retain or improve the strongest Sacred-Tech visual ideas while remaining original, fast, accessible and maintainable.

## Production safety

Current production remains at `https://omsaravanabhava.org/` until the new website passes source, build, functional, responsive, accessibility, PWA, SEO, performance, content-provenance, rights and anti-reversion gates and receives explicit owner production approval.

Do not change production DNS or root-domain routing during development.

## Anti-reversion principle

A production artifact must be built from this repository only, at an exact recorded Git commit. Build/deploy workflows must never checkout or generate runtime files from the legacy repository.

Reintroduction of the legacy application shell is an:

`ANTI-REVERSION FAILURE — NO-GO`

Current production status: **NO-GO**.
