/*
 * OmSaravanaBhava hi-tech service worker.
 *
 * New product-specific cache namespace. Navigation is network-first and only
 * a successful HTML document can replace the last known-good offline shell.
 */
const CACHE = 'omsaravanabhava-hitech-v1-shell';
const OWNED_PREFIX = 'omsaravanabhava-hitech-';

// Known cache prefixes from superseded OmSaravanaBhava deployments only.
const SUPERSEDED_PREFIXES = ['osb-r5-', 'osb-phase2v-', 'osb-contract-v3-'];

const PRECACHE = ['/index.html', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE)
            .filter(
              (key) =>
                key.startsWith(OWNED_PREFIX) ||
                SUPERSEDED_PREFIXES.some((prefix) => key.startsWith(prefix)),
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

const isSuccessfulHtml = (response) => {
  if (!response || !response.ok) return false;
  const contentType = response.headers.get('content-type') ?? '';
  return contentType.toLowerCase().includes('text/html');
};

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation: network first. Only a good HTML response can refresh the
  // offline shell; 4xx/5xx/non-HTML responses are never cached as index.html.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (isSuccessfulHtml(response)) {
            const cache = await caches.open(CACHE);
            await cache.put('/index.html', response.clone());
          }
          return response;
        })
        .catch(async () => {
          const fallback = await caches.match('/index.html');
          return fallback ?? new Response('Offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        }),
    );
    return;
  }

  // Vite fingerprinted assets are immutable, so cache-first is safe here.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then(async (response) => {
            if (response.ok) {
              const cache = await caches.open(CACHE);
              await cache.put(request, response.clone());
            }
            return response;
          }),
      ),
    );
  }
});
