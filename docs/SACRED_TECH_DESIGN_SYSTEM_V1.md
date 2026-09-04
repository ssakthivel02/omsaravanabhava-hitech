# OmSaravanaBhava Sacred-Tech Design System V1

**Status:** design/acceptance authority for R2+; does not authorize production.  
**Scope:** visual language, typography, motion, layout, interaction, imagery and reading experience for the clean-room React/Vite application.  
**Precedence:** `CURRENT_PROJECT_AUTHORITY.md` remains the project authority. This file refines the design standard without changing source/content governance.

## 1. Design thesis

OmSaravanaBhava should feel like entering a **living Murugan knowledge sanctuary**: sacred, calm, luminous, exacting and technically modern. The site must never resemble a renamed SaaS template, a generic dashboard, a gaming UI or a copied commercial product.

The design is built from five ideas:

1. **Vel axis** — clarity, direction, vertical rhythm, focused action.
2. **Sanctum depth** — dark devotional ground, controlled light, calm spatial hierarchy.
3. **Lamp gold / copper** — warmth and sacred emphasis, never used as low-contrast body text.
4. **Tamil reading authority** — canonical Tamil receives the most stable and generous reading surface in the product.
5. **Six-abode rhythm** — repeated six-point/ordinal structures may support Arupadai Veedu narratives without turning the entire UI into a literal motif.

Manus R6 visual quality is the minimum floor. The clean application must match or exceed its craft while remaining original, accessible, lightweight and maintainable.

## 2. Experience hierarchy

Every flagship page should satisfy this order:

1. **Identity** — user immediately knows this is OmSaravanaBhava / Murugan.
2. **Purpose** — user immediately understands what they can learn/read/do.
3. **Primary action** — one clear next step.
4. **Source/truth state** — verification/completeness is visible without dominating sacred identity.
5. **Depth** — related works, temples, sources and practice paths reveal progressively.

Do not open a page with governance metadata before devotional identity unless the route is specifically a Sources/Completeness page.

## 3. Color system

The clean-room palette should remain restrained. Suggested semantic tokens:

- `sanctum-1000`: `#0c0907` — deepest background
- `sanctum-950`: `#14100d` — primary ground / accepted R1 basis
- `sanctum-900`: `#1b1511` — raised ground
- `sanctum-800`: `#261d17` — selected/interactive dark surface
- `parchment-50`: `#fff9ed` — canonical reading surface
- `parchment-100`: `#f7edd7` — secondary reading surface
- `ink-950`: `#201812` — parchment text
- `lamp-gold-500`: `#d9a441` — primary sacred accent/focus
- `lamp-gold-300`: `#f0cd88` — luminous accent
- `copper-600`: `#a85a2e` — decorative/structural accent, not small essential text
- `vel-steel-400`: `#9fb6c4` — single cool technical accent
- `vel-steel-200`: `#cfe0ea` — luminous cool linework
- `success`: use a restrained green only for status semantics, not devotional decoration
- `warning`: use amber/orange only for content-state semantics
- `danger`: reserve for destructive/error states

Rules:

- never use color alone to communicate verification or completeness;
- copper is decorative/structural unless measured contrast supports the text role;
- faint secondary text must still pass contrast for its rendered size;
- dark gradients may add depth but may not reduce text contrast or create visual noise;
- no rainbow gradient system and no neon multi-color glow.

## 4. Typography

### Tamil

Tamil is the primary devotional language.

Preferred role separation:

- **Canonical / sacred reading:** a high-quality Tamil serif such as Noto Serif Tamil when legally and technically suitable.
- **Interface / navigation / filters:** a highly readable Tamil sans such as Noto Sans Tamil when legally and technically suitable.

Do not assume a font exists merely because CSS names it. Before production, either self-host rights-safe WOFF2 files or use a controlled web-font strategy and measure font payload/FOIT/FOUT behavior.

### English

English should be secondary and visually quieter where it is supporting Tamil, but must remain fully legible and functionally complete in English locale mode.

### Type scale

Use fluid `clamp()` scales with hard min/max bounds rather than device-specific typography.

Recommended role targets (implementation may tune after browser QA):

- display/hero Tamil: ~40–72 CSS px desktop, ~34–48 mobile
- page H1 Tamil: ~34–52 desktop, ~30–40 mobile
- H2: ~26–38
- H3: ~21–28
- UI/body: 16–18 minimum target
- canonical reader: user-adjustable, default around 20–24 depending on font
- metadata/source detail: 14–16; never shrink governance text below comfortable reading simply to fit cards

Canonical Tamil should generally use a narrower reading measure than ordinary interface copy.

## 5. Spacing and composition

Use an 8px-based rhythm with 4px exceptions for micro-alignment.

Suggested semantic spacing:

- `space-1`: 4
- `space-2`: 8
- `space-3`: 12
- `space-4`: 16
- `space-5`: 24
- `space-6`: 32
- `space-7`: 48
- `space-8`: 64
- `space-9`: 96
- `space-10`: 128

Do not make every section the same height/padding. Flagship pages need deliberate rhythm: compressed utility regions, generous sacred reading regions and occasional cinematic open space.

Desktop content should not expand indefinitely on 1920+ screens. Use intentional max widths and asymmetric composition where it improves hierarchy.

## 6. Surface language

Avoid an endless-card system.

Use multiple intentional surface types:

- **Sanctum field** — background/hero/immersive narrative.
- **Parchment reader** — canonical text and focused study.
- **Ledger row** — dense directory/search results.
- **Source drawer** — provenance/verification detail.
- **Pilgrimage stop** — Arupadai ordinal experience.
- **Practice vessel** — local counter/saved state.
- **Trust panel** — completeness/methodology.

Cards are acceptable when semantically correct, but a whole page should not look like one repeated component with different labels.

## 7. Vel geometry

The Vel is a brand/structural motif, not decoration pasted everywhere.

Appropriate uses:

- home hero axis;
- active navigation indicator;
- section divider geometry;
- pilgrimage progression;
- loading/release mark in subtle form;
- icon/favicon/PWA mark after visual qualification.

Avoid:

- placing a large Vel behind every page;
- animating the Vel continuously;
- using sacred symbolism as a generic spinner when a normal progress indicator is clearer;
- implying an official religious emblem where none is intended.

## 8. Motion vocabulary

Motion exists to preserve context and communicate hierarchy.

Project motion targets:

- micro feedback: 120–180ms
- disclosure/state change: 180–260ms
- route/spatial transition: 220–320ms
- one-time flagship/Vel reveal: 500–800ms maximum when it does not delay meaningful content

Principles:

- no scroll-jacking;
- no continuous particle background;
- no autoplay video hero by default;
- no animated canonical Tamil text;
- no motion that shifts reading baselines;
- route transitions are progressive enhancement only;
- View Transition API may be used where supported, with ordinary navigation fallback;
- `prefers-reduced-motion: reduce` removes non-essential transforms/reveals and retains all information/function.

## 9. Interaction system

### Targets

WCAG 2.2 AA minimum target-size criterion is 24×24 CSS px with defined exceptions; OmSaravanaBhava should normally exceed this and target about **44×44 CSS px** for primary mobile controls.

### Focus

- focus must always be visible for keyboard users;
- sticky headers/dialogs must not hide focused elements;
- focus style should be visually distinct from hover/selected state;
- skip-to-main must move keyboard focus, not only visual scroll position.

### Feedback

Every interactive control must have meaningful states:

- rest
- hover (where applicable)
- focus-visible
- active/pressed
- disabled where necessary
- loading only when an async action exists
- success/error only when real state changes occur

No decorative button may look actionable without doing something.

## 10. Responsive model

Design for content, not named devices.

Required qualification widths remain:

- 320px small mobile
- 390px typical mobile
- 768px tablet
- 1440px desktop
- 1920px large desktop review
- landscape-phone smoke
- 200% zoom/reflow

Breakpoints should arise from layout pressure, not from copying a framework's default breakpoints blindly.

On mobile:

- Tamil headings may wrap intentionally;
- controls should be one-handed where practical;
- filters should use progressive disclosure;
- directory results should be compact ledger rows rather than giant cards;
- bottom/fixed controls must account for safe areas and not obscure content/focus.

## 11. Canonical reading system

Canonical reading surfaces are a flagship differentiator.

Required structure:

- canonical Tamil is the default primary layer;
- easy-reading Tamil is separate;
- transliteration is separate;
- meaning is separate;
- commentary/generated reflection is separate and labelled;
- source/edition can open without losing reading position;
- user can adjust text size/reading width/line spacing within safe bounds;
- reader settings are browser-local by default;
- print/share only when publication rights permit;
- audio/read-aloud controls never obscure text.

The reader should feel calmer than the surrounding application and should not inherit excessive hero motion, glows or decorative textures.

## 12. Temple visual system

Temple UX must distinguish:

- official/dynamic information;
- documentary facts;
- traditional/devotional narrative;
- generated/illustrative media;
- pending/unverified fields.

When documentary photography is unavailable, original abstract architectural/Vel/landscape illustration is preferable to a random stock temple photo. Any image that could be mistaken for a real temple photograph must be labelled appropriately.

Arupadai Veedu should use 01–06 ordinal progression with strong individual identity while remaining one coherent pilgrimage story.

## 13. Search visual system

Search is a trust surface, not an AI-answer theatre.

Result hierarchy:

1. title / Tamil identity
2. content type
3. governed/source state
4. truthful snippet from an existing governed field
5. source/completeness cue
6. direct destination

Zero results must never fabricate a devotional answer.

Generated reflection, if ever added, must appear below/after governed source results and be clearly separated.

## 14. Audio visual system

Three states must never be conflated:

- owned/licensed recorded devotional audio;
- browser/device text-to-speech/read-aloud;
- no audio available.

No autoplay with sound. Audio UI must be fully keyboard-accessible and loading must be lazy.

## 15. Performance is part of visual quality

A page that looks premium but loads slowly is not flagship-quality.

Protect:

- lightweight SVG/geometry hero;
- no initial 376-temple corpus on home;
- responsive image dimensions to prevent CLS;
- lazy loading below the fold;
- route/code splitting;
- limited Tamil font weights;
- no heavy motion library unless it earns its cost;
- no video/3D dependency merely for visual novelty.

Current Core Web Vitals good thresholds remain LCP <=2.5s, INP <=200ms and CLS <=0.1 at p75. Lab performance is a regression signal, not a substitute for field data.

## 16. Accessibility quality floor

At minimum:

- WCAG 2.2 AA-oriented implementation;
- semantic HTML before ARIA;
- one logical page H1;
- landmarks and named controls;
- usable 200% zoom/reflow;
- clear focus;
- keyboard-only core journeys;
- reduced-motion parity;
- proper document language;
- full RTL qualification before Arabic is claimed;
- informative imagery has meaningful alt text;
- decorative imagery is ignored by assistive technology.

## 17. What 'better than Manus' means

It does **not** mean more gradients, more animation or more visual noise.

It means:

- stronger information architecture;
- more original Murugan-specific identity;
- better Tamil typography;
- cleaner state/truth communication;
- better mobile behavior;
- faster interaction;
- better accessibility;
- richer source-aware discovery;
- more coherent motion;
- fewer dead ends;
- stronger engineering evidence.

## 18. Current standards references

Implementation should periodically recheck current official guidance before release. Current reference lanes include:

- Core Web Vitals: https://web.dev/articles/vitals
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- View Transition API progressive enhancement: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- Responsive images: https://web.dev/learn/design/responsive-images
- Cloudflare SPA Static Assets: https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/

## 19. Release gate

No route is visually complete merely because it matches a mockup.

A flagship route passes only when it is simultaneously:

- truthful;
- functional;
- original;
- Tamil-first;
- responsive;
- keyboard accessible;
- reduced-motion safe;
- fast enough for project budgets;
- source-transparent;
- free of legacy application contamination.

Production remains `NO-GO` until evidence proves these conditions on the exact release candidate.
