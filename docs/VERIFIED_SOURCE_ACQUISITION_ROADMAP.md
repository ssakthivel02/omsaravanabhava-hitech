# Verified Source Acquisition Roadmap

**Project:** OmSaravanaBhava Hi-Tech  
**Effective date:** 2026-09-04  
**Purpose:** strengthen the new clean-room website with authoritative source data without copying the legacy application or fabricating devotional/temple facts.

This is a **source-governance plan**, not permission to republish every source verbatim.

## Source classes

Every imported field should identify one of these source classes:

- `OFFICIAL_GOVERNMENT_FACT_SOURCE`
- `OFFICIAL_TEMPLE_FACT_SOURCE`
- `LITERARY_REFERENCE_SOURCE`
- `PUBLIC_DOMAIN_WORK_EDITION_RIGHTS_REVIEW`
- `REFERENCE_ONLY_PERMISSION_PENDING`
- `OWNER_SUPPLIED_VERIFIED_SOURCE`

Dynamic facts such as temple timings must also carry `lastVerifiedAt` and should not be treated as timeless canonical data.

---

# A. Arupadai Veedu — official HR&CE source lane

Tamil Nadu Hindu Religious & Charitable Endowments Department (HR&CE) temple pages are the preferred first-party/government source for temple identity, official contact, opening times, facilities, transport/location notes, executive officer details and official temple service links where available.

Do **not** intermediate donations. If direct support/donation information is exposed, link only to an official HR&CE/temple destination and state clearly that OmSaravanaBhava does not receive or process funds.

## 1. Thirupparankundram

- Canonical project role: Arupadai Veedu 1
- HR&CE temple ID: `TM031985`
- Official identity: `Arulmigu Subramaniyaswamy Temple, Thirupparankundram - 625005, Madurai District`
- Official host: `thiruparankundrammurugan.hrce.tn.gov.in`
- Official base page pattern: `https://thiruparankundrammurugan.hrce.tn.gov.in/hrcehome/index_temple.php?tid=31985`
- Official source types already discoverable: contact, executive officer, temple timings/pooja, facilities.

Recommended initial fields:

- official Tamil/English name;
- HR&CE ID;
- district/postcode;
- official contact endpoint;
- current opening-time record + `lastVerifiedAt`;
- facility/source links;
- official direct-support link only if needed and clearly external.

## 2. Tiruchendur

- Canonical project role: Arupadai Veedu 2
- HR&CE temple ID: `TM038271`
- Official identity: `Arulmigu Subramania Swamy Temple, Tiruchendur - 628215, Thoothukudi District`
- Official host: `tiruchendurmurugan.hrce.tn.gov.in`
- Official base page pattern: `https://tiruchendurmurugan.hrce.tn.gov.in/hrcehome/index_temple.php?tid=38271`
- Official source types already discoverable: temple timing/pooja, executive officer/contact, temple services.

## 3. Palani

- Canonical project role: Arupadai Veedu 3
- HR&CE temple ID: `TM032203`
- Official identity: `Arulmigu Dhandayuthapaniswamy Temple, Palani - 624601, Dindigul District`
- Official host: `palanimurugan.hrce.tn.gov.in`
- Official base page pattern: `https://palanimurugan.hrce.tn.gov.in/hrcehome/index_temple.php?tid=32203`
- Official source types already discoverable: contact/executive officer, temple timings, pooja, sub-shrines, e-services.

## 4. Swamimalai

- Canonical project role: Arupadai Veedu 4
- HR&CE temple ID: `TM018002`
- Official identity: `Arulmigu Swaminatha Swamy Temple, Swamimalai, Kumbakonam - 612302, Thanjavur District`
- Official host: `swamimalaiswaminathar.hrce.tn.gov.in`
- Official base page: `https://swamimalaiswaminathar.hrce.tn.gov.in/hrcehome/index_temple.php?tid=18002`
- Official page currently exposes temple identity, an About Temple section and current opening/closing-time information.

Historical/traditional narrative copied from the official page should **not** automatically be labelled `HISTORICAL_FACT`. Preserve distinctions such as:

- official administrative fact;
- temple-published traditional narrative;
- literary/scriptural reference;
- independently corroborated historical fact.

## 5. Tiruttani

- Canonical project role: Arupadai Veedu 5
- HR&CE temple ID: `TM001506`
- Official identity: `Arulmigu Subramanyaswamy Temple, Malaikoil, Tiruttani - 631209, Tiruvallur District`
- Official host: `tiruttanimurugan.hrce.tn.gov.in`
- Official base page pattern: `https://tiruttanimurugan.hrce.tn.gov.in/hrcehome/index_temple.php?tid=1506`
- Official source types already discoverable: temple timings/pooja, facilities, transport, e-services, consecration records.

## 6. Pazhamudircholai / Solaimalai

- Canonical project role: Arupadai Veedu 6
- HR&CE temple ID: `TM032124`
- Official identity: `Arulmigu Murugan Temple, Solaimalai Mandapam, Alagarkovil - 625301, Madurai District`
- Official page itself identifies it as `Aravathu Padai Veedu` / sixth abode.
- Official host: `solaimalaimurugan.hrce.tn.gov.in`
- Official base page: `https://solaimalaimurugan.hrce.tn.gov.in/hrcehome/index_temple.php?tid=32124`
- Official source types already discoverable: contact, temple timings, nearby transport/location information, shrines, e-services.

---

# B. Temple ingestion rules

## B1. Dynamic information

Treat these as time-sensitive:

- temple opening/closing times;
- pooja schedules;
- ticket/service availability;
- executive officer/contact information;
- donation/service amounts;
- festival-specific operational timing;
- temporary facilities/announcements.

Required fields:

- `sourceUrl`
- `sourceAuthority`
- `retrievedAt`
- `lastVerifiedAt`
- `dynamic: true`

UI should tell users to confirm current timings/services with the official temple source before travel/payment.

## B2. Direct support/donations

OmSaravanaBhava must never receive, pool, redirect through an internal payment processor, or intermediate temple donations.

Allowed:

- verified external HR&CE/official temple donation/service URL;
- clear external-link treatment;
- source and authority label;
- warning that prices/availability can change.

Not allowed:

- copied QR code presented as our own;
- internal donation wallet;
- platform commission;
- unverified UPI/bank details;
- third-party fundraiser presented as official.

## B3. Coordinates

Do not fill coordinates from generic search results just to enable a map.

Preferred confidence order:

1. official HR&CE GIS/location source;
2. official temple page with explicit coordinates;
3. government geospatial source;
4. corroborated reputable map source, clearly marked lower confidence.

Only expose the flagship pilgrimage map when the six core coordinates have passed the defined confidence gate.

## B4. Historical/traditional narrative

Keep separate fields such as:

- `administrativeFacts`
- `documentedHistory`
- `templePublishedTradition`
- `literaryTradition`
- `architectureEvidence`
- `visitorInformation`

A temple's own devotional narrative is a valid source for **what the temple states**, but should not automatically be presented as independently proven secular history.

---

# C. Thiruppugazh — literary source lane

## C1. Project Madurai

Project Madurai provides Unicode Tamil editions of Arunagirinathar's Thiruppugazh in four parts covering the corpus through song 1326:

- Part 1: songs 1–330 — `pmuni0180.html`
- Part 2: songs 331–670 — `pmuni0187.html`
- Part 3: songs 671–1000 — `pmuni0189.html`
- Part 4: songs 1001–1326 — `pmuni0191.html`

Project Madurai states that its initiative distributes free electronic editions of Tamil classics. Its Thiruppugazh pages also state that the file may be freely distributed provided the header page is kept intact. The current Project Madurai homepage says third-party redistribution is permitted provided the Project header/logo/acknowledgements are kept intact and asks online distributors to contact Project Coordinators.

Therefore classify Project Madurai for OmSaravanaBhava as:

`REFERENCE_ONLY_PERMISSION_PENDING`

until the publication method has been reviewed against those redistribution conditions or permission/clarification is obtained.

Do **not** simply copy the complete Project Madurai transcription into our database and strip its required header/credits.

Recommended use now:

- confirm song numbering/opening words;
- compare textual variants;
- validate corpus coverage;
- link source/edition metadata;
- prepare an import mapping without publishing copied full text until rights conditions are satisfied.

## C2. Tamil Virtual Academy

Tamil Virtual Academy (Tamil Nadu government institution) has a Thiruppugazh library section and can serve as a strong secondary reference for corpus identity and educational context.

Classify initially as:

`LITERARY_REFERENCE_SOURCE`

Do not infer republication permission from public web availability. Check terms/permission before copying full text into OmSaravanaBhava.

## C3. Public-domain author vs edition/transcription rights

Arunagirinathar's original work is historical/public-domain literature, but a modern transcription, edition, commentary, musical notation, translation or digitisation may carry its own rights/conditions.

The content model must therefore keep separate:

- original work status;
- source edition;
- transcription source;
- editor/transcriber;
- commentary/meaning author;
- rights/publication status;
- textual variant notes.

Never mark a modern digital transcription `PUBLIC_DOMAIN` merely because the underlying medieval poem is public-domain.

---

# D. Thiruppugazh import plan

For each current 12 R1 Thiruppugazh record:

1. identify Project Madurai part and song number;
2. confirm opening words/title against at least one secondary authoritative reference when practical;
3. record exact source edition/transcription;
4. determine publication permission/state;
5. only then import canonical Tamil body;
6. run Unicode/line-break preservation test;
7. store easy-reading Tamil separately;
8. store transliteration separately;
9. store meaning/commentary separately;
10. keep audio rights separate from text rights.

Suggested publication states:

- `SOURCE_IDENTITY_VERIFIED_TEXT_WITHHELD`
- `TEXT_VERIFIED_PUBLICATION_PERMISSION_PENDING`
- `TEXT_VERIFIED_PUBLISHABLE`
- `VARIANT_REVIEW_REQUIRED`

---

# E. Immediate highest-value content work

After R2 engineering gates are green, prioritize:

1. all six Arupadai Veedu official HR&CE identity/contact/source links;
2. all six current official timing records with `lastVerifiedAt` and travel-confirmation notice;
3. official location/facility source links;
4. source-confidence model for map coordinates;
5. rights/permission resolution for the current 12 Thiruppugazh records;
6. canonical-text import only after the rights gate;
7. a real correction/contact channel;
8. audio registry only for owned/licensed/read-aloud-qualified material.

This path makes the website more useful without fabricating a single devotional or temple claim.
