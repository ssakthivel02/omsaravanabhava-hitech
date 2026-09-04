# R2 Premium Experience Review — OmSaravanaBhava Hi-Tech

**Review date:** 2026-09-04  
**Reviewed baseline:** accepted R1 clean-room React/Vite candidate + independent R1.1 hardening  
**Purpose:** non-conflicting design/UX engineering guidance for R2 and later.  

This review does **not** authorize production deployment. It focuses on whether the clean-room application can reach the intended Manus-quality-or-better Sacred-Tech standard without compromising devotional truth, accessibility, performance, or anti-reversion controls.

## Executive assessment

R1 is a sound clean-room engineering foundation, but it is **not yet a flagship visual/product experience**. Its current visual language is elegant and restrained, yet most inner routes remain functional text/list views. That is appropriate for recovery, but below the final ambition.

The correct strategy is **not** to add heavy visual effects everywhere. The website should gain depth through information architecture, typography, spatial storytelling, purposeful motion, progressive disclosure and original Sacred-Tech illustration/geometry while keeping canonical Tamil exceptionally readable.

## What is already strong

- Original Vel geometry instead of copied imagery.
- Deep sanctum + lamp-gold/copper + single cool Vel-steel palette.
- Canonical Tamil receives a distinct parchment reading surface.
- Strong default text contrast; most current foreground/background combinations exceed WCAG AA comfortably.
- Clear verification-state component rather than ad-hoc truth claims.
- Reduced-motion mode exists from the start.
- Responsive layout is fluid rather than device-snapped.
- Home avoids a large raster hero, helping LCP.
- 376-temple corpus is split out of the home bundle.
- Old runtime shell/cache architecture is excluded.

## P0 — must resolve before flagship preview can be called feature-complete

### P0.1 Tamil-first + English support is not yet implemented as a real i18n system

The current UI is predominantly Tamil with isolated English subtitles. There is no real language switch/persistence architecture.

Required:

- establish explicit locale state;
- Tamil default;
- English full interface parity for all core routes before claiming bilingual support;
- persist language locally without account requirement;
- set document `lang` dynamically;
- do not advertise Hindi/Telugu/Malayalam/Arabic until their route-level QA exists;
- if Arabic is later enabled, implement real RTL layout rather than translated strings in LTR chrome.

### P0.2 Search wording is currently too strong

Current search copy says only verified records are shown, while the index includes governed records whose individual fields may be pending/absent.

Change the promise to something equivalent to:

`governed/source-tracked records only`

and render the record's real `StateBadge` in search results.

Never imply record-wide verification merely because a record is governed.

### P0.3 Home corpus counts need completeness context

The home currently advertises record counts such as Thiruppugazh and temples. Because many records are source-linked skeletons, counts should distinguish:

- directory/source-linked records;
- records with canonical body;
- records with visitor/detail content;
- published audio.

Avoid a user reading `12 Thiruppugazh` as `12 complete songs` when canonical text is not yet imported.

### P0.4 Contact route has no actual contact mechanism

The current Contact page explains how to submit a correction but provides no actual destination/channel.

Before production either:

- provide an owner-approved contact/email/form channel with anti-spam/privacy controls; or
- clearly state the current correction channel is not yet available.

Do not ship a dead support promise.

### P0.5 PWA installability is not yet qualified

The manifest currently lacks governed 192/512 icons. Do not claim installability until:

- new hi-tech icons are created;
- manifest/browser installability passes;
- service-worker update/offline behavior passes;
- stale-version recovery is documented.

Do not reuse old app icons solely to make PWA checks pass.

## P1 — flagship experience upgrades

### P1.1 Home should become an orchestrated Sacred-Tech narrative

Keep the current Vel-axis idea, but elevate it into a spatial narrative rather than adding generic cards.

Recommended home sequence:

1. **Sacred opening / Vel axis** — immediate Tamil identity, one strong primary action, no autoplay sound.
2. **Six-abode pilgrimage ribbon** — a sculptural sequence tied to the Vel, not six identical cards.
3. **Canonical knowledge portals** — Thiruppugazh, prayers, names/forms, sources.
4. **Temple intelligence** — honest directory depth + verification coverage, not inflated completion claims.
5. **Daily practice** — private/local and non-coercive.
6. **Trust layer** — source methodology, completeness, corrections.

The page should feel like entering a knowledge universe, not reading a dashboard.

### P1.2 Arupadai Veedu deserves a flagship visual journey

Current implementation is a text list. Final experience should add, without fabricating facts:

- a six-stop vertical/curved pilgrimage progression;
- distinctive ordinal treatment 01–06;
- temple names and governed verification states;
- original/rights-safe devotional illustrations or abstract architectural motifs where documentary photography is unavailable;
- optional verified maps only after coordinates are source-verified;
- deep links to each temple record;
- reduced-motion equivalent.

Do not invent coordinates to make a map look complete.

### P1.3 Temple directory needs better discovery than one text filter

376 records warrant a richer explorer while staying lightweight.

Add only when supported by actual data:

- text search;
- district/state facets;
- Arupadai Veedu filter;
- verification/completeness filter;
- alphabetical Tamil/English browse;
- progressive result rendering/pagination or virtualization if needed;
- persistent query in URL so filtered views can be shared/back-navigated.

For long result regions, consider browser-native rendering optimisations such as `content-visibility: auto` only after measuring the actual route.

### P1.4 Temple detail should make incomplete data feel intentional, not broken

Use a structured **What is verified / What is pending / Sources / Official channel** hierarchy.

If history, architecture, coordinates or visitor information are missing, show one tasteful completeness panel rather than many visually empty rows.

Do not turn absence into fake filler text.

### P1.5 Thiruppugazh reading experience should be ready before corpus arrives

The final reading shell should support:

- canonical Tamil first;
- adjustable comfortable text size;
- line-height/reading-width controls within accessible bounds;
- easy-reading Tamil as a separate governed layer;
- transliteration as a separate layer;
- meaning as a separate layer;
- source/edition drawer;
- audio/read-aloud state clearly separated;
- print/share only when rights allow.

Until canonical text is imported, keep the truthful pending state.

### P1.6 Search must become source-aware, not merely substring matching

The current local search is a good baseline. Upgrade progressively:

- Tamil normalisation without damaging canonical text;
- English/transliteration aliases;
- type filters;
- source/verification badges;
- result snippets only from real governed fields;
- no generated answer in the zero-result state;
- direct navigation to the most useful governed layer.

Do not add opaque AI-generated search answers ahead of source results.

### P1.7 Daily practice needs stronger devotional usefulness without gamification

Current local counter is safe, but the rotating daily temple-name focus is minimal.

Future additions may include only governed material:

- a daily verified Murugan name;
- source-linked short canonical line when available;
- local repetition counter;
- local saved/recent items;
- optional gentle reminder UI controlled by the user.

No streak pressure, rankings, guilt language or guaranteed benefits.

Use the user's **local calendar day**, not a raw UTC-day calculation, for any daily content rotation.

### P1.8 Add a real Murugan knowledge route

The product vision includes Murugan names/forms/epithets and source-aware knowledge, but R1 has no dedicated knowledge route despite having a small sacred-name registry.

Create an expandable `Murugan Knowledge` journey that starts only with governed records and grows safely as the corpus matures.

### P1.9 Audio should have its own truthful architecture even while empty

Do not fabricate content, but establish:

- recorded devotional audio vs browser/device read-aloud distinction;
- ownership/rights state;
- accessible player controls;
- no autoplay with sound;
- efficient lazy loading;
- empty-state explanation until owned/licensed audio exists.

## P1 — design system upgrades

### Typography

Current CSS declares Noto Serif/Sans Tamil but does not itself guarantee those fonts are available.

Before production:

- self-host only legally permitted font files or use a controlled web-font strategy;
- prefer Noto Serif Tamil for sacred/canonical headings/readers and Noto Sans Tamil for UI;
- define font-display behavior to avoid invisible text;
- measure Tamil font payload;
- avoid loading multiple unnecessary weights.

### Motion

Use motion to preserve spatial context, not for spectacle.

The View Transition API can now be used as progressive enhancement in modern browsers, but must gracefully fall back and respect `prefers-reduced-motion`.

Recommended motion vocabulary:

- 120–180ms micro-feedback;
- 220–320ms route/state transition;
- 500–800ms one-time hero/Vel reveal only where it does not delay LCP;
- no scroll-jacking;
- no continuous background particles;
- no parallax that makes Tamil reading unstable;
- never animate canonical text itself in a distracting way.

### Color and contrast

Independent token review found the main current text palette strong:

- normal primary/muted text has comfortable contrast on the sanctum ground;
- `ink-faint` is close to the AA threshold on raised backgrounds and must be monitored when used below large-text sizes;
- copper is appropriate as decorative/accent color but should not become small essential text because its contrast is too low for that role.

### Focus and touch

Keep the current visible 2px gold focus outline and test against WCAG 2.2 focus visibility expectations.

Primary interactive controls should aim for approximately 44×44 CSS px even though WCAG 2.2 AA minimum target-size criterion is smaller, because the larger target improves mobile accessibility.

Sticky headers/mobile overlays must never obscure keyboard focus.

## P1 — performance architecture

Maintain these field-quality targets:

- LCP <= 2.5s at p75;
- INP <= 200ms at p75;
- CLS <= 0.1 at p75.

Lab budgets should be treated as regression gates, not substitutes for field data.

Additional guidance:

- preserve the current lightweight SVG hero rather than introducing a blocking hero video;
- do not preload the 376-temple corpus on home;
- lazy-load audio and documentary/illustrative media;
- use responsive images with intrinsic dimensions;
- avoid runtime animation libraries unless native CSS/Web APIs cannot meet the requirement;
- measure before adding `content-visibility`, virtualization or prefetching;
- prefetch only likely next routes on capable connections, not the entire corpus.

## P2 — premium differentiators after R2 baseline is green

These are desirable only after correctness/performance gates pass:

- optional source graph showing Work -> Verse/Record -> Temple relationships;
- pilgrimage planning based only on verified geography;
- saved/recent local library;
- source-comparison view for textual variants;
- elegant offline-library management;
- pronunciation/read-aloud aids clearly distinguished from canonical audio;
- accessible print/reading mode;
- source contribution/correction workflow;
- responsive temple illustration system with explicit `devotional illustration` labelling where needed.

## Routes/features still missing from the final product vision

R1 currently lacks or only partially implements:

- real bilingual UI switch;
- Murugan knowledge/forms route;
- audio library/player architecture;
- saved/recent library;
- complete Thiruppugazh reader layers;
- complete temple visitor intelligence;
- verified map/pilgrimage tooling;
- useful correction/contact submission channel;
- qualified PWA icons/installability;
- multilingual/RTL qualification;
- production performance evidence.

None of these gaps justifies copying the old application shell.

## Flagship release principle

A page is not flagship-quality merely because it is visually dramatic. It must simultaneously be:

1. truthful;
2. useful;
3. unmistakably OmSaravanaBhava/Murugan;
4. fast;
5. excellent on mobile;
6. accessible;
7. source-transparent;
8. maintainable;
9. resilient/offline-safe where promised;
10. protected against old-site reversion.

R2 should first make the engineering evidence green. Visual-excellence work can then progress route-by-route without weakening these controls.
