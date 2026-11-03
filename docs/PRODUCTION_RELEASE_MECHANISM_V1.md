# Production Release Mechanism V1 (approval-gated, disabled by default)

**Status:** candidate. Production remains **HOLD**. Merging this does not deploy anything and does not change `omsaravanabhava.org`.

Files: `.github/workflows/production-release.yml`, `wrangler.production.jsonc`, `scripts/verify-production-release-workflow.mjs`, `tests/production-release-gate.test.ts`.

## What it does and does not do

| Does | Does NOT |
| --- | --- |
| Builds the exact approved SHA in production mode and deploys the Worker `omsaravanabhava-hitech` | Touch DNS, routes, custom domains, zones or `omsaravanabhava.org` |
| Checks SHA is on `main` with a green push CI run | Reuse any preview workflow, Worker or config |
| Verifies `/release.json`, production robots/sitemap/CSP, PWA, no legacy runtime | Run on push, PR or schedule |
| Requires a human approval (GitHub Environment) per run | Run at all until the owner arms it |

## One-time arming (owner, in GitHub settings)

1. Settings > Environments > create `production`; add yourself as **required reviewer**; restrict to branch `main`.
2. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as **environment** secrets on `production` (Workers Scripts edit only; no zone/DNS permission).
3. Settings > Variables > repository variable `PRODUCTION_RELEASE_ENABLED` = `true`. Delete or set to anything else to disarm instantly.
4. Enable branch protection on `main` (require PR, require CI checks, block force-push).

## Running a release

Actions > "Production release" > Run workflow:

- `release_sha`: full 40-hex SHA on `main`
- `confirmation`: `DEPLOY_PRODUCTION_` + first 12 characters of that SHA
- `rollback_sha`: last known-good 40-hex SHA, or `FIRST_RELEASE`

Approve the `production` environment prompt. The Worker is then live only at its `workers.dev` URL.

## After deploy (manual, per cutover runbook section 5-7)

1. Open the Worker's `workers.dev` URL; `/release.json` must show `commit` = approved SHA, `environment` = `production`, `repository` = `ssakthivel02/omsaravanabhava-hitech`. (Field is `commit`; older runbook text says `commitSha`.)
2. Smoke-test critical routes, deep-link refresh, offline/SW update, mobile 320/390.
3. Only then, in the Cloudflare dashboard, attach `omsaravanabhava.org` to the Worker (owner action). Record the legacy target first.
4. Re-verify `/release.json` from the public root domain and the fresh-client checks in the runbook.

## Rollback

- **Before domain attach:** nothing to roll back; the root domain never changed.
- **After domain attach:** (a) detach the custom domain / re-point to the recorded legacy target in Cloudflare (fastest), or (b) re-run this workflow with `release_sha` = the `rollback_sha` of the failed run (rebuilds and redeploys the prior approved commit), or (c) use Cloudflare's Worker version rollback.
- Any `/release.json` mismatch or legacy asset on the live domain = immediate rollback.

## Open decisions for the owner

- `workers_dev: true` lets the production-mode build be reached at a `workers.dev` URL before cutover. It serves production robots (`Allow`) with canonical tags pointing at `omsaravanabhava.org`. Set it to `false` at cutover if you prefer no secondary hostname.
- Cloudflare token scope and the `production` environment reviewers are owner-side; this repo cannot enforce them.
- Not yet rehearsed against Cloudflare: the deploy step has been verified only by static audit, unit tests and a local dry-run of its shell assertions, not by a real deployment.
