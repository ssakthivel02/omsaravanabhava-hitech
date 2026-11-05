# Production Release Mechanism V1 (approval-gated, disabled by default)

**Status:** create-only candidate. Production remains **HOLD**. Merging this does not deploy anything and does not change `omsaravanabhava.org`.

Files: `.github/workflows/production-release.yml`, `wrangler.production.jsonc`, `scripts/verify-production-release-workflow.mjs`, `tests/production-release-gate.test.ts`.

## What it does and does not do

| Does | Does NOT |
| --- | --- |
| Builds the exact approved SHA in production mode and uploads to Worker `omsaravanabhava-hitech` | Explicitly edit DNS, routes, custom domains or zones; **it cannot prove effective traffic isolation** |
| Checks SHA is on `main` with a green push CI run | Reuse any preview workflow, Worker or config |
| Verifies `/release.json`, production robots/sitemap/CSP, PWA, no legacy runtime | Run on push, PR or schedule |
| Requires a human approval (GitHub Environment) per run | Run at all until the owner arms it |

## One-time arming (owner, in GitHub settings)

1. Settings > Environments > create `production`; require a **different authorized reviewer**, enable **Prevent self-review**, restrict deployments to branch `main`, and check bypass controls.
2. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as **environment** secrets on `production` (Workers Scripts edit only; no zone/DNS permission).
3. Settings > Variables > repository variable `PRODUCTION_RELEASE_ENABLED` = `true`. Delete or set to anything else to disarm instantly.
4. Enable branch protection on `main` (require PR, require CI checks, block force-push).

## Running a release

Actions > "Production release" > Run workflow:

- `release_sha`: full 40-hex SHA on `main`
- `confirmation`: `DEPLOY_PRODUCTION_` + first 12 characters of that SHA
- `rollback_sha`: exactly `FIRST_RELEASE` for this create-only candidate. Upgrading an existing Worker or invoking a rollback requires a separately reviewed workflow and a proven recovery method.

The preflight checks the Cloudflare Worker-list API (account authorization) and checks the exact named production Worker. It refuses a Worker already present and fails closed for errors or an unknown status; this reduces accidental overwrites but is not atomic, and does not establish actual routes or domains. Independently inspect Cloudflare routing and rollback before approval. A first deployment is intended to be smoke-tested on `workers.dev` before any manual domain cutover. **WARNING:** an existing route/domain configuration may reference a Worker name even when no script currently exists. Creating that named Worker could potentially affect live traffic; verify actual Cloudflare route/domain bindings and the currently live origin independently BEFORE running this workflow. The script-absence check is not a route-absence check.

## After deploy (manual, per cutover runbook section 5-7)

1. Open the Worker's `workers.dev` URL; `/release.json` must show `commit` = approved SHA, `environment` = `production`, `repository` = `ssakthivel02/omsaravanabhava-hitech`. (Field is `commit`; older runbook text says `commitSha`.)
2. Smoke-test critical routes, deep-link refresh, offline/SW update, mobile 320/390.
3. Only then, in the Cloudflare dashboard, attach `omsaravanabhava.org` to the Worker (owner action). Record the legacy target first.
4. Re-verify `/release.json` from the public root domain and the fresh-client checks in the runbook.

## Rollback

- **Before domain attach:** nothing to roll back; the root domain never changed.
- **After domain attach:** restore the recorded legacy routing target or use a separately approved Cloudflare version rollback after verifying version history. Do **not** re-run this create-only candidate against an existing Worker; it intentionally refuses that operation.
- Any `/release.json` mismatch or legacy asset on the live domain = immediate rollback.

## Open decisions for the owner

- `workers_dev: true` lets the production-mode build be reached at a `workers.dev` URL before cutover. It serves production robots (`Allow`) with canonical tags pointing at `omsaravanabhava.org`. Set it to `false` at cutover if you prefer no secondary hostname.
- Cloudflare token scope and the `production` environment reviewers are owner-side; this repo cannot enforce them.
- Not yet rehearsed against Cloudflare: the deploy step has been verified only by static audit, unit tests and a local dry-run of its shell assertions, not by a real deployment.
