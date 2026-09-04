#!/usr/bin/env node
/**
 * Fail-closed post-build gate. This is the control that makes silent reversion
 * to the legacy website impossible.
 *
 * Every check here corresponds to a real observed failure mode in the R6
 * archive, not a hypothetical one. See docs/PHASE0_RECOVERY_REPORT.md.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = 'dist';
const REPOSITORY = 'ssakthivel02/omsaravanabhava-hitech';

const failures = [];
const fail = (m) => failures.push(m);
const ok = (m) => console.log(`  PASS  ${m}`);

const walk = (dir, acc = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
};

if (!existsSync(DIST)) {
  console.error('FATAL: no dist/ — build did not run');
  process.exit(1);
}

const files = walk(DIST);
console.log(`verify-build: ${files.length} files in dist/\n`);

// 1 ---------------------------------------------------- release marker present
const rp = join(DIST, 'release.json');
if (!existsSync(rp)) {
  fail('release.json missing from build output');
} else {
  const rel = JSON.parse(readFileSync(rp, 'utf8'));
  if (rel.repository !== REPOSITORY) {
    fail(`release.json repository is "${rel.repository}", expected "${REPOSITORY}"`);
  } else ok(`release marker repository = ${REPOSITORY}`);
  for (const k of ['commit', 'buildTimestamp', 'version', 'environment', 'sourceAuthority']) {
    if (!rel[k]) fail(`release.json missing required field: ${k}`);
  }
  if (['ci', 'preview', 'production'].includes(rel.environment) && rel.commit === 'UNCOMMITTED') {
    fail(`${rel.environment} build from uncommitted tree`);
  }
  if (rel.sourceAuthority?.role !== 'governed-data-and-provenance-only') {
    fail('release marker does not demote R6 to governed data/provenance only');
  }
  if (rel.sourceAuthority?.legacyApplicationShellAuthorized !== false) {
    fail('release marker does not explicitly reject the R6 legacy application shell');
  }
  // R2Q-001: release identity must be the exact GitHub Actions SHA whenever
  // this build runs under GitHub Actions — never a stale/local/sandbox SHA.
  if (process.env.GITHUB_SHA && rel.commit !== process.env.GITHUB_SHA) {
    fail(`release.json.commit "${rel.commit}" does not equal GITHUB_SHA "${process.env.GITHUB_SHA}"`);
  } else if (process.env.GITHUB_SHA) {
    ok(`release.json.commit === GITHUB_SHA (${process.env.GITHUB_SHA.slice(0, 8)})`);
  }
}

// 2 ------------------------------------------- legacy shell must not be present
// These are the exact filenames the legacy vanilla site shipped. Their presence
// in dist/ means the old website has been packaged again.
const LEGACY = ['app.js', 'rc1.js', 'rc2.js', 'rc1.css', 'rc2.css', 'styles.css',
  'route-alias-guard.js', 'locale-bootstrap.js', 'locale-runtime-guard.js'];
const legacyHits = files.filter((f) => {
  const base = f.split('/').pop();
  return LEGACY.includes(base) || /^phase2[a-z]\.js$/.test(base ?? '');
});
if (legacyHits.length) fail(`legacy shell artefacts in dist/: ${legacyHits.join(', ')}`);
else ok('no legacy shell artefacts (app.js / rc*.js / phase2*.js)');

// 3 -------------------------------------------- legacy cache namespace banned
//
// The worker is allowed to NAME legacy prefixes inside its own activation
// cleanup list (it has to know what to delete) — see public/sw.js
// `SUPERSEDED_PREFIXES`. What it must never do is declare or write to a
// cache whose own name starts with a legacy prefix. A blanket "the string
// must not appear anywhere in the file" check flags the worker's own
// (correct) cleanup logic as a false failure — this was itself a defect
// found while qualifying R2, in the same family as R2-CODE-010/011.
const sw = join(DIST, 'sw.js');
if (existsSync(sw)) {
  const src = readFileSync(sw, 'utf8');
  const legacyNs = ['osb-r5', 'osb-phase2v', 'contract-v3-v1'];
  const ownCacheNames = [...src.matchAll(/const CACHE\s*=\s*'([^']+)'/g)].map((m) => m[1]);
  const writeLiterals = [...src.matchAll(/caches\.(?:open|put)\(\s*'([^']+)'/g)].map((m) => m[1]);
  const namesToCheck = [...ownCacheNames, ...writeLiterals];
  const usesLegacy = namesToCheck.some((name) => legacyNs.some((n) => name.includes(n)));
  const declares = ownCacheNames.some((name) => name.startsWith('omsaravanabhava-hitech-v1-'));
  if (ownCacheNames.length === 0) fail('service worker has no `const CACHE = ...` declaration');
  else if (usesLegacy) fail(`service worker's own cache name reuses a superseded namespace: ${namesToCheck.join(', ')}`);
  else if (!declares) fail('service worker does not declare the hi-tech namespace');
  else ok('service worker namespace = omsaravanabhava-hitech-v1-*');
} else ok('no service worker in output (acceptable)');

// 4 ---------------------------------- the app must actually be a bundled SPA
// R6 "built" successfully while transforming 1 module and emitting zero JS.
// A real build of this app emits hashed JS chunks; assert that.
const jsChunks = files.filter((f) => f.includes('/assets/') && extname(f) === '.js');
if (jsChunks.length === 0) {
  fail('no JS chunks emitted — the React entry is not wired into index.html');
} else ok(`${jsChunks.length} JS chunk(s) emitted`);

const html = join(DIST, 'index.html');
if (existsSync(html)) {
  const src = readFileSync(html, 'utf8');
  if (!/<script[^>]+type="module"/.test(src)) {
    fail('dist/index.html has no module script — legacy entry pattern');
  } else ok('index.html loads a module entry');
  if (!/id="root"/.test(src)) fail('dist/index.html missing #root mount point');
  if (/src="\/app\.js"/.test(src)) fail('dist/index.html loads legacy /app.js');
}

// 5 ------------------------------------------- stray legacy HTML page dump
// The legacy site was 82 standalone .html files. A real SPA emits one.
const htmlFiles = files.filter((f) => extname(f) === '.html');
if (htmlFiles.length > 3) {
  fail(`${htmlFiles.length} .html files in dist/ — legacy multi-page site suspected`);
} else ok(`${htmlFiles.length} .html file(s) — SPA shape`);

// 6 -------------------------------------------- cross-project contamination
const BANNED = ['KirthiVerse', 'RamaVerse', 'DivyaNexus', 'SakthiAI', 'SaravanAI'];
const textExt = new Set(['.js', '.css', '.html', '.json', '.webmanifest', '.txt']);
const contaminated = [];
for (const f of files) {
  if (!textExt.has(extname(f))) continue;
  const src = readFileSync(f, 'utf8');
  for (const b of BANNED) if (src.includes(b)) contaminated.push(`${b} in ${f}`);
}
if (contaminated.length) fail(`cross-project contamination: ${contaminated.join(', ')}`);
else ok('no cross-project contamination');

// 7 ---------------------------------------- preview crawler / PWA truthfulness
if (existsSync(rp)) {
  const rel = JSON.parse(readFileSync(rp, 'utf8'));
  const robotsPath = join(DIST, 'robots.txt');
  const headersPath = join(DIST, '_headers');
  if (rel.environment !== 'production') {
    if (!existsSync(robotsPath) || !/Disallow:\s*\//.test(readFileSync(robotsPath, 'utf8'))) {
      fail('non-production build is not blocked by robots.txt');
    } else ok('non-production robots.txt = disallow all');
    if (!existsSync(headersPath) || !/X-Robots-Tag:\s*noindex/i.test(readFileSync(headersPath, 'utf8'))) {
      fail('non-production build lacks X-Robots-Tag noindex');
    } else ok('non-production X-Robots-Tag = noindex');

    // release/SECURITY_HEADERS_POLICY_V1.json: preview must ship CSP as
    // Report-Only (not yet enforced) with the documented minimum directives.
    const headersSrc = existsSync(headersPath) ? readFileSync(headersPath, 'utf8') : '';
    if (!/Content-Security-Policy-Report-Only:/i.test(headersSrc)) {
      fail('non-production build lacks Content-Security-Policy-Report-Only header');
    } else if (/^\s*Content-Security-Policy:/im.test(headersSrc)) {
      fail('non-production build enforces CSP outright — policy requires report-only until preview is green');
    } else ok('non-production CSP = report-only');
    if (/geolocation=\(self\)/.test(headersSrc)) {
      fail('Permissions-Policy grants geolocation=(self) with no functional geolocation feature in the app');
    } else ok('Permissions-Policy geolocation = ()');
  } else {
    // R2Q-004: production must ship CSP enforced, never silently absent.
    const headersSrc = existsSync(headersPath) ? readFileSync(headersPath, 'utf8') : '';
    if (!/^\s*Content-Security-Policy:/im.test(headersSrc)) {
      fail('production build has no enforced Content-Security-Policy header');
    } else ok('production CSP = enforced');
    if (/geolocation=\(self\)/.test(headersSrc)) {
      fail('Permissions-Policy grants geolocation=(self) with no functional geolocation feature in the app');
    } else ok('Permissions-Policy geolocation = ()');
  }
}

const manifestPath = join(DIST, 'manifest.webmanifest');
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.display === 'standalone' && (!Array.isArray(manifest.icons) || manifest.icons.length < 2)) {
    fail('manifest claims standalone installability without governed app icons');
  } else ok('PWA manifest does not overclaim installability');
}

// Service worker must not turn a failed/non-HTML navigation response into the offline shell.
if (existsSync(sw)) {
  const src = readFileSync(sw, 'utf8');
  if (!/response\.ok/.test(src) || !/content-type/i.test(src) || !/text\/html/i.test(src)) {
    fail('service worker lacks successful-HTML guard before shell caching');
  } else ok('service worker caches only successful HTML navigation shell');
}

// ------------------------------------------------------------------- verdict
console.log('');
if (failures.length) {
  console.error('BUILD VERIFICATION FAILED\n');
  for (const f of failures) console.error(`  FAIL  ${f}`);
  console.error(`\n${failures.length} blocking failure(s).`);
  process.exit(1);
}
console.log('BUILD VERIFICATION PASSED — artifact is the hi-tech application.');
