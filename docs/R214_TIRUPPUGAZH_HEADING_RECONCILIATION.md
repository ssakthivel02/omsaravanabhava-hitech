# R2.14 Tiruppugazh PDF heading reconciliation — 2026-10-22

## Source and scope

User-provided PDF: `697840-அருணகிரிநாதர்-அருளிய-திருப்புகழ்-(1)-(1).pdf` (2,191 pages).

Automated local scan used PyMuPDF text-layer extraction and a heading detector tolerant of optional dash and spaces in song numbers. **This is an extraction audit, not a canonical text verification or publication approval.**

## Verified extraction observations

- 1,320 unique song numbers detected in range 1–1,326.
- Songs 1–5 **are present**, on PDF pages 2, 4, 6, 7, 9. Previous missing classifications for them were regex false negatives.
- Six numbers not detected: **93, 102, 203, 206, 1141, 1199**.
- Eleven numbers detected more than once: **72, 92, 101, 114, 202, 205, 349, 801, 920, 922, 1100**.
- PDF page 159 and 160 both contain heading 92; pages 173 and 174 both contain heading 101; pages 343 and 344 both contain heading 202. These may be original numbering issues, variants, or extraction artefacts. Do not auto-renumber without comparing verse bodies.

## Source cross-reference lane

- For 93, 102, 203, 206, compare with Project Madurai Part I (1–330): https://www.projectmadurai.org/pm_etexts/utf8/pmuni0180.html
- For 1141, 1199, compare with Part IV (1001–1326): https://www.projectmadurai.org/pm_etexts/utf8/pmuni0191.html
- User prefers on-site Tamil reading with attribution/source information in a compact footer rather than prominent outbound reading links.
- Preserve source notices and honor the applicable redistribution terms; ancient composition rights do not automatically resolve modern edition rights.

## Next quality gates

1. Review PDF page images for all 17 numbering exceptions; match first lines and complete verse bodies against independent witnesses.
2. Preserve original verse wording and source-specific variants. Avoid repairing corrupt Tamil Unicode by speculative substitutions.
3. Import only source-verified, rights-cleared canonical text with edition/witness metadata.
4. Implement the on-site reader and source footer; do not count unverified entries as published.
5. Run tests for unique IDs, line integrity, Tamil Unicode, rights flags, navigation and accessibility.

## Release safety

Audit-only branch from `bfa15b1411e444850e7a0a939346d8ee2d9a2385`. No changes to deployment, Cloudflare, database, existing PR #4, or production. R2.13 preview remains the reference baseline.

## 2026-10-23 follow-up — page-boundary evidence (text-layer only)

A subsequent independent review of the owner-provided 2,191-page PDF and the previously generated heading index recorded **1,331 detected heading occurrences** and **1,320 unique song numbers**. These counts describe the extraction, **not** a count of verified or publishable verses.

| Undetected reference number | Immediately preceding heading occurrence(s), PDF page(s) | Following heading, PDF page | Editorial status |
|---|---|---|---|
| 93 | 92 on 159 and 160 | 94 on 162 | Number gap coincides with repeated 92; do not renumber without verse-level comparison |
| 102 | 101 on 173 and 174 | 103 on 176 | Number gap coincides with repeated 101; do not renumber without verse-level comparison |
| 203 | 202 on 343 and 344 | 204 on 346 | Number gap coincides with repeated 202; do not renumber without verse-level comparison |
| 206 | 205 on 348 and 349 | 207 on 351 | Number gap coincides with repeated 205; do not renumber without verse-level comparison |
| 1141 | 1140 on 1892 | 1142 on 1896 | Heading not matched in intervening pages; presence/identity of verse unverified |
| 1199 | 1198 on 1998 | 1200 on 2001 | Heading not matched in intervening pages; presence/identity of verse unverified |

**Inspection method and limits:** The page numbers above are 1-based PDF page indexes. PyMuPDF extracted Tamil text has character-corruption artefacts; consequently heading detection is not trustworthy enough to certify a verse or correct the source numbering. Page images and full verse bodies must be compared against a second witness. The Project Madurai reference editions for this review are Part I (1–330; pmuni0180.html) and Part IV (1001–1326; pmuni0191.html); both display the condition that the electronic text header be preserved when redistributed.

**Hold points:** Do not commit owner-supplied PDF bytes or its wholesale extracted text. Do not synthesize verses, silently renumber source headings, promote reference-record counts to published counts, or deploy production from this documentation-only change. Next review: capture original heading image plus initial and final verse lines for each ambiguous occurrence, compare to independent edition witnesses, then seek source-rights clearance before publication.

## 2026-10-23 follow-up — repeated heading occurrence classification

Re-examined all eleven number values flagged as repeated in the stored 1,331-occurrence index against the owner-provided PDF text layer. These are **occurrence locations, not proof of distinct songs or fully legible headings**.

| Number | PDF pages in extracted index | Initial triage |
|---|---|---|
| 72 | 124, 124 | Two matches on one page: check double text layer or repeated reference |
| 92 | 159, 160 | Adjacent page duplicate, preceding undetected 93 |
| 101 | 173, 174 | Adjacent page duplicate, preceding undetected 102 |
| 114 | 193, 1894 | Distant recurrence: reject automatic classification as second verse |
| 202 | 343, 344 | Adjacent page duplicate, preceding undetected 203 |
| 205 | 348, 349 | Adjacent page duplicate, preceding undetected 206 |
| 349 | 577, 577 | Two matches on one page: check extraction duplication |
| 801 | 1338, 1339 | Adjacent page duplicate; inspect page-break continuation |
| 920 | 1545, 1545 | Two matches on one page: check extraction duplication |
| 922 | 1549, 1550 | Adjacent page duplicate; inspect page-break continuation |
| 1100 | 1827, 2000 | Distant recurrence: may be cited within another song or metadata |

**Actionable parser rule:** A regex hit alone MUST NOT establish a song boundary. Candidate headings require a page-layout/line-position check, a credible continuation/boundary, and a verse-body comparison. Same-page and distant recurrence candidates must remain in a manual-exception ledger instead of generating duplicate canonical IDs. Preserve source-side numbering; NEVER auto-shift songs to fill a missing number.

**Evidence limitation:** Text-layer Tamil glyph corruption prevents claiming corrected verses, confirmed duplicates, or a published text count. This update is documentation only; follow source-rights and production HOLD gates before importing any content.

## 2026-10-23 direct PDF text-layer follow-up — suspected misread numbers

Inspected text-layer excerpts of the owner-provided 2,191-page PDF at the source boundaries. These are **observations, not approved textual emendations**:

- **1141 candidate, PDF p.1894:** following the preceding verse, the extracted heading is `பாடல் 114த ( மபாதுப்பாடல்கள் )`, followed by its own rhythm and lines; PDF p.1896 begins heading 1142. The non-digit `த` in `114த` may reflect embedded-font mapping/text-extraction corruption. Record as **probable heading-recognition failure**, requiring a rendered page check and comparison with a second independent edition.
- **1199 candidate, PDF p.2000:** after heading 1198 (p.1998), the next PDF heading is literally extracted as `பாடல் 1100 ( மபாதுப்பாடல்கள் )`; p.2001 continues its song body. The apparent repeated 1100 between 1198 and 1200 may be a source printing/encoding numbering anomaly. Treat as **1199 candidate / displayed 1100**, not an automatically corrected 1199.
- **205/206 candidate, PDF pp.348–350:** PDF p.348 and p.349 both show heading 205 with the same raga/tala description, and their following extracted verse text overlaps; p.351 begins heading 207. Treat as a **potential duplicated body rather than evidence for 206** until comparison of complete verse lines and any intervening pages.
- **92/93, 101/102, 202/203:** duplicate predecessor headings occur at the expected boundaries. Require full-body matching rather than numeric guessing.

**Evidence method:** direct PyMuPDF text-layer reading around pages 159–162, 173–176, 343–351, 1893–1896, and 1998–2001. Extracted Tamil glyphs are visibly corrupted. No wholesale source extraction, copyrighted modern-edition content, or owner's PDF is committed. A readable page-image/second-witness inspection remains required, and the count of published canonical songs is unchanged.
