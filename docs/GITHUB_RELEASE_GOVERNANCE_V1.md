# OmSaravanaBhava Hi-Tech — GitHub Release Governance V1

## Current risk

The repository `main` branch is currently unprotected. Until repository rules/branch protection are configured, process discipline must prevent accidental direct application-source promotion.

## Target governance

For the application phase, prefer:

- `main` = reviewed release integration branch;
- feature/build branch such as `build/native-r6-flagship` = active candidate;
- changes merged by PR;
- production deploy uses exact approved `main` SHA only after owner release approval.

## Recommended branch/ruleset controls

When GitHub account/repository settings permit, configure rules equivalent to:

- require pull request before merge;
- require at least one review for material application/deployment changes where practical;
- dismiss stale approvals after material changes;
- require conversation resolution;
- require status checks;
- block force push;
- block branch deletion;
- require branch to be up to date before merge if CI depends on base state;
- restrict production workflow to reviewed refs/environments;
- do not allow bypass merely to accelerate a release.

Suggested required checks after R2 workflow names are stable:

- provenance / contamination
- dependency consistency
- typecheck
- lint
- unit/integration
- anti-reversion
- build / verify-build
- Playwright
- accessibility
- preview/security/release identity as appropriate

## Commit/release discipline

- no force-push rewriting release evidence;
- no direct commit of ZIP archives, `dist`, `node_modules`, `.env`, keys, caches or old site output;
- no legacy repository subtree/submodule;
- no deployment from developer local working directory;
- every deployed preview/production release tied to an immutable Git SHA;
- preserve failed-release SHAs for diagnosis.

## Production environment gate

Create/use a GitHub Environment such as `production` when deployment is implemented.

Production workflow should require:

- manual invocation/approval rather than automatic push-to-main deployment during migration;
- exact expected SHA input or equivalent immutable selection;
- environment-scoped Cloudflare credentials/secrets;
- no credentials exposed to pull-request jobs from untrusted forks;
- artifact/release identity verification before deployment.

## Supply-chain guidance

GitHub Actions versions should remain on current supported major lines and be reviewed periodically. For higher assurance, pin third-party/non-GitHub actions to reviewed immutable commit SHAs, especially actions with write/deploy privileges.

Use the minimum workflow `permissions:` required per job. Build/test jobs should be read-only unless an explicit upload/comment operation requires more.

Do not run untrusted PR code with production secrets.

## CODEOWNERS / ownership

When the application is imported, consider CODEOWNERS-like review expectations for:

- `.github/workflows/**`
- Cloudflare/Wrangler config
- service worker
- release policies
- canonical content registries
- source/provenance registries
- security/privacy policy

This is process guidance; do not invent additional maintainers without owner approval.

## Repository hygiene gate

CI should fail when it detects:

- old repository URL used as build checkout/runtime dependency;
- `app.js`, `rc*.js`, `phase2*.js` legacy runtime signatures;
- old service-worker/cache names;
- other-project source/runtime identifiers;
- committed secret patterns;
- archives/build output/private environment files.

## Merge rule

A PR may be technically mergeable but still remain DRAFT/NO-GO when:

- browser QA is pending;
- content truth/rights gate is pending;
- preview is unreviewed;
- visual acceptance is pending;
- production approval has not been given.

`mergeable` is a Git property, not a product-release decision.

## Production rule

Production deployment requires explicit owner approval after the exact candidate has been independently reviewed.

Until then:

`PRODUCTION STATUS: NO-GO`
