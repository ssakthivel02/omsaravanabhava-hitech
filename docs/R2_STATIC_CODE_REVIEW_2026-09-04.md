# R2 Static Code Review — 2026-09-04

**Reviewed baseline:** accepted R1 clean-room candidate + independent R1.1 hardening input.  
**Purpose:** precise defect list for Claude R2 implementation.  
**Production:** `NO-GO`.  
**Authority:** `CURRENT_PROJECT_AUTHORITY.md` remains controlling.

This review is intentionally concrete. It does not authorize copying any legacy R6 application shell. All fixes must remain inside the clean React/TypeScript/Vite architecture.

## P0 — correctness / truth / release blockers

### R2-CODE-001 — Search truth wording overclaims verification

**Observed behavior**

Search copy states, in effect, that only verified records are shown. The search index includes governed/source-tracked records whose individual fields may be pending or absent. `Hit.state` is collected but not presented to the user.

**Risk**

A governed record may be mistaken for fully verified/complete content.

**Required fix**

- change promise to `governed/source-tracked records` or equivalent truthful Tamil/English wording;
- render the actual record/source/completeness state in every result;
- zero-result copy must not repeat a blanket `verified records` claim;
- keep generated reflection out of source-result ranking.

**Gate**: CONTENT_TRUTH_GATE.

---

### R2-CODE-002 — Footer makes an over-broad source claim

**Observed behavior**

Footer wording implies content comes only from verified sources and that source state is shown on every record.

**Risk**

Current corpus includes source-linked/pending and identity-only records.

**Required fix**

Use wording equivalent to `governed/source-tracked content; verification and completeness states are shown where applicable`.

---

### R2-CODE-003 — Home metrics conflate record count with completeness

**Observed behavior**

Home count uses `thiruppugazh.length` and other raw corpus counts. Current baseline has 12 Thiruppugazh identities but 0/12 imported canonical verse bodies.

**Required fix**

Metrics must distinguish, where relevant:

- directory/source-linked records;
- records with canonical body;
- records with verified visitor/detail information;
- published audio.

Example: `12 source-linked Thiruppugazh records · canonical text import pending`, not `12 Thiruppugazh` if that can imply completeness.

---

### R2-CODE-004 — Completeness table has misleading shared column semantics

**Observed behavior**

One column labelled approximately `source text` renders a fallback expression such as:

`withCanonicalText ?? withHistory ?? '—'`

For temple rows, a history count can therefore appear under a source-text heading.

**Required fix**

Use domain-specific columns or an explicit completeness matrix. Separate at minimum:

- canonical body;
- history;
- coordinates;
- visitor information;
- architecture;
- audio;
- rights/publication state.

Never use a shared label for different dimensions.

---

### R2-CODE-005 — Temple verification dimension is conflated with coordinate status

**Observed behavior**

Arupadai list uses a badge sourced from `coordinateConfidence`. All six currently have coordinate verification pending, even though the temple identity itself can have a strong official/source identity lane.

Temple detail provenance similarly emphasizes coordinate/image state without an explicit independent temple-identity/source verification dimension.

**Risk**

A user can read `coordinates pending` as `temple identity unverified`.

**Required data-model fix**

Add independent dimensions, for example:

- `identityVerificationState`;
- `sourceVerificationState`;
- `coordinatesState`;
- `visitorInformationState`;
- `imageState`;
- `rightsState`;
- `completenessState`.

Every badge must identify the dimension it describes when ambiguity is possible.

Do not infer global record verification from coordinates or image state.

---

### R2-CODE-006 — Contact/corrections route promises a process but has no real destination

**Required fix**

Before preview/product-complete claim either:

- add an owner-approved contact/email/form destination with privacy/anti-spam handling; or
- explicitly state that the correction channel is not yet available.

A dead support promise is not acceptable.

---

### R2-CODE-007 — Daily practice rotates on UTC day, not visitor-local date

**Observed logic**

A calculation equivalent to `Math.floor(Date.now() / 86_400_000)` is used.

**Risk**

Daily content can change at the wrong local time.

**Required fix**

Derive a stable day key from the visitor's local year/month/date. Test near local-midnight boundaries.

---

### R2-CODE-008 — Accessibility page overclaims unproven conformance

**Observed behavior**

Accessibility copy says the site is fully keyboard operable / touch targets meet a particular size before GitHub-hosted Playwright/axe/browser qualification has run on the exact candidate.

**Required fix**

Until exact-candidate evidence exists, use wording like:

- `designed to support keyboard-only operation`;
- `primary touch targets target approximately 44×44 CSS px`;
- `qualification evidence pending`.

After CI/browser evidence is green, stronger versioned claims may be made.

Do not claim WCAG requires 44×44; WCAG 2.2 AA target-size minimum is 24×24 CSS px with defined exceptions. The 44×44 target is a stronger project preference.

---

### R2-CODE-009 — Namavali/prayer UI leaks raw internal research-state keys

**Observed behavior**

UI renders raw `Object.entries(namavali.researchState)` style internal keys/values to ordinary users.

**Required fix**

Use devotee-friendly status labels. Keep technical/raw state on Sources/Completeness pages or an advanced disclosure.

Current Namavali policy remains `ZERO_PUBLISHABLE_COLLECTIONS`; do not synthesize a collection from the seven-name registry.

---

### R2-CODE-010 — Old-cache eviction Playwright scenario is logically incorrect

**Observed test shape**

The test allows the new service worker to activate, then creates an old cache such as `osb-r5-contract-v3-v1`, reloads, and expects activation cleanup to remove the newly seeded old cache.

**Problem**

A page reload does not cause the already-active service worker's `activate` event to run again. The test can therefore fail for the wrong reason or fail to prove the intended migration behavior.

**Required fix**

Test migration by one of these valid patterns:

1. seed known legacy cache **before** candidate service-worker registration/activation, then register/activate and assert cleanup; or
2. unregister existing SW, seed old cache, register exact candidate SW, await activation/claim, assert cleanup.

Also test that cleanup is narrowly scoped to known OmSaravanaBhava legacy cache prefixes/names, not arbitrary `osb-*` data.

---

### R2-CODE-011 — Service-worker registration test can be vacuous

**Observed behavior**

A `waitForFunction(...).catch(() => {})` pattern permits no controlling SW, then later checks cache names.

**Required fix**

For SW-specific tests, failure to become registered/ready must fail the test. Use explicit `navigator.serviceWorker.ready` / registration-state assertions and prove the candidate worker URL/version.

Offline tests should additionally prove:

- online first visit;
- successful shell cached;
- offline navigation works for supported scope;
- a failed/non-HTML navigation response cannot replace the last-known-good shell;
- update activation behavior;
- fresh/private state.

---

### R2-CODE-012 — Source confidence field naming is inconsistent

**Observed model mismatch**

Typed source reference uses a field resembling `confidence?: string`, while recovered sample data uses `source_confidence`.

**Required fix**

Normalize source data during extraction/import or update the type/model deliberately. Do not silently drop source-confidence information due to naming mismatch.

---

## P1 — product/UX quality defects

### R2-CODE-013 — Temple directory silently truncates results

Current UX can report the full record count while rendering only the first ~200 results, with a note.

**Required improvement**

Use one or more of:

- explicit `showing X of Y`;
- load-more/pagination;
- governed facets;
- URL-persisted search/filter state.

Do not load all 376 records on Home. Directory-route optimization should be measurement-led.

---

### R2-CODE-014 — Search silently truncates results

Current search slices results to roughly 60 without a strong user-facing count/disclosure.

**Required improvement**

Show `first N of total` and/or use ranking/pagination. Preserve keyboard/assistive-tech navigation.

---

### R2-CODE-015 — Generic StateBadge mixes unrelated state dimensions

A single badge/tone mapping is used for rights, coordinates, source state, publication state, audio and image state.

**Risk**

`pending` has no clear semantic object.

**Required improvement**

Keep shared visual primitives if useful, but bind them to a labelled dimension such as:

- `Source: linked / review pending`
- `Coordinates: pending verification`
- `Rights: metadata only`
- `Audio: not published`

Do not make color/tone alone carry the meaning.

---

### R2-CODE-016 — Legal/About wording needs finer content-governance language

Examples of problematic simplification:

- `source rights belong to publishers` is too broad for public-domain works, editions, transcriptions and owner-supplied material;
- `unverified information is not published` conflicts with public identity/source-linked partial records.

**Required fix**

Use the dimensions defined in `docs/R2_CONTENT_PUBLICATION_CONTRACT.md` and `release/CONTENT_PUBLICATION_POLICY.json`.

Suggested principle:

`Public visibility, source verification, completeness and publication rights are independent states.`

---

### R2-CODE-017 — Mobile navigation lacks full current-route semantics

Desktop nav uses `aria-current`; mobile nav does not consistently do so.

**Required fix**

Add equivalent current-route semantics to mobile navigation and confirm menu closes/focus restores correctly after navigation.

---

### R2-CODE-018 — Detail-route metadata is generic

Temple/Thiruppugazh detail pages use generic route titles instead of the actual governed record title/name.

**Required fix**

Generate route-specific title/description from real governed record data. Production-only canonical and OpenGraph must follow publication policy. Preview remains noindex and must not create production canonical collisions.

---

### R2-CODE-019 — Tamil font declarations are not proof of delivered typography

CSS names Tamil fonts, but source does not by itself prove those fonts are actually loaded.

**Required fix before production**

- choose rights-safe font delivery;
- include only necessary weights;
- explicit `font-display`;
- measure WOFF2 transfer and text rendering;
- verify no Tamil fallback glyph/mojibake at 320/390/768/1440/1920.

Follow `docs/SACRED_TECH_DESIGN_SYSTEM_V1.md` and `release/PERFORMANCE_MOTION_BUDGET_V1.json`.

---

### R2-CODE-020 — Footer responsive rule needs 320px validation

A footer navigation rule appears outside the desktop media block and may force a two-column layout on narrow screens.

**Required action**

Verify at 320px and 200% zoom. Fix only if overflow, awkward reading order or cramped targets occur.

---

## P1 — accessibility/test completeness

### R2-CODE-021 — Axe configuration should explicitly cover current WCAG 2.2 expectations

Current test tags emphasize WCAG 2.0/2.1 families.

**Required action**

Review the installed/current axe rules and configure the CI suite so WCAG 2.2-related rules supported by that axe version are actually exercised. Keep manual checks for criteria automation cannot prove.

Do not claim full WCAG conformance from axe alone.

---

### R2-CODE-022 — Touch-target test scope is too narrow

Do not validate buttons only.

Include meaningful interactive controls:

- links;
- buttons;
- inputs/search controls;
- menu triggers;
- audio controls;
- practice controls;
- filter chips/selects where used.

Project preference is ~44×44 for primary mobile controls; exceptions must remain usable and meet actual WCAG requirements.

---

## Positive findings to preserve

The following R1 foundations are good and should not be regressed:

- clean React/Vite application is independent from legacy shell;
- old runtime files are excluded;
- new explicit cache namespace exists;
- home does not eagerly load the 376-temple corpus;
- lightweight SVG/Vel approach supports performance;
- `main` is focusable as a skip-link destination;
- hero decorative geometry is hidden appropriately from assistive technology;
- content model already separates several rights/source states;
- production canonical logic is origin-aware, reducing preview collision risk;
- canonical-content gaps are represented instead of fabricated.

## R2 fix order

Recommended implementation sequence:

1. R2-CODE-004/005/012 — correct the data/state dimensions first;
2. R2-CODE-001/002/003/008/016 — fix public truth language;
3. R2-CODE-010/011/021/022 — make browser/SW/a11y tests valid;
4. R2-CODE-006/007/009/017/018 — remove product dead ends/semantic defects;
5. R2-CODE-013/014/015/019/020 — premium discovery/visual polish;
6. run exact-candidate TypeScript/lint/Vitest/build/anti-reversion/Playwright/axe/responsive/SW/offline/performance gates.

## Exit condition

This static review is complete only when each P0 item is fixed or explicitly dispositioned with evidence on the exact R2 candidate.

No P0 item may be converted into `N/A` merely because the current corpus is incomplete.

Production remains `NO-GO`.
