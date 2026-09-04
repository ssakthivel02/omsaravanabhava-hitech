# OmSaravanaBhava Hi-Tech — SEO & Structured Data Contract V1

**Goal:** strong discoverability without thin-content inflation, keyword stuffing or unsupported religious/temple claims.

## 1. Environment separation

Preview:

- `X-Robots-Tag: noindex, nofollow, noarchive`
- robots disallow all
- no production sitemap exposure
- no preview URL declared canonical to production unless route parity and policy explicitly permit it; safest default is no canonical on preview

Production:

- canonical host: `https://omsaravanabhava.org`
- one canonical URL per indexable route
- no duplicate trailing-slash/query/index variants
- sitemap contains only `INDEXABLE_PUBLIC` routes from the content publication policy

## 2. Indexability is a content decision

Do not index a route merely because it exists.

Current defaults:

- temple identity-only record → `PUBLIC_DIRECTORY_ONLY`
- Thiruppugazh metadata without canonical body → `PUBLIC_DIRECTORY_ONLY`
- meaningful About/Sources/Accessibility/legal routes → `INDEXABLE_PUBLIC`
- preview routes → `PUBLIC_NOINDEX`

A detail route becomes indexable only when it has substantive, truthful, source-aware value beyond a title/ID.

## 3. Route metadata

Every indexable route requires:

- unique title;
- concise truthful description;
- canonical URL;
- correct document language;
- OpenGraph title/description/type/url where useful;
- social image only when the image is rights-safe and contextually accurate.

Dynamic temple/song/detail pages must generate route-specific metadata from governed fields; no generic title repeated across hundreds of pages.

## 4. Structured data rules

Use structured data only when the visible page supports the same claim.

Possible types to evaluate carefully:

- `WebSite`
- `WebPage`
- `BreadcrumbList`
- `Organization` only for the OmSaravanaBhava platform identity, not temple ownership
- `Article` / `CreativeWork` only where the page actually qualifies

Do not mark OmSaravanaBhava as owner/operator of temples.

Do not emit:

- fabricated ratings/reviews;
- fake events;
- unverified opening hours;
- donation/payment schema pointing to the platform;
- `Place`/coordinates unless verified under the coordinate-confidence policy;
- author/publisher identities unsupported by source data;
- religious work metadata broader than the governed record proves.

## 5. Temple pages

For a temple detail page:

- official temple name may be shown when source-verified;
- administrative/source authority must be distinct from OmSaravanaBhava;
- current timings require `lastVerifiedAt` and should not be encoded as evergreen structured data unless freshly verified;
- coordinates require the project coordinate-confidence gate;
- traditional narrative should not be encoded as independently proven history.

## 6. Thiruppugazh / devotional works

For each work/verse record, keep separate:

- original author/work identity;
- source edition/transcription;
- modern editor/transcriber/commentator;
- canonical body publication state;
- rights state;
- transliteration/meaning authorship.

Do not imply that a metadata-only record contains canonical verse text.

## 7. Multilingual SEO

Tamil remains primary.

Only publish `hreflang` for a language when:

- the route has genuine interface/content parity for that locale;
- metadata is localized;
- direct navigation works;
- QA has passed.

Do not publish `hreflang` merely because a locale code exists in configuration.

Arabic requires RTL-qualified output before claim/indexing.

## 8. Sitemap generation

Sitemap is generated from the governed publication registry, not from a filesystem crawl.

Exclude:

- preview/internal routes;
- search result URLs;
- filter/query variants;
- saved/recent local routes;
- thin `PUBLIC_DIRECTORY_ONLY` detail pages;
- quarantined/review-only content;
- routes with unresolved publication rights.

## 9. Search snippets and page copy

Do not keyword-stuff Murugan names.

Natural alternate names may appear where contextually useful:

Murugan, Skanda, Subramanya/Subrahmanya, Kartikeya/Karthikeya, Shanmukha, Kumara, Saravana, Guha, Senthil, Vel Murugan.

Tamil devotional identity remains primary.

## 10. SEO release gate

Production SEO PASS requires:

- preview confirmed noindex;
- canonical host exact;
- no duplicate canonicals;
- no thin-record sitemap inflation;
- unique route metadata;
- structured data validates and matches visible content;
- supported-language claims only;
- robots/sitemap tested against built artifact;
- no legacy URLs/assets accidentally exposed by service worker or old deployment.

SEO must increase discovery of trustworthy content, not manufacture the appearance of a larger verified corpus.
