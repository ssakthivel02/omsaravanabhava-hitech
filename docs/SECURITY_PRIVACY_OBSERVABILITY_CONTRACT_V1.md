# OmSaravanaBhava Hi-Tech — Security, Privacy & Observability Contract V1

**Status:** R2+ engineering contract  
**Production authority:** `ssakthivel02/omsaravanabhava-hitech` only  
**Production:** NO-GO until release gates pass

## Purpose

The new flagship must be secure and observable without turning a devotional website into a surveillance product. Security controls, performance telemetry and operational evidence must protect users while keeping local devotional practice private by default.

## 1. Security-header baseline

For the pure static React/Vite surface, use Cloudflare Workers Static Assets `_headers` where appropriate. If a Worker later generates dynamic responses, apply equivalent headers in Worker code because `_headers` does not cover Worker-generated responses.

Required baseline after compatibility testing:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY` as compatibility defence, with CSP `frame-ancestors 'none'` as the primary modern control
- `Permissions-Policy` disabling unneeded browser capabilities
- HSTS on production only after HTTPS/custom-domain cutover is proven and rollback implications are understood
- CSP delivered by response header, not only meta tags

## 2. Content Security Policy deployment

Do not jump directly to a brittle production CSP.

Sequence:

1. inventory every script/style/font/image/connect/frame/media origin actually used by R2;
2. eliminate unnecessary third-party runtime origins;
3. deploy `Content-Security-Policy-Report-Only` on preview;
4. fix violations;
5. move to enforced CSP for production candidate;
6. keep `object-src 'none'` and `base-uri 'none'` unless a documented need exists;
7. block framing with `frame-ancestors 'none'`;
8. avoid `unsafe-eval`;
9. avoid `unsafe-inline` for scripts;
10. if inline script is unavoidable, prefer hashes/nonces rather than global inline permission.

Any later analytics, Turnstile, video, audio CDN or font provider must update the CSP deliberately. Do not weaken CSP globally to make a third-party widget work.

## 3. Third-party dependency rule

Every new runtime dependency or external service must answer:

- why it is needed;
- payload cost;
- privacy impact;
- CSP impact;
- offline impact;
- accessibility impact;
- fallback behaviour;
- whether a native browser/API solution is sufficient.

No tracking SDK should be added merely because it is common.

## 4. Privacy-first product defaults

Default local-only data:

- saved/recent devotional items;
- practice counters;
- reading preferences;
- language preference;
- optional local reminders/preferences where browser APIs permit.

Do not create a user account merely to save these states.

Do not transmit mantra/practice counts, saved prayers, religious reading behaviour or other devotional-practice data to analytics by default.

Do not infer or expose a user's religion, devotional intensity or personal spiritual state from product telemetry.

## 5. Analytics policy

Before enabling any analytics:

- define the exact product question the metric answers;
- prefer aggregate, low-cardinality operational metrics;
- exclude canonical text, user search queries, local practice content and free-form devotional input unless a separate privacy review explicitly permits collection;
- never record full URL/query strings if they may reveal devotional/private search terms;
- no session replay/keystroke capture on canonical-reading, search, practice, correction/contact or legal routes;
- no advertising trackers;
- no cross-site profiling.

Suggested safe high-level metrics if needed later:

- anonymous route-level page-view counts;
- Web Vitals aggregates by route group/device class;
- generic error rate;
- asset/build version adoption;
- service-worker version adoption;
- 404 counts with path normalization.

## 6. Real-user performance observability

Core Web Vitals field targets remain:

- LCP <= 2.5s at p75;
- INP <= 200ms at p75;
- CLS <= 0.10 at p75.

RUM, if implemented, must:

- sample rather than collect every interaction where possible;
- avoid sending text content;
- attach only coarse device/network/route-group information;
- attach `release.json` build identity so regressions can be tied to a Git SHA;
- permit full removal without breaking the application.

## 7. Error observability

A client error pipeline, if added, should record only:

- release SHA;
- application version;
- route template, not sensitive query content;
- browser/runtime class;
- sanitized stack/message;
- occurrence count.

Redact:

- free-form user content;
- search strings;
- local-storage values;
- contact details;
- devotional-practice data;
- source texts where not needed for debugging.

## 8. Release and health observability

Every deployed preview/production candidate must expose `/release.json` with:

- repository;
- exact Git SHA;
- environment;
- build timestamp;
- app version;
- R6 role = governed data/provenance only;
- verified source SHA where applicable.

Production verification should also check:

- root HTML returns expected release marker linkage;
- key JS/CSS assets return successfully;
- SPA deep routes resolve;
- no legacy `app.js` / legacy SW / old cache namespace is served;
- preview remains noindex;
- production canonical host is correct.

## 9. Security/observability release gates

Production is blocked unless:

- secret scan PASS;
- dependency review PASS;
- CSP preview/report-only evidence reviewed;
- security headers PASS;
- no mixed content;
- no wildcard cross-origin policy without documented need;
- no unapproved third-party trackers;
- privacy copy matches actual behaviour;
- release identity exact SHA PASS;
- service-worker update/rollback evidence PASS.

## 10. Cloudflare-specific implementation note

Cloudflare Workers Static Assets supports `_headers`; default static-asset caching uses revalidation/ETags, while fingerprinted assets may receive explicit long immutable browser caching. Do not make HTML/navigation immutable. Preview `workers.dev` responses should carry `X-Robots-Tag: noindex`.

If dynamic Worker code is introduced later, headers for Worker-generated responses must be added in the Worker itself.

## Final principle

Observability should help us answer **“Is the site healthy, fast and serving the intended release?”** without answering **“What exactly is this devotee privately reading, searching or practising?”**
