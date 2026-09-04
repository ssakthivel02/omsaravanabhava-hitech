# OmSaravanaBhava Hi-Tech — Component Architecture & Visual Regression Contract V1

## Purpose

Keep the flagship visually coherent as the codebase grows. A premium design can degrade quickly when each route invents its own spacing, cards, badges, mobile behaviour and animation. This contract makes visual quality reusable and testable.

## 1. Component hierarchy

Prefer four layers:

1. **Primitives** — Button, Link, Field, Dialog, Drawer, Tabs, Tooltip, SkipLink, VisuallyHidden.
2. **Sacred-Tech surfaces** — SanctumSurface, ParchmentReader, VelDivider, SourceState, CompletenessPanel, PilgrimageStep.
3. **Domain components** — TempleIdentity, TempleSourcePanel, WorkReaderLayers, SearchResult, AudioState, PracticeCounter.
4. **Route compositions** — Home, Arupadai Veedu, Temple Detail, Thiruppugazh Reader, Search, Sources.

Route files should compose existing primitives/surfaces rather than redefine interaction behaviour.

## 2. No generic-card sprawl

Do not create a universal `Card` and use it for every content type.

The design system should intentionally distinguish:

- sacred reading surface;
- directory/list row;
- pilgrimage step;
- trust/source panel;
- interactive action surface;
- editorial story block;
- empty/pending state.

A page containing many identical bordered rectangles is a visual-regression smell.

## 3. State rendering

Verification, rights, completeness, image and dynamic-freshness states must use shared domain components and the independent state model in `release/CONTENT_STATE_MODEL_V1.json`.

Rules:

- colour alone never communicates state;
- badge labels identify the state dimension when ambiguity is possible;
- internal enum keys are not primary devotee-facing copy;
- one pending field never turns the entire record into a generic pending badge.

## 4. Layout tokens

Components should consume central tokens for:

- spacing rhythm;
- content measure;
- radius;
- border/line opacity;
- surface elevation;
- typography roles;
- focus ring;
- motion durations;
- breakpoints.

Avoid route-local magic numbers unless they solve a documented composition need.

## 5. Component accessibility contract

Every interactive shared component must define:

- keyboard interaction;
- focus entry/exit behaviour;
- accessible name;
- disabled state semantics;
- error/validation announcement where relevant;
- touch target behaviour;
- reduced-motion behaviour;
- mobile/zoom behaviour.

Dialogs/drawers must restore focus to the opener after close.

## 6. Tamil stress testing

Shared UI must be tested with:

- long Tamil temple names;
- mixed Tamil/English labels;
- 200% zoom;
- 320px width;
- increased text size;
- multi-line button/link labels where unavoidable.

Do not truncate canonical titles merely to preserve a one-line card design.

## 7. Visual regression matrix

After R2 enters GitHub CI, add screenshot regression for representative states at minimum:

### 320px
- Home
- mobile navigation open
- Arupadai Veedu
- Temple Directory
- incomplete Temple Detail
- Thiruppugazh pending reader
- Search results
- Search zero result

### 390px
Same critical journeys plus Daily Practice and Sources.

### 768px
- Home tablet composition
- Temple Directory filters/results
- Reader layers

### 1440px
- Home flagship composition
- Arupadai Veedu pilgrimage journey
- Temple Directory
- Temple Detail
- Reader
- Search

### 1920px
- Home and reader large-desktop measure check.

## 8. Screenshot policy

Visual snapshots must not become an approval shortcut.

A snapshot change is accepted only after reviewing:

- why it changed;
- whether Tamil wrapping remains intentional;
- whether focus/keyboard behaviour remains correct;
- whether content truth changed;
- whether reduced motion is affected;
- whether mobile composition regressed.

Do not bulk-approve screenshots after a design-system change without route review.

## 9. Dynamic-content stabilization

Visual tests should avoid nondeterminism:

- freeze dates where a Daily route depends on local calendar day;
- use deterministic content fixtures;
- disable network-dependent external imagery;
- control animation timing;
- wait for fonts intentionally;
- never hide real rendering failures by arbitrary sleeps.

## 10. Design review score

For each flagship route score 0–2 on:

- Murugan/Sacred-Tech identity;
- information hierarchy;
- Tamil readability;
- mobile composition;
- accessibility/focus;
- source/truth clarity;
- performance discipline;
- originality/non-template feel.

A P0 flagship route should not pass visual acceptance with any category at 0.

## Release gate

`COMPONENT_VISUAL_REGRESSION_GATE` passes only when shared components meet keyboard/Tamil/mobile contracts and required P0 screenshot journeys show no unexplained regression on the exact candidate SHA.

Production remains NO-GO until exact-candidate evidence exists.