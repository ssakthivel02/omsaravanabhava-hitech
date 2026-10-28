# R2.14 First-party Tamil text intake — 28 October 2026

## User publication requirement

Render reviewed canonical Murugan works and songs **inside OmSaravanaBhava**. Do not add outbound devotional-reading links. Retain attribution discreetly in the on-site provenance footer. Do not imply complete bodies exist where only metadata has been published.

## Previously uploaded sources located in the connected Project / Library

| Asset | Located in | Purpose | Publication decision |
| --- | --- | --- | --- |
| `697840-அருணகிரிநாதர்-அருளிய-திருப்புகழ்-(1)-(1).pdf` | Project Files | 2,191-page Tiruppugazh PDF source witness | **RECONCILIATION ONLY.** Numbering exceptions, textual variants, edition rights and canonical text require review. |
| `Kandar-Anubhuti-Batch-01-Kappu-Verses-1-10.pdf` | Project/Library files | Existing Kappu and verses 1–10 editorial working batch | **REVIEW ONLY.** Its bibliography references Project Madurai; user previously excluded direct import of that edition. Cross-check against an independently eligible original source. |
| `Kandar-Anubhuti-Batch-01-Kappu-Verses-1-10.docx` | Project/Library files | Editable counterpart to the Kandar Anubhuti batch | **REVIEW ONLY.** Do not assume original authorship or clearance of quoted verses/commentaries. |
| `Murugan Devotional Composition Research.docx` | Project/Library files | Research into text editions and publication rights | **SUPPORTING RESEARCH ONLY.** Not a substitute for record-level rights evidence. |

Files are already present; **do not ask owner to reupload duplicates**. Opaque Project/Library file identifiers are not published as website URLs.

## Independent publication gates per book or song

1. Establish original work, exact edition/witness and author attribution.
2. Verify every Tamil verse from eligible source witnesses, line breaks, Unicode fidelity, ordering and heading correspondence. A metadata number alone is not a canonical body.
3. Document edition-specific reproduction permission or an independently defensible public-domain source transcription. User's upload alone does not transfer third-party publishing rights.
4. Review and distinguish translated meaning, editorial commentary, and canonical devotional text. Never label AI-generated interpretation as scripture.
5. Only after all gates pass, add an approved item to `src/content/approved-devotional-texts.ts` or the governed song registry with provenance.
6. Verify the actual in-site reader, internal navigation, search, accessibility, mobile and PWA routing for each published slice.
7. Update published-body counts from the verified registry, never the 1,326-entry source index.

## Tiruppugazh exceptions already isolated

The source-number reconciliation for the user's PDF found six undetected heading numbers: 93, 102, 203, 206, 1141, 1199. Duplicated or variant headings require editorial review. Songs 1–5 must not be mislabelled missing. Preserve independent evidence from PR #6 and PR #7; do not bulk publish until exceptions are resolved.

## Practical implementation sequence

- **Slice A — Kandar Anubhuti:** compare the already-located Kappu/verses 1–10 against an eligible independent edition, then publish only the accurately verified and rights-cleared portion if the UI distinguishes excerpt from complete book.
- **Slice B — Tiruppugazh:** establish a numbered rights-cleared Tamil witness for individual songs, import in tracked batches and document unresolved variants explicitly. Never fill missing bodies from generated lyrics or invented stanzas.
- **Slice C — remaining works:** Kandar Alangaram, Kandar Andhadhi, Tirumurukarruppatai, Kanda Sashti Kavacham and others follow the same gates, with original Tamil text and commentary separated.

## Status / production boundary

As of this note, the approved full-text devotional registry remains empty. CI passing on the reader code is not proof that devotional texts are available. PR #8 is a reader candidate; PR #10 is an unmerged isolated-preview workflow. Do not claim all Murugan works or the 1,326-song corpus are published. Production cutover requires a live qualified preview, rollback evidence and explicit approved release scope.
