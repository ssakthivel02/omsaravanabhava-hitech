# OmSaravanaBhava Hi-Tech — Offline / PWA Lifecycle Contract V1

## Goal

Provide reliable offline support without allowing an obsolete service worker to pin users to an old application shell. PWA behavior must be predictable, recoverable and explicitly versioned.

## 1. New application identity only

All new cache names must start with a clear new identity such as:

`omsaravanabhava-hitech-v1-`

Never write new assets into `osb-*`, legacy R5/R6, Kandan or other-project cache namespaces.

## 2. Navigation strategy

Navigation requests use network-first behavior with a last-known-good shell fallback.

Only cache a navigation response as the offline shell when:

- response is successful;
- response is HTML;
- response belongs to the expected application origin/build;
- it is not a server error/fallback error page.

A 404/500/Cloudflare error page must never replace the last-known-good shell.

## 3. Asset strategy

Immutable hashed Vite assets may use cache-first behavior.

Do not cache every external resource indiscriminately.

Media/audio should follow explicit media policy and storage budgets.

## 4. Service-worker lifecycle

Required states:

- first install;
- installed/waiting;
- active;
- update found;
- new version ready;
- activation;
- controller change;
- recovery after failed update.

The UI may show a calm `New version available` action when needed. Do not force reload while a user is reading canonical text or entering local practice state unless safety requires it.

## 5. Cache migration

During activation:

- retain only current-version caches plus explicitly permitted durable offline content;
- delete known legacy OmSaravanaBhava cache prefixes;
- do not delete unrelated browser-origin caches using a generic prefix;
- preserve localStorage/IndexedDB user preferences unless a schema migration explicitly requires change.

## 6. Local data schema migration

Any saved/recent/practice/offline-library data must have a schema version.

Migrations must be:

- deterministic;
- backward-aware where practical;
- tested with old fixtures;
- non-destructive by default.

If data cannot be safely migrated, prefer preserving it under an old key and explaining the limitation rather than silently discarding devotional history/preferences.

## 7. Offline truth

Do not imply that every route/content item is available offline.

The UI should distinguish:

- currently cached;
- available to save offline;
- network required;
- media not stored offline.

Canonical/source state must remain visible offline; offline mode must not strip provenance labels.

## 8. Installability

PWA installability is not considered qualified merely because a manifest exists.

Qualification requires:

- valid manifest;
- governed 192/512/maskable icons;
- correct start URL/scope;
- HTTPS preview/production;
- working service worker;
- browser installability evidence;
- update/recovery test.

Until all pass: `PWA INSTALLABILITY: NOT YET QUALIFIED`.

## 9. Mandatory browser scenarios

Test at minimum:

1. clean first visit online;
2. reload online;
3. visit critical routes then go offline;
4. offline root;
5. offline previously visited route;
6. offline non-cached route;
7. update from version N to N+1;
8. legacy cache exists before new SW activation;
9. private/fresh browser;
10. service worker manually unregistered then fresh load;
11. storage pressure/empty cache graceful behavior where practical.

Tests must fail if SW registration/readiness is not actually proven.

## 10. Anti-reversion runtime invariant

After new SW activation:

- network must not request legacy `app.js`/rc*/phase2* runtime;
- Cache Storage must not contain legacy shell entries that can navigate the app;
- `/release.json` must identify the same new candidate SHA;
- direct refresh on a React route must return the new app.

Any old-shell appearance is an immediate `ANTI-REVERSION FAILURE — NO-GO`.

## Release gate

`PWA_LIFECYCLE_GATE` passes only when exact-candidate install/update/offline/cache-migration/recovery scenarios pass without stale-shell trapping, lost essential local state or overclaiming offline/installability coverage.