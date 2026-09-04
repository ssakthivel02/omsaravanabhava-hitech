# OmSaravanaBhava Hi-Tech — Release Cutover & Rollback Runbook V1

## Objective

Move the clean hi-tech application from isolated preview to `https://omsaravanabhava.org/` without ever falling back to the legacy application shell through repository drift, DNS drift, Cloudflare project confusion, stale service-worker caches or a wrong build artifact.

Production remains **NO-GO** until explicit owner approval.

## 1. Pre-cutover prerequisites

All of the following must be green on one exact Git SHA:

- dependency install / typecheck / lint / tests;
- production build;
- anti-reversion source + artifact checks;
- Playwright browser matrix;
- axe/accessibility;
- mobile/tablet/desktop visual matrix;
- service-worker install/update/offline/old-cache migration;
- preview noindex;
- production robots/sitemap/canonical build logic;
- security/privacy headers;
- PWA truthfulness;
- performance budgets;
- content publication/rights gate;
- exact `/release.json` identity;
- owner visual/content acceptance.

## 2. Release identity

Before cutover record:

- repository = `ssakthivel02/omsaravanabhava-hitech`;
- exact Git SHA;
- tag/version if used;
- build timestamp;
- preview deployment URL;
- Cloudflare project/Worker = `omsaravanabhava-hitech`;
- R6 role = governed data/provenance only;
- source archive SHA where relevant;
- current legacy production target information for rollback.

No release may use a local placeholder SHA.

## 3. Artifact integrity

The promoted artifact must be rebuilt from or proven identical to the exact approved Git SHA.

Artifact checks:

- explicit deployment directory = `dist` (or final documented Vite output);
- real hashed Vite/React assets present;
- no legacy `app.js`;
- no `rc*.js` / `phase2*.js`;
- no legacy static HTML corpus;
- no legacy `sw.js`;
- no `osb-r5-*` cache name;
- `/release.json` exact;
- expected file-count/signature recorded.

Never deploy repository root using a generic assets command.

## 4. Cloudflare separation

Preview identity:

`omsaravanabhava-hitech-preview`

Production identity:

`omsaravanabhava-hitech`

Legacy production hosting remains untouched until cutover.

Never reuse an old Worker/Pages project that could retain old assets/configuration.

## 5. Cutover procedure

Only after explicit owner command equivalent to `DEPLOY PRODUCTION`:

1. freeze the approved Git SHA;
2. rerun exact-head CI;
3. build production-mode artifact;
4. verify production robots/canonical/sitemap;
5. verify `/release.json`;
6. deploy the NEW production Cloudflare project without yet changing root-domain routing if supported;
7. smoke-test its platform URL/direct deployment URL;
8. record deployment identifier;
9. attach/switch `omsaravanabhava.org` using supported Cloudflare custom-domain/routing configuration;
10. verify TLS/HTTPS;
11. verify root and critical routes;
12. verify deep refresh on React routes;
13. verify release marker from public root domain;
14. verify no old assets/cache/service-worker shell;
15. monitor for errors/Web Vitals/regression signals.

## 6. Mandatory fresh-client checks

After domain switch test at minimum:

- normal desktop browser with existing old-site history;
- private/incognito desktop;
- mobile browser fresh session;
- existing client with old service worker if reproducible;
- service worker manually unregistered + cache cleared;
- hard reload;
- direct deep route such as temple/search/source route.

All must serve the same new release identity.

## 7. Anti-reversion runtime checks

On live production inspect:

- HTML source references hashed new bundles;
- network does not request legacy `app.js`;
- service-worker registration script points to new SW;
- Cache Storage contains only expected new namespace after activation cleanup;
- `/release.json.repository` = `ssakthivel02/omsaravanabhava-hitech`;
- `/release.json.commitSha` = approved SHA;
- production Cloudflare deployment identifier matches recorded release.

Any mismatch = **IMMEDIATE NO-GO / ROLLBACK CANDIDATE**.

## 8. Rollback triggers

Rollback should be considered immediately for:

- wrong/legacy site appears;
- widespread blank page/runtime failure;
- broken root/deep routing;
- service-worker stale-loop trapping users;
- serious accessibility regression blocking navigation;
- material canonical-content corruption;
- security/privacy regression;
- incorrect release identity;
- severe performance regression that makes critical use impractical;
- DNS/custom-domain misrouting.

Minor copy/visual defects do not automatically require rollback if safe hotfix is lower risk.

## 9. Rollback method

Rollback means restoring the previous known-good routing/hosting target, **not copying legacy code into the new repository**.

Sequence:

1. capture failure evidence first if safe;
2. switch domain/routing back to previous known-good target;
3. verify HTTPS/root/deep routes;
4. confirm old known-good service is reachable;
5. publish incident state internally;
6. keep failed hi-tech release SHA/deployment preserved for diagnosis;
7. do not force-push/delete evidence;
8. fix forward on a new branch/PR.

## 10. Service-worker rollback strategy

Because service workers can outlive DNS/deploy changes:

- every hi-tech SW version must support controlled activation/update;
- new cache namespace is versioned;
- navigation is network-first with last-known-good offline fallback;
- shell caching requires successful HTML;
- obsolete known hi-tech/legacy caches may be deleted during activation;
- emergency SW unregistration logic may be prepared but must not be shipped casually.

A rollback is incomplete until a client previously running the failed SW can recover.

## 11. Post-cutover observation window

During initial release observation check:

- release identity consistency;
- 404/error rate;
- critical route availability;
- Web Vitals aggregates if privacy-safe telemetry is enabled;
- service-worker version adoption;
- old-release traffic persistence;
- mobile navigation/search/temple pages;
- correction/contact channel availability.

## 12. Release evidence package

Preserve:

- approved Git SHA;
- CI run links/results;
- preview URL/screenshots;
- Cloudflare deployment ID;
- before/after routing record;
- `/release.json` capture;
- browser matrix evidence;
- performance/accessibility reports;
- content/rights gate report;
- rollback target and procedure;
- owner approval timestamp/message.

## Final principle

The old production repository may remain as rollback history, but **rollback must never turn into source contamination**. The hi-tech repository stays clean even if routing temporarily returns to the old production service.
