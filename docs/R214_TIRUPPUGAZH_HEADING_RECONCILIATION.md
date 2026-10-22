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
