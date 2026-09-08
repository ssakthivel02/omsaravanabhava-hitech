# QA baseline

## Executed in this environment

| Gate | Result |
|---|---|
| `pnpm install --frozen-lockfile` | PASS |
| `pnpm run typecheck` (strict, no suppressions) | PASS |
| `pnpm run lint` (`--max-warnings 0`) | PASS |
| `pnpm run test` | **39/39 PASS** |
| `pnpm run build` | PASS — 71 modules, 6 JS chunks |
| `verify-build.mjs` | **7/7 PASS** |

Test breakdown: 10 anti-reversion, 8 content integrity, 21 UI behaviour
(routing, deep links, unknown routes, landmarks, skip link, keyboard, mobile
menu ARIA, Tamil rendering, truthful states, search including zero-result,
practice counter).

## Written but NOT executed here

Playwright's browser CDN is outside this container's network allowlist, so
`chromium` could not be downloaded. `tests/e2e/*.spec.ts` and
`playwright.config.ts` are complete and wired into CI, but **have not been run**.

Unproven until they execute in CI:

- axe/WCAG 2.1 AA scans
- viewports 320 / 390 / 768 / 1440
- real focus-ring visibility and 44px target measurement
- reduced-motion computed styles
- offline behaviour, service-worker activation and cache eviction
- legacy endpoints returning 404 from a real server
- Lighthouse performance, LCP / INP / CLS

## Performance — measured statically only

Initial payload for `/` (gzip): vendor 62.8 kB + app 11.9 kB + CSS 2.7 kB
≈ **77 kB**. The 295 kB temple corpus (10.6 kB gzip) is code-split and is *not*
modulepreloaded on the home route; it loads only on temple and search routes.

No hero raster image is shipped — the Vel is inline SVG geometry. Fonts load
via `display=swap` with a real fallback stack.

Lab scores are **not claimed**: no Lighthouse run has happened.
