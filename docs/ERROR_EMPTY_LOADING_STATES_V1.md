# OmSaravanaBhava Hi-Tech — Error, Empty, Pending & Loading States V1

## Purpose

A world-class site must feel intentional even when content is missing, loading, offline, restricted or unavailable. Given the current governed corpus gaps, these states are core product design—not edge cases.

## 1. State families

Use distinct experiences for:

- `LOADING`
- `EMPTY_VALID`
- `CONTENT_PENDING_VERIFICATION`
- `RIGHTS_METADATA_ONLY`
- `OFFLINE_NOT_CACHED`
- `NETWORK_ERROR`
- `NOT_FOUND`
- `SOURCE_UNAVAILABLE`
- `TEMPORARILY_STALE_REVERIFY`
- `QUARANTINED_NOT_PUBLIC`

Do not show one generic “Something went wrong” message for all cases.

## 2. Loading

Loading UI should preserve the final layout shape and avoid CLS.

Rules:

- no fake progress percentage;
- skeletons only when they meaningfully mirror the destination;
- do not skeleton canonical text in a way that looks like actual scripture;
- loading animation respects reduced motion;
- avoid long blocking spinners when partial content can render immediately.

## 3. Canonical text pending

For Thiruppugazh or other source text not yet imported:

Show:

- record identity/title;
- source/edition metadata if governed;
- verification/publication state;
- a respectful explanation that canonical body is pending verified import;
- related source/trust link.

Do not fill the space with generated verses, generic devotional paragraphs or repeated placeholders.

## 4. Rights metadata-only

When text/audio exists conceptually but publication rights are not established:

- show metadata and source identity;
- explain why full content is not published;
- do not style it as a broken media player or failed load;
- do not offer unauthorized download/copy actions.

## 5. Incomplete temple

Use one intentional completeness panel summarizing:

- verified identity;
- available source-backed facts;
- official source link;
- pending fields.

Do not render many empty “History”, “Architecture”, “Timings” blocks with dashes.

## 6. Search zero result

The zero-result state must:

- repeat/clarify the query safely;
- suggest filters/categories/aliases;
- link to browse/explore;
- state that no governed/source-tracked result was found;
- never synthesize a mantra, verse, temple or religious answer.

## 7. Network error

Keep known local content usable.

Offer:

- retry;
- offline content if cached;
- clear distinction between network failure and content absence.

Do not imply a source record is missing merely because the network failed.

## 8. Offline not cached

Explain:

- this content is not available offline yet;
- reconnect to load it;
- whether future “save offline” is supported.

Avoid generic browser-error appearance when the app shell itself is available.

## 9. Stale dynamic temple fact

If a timing/contact/service fact exceeds its freshness policy:

- show the last verification date;
- mark `reverify required` or equivalent devotee-friendly wording;
- direct users to the official source;
- do not silently hide the freshness problem.

## 10. Not Found

404/unknown route should remain in the Sacred-Tech visual system and provide useful paths:

- Home
- Search
- Temples
- Sacred Works

Do not expose framework/debug information.

## 11. Error tone

Tone should be calm, precise and respectful.

Avoid:

- jokes during canonical/source failure;
- alarming red everywhere;
- blame;
- vague mystical language;
- manipulative urgency.

## 12. Accessibility

All states require:

- semantic heading/message;
- appropriate live-region behavior for async changes;
- keyboard-accessible retry/actions;
- no colour-only status;
- reduced-motion compliance;
- readable Tamil and English labels.

## Release gate

`RESILIENT_STATES_GATE` passes when P0 routes have intentional loading/empty/pending/offline/error states that preserve source truth and accessibility without generic filler or fabricated content.