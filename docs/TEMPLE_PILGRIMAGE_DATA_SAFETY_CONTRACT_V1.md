# OmSaravanaBhava Hi-Tech — Temple & Pilgrimage Data Safety Contract V1

## Purpose

Temple and pilgrimage information can affect real-world travel, payments and expectations. The site must separate timeless devotional/source material from changing operational facts.

## 1. Fact classes

Every temple field should belong to one class:

- `IDENTITY_FACT`
- `DOCUMENTED_HISTORY`
- `TEMPLE_PUBLISHED_TRADITION`
- `LITERARY_TRADITION`
- `ARCHITECTURE_EVIDENCE`
- `GEOGRAPHIC_FACT`
- `DYNAMIC_VISITOR_FACT`
- `OFFICIAL_SUPPORT_CHANNEL`
- `DEVOTIONAL_ILLUSTRATION`

Do not collapse these into one generic description.

## 2. Dynamic facts

Treat as time-sensitive:

- opening/closing times;
- pooja schedules;
- ticket/service availability;
- transport/facility information;
- executive officer/contact data;
- service/donation amounts;
- festival operational arrangements.

Required metadata:

- `sourceUrl`
- `sourceAuthority`
- `retrievedAt`
- `lastVerifiedAt`
- `dynamic: true`

UI should advise users to confirm current operational information with the official temple source before travel/payment.

## 3. Coordinates/maps

Do not publish a map pin solely because a generic map/search engine found a location.

Confidence order:

1. official temple/HR&CE geographic source;
2. government geospatial source;
3. independently corroborated reputable map source with lower-confidence state.

The six-abode flagship map becomes public only when all six required coordinates meet the approved confidence gate or the UI clearly handles missing pins without inventing them.

## 4. Routes/pilgrimage planning

A future route planner may calculate distance/order using verified geography, but must not imply:

- road safety;
- public transport availability;
- temple opening at arrival time;
- accessibility/facility availability;
- visa/permit/legal conditions;
- weather suitability.

These are dynamic external conditions and need current authoritative sources if exposed.

## 5. Official links

External HR&CE/official temple links should be clearly labelled as external and official when verified.

OmSaravanaBhava must not receive/intermediate temple donations.

No unverified QR code, UPI ID, bank account or third-party fundraiser may be presented as official.

## 6. Traditional narrative

A temple's own published devotional narrative is valid evidence of **what that temple states**, but is not automatically independently proven secular history.

UI/content model should preserve labels such as:

- documented history;
- temple-published tradition;
- literary/scriptural tradition;
- local/oral tradition if ever included and properly sourced.

## 7. Images

Temple documentary photos require identity/provenance confidence.

If verified documentary imagery is unavailable, use:

- abstract Sacred-Tech geometry; or
- clearly labelled devotional illustration.

Never use an unrelated temple photograph as decorative filler.

## 8. Accessibility/visitor information

Do not claim wheelchair access, lift availability, step-free access, parking, toilets or other facilities without a current source.

Where source-linked but not recently verified, show freshness and advise confirmation.

## 9. Emergency stale-information handling

If an official service/payment/contact detail is reported wrong:

- remove/disable the actionable link/value first when risk warrants;
- retain the source/evidence for review;
- mark the field `REVERIFY_REQUIRED`;
- publish again only after verification.

## 10. Temple completeness UX

An incomplete record should still be useful through:

- verified identity;
- source links;
- what is verified;
- what is pending;
- official destination where available.

Do not fill empty history/visitor sections with generic AI prose.

## Release gate

`TEMPLE_PILGRIMAGE_DATA_SAFETY_GATE` passes when actionable dynamic/geographic/payment-related temple data is source-linked with freshness/confidence state and no unverified fact can appear as current official travel/payment guidance.