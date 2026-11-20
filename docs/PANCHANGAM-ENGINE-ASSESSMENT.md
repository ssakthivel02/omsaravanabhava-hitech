# Panchangam engine assessment — 2026-11-20

Decision: evaluation only; no dependency installation or publication approval.

## Evidence
Reviewed upstream revision [3e24263](https://github.com/Tattvasphere/tattva-astro-core/tree/3e24263f3d5e4d2c8be8d015bc555d146435c408): package.json, LICENSE, NOTICE, docs/LICENSING.md, src/index.ts, src/types.ts and src/core/panchanga.ts. Version declared 1.0.0, Apache-2.0; sole declared runtime dependency astronomy-engine ^2.1.19 (MIT per upstream notice). Registry tarball, exact resolved dependency and integrity not yet checked. Preserve applicable licence and notices on redistribution.

The root entrypoint also exports a digitized Kannada compatibility table. Upstream asserts traditional-data rights, but the original edition and digitization provenance are not independently established. Do not import or redistribute the full package until this is resolved or a narrowly scoped calculation-only distribution is reviewed.

## Calculation contract
Use Chennai city coordinates (proposed 13.0827 N, 80.2707 E), Asia/Kolkata, explicit Lahiri ayanamsa and amanta month system as evaluation parameters, not approved Tamil tradition. The engine returns sunrise-based tithi, nakshatra, yoga and karana with UTC end times; periods.rahuKalam and periods.yamaganda provide UTC intervals. Reject sunriseFallback or sunsetFallback, invalid date, nonfinite or inverted intervals and results inconsistent with the requested coordinates/method. The upstream function substitutes 06:00/18:00 on missing solar events; these must never silently become verified data.

Nalla Neram has no matching field in this interface. Abhijit is not a substitute. Obtain independent Tamil tradition references and review before implementing. Tamil names and transition-day presentation require native-language review.

## Benchmark acceptance plan (not executed)
Evaluate all seven weekdays, new/full moon proximity, dates with multiple limb transitions, Tamil month boundaries and Chennai midnight. Include independently sourced expected limb indices and UTC transition instants, sunrise/sunset and Rahu/Yamaganda intervals. Proposed preliminary time tolerance two minutes for matching conventions, subject to independent reviewer sign-off; investigate all disagreements, never average competing traditions. Record source, edition/date, location, ayanamsa and calculation conventions for every reference. Do not copy protected tables. Compare Nalla Neram separately against reviewed Tamil rules.

## Release gates
Pin package and transitive dependency with integrity, verify licence/NOTICE and table provenance, execute reproducible benchmarks and dependency audit, obtain Tamil review, then implement the isolated adapter. Keep all seven production fields pending until the existing approval and field-evidence contract is satisfied. No scheduled job, provider approval or production change authorized by this assessment.
