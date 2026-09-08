/**
 * anti-reversion-build-test
 *
 * This suite exists because of a specific, proven failure mode.
 *
 * The hash-verified Manus R6 archive ships a complete legacy vanilla-JS website
 * inside `client/public/` (82 HTML pages, a 151 KB `app.js`, and a service
 * worker using cache `osb-r5-contract-v3-v1`). R6's own `index.html` loads that
 * legacy bundle and never loads a module entry, so `pnpm run build` emitted
 * "1 modules transformed", zero JS chunks, and a `dist/` that WAS the old site.
 *
 * That is how every previous migration "reverted". These tests make a repeat
 * structurally impossible: if a future developer copies R6's client/public back
 * into this repository, or re-points index.html at a legacy bundle, the build
 * fails here rather than silently shipping the old website.
 *
 * Do not relax these assertions to make CI pass.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const ROOT = process.cwd();

/** Filenames that only ever existed in the legacy vanilla renderer. */
const LEGACY_RUNTIME_FILES = [
  'app.js',
  'rc1.js',
  'rc2.js',
  'rc1.css',
  'rc2.css',
  'styles.css',
  'route-alias-guard.js',
  'locale-bootstrap.js',
  'locale-runtime-guard.js',
];

/** Cache namespaces used by the legacy site. Never reuse these. */
const LEGACY_CACHE_NAMESPACES = [
  'osb-r5-contract-v3-v1',
  'osb-r5-',
  'osb-phase2v-',
];

const BANNED_PROJECTS = [
  'KirthiVerse',
  'RamaVerse',
  'DivyaNexus',
  'SakthiAI',
  'SaravanAI',
];

const walk = (dir: string, acc: string[] = []): string[] => {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git') continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
};

const isLegacyPhaseScript = (file: string) => /^phase2[a-z]\.js$/i.test(basename(file));

describe('anti-reversion: source tree', () => {
  const sourceFiles = [
    ...walk(join(ROOT, 'src')),
    ...walk(join(ROOT, 'public')),
  ];

  it('contains no legacy vanilla runtime files', () => {
    const hits = sourceFiles.filter(
      (f) => LEGACY_RUNTIME_FILES.includes(basename(f)) || isLegacyPhaseScript(f),
    );
    expect(hits, `legacy runtime files found: ${hits.join(', ')}`).toEqual([]);
  });

  it('does not carry the legacy multi-page HTML corpus', () => {
    // The legacy site was 82 standalone .html files under public/.
    // This application is a single-page app: public/ holds no HTML at all.
    const html = walk(join(ROOT, 'public')).filter((f) => extname(f) === '.html');
    expect(html, `unexpected HTML in public/: ${html.join(', ')}`).toEqual([]);
  });

  it('index.html loads a module entry and mounts #root', () => {
    const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
    expect(html).toMatch(/<script[^>]+type="module"[^>]+src="\/src\/main\.tsx"/);
    expect(html).toContain('id="root"');
  });

  it('index.html does not load any legacy bundle', () => {
    const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
    for (const f of LEGACY_RUNTIME_FILES) {
      expect(html, `index.html references legacy ${f}`).not.toContain(`/${f}`);
    }
    expect(html).not.toMatch(/phase2[a-z]\.js/i);
    // The legacy shell mounted into #app, not #root.
    expect(html).not.toMatch(/id="app"/);
  });

  it('service worker uses a product-specific namespace, never a legacy one', () => {
    // Note: the worker is *allowed* to name legacy prefixes inside its own
    // activation-cleanup list (`SUPERSEDED_PREFIXES`) — it has to know what
    // to delete. What it must never do is declare or write to a cache whose
    // own name starts with a legacy prefix. A blanket "the string must not
    // appear anywhere" assertion previously failed on the worker's own
    // (correct) cleanup logic, which is a false positive, not a real defect.
    const sw = readFileSync(join(ROOT, 'public', 'sw.js'), 'utf8');

    const ownCacheDeclarations = [...sw.matchAll(/const CACHE\s*=\s*'([^']+)'/g)].map((m) => m[1]);
    expect(ownCacheDeclarations.length, 'no `const CACHE = ...` declaration found').toBeGreaterThan(0);
    for (const name of ownCacheDeclarations) {
      for (const ns of LEGACY_CACHE_NAMESPACES) {
        expect(name, `own cache name "${name}" reuses legacy namespace ${ns}`).not.toContain(ns);
      }
    }

    // caches.open()/caches.put() may only ever be called with the CACHE
    // constant or a request object — never a legacy literal.
    const writes = [...sw.matchAll(/caches\.(?:open|put)\(\s*'([^']+)'/g)].map((m) => m[1]);
    for (const literal of writes) {
      for (const ns of LEGACY_CACHE_NAMESPACES) {
        expect(literal, `caches.open/put uses legacy literal "${literal}"`).not.toContain(ns);
      }
    }

    expect(sw).toContain('omsaravanabhava-hitech');
  });



  it('service worker only caches a successful HTML navigation shell', () => {
    const sw = readFileSync(join(ROOT, 'public', 'sw.js'), 'utf8');
    expect(sw).toContain('response.ok');
    expect(sw).toMatch(/content-type/i);
    expect(sw).toMatch(/text\/html/i);
  });

  it('has no cross-project contamination', () => {
    const textFiles = sourceFiles.filter((f) =>
      ['.ts', '.tsx', '.js', '.css', '.json', '.html', '.webmanifest'].includes(
        extname(f),
      ),
    );
    const hits: string[] = [];
    for (const f of textFiles) {
      const src = readFileSync(f, 'utf8');
      for (const p of BANNED_PROJECTS) if (src.includes(p)) hits.push(`${p} in ${f}`);
    }
    expect(hits).toEqual([]);
  });
});

describe('anti-reversion: build output', () => {
  const DIST = join(ROOT, 'dist');
  const built = existsSync(DIST);
  const distFiles = built ? walk(DIST) : [];

  it.skipIf(!built)('emits real hashed JS bundles', () => {
    // R6 built "successfully" while emitting zero JS. A genuine build of this
    // application must produce hashed chunks under dist/assets.
    const chunks = distFiles.filter(
      (f) => f.includes(`${'assets'}`) && extname(f) === '.js',
    );
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.some((f) => /-[A-Za-z0-9_-]{8,}\.js$/.test(f))).toBe(true);
  });

  it.skipIf(!built)('emits a single HTML entry, not a page corpus', () => {
    const html = distFiles.filter((f) => extname(f) === '.html');
    expect(html.length).toBeLessThanOrEqual(3);
  });

  it.skipIf(!built)('contains no legacy runtime artefacts', () => {
    const hits = distFiles.filter(
      (f) => LEGACY_RUNTIME_FILES.includes(basename(f)) || isLegacyPhaseScript(f),
    );
    expect(hits, `legacy artefacts in dist/: ${hits.join(', ')}`).toEqual([]);
  });

  it.skipIf(!built)('release marker identifies the correct repository', () => {
    const rel = JSON.parse(readFileSync(join(DIST, 'release.json'), 'utf8'));
    expect(rel.repository).toBe('ssakthivel02/omsaravanabhava-hitech');
    expect(rel.sourceAuthority.sha256).toBe(
      '3477dd375e9545bd51482f9cacabe851adc6a841cdf111ffd5eb408f76c26585',
    );
    expect(rel.buildTimestamp).toBeTruthy();
    expect(rel.environment).toBeTruthy();
  });
});
