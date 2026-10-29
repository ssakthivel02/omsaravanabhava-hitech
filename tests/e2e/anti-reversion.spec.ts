import { test, expect } from '@playwright/test';

/** Runtime half of anti-reversion: what the served application actually is. */
test('release marker identifies the new repository', async ({ request }) => {
  const res = await request.get('/release.json');
  expect(res.ok()).toBeTruthy();
  const rel = await res.json();
  expect(rel.repository).toBe('ssakthivel02/omsaravanabhava-hitech');
  expect(rel.sourceAuthority.sha256).toBe(
    '3477dd375e9545bd51482f9cacabe851adc6a841cdf111ffd5eb408f76c26585',
  );
  expect(rel.cacheNamespace).toContain('omsaravanabhava-hitech');
});

test('legacy shell endpoints are not served', async ({ request }) => {
  // The deployment target (Cloudflare, `not_found_handling:
  // "single-page-application"`, matching `vite preview`'s own default
  // `appType: 'spa'` behaviour used here) intentionally answers ANY unmatched
  // path with the SPA shell (200) rather than a bare server 404 — that SPA
  // fallback is what makes a direct refresh on a deep React route work at
  // all. So a literal `expect(status).toBe(404)` is the wrong assertion for
  // this platform: it would fail even on a correctly-configured server. What
  // actually matters is that these paths never serve real legacy JS/CSS —
  // they get the SPA's own HTML shell like any other unknown path.
  for (const path of ['/app.js', '/rc1.js', '/rc2.js', '/phase2v.js', '/styles.css']) {
    const res = await request.get(path);
    const contentType = res.headers()['content-type'] ?? '';
    expect(contentType, `${path} served as ${contentType}, not the SPA HTML shell`).toMatch(/text\/html/);
    const body = await res.text();
    expect(body, `${path} response body loads a classic (non-module) script`).not.toMatch(
      /<script(?![^>]*type="module")[^>]*src=/,
    );
  }
});

test('legacy page corpus is not served as static HTML', async ({ page }) => {
  // The SPA answers unknown paths with its own not-found view, not a legacy page.
  await page.goto('/murugan-song-library.html');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    /காணப்படவில்லை/,
  );
});

test('service worker registers and becomes ready under the product namespace', async ({ page }) => {
  // R2-CODE-011: the previous test swallowed a failed/absent registration
  // with `.catch(() => {})` and could pass having proven nothing. A
  // SW-specific test must fail if the worker never registers.
  await page.goto('/');
  const registration = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    return { scriptURL: reg.active?.scriptURL ?? null };
  });
  expect(registration.scriptURL, 'service worker never became ready').toContain('/sw.js');

  const keys = await page.evaluate(() => caches.keys());
  for (const k of keys) {
    expect(k.startsWith('omsaravanabhava-hitech-'), `unexpected cache ${k}`).toBe(true);
  }
});

test('a legacy cache present before activation is evicted, not just left alone', async ({ page, context }) => {
  // R2-CODE-010: seeding the legacy cache AFTER the candidate worker was
  // already active and then reloading proves nothing, because a reload does
  // not re-run `activate` on an already-active worker. This seeds the
  // legacy cache before the candidate worker ever registers, so the
  // assertion actually exercises the migration/cleanup path in `activate`.
  await page.goto('/');
  await page.evaluate(async () => {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await caches.open('osb-r5-contract-v3-v1');
  });

  // A fresh navigation with no controlling worker registers the candidate
  // worker for the first time, which runs `install` then `activate`.
  await context.clearCookies();
  await page.reload();
  await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.register('/sw.js');
    // `reg.installing` is already set by the time `register()` resolves if a
    // new worker is installing, so waiting on the `updatefound` event here
    // is a race — it can (and did) fire before this code attaches a
    // listener. Read the in-flight worker directly instead.
    const worker = reg.installing ?? reg.waiting ?? reg.active;
    if (worker && worker.state !== 'activated') {
      await new Promise<void>((resolve) => {
        worker.addEventListener('statechange', () => {
          if (worker.state === 'activated') resolve();
        });
      });
    }
  });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, {
    timeout: 15_000,
  });

  const keys = await page.evaluate(() => caches.keys());
  expect(keys).not.toContain('osb-r5-contract-v3-v1');
  expect(keys.every((k) => k.startsWith('omsaravanabhava-hitech-'))).toBe(true);
});

test('a new release is served rather than a cached shell', async ({ page }) => {
  await page.goto('/');
  await page.reload();                      // second visit, SW active
  const marker = await page.evaluate(async () => {
    const r = await fetch('/release.json', { cache: 'no-store' });
    return (await r.json()).repository;
  });
  expect(marker).toBe('ssakthivel02/omsaravanabhava-hitech');
});


test('offline navigation falls back to the last known-good shell', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await context.setOffline(false);
});

test('preview crawler controls are non-indexable in CI build', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain('Disallow: /');
});
