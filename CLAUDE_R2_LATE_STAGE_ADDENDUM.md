# Claude R2 Late-Stage Addendum — OmSaravanaBhava Hi-Tech

Read this after `CLAUDE_CURRENT_OVERRIDE_R2.md`.

This addendum does not change application authority or authorize production. It adds durable quality controls prepared while Claude was rate-limited.

## Additional authorities

Read and preserve the stronger/equivalent implementation of:

1. `docs/COMPONENT_ARCHITECTURE_VISUAL_REGRESSION_CONTRACT_V1.md`
2. `docs/OFFLINE_PWA_LIFECYCLE_CONTRACT_V1.md`
3. `docs/CORRECTIONS_FEEDBACK_WORKFLOW_V1.md`
4. `release/CONTENT_VERSION_PROVENANCE_V1.json`
5. `release/RELEASE_EVIDENCE_TEMPLATE_V1.json`
6. `docs/MEDIA_AUDIO_IMAGE_PIPELINE_V1.md`
7. `docs/SOURCE_AWARE_AI_GUIDE_TRUST_CONTRACT_V1.md`

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

### Release evidence

At R2 handoff instantiate/fill `release/RELEASE_EVIDENCE_TEMPLATE_V1.json` for the exact candidate SHA. Mandatory PENDING fields remain PENDING/NO-GO until proven.

## Priority

Do not delay current P0 R2 defect fixes to implement optional future features. Merge these controls into the natural implementation while moving toward GitHub CI and isolated preview.

Production/DNS remains `NO-GO`.