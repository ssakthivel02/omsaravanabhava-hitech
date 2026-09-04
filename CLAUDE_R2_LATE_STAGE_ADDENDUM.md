# Claude R2 Late-Stage Addendum — OmSaravanaBhava Hi-Tech

Read this after `CLAUDE_CURRENT_OVERRIDE_R2.md`.

This addendum does not change application authority or authorize production. It adds durable quality controls prepared while Claude was rate-limited.

## Repository landing zone now ready

The real application branch now exists:

`build/native-r6-flagship`

Use it for the R2 clean application candidate when GitHub write access is available.

Do not develop application features directly on `main`.

Repository governance now also includes:

- `.github/CODEOWNERS`
- `.github/pull_request_template.md`
- `SECURITY.md`
- `CONTRIBUTING.md`
- `docs/R2_SOURCE_IMPORT_CHECKLIST.md`

Do not overwrite these with stale candidate copies.

## Additional authorities

Read and preserve the stronger/equivalent implementation of:

1. `docs/COMPONENT_ARCHITECTURE_VISUAL_REGRESSION_CONTRACT_V1.md`
2. `docs/OFFLINE_PWA_LIFECYCLE_CONTRACT_V1.md`
3. `docs/CORRECTIONS_FEEDBACK_WORKFLOW_V1.md`
4. `release/CONTENT_VERSION_PROVENANCE_V1.json`
5. `release/RELEASE_EVIDENCE_TEMPLATE_V1.json`
6. `release/ENVIRONMENT_CONTRACT_V1.json`
7. `docs/CLOUDFLARE_PREVIEW_DEPLOYMENT_CONTRACT_V1.md`
8. `docs/OWNER_PREVIEW_ACCEPTANCE_CHECKLIST_V1.md`
9. `docs/LEARNING_PATHS_ARCHITECTURE_V1.md`
10. `release/KNOWLEDGE_GRAPH_RELATIONSHIP_SCHEMA_V1.json`
11. `docs/LOCAL_LIBRARY_PRIVACY_CONTRACT_V1.md`
12. `docs/ACCESSIBILITY_MANUAL_QA_RUNBOOK_V1.md`
13. `docs/TEMPLE_PILGRIMAGE_DATA_SAFETY_CONTRACT_V1.md`
14. `docs/PERFORMANCE_PROFILING_RUNBOOK_V1.md`
15. `release/SACRED_TECH_DESIGN_TOKENS_V1.json`
16. `docs/ERROR_EMPTY_LOADING_STATES_V1.md`
17. `docs/HOME_ARUPADAI_INTERACTION_STORYBOARD_V1.md`
18. `docs/MEDIA_AUDIO_IMAGE_PIPELINE_V1.md`
19. `docs/SOURCE_AWARE_AI_GUIDE_TRUST_CONTRACT_V1.md`
20. `source-data/README.md`
21. `source-data/ARUPADAI_VEEDU_OFFICIAL_DYNAMIC_SEED_2026-09-04.json`

## Current official Arupadai source seed

A first-party HR&CE dynamic-data seed for all six Arupadai Veedu is now staged under `source-data/` with official identities, source URLs, published opening windows/contact details, `retrievedAt`, `lastVerifiedAt`, and explicit travel re-verification warnings.

Treat it as governed source evidence, not timeless hard-coded truth.

Dynamic timing/contact/service information must be reverified when stale and before travel/payment-sensitive publication. Preserve the Solaimalai source-formatting anomaly note instead of pretending the official table was clean.

## R2 expectations added

### Component consistency

- Shared interactive components own keyboard/focus/accessibility behavior.
- Do not create generic-card sprawl.
- Verification/completeness/rights dimensions use shared domain components.
- Long Tamil labels/titles must work at 320px and 200% zoom.

### Visual regression

When GitHub browser CI is available, preserve screenshot evidence for P0 routes/states at 320/390/768/1440, with 1920 spot checks.

Do not bulk-approve screenshots without review.

### PWA lifecycle

Test first install, online/offline, N->N+1 update, legacy-cache migration, fresh/private browser, manual unregister recovery, and stale-shell avoidance.

Do not claim installability until manifest/icons/SW/browser evidence all pass.

### Corrections

Before production, Contact/Corrections must have a real owner-approved destination or explicitly state submission is unavailable.

Submissions are evidence only; they never directly alter canonical or temple data.

### Content versioning

Material canonical/source/rights/dynamic-fact changes must be traceable by record/version/source/change reason. Silent canonical overwrite is forbidden.

### Environment separation

Preview and production are explicit environments. Preview stays non-indexable and must never mutate root DNS. Production requires exact Git SHA and separate owner approval.

### Cloudflare preview

Use only the new `omsaravanabhava-hitech-preview` identity, deploy explicit `dist`, support SPA deep refresh, expose exact `/release.json`, and prove anti-reversion in private/fresh browser before owner review.

### Learning / graph / local library

These are forward-compatible product architectures, not reasons to delay current P0 engineering. Learning paths orchestrate governed records; graph relationships require source-backed states; local library remains private/local-first.

### Manual accessibility

Axe alone is not enough. Record keyboard/focus/zoom/reflow/screen-reader/Tamil language evidence on P0 routes before production claims.

### Temple travel safety

Dynamic timings/contact/facility/payment/location facts require official/source-linked freshness/confidence. No invented map pins or travel guarantees.

### Performance

Preserve the machine-readable budgets and profile Home, Temple Directory, Search, readers, fonts, imagery and motion on exact production-mode candidates.

### Design implementation

Use `release/SACRED_TECH_DESIGN_TOKENS_V1.json` as implementation input. Empty/loading/pending/offline/error states are first-class product surfaces. Home/Arupadai interactions should follow the storyboard without scroll-jacking, auto-advancing carousels or heavy hero media.

### Release evidence

At R2 handoff instantiate/fill `release/RELEASE_EVIDENCE_TEMPLATE_V1.json` for the exact candidate SHA. Mandatory PENDING fields remain PENDING/NO-GO until proven.

## Priority

Do not delay current P0 R2 defect fixes to implement optional future features. Merge these controls into the natural implementation while moving toward GitHub CI and isolated preview.

Production/DNS remains `NO-GO`.
