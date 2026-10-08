# R2.14 Tiruppugazh source reconciliation — working register

Date: 2026-10-08. Base: `build/r2-13-product-completion` at `bfa15b1411e444850e7a0a939346d8ee2d9a2385`.

## Scope and publication safety

Owner-supplied source: `697840-அருணகிரிநாதர்-அருளிய-திருப்புகழ்-(1)-(1).pdf` (private uploaded source; **do not commit the PDF or raw extraction**). Project Madurai reference editions:
- Part I, songs 1–330: https://www.projectmadurai.org/pm_etexts/utf8/pmuni0180.html
- Part IV, songs 1001–1326: https://www.projectmadurai.org/pm_etexts/utf8/pmuni0191.html

The Project Madurai Part I page attributes electronic text preparation to A.S. Maniam and conversion/web work to named contributors. It states redistribution of the file is permitted if its header page remains intact. Do not assume that this permits removal of the header and unrestricted republication of an adapted electronic transcription. Preserve the full original attribution/header in any redistribution of that electronic edition; get rights review before public bulk import. Original devotional compositions and an electronic edition are distinct rights layers.

## Exception review

Earlier PDF text-layer regex marked songs 1–5 missing. Subsequent page review established they are present under Vinayagar invocation headings. **Do not classify 1–5 as missing.**

| Song number | PDF extraction status | Cross-reference edition | Next check |
|---|---|---|---|
| 93 | Heading not detected | Project Madurai Part I | Verify original PDF page and verse boundaries |
| 102 | Heading not detected | Project Madurai Part I | Verify original PDF page and verse boundaries |
| 203 | Heading not detected | Project Madurai Part I | Verify original PDF page and verse boundaries |
| 206 | Heading not detected | Project Madurai Part I | Verify original PDF page and verse boundaries |
| 1141 | Heading not detected | Project Madurai Part IV | Verify original PDF page and verse boundaries |
| 1199 | Heading not detected | Project Madurai Part IV | Verify original PDF page and verse boundaries |

These are **unresolved extraction exceptions**, not proof of missing songs. Earlier reports noted repeated heading matches; each must be disambiguated against source pages before import.

## Acceptance gates for future implementation

1. Maintain stable song numbers and provenance at verse level; avoid guessing Tamil glyphs from corrupted PDF extraction.
2. Preserve rhythm lines and verse line breaks, normalize Unicode conservatively, and compare ambiguous readings against a second witness.
3. Track governance, source verification, rights, and completeness independently per `docs/R2_CONTENT_PUBLICATION_CONTRACT.md`.
4. On-site reading experience first; compact source attribution at bottom, without obscuring required original electronic-edition header.
5. Never change the public canonical-text count until the relevant bodies have passed both textual and publication-rights gates.
6. Keep production HOLD until separate runtime/mobile/a11y/security qualification.

This register documents verified source locations and outstanding decisions; **it does not certify or publish any song bodies**.
