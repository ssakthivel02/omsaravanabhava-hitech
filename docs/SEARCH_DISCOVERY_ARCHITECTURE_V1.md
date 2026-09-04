# OmSaravanaBhava Hi-Tech — Search & Discovery Architecture V1

## Objective

Make search excellent for Tamil devotional knowledge while preserving source truth. Search must help users find governed material; it must never manufacture an answer when evidence is absent.

## 1. Search modes

The product should support five user intentions:

1. **Find** — exact temple/work/name/verse identity.
2. **Explore** — browse related temples, Murugan names/forms, works and categories.
3. **Read / Study** — enter canonical/source-aware reading layers.
4. **Practice** — reach local devotional practice tools from governed items.
5. **Trust / Verify** — inspect sources, completeness and publication status.

A single results page can expose these intentions, but should not flatten them into one relevance score.

## 2. Search corpus

Only governed/publicly discoverable records may enter the public search index.

Index fields may include:

- canonical Tamil title;
- English title;
- verified aliases;
- transliteration aliases;
- record type;
- district/place where governed;
- work/author identity;
- source-safe short descriptions;
- source/completeness state;
- temple Arupadai Veedu ordinal/classification;
- canonical text only when publication rights permit it.

Never index quarantined/private/review-only body text into public search.

## 3. Tamil handling

Search normalization must not mutate stored canonical text.

Use a derived search-normalization layer for:

- Unicode normalization;
- safe whitespace normalization;
- punctuation variants;
- common Tamil orthographic/input variants where tested;
- optional transliteration aliases.

Do not rewrite or display the normalized query as canonical Tamil.

## 4. Alias model

Aliases must be governed data, not arbitrary keyword stuffing.

Examples may include natural Murugan names where contextually correct:

- Murugan
- Skanda
- Subramanya / Subrahmanya
- Kartikeya / Karthikeya
- Shanmukha
- Kumara
- Saravana
- Guha
- Senthil
- Vel Murugan

Each alias should be tied to a record/entity type so a name does not create unrelated search noise.

## 5. Ranking principles

Initial deterministic ranking should prefer:

1. exact canonical-title match;
2. exact governed alias match;
3. prefix/title match;
4. strong token match in title/identity fields;
5. type/district/author match;
6. body/snippet match only when text is publishable.

Then apply truthful quality signals, for example:

- substantive complete record may rank above identity-only duplicate;
- source-verified may rank above source-unavailable when intent is otherwise equal;
- Arupadai Veedu classification may receive context boost for explicit matching query;
- do not hide pending records completely if they are the only truthful match.

Never rank generated reflection above canonical/source records.

## 6. Result presentation

Each result should show enough state to prevent overclaim:

- title;
- record type;
- Tamil/English identity as available;
- relevant snippet from governed data only;
- source/completeness badge or concise state;
- location/category context where useful.

Use wording such as:

`governed/source-tracked records`

not blanket:

`verified records only`

unless every displayed dimension is actually verified.

## 7. Filters

Only offer filters supported by real data.

Candidate filters:

- content type;
- Arupadai Veedu;
- district/state;
- source/completeness state;
- work/author;
- canonical text available;
- audio available.

Do not create empty decorative facets.

Filter/query state should be reflected in the URL when practical for back/forward/share behaviour, but public search-result URLs should normally remain non-indexable.

## 8. Zero-result behavior

Zero results must be useful and honest.

Allowed:

- spelling/input hints;
- alternate governed aliases;
- browse suggestions;
- source/completeness explanation;
- correction/source contribution path.

Forbidden:

- inventing a mantra/temple/song answer;
- synthesizing scripture;
- generated prophecy/divine guidance;
- presenting a model guess as a source-backed result.

If future AI assistance is offered, label it separately from search results and ground it only in retrieved governed sources.

## 9. Search privacy

Default rule: do not remotely log raw devotional search queries.

If aggregate search analytics are ever needed:

- use explicit privacy review;
- prefer coarse categories/zero-result rates over raw text;
- avoid storing queries that reveal religious practice or personal concerns;
- do not use search queries for advertising or cross-site profiling.

## 10. Performance architecture

R1 local search is an acceptable baseline, but the 376-temple corpus must not block Home startup.

Recommended progression:

### Stage 1 — client-side governed index

- lazy-load the search index only when search/discovery is used;
- split large record families;
- precompute compact normalized fields at build time;
- avoid shipping full unpublished body content solely for search.

### Stage 2 — optimized local index

If corpus growth justifies it:

- build compact token/alias maps;
- use worker-thread/Web Worker search if interaction cost becomes measurable;
- measure bundle/memory before adding a large search library.

### Stage 3 — server/edge search

Only if corpus scale or multilingual semantics genuinely require it. Preserve source IDs/states in every hit. The production website must not depend on a manually available third-party AI subscription.

## 11. Future semantic/source-aware search

Semantic search may be added after deterministic search is trustworthy.

Requirements:

- embeddings/index built only from content allowed for that processing;
- result always resolves to governed source records;
- citations/source links visible;
- no model-only result with no retrievable supporting record;
- canonical Tamil remains unchanged;
- generated answer is a separate layer;
- zero-evidence answer must abstain.

## 12. Search test matrix

Required tests:

- exact Tamil title;
- Tamil partial/prefix;
- English title;
- governed alias/transliteration;
- district/temple query;
- Arupadai Veedu query;
- canonical body unavailable state;
- metadata-only rights state;
- zero-result;
- no fabricated answer;
- keyboard navigation;
- 320/390 mobile interaction;
- search input responsiveness with temple corpus loaded;
- URL filter/back navigation;
- no raw query leakage to telemetry by default.

## 13. Acceptance principle

The search experience is world-class when users can quickly answer:

- **What did I find?**
- **What kind of record is it?**
- **How complete/verified is it?**
- **Where did it come from?**
- **What should I explore next?**

without the platform pretending to know more than its governed sources contain.
