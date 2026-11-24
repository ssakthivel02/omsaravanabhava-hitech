# Panchangam engine assessment — 2026-11-20

Decision: evaluation only; no dependency installation or publication approval.

## Evidence
Reviewed upstream revision [3e24263](https://github.com/Tattvasphere/tattva-astro-core/tree/3e24263f3d5e4d2c8be8d015bc555d146435c408): package.json, package-lock.json, LICENSE, NOTICE, docs/LICENSING.md, src/index.ts, src/types.ts and src/core/panchanga.ts. Version declared 1.0.0 under Apache-2.0. The source lockfile resolves the sole runtime dependency to `astronomy-engine@2.1.19` from `https://registry.npmjs.org/astronomy-engine/-/astronomy-engine-2.1.19.tgz` with npm integrity `sha512-8yWKNf7UeNbH458h3sAJ6ZgAjE5jTXp/mNNRFoC20j2SHwZIjAQeEsBB2Q3uCFRaTCCJRv33K2XhkhZQMXoX6w==`; upstream NOTICE identifies Astronomy Engine as MIT-licensed. This verifies source-lock dependency identity/integrity, not the publication integrity of a future `@tattvasphere/tattva-astro-core` registry tarball. Preserve Apache-2.0 copyright/licence/NOTICE obligations on any redistribution.

The root entrypoint also exports a digitized Kannada compatibility table. Upstream asserts traditional-data rights, but the original edition and digitization provenance are not independently established. Do not import or redistribute the full package until this is resolved or a narrowly scoped calculation-only distribution is reviewed.

## Calculation contract
Use Chennai city coordinates (proposed 13.0827 N, 80.2707 E), Asia/Kolkata, explicit Lahiri ayanamsa and amanta month system as evaluation parameters, not approved Tamil tradition. The engine returns sunrise-based tithi, nakshatra, yoga and karana with UTC end times; periods.rahuKalam and periods.yamaganda provide UTC intervals. Reject sunriseFallback or sunsetFallback, invalid date, nonfinite or inverted intervals and results inconsistent with the requested coordinates/method. The upstream function substitutes 06:00/18:00 on missing solar events; these must never silently become verified data.

Nalla Neram has no matching field in this interface. Abhijit is not a substitute. Obtain independent Tamil tradition references and review before implementing. Tamil names and transition-day presentation require native-language review.

## Benchmark acceptance plan (not executed)
Evaluate all seven weekdays, new/full moon proximity, dates with multiple limb transitions, Tamil month boundaries and Chennai midnight. Include independently sourced expected limb indices and UTC transition instants, sunrise/sunset and Rahu/Yamaganda intervals. Proposed preliminary time tolerance two minutes for matching conventions, subject to independent reviewer sign-off; investigate all disagreements, never average competing traditions. Record source, edition/date, location, ayanamsa and calculation conventions for every reference. Do not copy protected tables. Compare Nalla Neram separately against reviewed Tamil rules.

## Release gates
Pin package and transitive dependency with integrity, verify licence/NOTICE and table provenance, execute reproducible benchmarks and dependency audit, obtain Tamil review, then implement the isolated adapter. Keep all seven production fields pending until the existing approval and field-evidence contract is satisfied. No scheduled job, provider approval or production change authorized by this assessment.


## Exact dependency and licence verification — 2026-11-21
Reviewed the exact upstream commit `3e24263f3d5e4d2c8be8d015bc555d146435c408` again at package/lockfile level.

- Core package: `@tattvasphere/tattva-astro-core` version `1.0.0`, declared `Apache-2.0`.
- Runtime dependency count in upstream package metadata: exactly one — `astronomy-engine` with range `^2.1.19`.
- Upstream `package-lock.json` resolves that runtime dependency to **`astronomy-engine@2.1.19`** from the public npm registry with integrity:
  `sha512-8yWKNf7UeNbH458h3sAJ6ZgAjE5jTXp/mNNRFoC20j2SHwZIjAQeEsBB2Q3uCFRaTCCJRv33K2XhkhZQMXoX6w==`.
- The lockfile records `astronomy-engine` as **MIT**. The upstream NOTICE attributes it to Don Cross and the upstream LICENSE is Apache-2.0.
- If this package is ever redistributed or vendored, retain the Apache-2.0 licence and applicable NOTICE attribution. Linking/importing it does not waive those obligations.

### Still unresolved
This verification establishes the dependency version/integrity recorded by the reviewed upstream source commit; it does **not** independently prove npm publisher provenance for the core package tarball, nor does it validate the copyright/provenance assertion for the digitized Kannada Padaka table. The table remains a separate rights/provenance HOLD. Do not import or redistribute that table unless its source edition/digitization rights are independently established or the integration is narrowed to calculation-only code that excludes it.

This evidence also does not establish Panchangam accuracy for Chennai or approve a Tamil tradition. Reproducible benchmark comparison, Nalla Neram methodology, Tamil review, and publication approval remain required.


## 24 Nov 2026 provenance checkpoint
- Upstream source revision: `3e24263f3d5e4d2c8be8d015bc555d146435c408`.
- Package identity: `@tattvasphere/tattva-astro-core@1.0.0`, Apache-2.0.
- Source package-lock runtime resolution: `astronomy-engine@2.1.19`, MIT, registry URL and integrity recorded above.
- Upstream NOTICE explicitly attributes Astronomy Engine to Don Cross and its MIT licence.
- **Still unresolved:** independently verify any future core-package registry tarball before installation; preserve LICENSE/NOTICE; independently adjudicate provenance/redistribution rights for the digitized Kannada compatibility table and any traditional-data payloads. Do not treat the repository author's licensing assertions about that table as independent provenance evidence.


## 24 Nov 2026 independent daylight-period benchmark
Independent benchmark evidence now includes the Government of India / India Meteorological Department Positional Astronomy Centre Rashtriya Panchang station table for Chennai. For 24 November 2026 it gives sunrise 06:12 and sunset 17:40 IST. Dividing that daylight interval into the established weekday eighths yields Tuesday Yamaganda 09:04–10:30 and Rahu Kalam 14:48–16:14.

This check exposed a real evaluation defect inherited from the candidate engine: the previous Yamaganda weekday table used Tuesday segment 3 instead of segment 2 (and several other weekdays were likewise shifted). The local evaluation helper now uses the conventional zero-based sequence Sunday→Saturday `[4, 3, 2, 1, 0, 6, 5]`, while Rahu remains `[7, 1, 6, 4, 5, 3, 2]`. A regression locks the 24 Nov 2026 Chennai result to the government sunrise/sunset values.

This correction is an evaluation-layer finding, not publication approval of the upstream engine. Full tithi/nakshatra/yoga/karana transition benchmarking, Nalla Neram methodology, Tamil editorial review and source/publication approval remain mandatory.
