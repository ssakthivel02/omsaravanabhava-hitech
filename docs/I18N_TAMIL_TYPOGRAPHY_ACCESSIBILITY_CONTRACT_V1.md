# OmSaravanaBhava Hi-Tech — Tamil-First i18n, Typography & Accessibility Contract V1

## Purpose

Tamil is not a translated skin over an English product. Tamil is the primary devotional reading and navigation experience. Internationalisation must preserve devotional source integrity, excellent readability and full accessibility.

## 1. Locale authority

Initial supported UI claim:

- Tamil: primary
- English: secondary only after route-level parity passes

Do not claim Hindi, Telugu, Malayalam, Arabic or any other language until real route/content/metadata QA exists.

Arabic requires true RTL layout qualification.

## 2. Separate canonical content from interface localization

UI translation and canonical devotional text are different systems.

Never run canonical Tamil scripture/song/mantra text through generic UI translation resources.

Keep independent layers:

- canonical Tamil;
- easy-reading Tamil;
- transliteration;
- English meaning;
- other-language meaning/commentary;
- UI labels/navigation.

A locale switch may change UI and selected explanatory layers, but must never silently replace canonical text.

## 3. Locale persistence

Preferred behaviour:

- Tamil default unless an explicit product decision says otherwise;
- user-selected locale persists locally;
- no account required;
- document `<html lang>` updates correctly;
- page title/description update per locale;
- screen-reader language changes remain accurate.

Do not derive language from religion, ethnicity or other inferred personal attributes.

## 4. Tamil typography

Target roles:

- sacred/canonical reading: a high-quality Tamil serif where legally and technically suitable;
- interface/navigation: high-quality Tamil sans;
- English: compatible companion families with similar visual rhythm.

Before production:

- verify font licence/redistribution;
- self-host where practical;
- subset only when glyph coverage remains safe;
- avoid unnecessary weights;
- set `font-display` to avoid invisible text;
- measure Tamil WOFF2 transfer cost;
- provide resilient system fallbacks;
- test old Android/Windows/macOS/iOS/browser rendering.

## 5. Canonical reading surface

Reading width should remain comfortable rather than filling wide monitors.

Provide, when implemented:

- generous line-height;
- stable verse/line breaks;
- adjustable text size within accessible bounds;
- no horizontal scroll at 320px;
- excellent 200% browser zoom;
- clear source/edition access;
- layer switching that does not lose reading position;
- print mode only when publication rights allow.

Never animate canonical lines in a way that harms reading or copying.

## 6. Mixed-script handling

Test combinations such as:

- Tamil title + English source name;
- Tamil temple name + Latin administrative ID;
- Tamil text + transliteration;
- English UI + canonical Tamil body;
- numerals/ordinal labels within Tamil flows.

Avoid visual misalignment caused by mismatched baselines/font metrics.

## 7. Translation governance

For UI translations store:

- stable message key;
- locale;
- translated value;
- review state;
- reviewer/source where needed.

Do not expose internal missing-key strings to users.

Fallback rules must be explicit. A missing English string may fall back to Tamil if that is the documented policy, but mixed accidental half-translation must fail QA on claimed supported routes.

## 8. Accessibility baseline

Critical requirements:

- landmarks and heading hierarchy;
- first meaningful skip-to-main link;
- keyboard-operable navigation/menu/search/player/dialogs;
- visible focus;
- no focus obscured by sticky headers;
- meaningful link names in Tamil and English;
- correct `aria-current`;
- associated labels/instructions/errors;
- 200% zoom/reflow;
- reduced motion;
- adequate target size;
- sufficient contrast;
- no information conveyed by color alone;
- accessible state labels for verification/completeness.

Automated axe testing supports but does not replace manual keyboard/screen-reader review.

## 9. Screen-reader semantics for source state

Do not expose opaque keys such as:

`SOURCE_LINKED_PENDING_REVIEW`

directly as the only accessible label.

Map machine states to concise human text, for example:

- `Source verified`
- `Source linked — review pending`
- `Canonical text not yet published`
- `Visitor information pending verification`

If multiple dimensions exist, announce them independently rather than collapsing them into one ambiguous badge.

## 10. Mobile Tamil QA

Required viewports:

- 320px
- 390px
- landscape phone
- 768px tablet

Check:

- long Tamil temple/work names wrap intentionally;
- no clipping inside badges/buttons;
- primary controls remain at comfortable touch size;
- navigation does not cover content/focus;
- canonical lines do not overflow;
- language switch remains understandable;
- search input works with Tamil keyboards/IME.

## 11. RTL future gate

If Arabic is added later:

- set document direction per locale;
- mirror layout where semantically appropriate;
- do not mirror sacred symbols/icons indiscriminately;
- test mixed Tamil/Arabic/Latin content;
- test menus, breadcrumbs, player controls, forms, dialogs and focus order;
- only then advertise Arabic support.

## 12. Accessibility claim policy

Do not publish statements like `fully WCAG compliant` based solely on static code or automated scans.

Prefer truthful wording describing the implemented standard, testing methods, known limitations and correction/contact channel.

A production accessibility statement should match exact-release evidence.

## 13. Release gates

Before claiming Tamil + English support:

- all core routes available in both UI locales;
- no missing-key leakage;
- metadata localized;
- document `lang` correct;
- language selection persists;
- keyboard/axe/manual review on both locales;
- Tamil canonical content remains canonical regardless of UI locale;
- 320/390/768/1440 checks pass.

## Final principle

The platform should feel as though it was **designed in Tamil first**, not translated into Tamil after the product was finished.
