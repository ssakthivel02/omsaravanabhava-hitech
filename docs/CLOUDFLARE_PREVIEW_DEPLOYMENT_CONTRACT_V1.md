# OmSaravanaBhava Hi-Tech — Cloudflare Preview Deployment Contract V1

## Purpose

Create the first real browser-accessible hi-tech preview without touching `omsaravanabhava.org` or reusing any legacy Cloudflare runtime/configuration.

## 1. New preview identity

Required preview project/Worker identity:

`omsaravanabhava-hitech-preview`

Do not reuse old Worker/Pages names or bindings.

Preferred initial public endpoint: unique Cloudflare `workers.dev` deployment.

Do not create `hitech-preview.omsaravanabhava.org` unless the owner explicitly approves it.

## 2. Source/artifact authority

Deploy only from:

`ssakthivel02/omsaravanabhava-hitech`

at the exact approved candidate Git SHA.

Build:

`pnpm run build`

Deploy the explicit Vite output directory only (expected `dist`).

Never deploy repository root with a generic assets command.

## 3. SPA routing

The preview must support direct refresh for React routes.

Configure current Cloudflare-supported static-assets SPA fallback so routes such as:

- `/temples/...`
- `/thiruppugazh/...`
- `/search`
- `/sources`

return the new React application shell rather than a Cloudflare 404.

Unknown application routes must still render the application's intended Not Found experience after the SPA shell loads.

## 4. Preview indexing safety

Preview is not a public search-engine release.

Require:

- `robots.txt` disallow all;
- `X-Robots-Tag: noindex, nofollow, noarchive`;
- no production sitemap exposure;
- no preview/production canonical collision;
- no unsupported structured-data production claim.

## 5. Release identity

Preview `/release.json` must include:

- repository `ssakthivel02/omsaravanabhava-hitech`;
- exact Git SHA;
- build timestamp/version;
- environment `preview`;
- R6 role `governed-data/provenance only`;
- deployment identity where practical.

The local Claude placeholder SHA is not accepted after GitHub import.

## 6. Security headers

Apply preview headers according to:

`release/SECURITY_HEADERS_POLICY_V1.json`

CSP begins report-only where specified and must not be globally weakened to accommodate an unnecessary third-party widget.

## 7. Service worker

Preview uses only the new namespace:

`omsaravanabhava-hitech-v1-*`

Before declaring preview stable, test:

- first visit;
- refresh;
- offline after prior visit;
- update deployment;
- old cache seeded before activation;
- fresh/private browser;
- manual SW unregister/cache clear.

## 8. Preview smoke routes

Immediately after deployment verify:

- `/`
- `/arupadai-veedu` or final equivalent
- `/temples`
- one temple detail
- `/thiruppugazh`
- one Thiruppugazh detail
- `/search`
- `/sources`
- `/content-completeness` or final equivalent
- `/accessibility`
- `/release.json`
- `/robots.txt`

## 9. Anti-reversion checks

On workers.dev preview verify:

- HTML references hashed new Vite bundles;
- no request for legacy `app.js`;
- no `rc*.js` / `phase2*.js`;
- no old static HTML corpus;
- no old `osb-*` runtime cache;
- no other-project asset/runtime;
- private browser shows same new release immediately.

## 10. Preview evidence

Record:

- Git SHA;
- CI run;
- Cloudflare deployment ID/URL;
- `/release.json` capture;
- route smoke results;
- Playwright run;
- axe/manual accessibility evidence;
- visual screenshots;
- performance report;
- service-worker/offline/update evidence.

## 11. No production mutation

Creating or updating the preview must not:

- change root DNS;
- attach `omsaravanabhava.org`;
- modify legacy production Worker/hosting;
- remove rollback evidence.

## Preview gate

`CLOUDFLARE_PREVIEW_GATE` passes only when the exact GitHub candidate is served from the new Cloudflare preview identity, remains non-indexable, passes critical route/browser/security/anti-reversion checks, and leaves production routing untouched.