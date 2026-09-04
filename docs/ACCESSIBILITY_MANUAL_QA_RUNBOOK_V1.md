# OmSaravanaBhava Hi-Tech — Manual Accessibility QA Runbook V1

## Purpose

Automated axe/Lighthouse checks are necessary but insufficient. This runbook defines human interaction checks required for a premium Tamil-first devotional experience.

## 1. P0 routes

Manually review at minimum:

- Home
- primary/mobile navigation
- Arupadai Veedu
- Temple Directory
- incomplete Temple Detail
- Thiruppugazh index/detail shell
- Search/results/zero-result
- Prayers/Works
- Daily Practice
- Sources/Completeness
- Contact/Corrections
- Privacy/Accessibility

## 2. Keyboard-only pass

From a fresh page load:

- Tab reaches skip link first where expected;
- skip link transfers focus to main content;
- focus order follows visual/reading order;
- all links/buttons/inputs are reachable;
- no keyboard trap;
- drawers/dialogs trap focus only while open and restore focus after close;
- Escape closes dismissible overlays where appropriate;
- current navigation state remains understandable;
- focused element is never hidden under sticky chrome.

## 3. Visible focus

Verify focus is unmistakable on:

- dark sanctum background;
- parchment surface;
- gold/copper accents;
- buttons/links inside raised panels;
- mobile navigation;
- form controls.

Colour alone cannot be the only state indicator.

## 4. Zoom/reflow

At 200% browser zoom:

- no horizontal scrolling for ordinary reading content except intentionally scrollable regions;
- controls remain usable;
- Tamil titles wrap without clipping;
- source badges do not cover text;
- sticky elements do not consume most of the viewport;
- reader width remains comfortable.

Also test increased OS/browser text size where practical.

## 5. Screen-reader semantics

Verify with at least one current screen-reader/browser combination before production.

Check:

- page title announces correctly;
- document language is Tamil/English as selected;
- landmarks are meaningful;
- heading hierarchy is navigable;
- links have meaningful accessible names;
- external official temple links are understandable;
- state badges announce human-readable dimension + state;
- decorative Vel/ornamental SVG does not create noise;
- canonical text is not split into unusable fragments;
- live regions announce search/result changes without chatter.

## 6. Tamil pronunciation/language

The interface must set correct `lang` boundaries for Tamil and English segments.

Do not force transliteration into the canonical text node.

Mixed-script source/English metadata should be marked appropriately where it improves pronunciation.

## 7. Touch/mobile

At 320px and 390px:

- primary controls have comfortable touch area;
- no interaction depends on hover;
- mobile menu open/close is easy one-handed;
- long Tamil labels do not create tiny targets;
- audio/practice controls do not cluster too tightly;
- fixed bottom/top UI does not hide content/focus.

## 8. Reduced motion

With `prefers-reduced-motion: reduce`:

- no essential information disappears;
- route navigation remains understandable;
- hero/Vel reveal is reduced/removed;
- no continuous ambient movement;
- focus movement is not animated in a disorienting way;
- canonical text remains static.

## 9. Contrast review

Review actual rendered states, not only token values.

Pay special attention to:

- faint metadata;
- copper small text;
- disabled controls;
- link states;
- focus rings;
- text over gradients/images;
- badge borders/text.

Decorative colours can fail text contrast if they do not carry essential meaning; essential text cannot.

## 10. Forms/corrections

If a correction form exists:

- every input has a visible label;
- required/optional status is clear;
- error text is linked to the field;
- errors are announced;
- focus moves intelligently after submit failure;
- success state is announced;
- anti-spam widget does not block keyboard/screen-reader use.

## 11. Audio/read-aloud

Controls require:

- play/pause accessible name/state;
- progress understandable without relying on drag only;
- volume/mute accessible;
- no autoplay sound;
- recorded audio clearly distinguished from device read-aloud;
- keyboard operation.

## 12. Evidence

For each manual pass record:

- Git SHA;
- environment/URL;
- viewport/browser;
- assistive technology where used;
- route;
- PASS/FAIL;
- defect reference;
- reviewer/date.

## Release gate

`MANUAL_ACCESSIBILITY_GATE` passes only when P0 journeys have evidence beyond automated scanners and public accessibility claims match the exact candidate evidence.