# OmSaravanaBhava Hi-Tech — Owner Preview Acceptance Checklist V1

## Purpose

Give the owner a short, concrete review method when the first real Cloudflare preview is ready. This is a visual/product acceptance step, not a substitute for automated CI.

## Before reviewing

Confirm the preview report shows:

- repository = `ssakthivel02/omsaravanabhava-hitech`;
- exact Git SHA;
- preview URL;
- production root domain unchanged;
- automated mandatory gates green or explicitly pending;
- `/release.json` matches the preview SHA.

## 1. First impression — 30 seconds

Open the preview in a private browser.

Ask:

- Does it immediately feel like **OmSaravanaBhava / Murugan**, not a generic template?
- Is Tamil visually primary?
- Does the hero feel premium and calm rather than noisy?
- Is there one obvious meaningful action?
- Does it look materially different from the old website?
- Is anything visibly copied from another project/product?

Fail if the old site appears at any point.

## 2. Mobile — 390px class device

Check:

- hero copy wraps naturally;
- no horizontal scrolling;
- navigation opens/closes cleanly;
- touch targets are comfortable;
- long Tamil temple names remain readable;
- primary actions are not crowded;
- source/status labels do not dominate the devotional content.

## 3. Small mobile — 320px

Check the same critical items with particular attention to:

- clipping;
- stacked buttons;
- footer wrapping;
- sticky header space;
- Tamil headings;
- search input/results.

## 4. Arupadai Veedu

Ask:

- Does the six-abode experience feel like a pilgrimage journey rather than six generic cards?
- Are the six identities clear?
- Are pending coordinates/visitor facts shown honestly?
- Is there any invented map/location/history?
- Are official source links clear where present?

## 5. Temple Directory

Check:

- search/filter is obvious;
- results are easy to scan;
- 376 records do not feel like an endless wall;
- incomplete records are not presented as fully detailed;
- opening a detail and returning preserves useful context where expected.

## 6. Temple Detail

Choose an incomplete record.

A good page should clearly show:

- what is verified;
- what is available;
- sources;
- what is pending;
- official external channel where verified.

It should not look broken or padded with generic AI text.

## 7. Thiruppugazh

Confirm:

- the site does not imply 12 complete canonical verses while body text is still pending;
- the reader shell is beautiful and ready for future canonical Tamil;
- canonical/easy/transliteration/meaning/source layers are conceptually distinct;
- missing text is explained respectfully.

## 8. Search

Search in Tamil and English.

Check:

- wording says governed/source-tracked rather than blanket verified;
- result type/state is understandable;
- zero-result state does not invent a devotional answer;
- results navigate correctly.

## 9. Practice

Check:

- counter feels calm, not game-like;
- no streak pressure;
- local/private behavior is understandable;
- daily item changes by local calendar day as intended.

## 10. Trust/Sources

Ask:

- Can a normal devotee understand why some content is complete and some pending?
- Are source/rights/completeness concepts explained without excessive engineering jargon?
- Is the platform transparent rather than defensive?

## 11. Contact/Corrections

Confirm either:

- a real approved correction/contact channel exists; or
- the page explicitly says submissions are not yet available.

A dead promise is a NO-GO defect.

## 12. Accessibility spot check

Using keyboard only:

- use skip link;
- navigate header;
- open/close mobile/desktop menus where applicable;
- use search;
- follow a result;
- open a temple;
- verify visible focus everywhere.

Also enable reduced motion and confirm the site still feels complete.

## 13. Existing-browser anti-reversion

After the private-browser check, also test an ordinary browser that previously visited the old production website when a safe preview comparison is possible.

The preview must still display the exact new candidate; no old service-worker/cache behavior should appear.

## 14. Premium-design questions

Score 0–2:

- Murugan identity
- Tamil experience
- visual craftsmanship
- clarity
- source trust
- mobile quality
- originality
- desire to explore further

Any zero on a flagship route should be corrected before production review.

## 15. Owner decision

Possible owner decisions:

- `PREVIEW_REJECT — REWORK`
- `PREVIEW_GO — CONTINUE QUALIFICATION`
- `VISUAL_GO / CONTENT_FIX_REQUIRED`
- `CONTENT_GO / VISUAL_FIX_REQUIRED`

Do **not** use `DEPLOY PRODUCTION` until exact-head technical evidence and owner production approval are separately complete.

## Final rule

A beautiful preview is not production-ready by itself. Owner acceptance confirms product/visual direction; CI, accessibility, performance, source/rights, anti-reversion and cutover gates remain mandatory.