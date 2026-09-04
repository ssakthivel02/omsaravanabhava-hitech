# OmSaravanaBhava Hi-Tech — Private Local Library Contract V1

## Purpose

Let visitors save, revisit and study devotional material without requiring an account or turning private devotional behaviour into analytics data.

## 1. Local-first default

Preferred local capabilities:

- saved items;
- recent items;
- reading preferences;
- selected language;
- reader font-size/line-height preferences;
- learning-path progress;
- practice counters;
- optional offline-save choices.

No account is required for these features.

## 2. Privacy rule

Do not transmit by default:

- saved prayers/works;
- reading history;
- practice counts;
- devotional search history;
- learning-path progress;
- inferred religious interests.

Operational telemetry should not include these values.

## 3. Data model

Every local store must have:

- application key namespace `omsaravanabhava-hitech-*`;
- schema version;
- created/updated timestamp where needed;
- migration strategy;
- clear/delete mechanism.

Do not reuse legacy `osb-*` local-storage/database keys.

## 4. User controls

Provide understandable controls for:

- remove one saved item;
- clear recent history;
- reset practice counter;
- clear all local OmSaravanaBhava data;
- explain what is stored locally;
- explain what is not synced.

A browser-storage failure must not make canonical content inaccessible.

## 5. Offline saves

If users can save content offline, distinguish:

- metadata only;
- canonical text where rights permit;
- imagery where publication rights permit;
- audio where offline rights permit.

Do not silently cache restricted media merely because a page was opened.

## 6. Content-version updates

Saved item IDs should reference governed records, not duplicate uncontrolled copies of canonical content.

When a record changes:

- preserve the saved relationship;
- load the current governed version where online;
- if an old offline copy exists, show/version it accurately until refreshed;
- never silently present stale content as the latest verified version.

## 7. Export/import — future option

A future privacy-friendly export may package local preferences/saved IDs without an account.

If implemented:

- no secrets;
- no hidden analytics identifiers;
- versioned schema;
- user-controlled file;
- import validation.

## 8. Cross-device sync

Do not add cloud sync merely for convenience during R2.

Any later sync requires separate identity, security, privacy, retention and deletion design. Local-first remains the baseline.

## 9. UX principle

Saved/recent experiences should feel like a personal devotional bookshelf, not a social feed.

Avoid:

- public activity feeds;
- follower counts;
- streak pressure;
- comparative devotional metrics;
- personalised spiritual ranking.

## Release gate

`LOCAL_LIBRARY_PRIVACY_GATE` passes when local features are namespaced, versioned, deletable, do not require accounts, and do not transmit devotional activity by default.