# R2 Content Publication & Truth Contract

**Project:** OmSaravanaBhava Hi-Tech  
**Effective:** 2026-09-04  
**Purpose:** prevent a governed record, record count, search result, SEO page or verification badge from overstating how complete or verified the underlying devotional/temple content actually is.

This contract applies to every public content domain: temples, Arupadai Veedu, Thiruppugazh, devotional works, mantras/prayers, sacred names, audio, festivals, sources and future knowledge records.

---

## 1. Core principle

`governed` does **not** mean `complete`.

A record can be legitimately governed and source-tracked while one or more fields remain:

- absent;
- source-linked but not imported;
- awaiting textual verification;
- awaiting publication-rights decision;
- time-sensitive and stale;
- intentionally withheld;
- not applicable.

The UI, search index, home metrics, sitemap and structured data must never collapse these distinctions into a single misleading `Verified` label.

---

## 2. Separate four independent dimensions

Every content record must separate these concepts.

### A. Record governance state

Describes whether the record identity is managed by the project.

Allowed states:

- `GOVERNED`
- `REVIEW_QUEUE`
- `QUARANTINED`
- `RETIRED`

### B. Source verification state

Describes the evidence behind the record/field.

Allowed states:

- `SOURCE_VERIFIED`
- `SOURCE_LINKED_PENDING_REVIEW`
- `VARIANT_REVIEW_REQUIRED`
- `SOURCE_UNAVAILABLE`
- `NOT_APPLICABLE`

### C. Publication-rights state

Describes whether the exact text/audio/image may be publicly reproduced.

Allowed states:

- `PUBLISHABLE`
- `METADATA_ONLY`
- `PERMISSION_PENDING`
- `RESTRICTED`
- `OWNER_SUPPLIED_RIGHTS_CONFIRMED`
- `PUBLIC_DOMAIN_WORK_EDITION_REVIEW_REQUIRED`
- `NOT_APPLICABLE`

### D. Completeness state

Describes how much of the intended user-facing record is actually populated.

Allowed states:

- `COMPLETE_FOR_CURRENT_SCOPE`
- `PARTIAL`
- `IDENTITY_ONLY`
- `BODY_TEXT_PENDING`
- `VISITOR_INFORMATION_PENDING`
- `AUDIO_PENDING`
- `NOT_APPLICABLE`

Never derive one dimension automatically from another.

---

## 3. Field-level truth is required

Important fields must carry their own evidence where the record-level source is insufficient.

Recommended field envelope:

```json
{
  "value": "...",
  "sourceState": "SOURCE_VERIFIED",
  "sourceId": "...",
  "rightsState": "PUBLISHABLE",
  "retrievedAt": "2026-09-04T00:00:00Z",
  "lastVerifiedAt": "2026-09-04T00:00:00Z",
  "dynamic": false,
  "variantNote": null
}
```

For canonical devotional source text also allow:

- `editionId`
- `witnessId`
- `lineBreakPreserved`
- `unicodeNormalisationPolicy`
- `textualVariantState`

For temple operational information also allow:

- `dynamic: true`
- `travelConfirmationRecommended: true`

---

## 4. Record-level public display states

The application may derive a user-facing summary from the four dimensions, but the summary must remain conservative.

Recommended display labels:

- `Source verified`
- `Source linked — review pending`
- `Partial reviewed record`
- `Directory identity only`
- `Canonical text pending verification`
- `Visitor information pending verification`
- `Publication permission pending`
- `Metadata only`
- `Audio not published`
- `Variant review required`

Avoid broad labels such as:

- `Fully verified`
- `Complete`
- `Official`

unless the exact claim is true for the relevant scope.

`Official` should normally identify the source authority (for example, `Official Tamil Nadu HR&CE source`), not the whole OmSaravanaBhava record.

---

## 5. Home-page metric policy

Do not publish raw record counts without context when users could reasonably interpret the count as complete content.

### Bad

`12 Thiruppugazh`

when 0/12 have canonical verse bodies imported.

### Better

`12 source-linked Thiruppugazh records`

with an adjacent completeness indicator such as:

`Canonical body available: 0`

### Temple metric example

Instead of only:

`376 temples`

prefer a layered metric:

- `376 governed temple identities`
- `6 Arupadai Veedu officially source-linked`
- `Visitor detail coverage: x/376`
- `Verified map coordinates: x/376`

The home must never use volume to imply depth that is not present.

---

## 6. Search-result policy

Search results should say `governed/source-tracked` rather than `verified records only` unless every result truly meets the stated verification threshold.

Every result should show:

- content type;
- title/name;
- source/publication state badge;
- a truthful snippet only from populated governed fields;
- no generated devotional answer inserted into canonical/source results;
- a zero-result state that never invents content.

If a user searches for a Thiruppugazh record whose body is withheld/pending, return the metadata record and clearly show the body-text state.

---

## 7. Sitemap and indexability policy

Public availability and search-engine indexability are separate decisions.

### Allowed SEO publication classes

- `INDEXABLE_PUBLIC`
- `PUBLIC_DIRECTORY_ONLY`
- `PUBLIC_NOINDEX`
- `WITHHELD`

### `INDEXABLE_PUBLIC`

Use only when the route has enough substantive, truthful, non-duplicative content to be useful as an independent search result.

### `PUBLIC_DIRECTORY_ONLY`

The record can appear in internal browse/search but should not be emitted as a standalone sitemap URL when it is too thin for useful indexing.

Typical current example:

- temple identity with only name/source status and no substantive detail.

### `PUBLIC_NOINDEX`

Use for public utility/status pages that should not compete in search results or for controlled preview/test content.

### `WITHHELD`

No public route/body publication.

Never generate hundreds of sitemap URLs solely because IDs exist.

---

## 8. Structured-data policy

Schema.org/JSON-LD must reflect only actual verified public fields.

Do not emit:

- geographic coordinates when absent/unverified;
- event dates from unsourced calendars;
- temple opening hours that have not been recently verified;
- `sameAs`/official-site relationships without evidence;
- aggregate ratings/reviews that do not exist;
- fabricated author/publisher data;
- religious claims as factual structured data where the source category is traditional/devotional narrative.

Dynamic operational information should not be permanently baked into structured data without a freshness process.

---

## 9. Temple truth model

Recommended temple field groups:

### Identity

- canonical/project name
- official source name
- HR&CE/authority identifier where applicable
- district/state/country
- Arupadai classification

### Official operational information

- official source URL
- contact
- opening times
- pooja/service links
- facilities
- official direct-support/service link

These are time-sensitive and require `lastVerifiedAt`.

### Geography

- coordinates
- confidence/source
- map/publication state

### Narrative

Keep separate:

- `documentedHistory`
- `templePublishedTradition`
- `literaryTradition`
- `architectureEvidence`
- `visitorInformation`

Do not merge them into one generic `History` paragraph.

---

## 10. Thiruppugazh truth model

Recommended layers:

### Work identity

- song number
- opening words/title
- traditional/corpus grouping
- source edition/transcription

### Canonical text layer

- exact Tamil body
- edition/witness
- textual variant state
- source verification
- publication rights

### Reading aids

Each is separate and independently sourced:

- easy-reading Tamil
- transliteration
- simple meaning
- commentary

### Audio

Separate:

- licensed/owned devotional recording
- device/browser read-aloud
- pronunciation aid

Do not label device TTS as devotional audio.

---

## 11. Audio truth model

Every audio item should include:

- `audioType`: `OWNED_RECORDING | LICENSED_RECORDING | DEVICE_READ_ALOUD | PRONUNCIATION_AID`
- `rightsState`
- `source/performer`
- `publicationState`

No autoplay with sound.

An empty audio registry should show an honest empty state rather than a decorative `Audio Library` promising content that does not exist.

---

## 12. Generated reflection/AI policy

Generated reflection can exist only as a clearly separate editorial layer.

It must never be presented as:

- scripture;
- canonical commentary unless the commentary is a verified authored source;
- prophecy;
- divine message;
- personalised religious instruction;
- guaranteed remedy.

Source results always take precedence over generated reflection.

---

## 13. Corrections and provenance

Every public record should have a path to explain:

- why it is public;
- source(s);
- verification state;
- rights state;
- completeness state;
- last verification for dynamic fields;
- correction channel when available.

Corrections should create review work, not directly overwrite canonical/public text.

---

## 14. Release gate

Before any release candidate is promoted, run a publication-integrity check answering:

- Are raw record counts contextualised?
- Does every public result expose truthful state?
- Are thin records excluded from production sitemap where appropriate?
- Are dynamic temple facts freshness-labelled?
- Are copyrighted/permission-pending bodies withheld correctly?
- Are canonical/easy/transliteration/meaning layers distinct?
- Are empty content domains represented honestly?
- Does any UI claim `verified`, `complete`, `official`, `canonical` or `audio` more broadly than the data supports?

Any material overclaim is:

`CONTENT_TRUTH_GATE = FAIL`

and blocks production.
