# OmSaravanaBhava Flagship Journey Blueprint V1

**Purpose:** define the premium information architecture and interaction story for R2+ without forcing a specific component implementation.  
**Status:** design/product acceptance input; production remains `NO-GO`.  
**Source authority:** clean-room React/Vite application. R6 remains governed data/provenance evidence only.

## 1. Product principle

The site should not feel like a collection of pages. It should feel like a **coherent Murugan knowledge universe** where every journey leads naturally to scripture, temple, source, practice or related knowledge.

The user should repeatedly experience three things:

- **devotional presence** — unmistakable Murugan/Sacred-Tech identity;
- **learning depth** — source-aware knowledge is always one step deeper;
- **trust** — the interface clearly distinguishes what is canonical, sourced, partial, traditional, generated, rights-limited or pending.

## 2. Global navigation model

Primary information architecture should converge on a small set of durable destinations rather than exposing dozens of routes in the header.

Recommended top-level model:

- Home
- Murugan
- Songs & Sacred Works
- Thiruppugazh
- Temples
- Practice
- Search
- Sources / Trust

Audio may become a top-level destination once governed audio exists; until then it can live within works/readers with a truthful empty architecture.

Mobile navigation should prioritise the same concepts and not expose a separate competing IA.

## 3. Flagship Home — narrative, not dashboard

### HOME-01 Sacred opening

Goal: within seconds, establish identity and one meaningful next action.

Composition:

- Tamil-first OmSaravanaBhava/Murugan title;
- restrained English support line;
- original Vel axis / sacred light geometry;
- one primary CTA, e.g. enter the Murugan knowledge experience or explore Arupadai Veedu;
- one secondary path to Search/Find;
- no autoplay sound;
- no full-screen blocking loader;
- hero geometry remains lightweight and must not delay LCP.

Avoid a metric dashboard above the fold.

### HOME-02 Six abodes as spatial pilgrimage

Do not show six interchangeable cards.

Use a connected 01–06 progression with:

- temple Tamil name;
- English/locality support where governed;
- source state;
- direct deep link;
- original abstract visual cue per stop;
- reduced-motion equivalent.

No map or travel-distance claims until coordinates are verified.

### HOME-03 Sacred works constellation

Instead of a grid of generic cards, create a small set of distinct portals:

- Thiruppugazh
- Kandar/Kanda devotional works where publishable
- Mantras / Prayers
- Murugan Names / Knowledge

Each portal states real availability, e.g. `12 source-linked Thiruppugazh records · canonical body import pending` rather than implying completion.

### HOME-04 Temple intelligence

Show the real scale while preserving truth:

- `376 governed/source-tracked temple identities`
- `6 Arupadai Veedu`
- separate completeness indicator for records with verified visitor/detail data

Offer discovery, not inflated completeness.

### HOME-05 Daily devotion

A calm local-first practice surface:

- daily governed Murugan name or source-linked focus when available;
- repetition counter optional/local;
- continue recent reading;
- saved items where implemented;
- no streak pressure, rankings or guilt language.

Daily rotation must use the user's local calendar date.

### HOME-06 Trust ending

Close the home narrative with confidence, not legal clutter:

- how sources are verified;
- what `pending` means;
- corrections route;
- completeness status;
- privacy/local-first note.

## 4. Murugan Knowledge journey

Purpose: structured discovery of Murugan names, forms, epithets, works, associated temples and source relationships.

Start small with governed records. Do not generate a large encyclopedia from memory.

Recommended structure:

- canonical/governed name;
- Tamil spelling;
- transliteration;
- simple meaning only when source-supported/editorially governed;
- source/work reference;
- related temple/work links;
- verification state;
- variants handled explicitly.

Future graph relationships may support:

`Name -> Work -> Verse/Record -> Temple -> Practice`

but no knowledge graph should manufacture missing historical relationships.

## 5. Arupadai Veedu flagship journey

This should be one of the strongest visual experiences in the site.

### Desktop

Use a vertical/curved pilgrimage composition with six distinct stops. Scrolling should reveal context naturally without scroll-jacking.

Each stop:

- ordinal 01–06;
- Tamil temple name;
- governed official identity;
- concise source-backed summary when available;
- current source/completeness state;
- link to temple detail;
- official source link where verified.

### Mobile

The same journey becomes a clear connected vertical sequence. Do not reduce it to an oversized carousel requiring precise swipes.

### Future map

Only after verified coordinates:

- map is an optional tool, not the primary identity;
- show source/freshness for geographic data;
- no routing/travel-time promises without current provider data;
- avoid implying the platform is an official travel authority.

## 6. Temple Directory — 376-record explorer

### Discovery model

Search + governed facets, only where data supports them:

- Tamil/English name search;
- Arupadai Veedu filter;
- region/district/state when verified;
- completeness/source-state filter;
- alphabetical browse;
- URL-persisted query/filter state.

### Result presentation

Prefer compact ledger rows with meaningful hierarchy over giant repeated cards.

Each result may show:

- Tamil name;
- supporting English/locality;
- type/Arupadai status;
- source/completeness badge;
- one useful verified field;
- direct destination.

### Performance

Do not load the full temple dataset on home. On the directory route, measure actual scrolling/interaction before adding virtualization. Optimisation must not harm browser find, accessibility or deep-link behavior.

## 7. Temple Detail — truthful incompleteness

The page must remain useful even when only identity/source is known.

Recommended hierarchy:

1. identity / Tamil name;
2. Arupadai/special classification if governed;
3. source state;
4. verified facts;
5. visitor/location information when verified and fresh;
6. traditional/devotional context separately labelled;
7. sources;
8. `What is still pending` completeness panel;
9. official external channel where verified.

Do not render ten empty sections. Collapse missing fields into one dignified completeness statement.

Direct support/donation links, if later included, must go only to verified official/legal channels. OmSaravanaBhava must not receive or intermediate temple donations.

## 8. Thiruppugazh journey

### Index

Until canonical verse bodies are imported, each record must clearly say its text state. The index cannot imply `12 complete songs` merely because 12 identities exist.

Useful filters may later include source-supported author/work attributes, not invented categories.

### Reader shell

Build the premium reader before corpus expansion so future content has a stable home.

Layer model:

- Canonical Tamil
- Easy-reading Tamil
- Transliteration
- Meaning
- Source / edition
- Audio / read-aloud state

Only one layer should visually dominate at a time. Canonical Tamil is primary.

Reader controls:

- text size;
- reading width;
- line spacing;
- layer toggles;
- source drawer;
- save/recent if implemented;
- device read-aloud separately labelled;
- print/share only if rights permit.

No decorative animation on verse lines.

## 9. Songs & Sacred Works

Collection flow:

`Collection -> Work -> Record/Song -> Reading layers`

Every work should expose:

- source identity;
- author attribution where known;
- canonical/publication-rights state;
- available text/audio layers;
- related Murugan names/temples where governed.

For rights-limited modern works, metadata-only pages are intentional, not broken.

## 10. Mantras / Prayers / Namavali

Never create a publishable Namavali collection because an individual name registry exists.

When a governed set becomes available:

- retain exact ordering where source requires it;
- canonical text first;
- transliteration/meaning separate;
- source visible;
- practice controls local/private;
- no guaranteed-benefit language;
- no medical/financial/legal remedy claims.

## 11. Search — source-aware discovery

Search should be one of the product's strongest tools.

### Query handling

- Tamil first;
- English aliases/transliteration where governed;
- normalization for matching must never mutate stored/displayed canonical text;
- type filters;
- result state/completeness visible.

### Result ranking

Prefer real governed relevance:

1. exact title/name match;
2. canonical/source-linked field match;
3. governed alias/transliteration;
4. related metadata.

Do not place AI-generated prose above source results.

### Zero results

Offer:

- spelling/alternate search suggestions derived from real indexed aliases;
- browse links;
- correction/source contribution route where appropriate.

Never invent a devotional answer because search returned zero records.

## 12. Daily practice

The product should support devotion without becoming an engagement game.

Appropriate:

- local repetition counter;
- locally saved items;
- recent reading;
- optional reminder controlled by user;
- daily governed name/line;
- calm progress feedback.

Avoid:

- streak loss pressure;
- leaderboards;
- comparison with other devotees;
- manipulative push frequency;
- claims that a count guarantees an outcome.

## 13. Audio architecture

Before recorded audio exists, build a truthful framework.

State model:

- `RECORDED_OWNED_OR_LICENSED`
- `DEVICE_READ_ALOUD`
- `AUDIO_PENDING`
- `AUDIO_RESTRICTED`

Recorded audio player:

- keyboard accessible;
- no autoplay with sound;
- lazy media load;
- clear rights/source attribution;
- stable controls during route changes if persistent playback is intentionally supported.

Device read-aloud must never be presented as a devotional recording.

## 14. Saved / recent local library

Prefer browser-local ownership before account infrastructure.

Possible features:

- saved temple/work/verse IDs;
- recent reading positions;
- reader preferences;
- practice settings.

Requirements:

- clear privacy explanation;
- export/clear behavior when practical;
- no account requirement for basic use;
- graceful storage-unavailable behavior.

## 15. Sources / Completeness / Corrections

This trust layer is a differentiator, but it must be understandable.

Provide two levels:

### Devotee-friendly view

- `Verified source linked`
- `Source linked, review pending`
- `Text not yet imported`
- `Visitor details not yet verified`
- `Audio not published`

### Technical detail

Offer source ledger, IDs, verification dates, edition notes and rights state in a deeper drawer/page.

Corrections must have a real destination before the route promises submission.

## 16. Tamil / English locale architecture

Tamil remains default.

Before `English supported` is advertised:

- all core navigation translated;
- critical routes functionally equivalent;
- route metadata localized appropriately;
- locale persists locally;
- language switch accessible by keyboard/screen reader;
- Tamil canonical content remains Tamil and is not machine-replaced;
- document `lang` updates correctly.

Future Hindi/Telugu/Malayalam/Arabic remain candidate languages only. Arabic requires end-to-end RTL qualification.

## 17. Preview journey

The first Cloudflare preview must be a controlled release environment, not a public launch.

Requirements:

- new Worker identity: `omsaravanabhava-hitech-preview`;
- deploy explicit `dist` only;
- SPA fallback configured;
- preview noindex/nofollow;
- `/release.json` identifies new repo + exact GitHub SHA;
- fresh/private browser shows clean React site immediately;
- direct deep refresh works;
- old service-worker/cache does not appear;
- preview is reviewed at 320/390/768/1440/1920 plus keyboard/reduced-motion.

## 18. Production cutover journey

Only after owner approval.

Before switching `omsaravanabhava.org`:

- exact candidate SHA frozen;
- CI/browser/accessibility/performance/content-rights gates green;
- production sitemap/canonical generated from publication policy;
- new production Cloudflare identity ready;
- rollback target documented;
- service-worker migration tested;
- release marker verified.

After cutover validate:

- normal browser;
- private browser;
- mobile browser;
- service worker unregistered/cache cleared;
- critical deep routes;
- exact release SHA;
- no legacy static shell.

## 19. Experience acceptance rule

A journey is complete only when a user can finish its intended task without:

- a dead CTA;
- a fabricated content field;
- a hidden verification limitation;
- an inaccessible control;
- a mobile layout defect;
- an unnecessary performance penalty;
- a legacy application dependency.

Visual drama alone never satisfies this gate.
