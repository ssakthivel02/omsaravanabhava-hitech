# OmSaravanaBhava Hi-Tech — Performance Profiling Runbook V1

## Purpose

Protect the premium experience from gradual performance decay as imagery, Tamil fonts, temple data, audio and motion are added.

## 1. Critical routes

Profile at minimum:

- Home
- Arupadai Veedu
- Temple Directory
- Temple Detail
- Thiruppugazh index/detail reader
- Search
- Daily Practice
- Sources/Completeness

## 2. Exact-candidate evidence

Every performance report records:

- Git SHA;
- environment/URL;
- build mode;
- device/viewport profile;
- browser/tool version where practical;
- date;
- route;
- cold/warm cache distinction.

Do not compare local dev-server results with optimized production builds as if equivalent.

## 3. Core targets

Use `release/PERFORMANCE_MOTION_BUDGET_V1.json` as the machine-readable authority.

Important targets include:

- LCP <= 2.5s p75 field target;
- INP <= 200ms p75 field target;
- CLS <= 0.10 p75 field target;
- Mobile Lighthouse Performance >= 90 target;
- Desktop >= 95 target;
- Home initial JS gzip <= governed budget;
- 376-temple corpus absent from Home initial chunk.

## 4. Bundle analysis

After material dependency/route changes inspect:

- entry JS;
- vendor chunk;
- route chunks;
- temple corpus chunk;
- fonts;
- CSS;
- large JSON/data assets;
- duplicated dependencies.

A new library must justify payload and runtime cost.

## 5. Home

Protect the Home route aggressively:

- no full temple corpus eager load;
- lightweight Vel/SVG hero preferred;
- no autoplay hero video;
- no unnecessary audio preload;
- no large search index before interaction unless measured and justified;
- below-fold imagery lazy loaded;
- only likely next-route prefetch where appropriate.

## 6. Temple Directory

Measure:

- initial parse/render of 376 records;
- filter/search input responsiveness;
- memory use;
- scroll smoothness on low-end/mobile profiles;
- result-count rendering.

Do not add virtualization by habit. Use it only when measurement shows a real need and accessibility/SEO remain correct.

## 7. Search

Profile:

- index construction;
- first keystroke readiness;
- Tamil normalization cost;
- result ranking latency;
- route/data lazy loading;
- zero-result behavior.

Search must feel instant without preloading unrelated heavy data into Home.

## 8. Tamil fonts

Measure:

- WOFF2 total;
- number of weights;
- font-display behavior;
- first text paint;
- layout shift after font swap;
- canonical-reader legibility.

Do not ship many font weights for subtle visual differences.

## 9. Images/media

For every flagship image review:

- actual rendered size vs downloaded dimensions;
- AVIF/WebP availability where suitable;
- `srcset`/`sizes`;
- width/height/aspect-ratio;
- lazy/eager decision;
- LCP candidacy;
- rights/provenance.

Audio should not preload entire tracks by default.

## 10. Motion

Profile animation on representative mobile hardware/profile.

Avoid:

- continuous compositing for decorative effects;
- large blurred layers moving continuously;
- layout-triggering animation;
- scroll-jacking;
- animation libraries whose cost exceeds their benefit.

Reduced-motion mode must remove unnecessary animation without removing function.

## 11. Regression thresholds

Any material route regression should require explanation when compared with the last approved candidate, especially:

- >10% increase in initial JS/transfer;
- LCP deterioration >250ms in comparable lab runs;
- new CLS >0.05 on a previously stable route;
- user-input blocking visibly worse;
- new heavy runtime dependency.

These are investigation thresholds, not automatic statistical proof of a production regression.

## 12. Field monitoring

If privacy-safe field telemetry is enabled later, collect aggregate Web Vitals without devotional content/search/practice data.

Segment mobile/desktop and release SHA.

## Release gate

`PERFORMANCE_PROFILING_GATE` passes when exact-candidate critical routes meet agreed budgets or have an explicitly approved evidence-backed exception, with no unexplained bundle/media/font regression.