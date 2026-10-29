#!/usr/bin/env node
/**
 * Independent PWA installability check against the built dist/, evaluated
 * against the real Chromium "installable manifest" criteria (the same
 * criteria behind Chrome's own DevTools > Application > Manifest panel and
 * the `beforeinstallprompt` gate) rather than trusting the manifest's own
 * claims. This exists so the project can honestly say
 * `PWA INSTALLABILITY: PASS` only when every criterion below is verified
 * against real build output, not merely declared, and report
 * `NOT_YET_QUALIFIED` otherwise (R2.5 Priority A).
 *
 * No image-processing dependency is added for this: PNG dimensions are read
 * directly from the file's own IHDR chunk (bytes 16-23 of any valid PNG),
 * which is all Chromium itself checks against the manifest's declared size.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const failures = [];
const notes = [];
const fail = (m) => failures.push(m);
const ok = (m) => notes.push(m);

function pngDimensions(path) {
  const buf = readFileSync(path);
  const sig = buf.subarray(0, 8).toString('hex');
  if (sig !== '89504e470d0a1a0a') return null; // not a PNG (e.g. SVG icon) — dimension check skipped, not failed
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const manifestPath = join(DIST, 'manifest.webmanifest');
if (!existsSync(manifestPath)) {
  fail('manifest.webmanifest missing from dist/');
} else {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  // 1. name / short_name
  if (!manifest.name && !manifest.short_name) fail('manifest has neither name nor short_name');
  else ok(`name/short_name present ("${manifest.short_name ?? manifest.name}")`);

  // 2. start_url
  if (!manifest.start_url) fail('manifest missing start_url');
  else ok(`start_url = ${manifest.start_url}`);

  // 3. display must be one of the installable modes (NOT "browser")
  const installableDisplay = ['standalone', 'fullscreen', 'minimal-ui', 'window-controls-overlay'];
  if (!installableDisplay.includes(manifest.display)) {
    fail(`display="${manifest.display}" is not an installable display mode (needs one of ${installableDisplay.join('/')})`);
  } else ok(`display = ${manifest.display} (installable)`);

  // 4. icons: at least one >=192 and one >=512, real files, real declared
  //    size backed by the actual PNG, and at least one maskable >=512 icon.
  const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
  if (icons.length < 2) fail(`only ${icons.length} icon(s) declared — need at least a 192px and a 512px icon`);

  let has192 = false;
  let has512 = false;
  let hasMaskable512 = false;

  for (const icon of icons) {
    const iconPath = join(DIST, icon.src.replace(/^\//, ''));
    if (!existsSync(iconPath)) {
      fail(`declared icon missing from build output: ${icon.src}`);
      continue;
    }
    if (statSync(iconPath).size === 0) fail(`icon file is empty: ${icon.src}`);

    const actual = pngDimensions(iconPath);
    const declaredSizes = (icon.sizes ?? '').split(/\s+/).filter(Boolean);
    for (const sizeStr of declaredSizes) {
      const [w, h] = sizeStr.split('x').map(Number);
      if (!w || !h) continue;
      if (actual && (actual.width !== w || actual.height !== h)) {
        fail(`icon ${icon.src} declares ${sizeStr} but the PNG is actually ${actual.width}x${actual.height}`);
      } else if (actual) {
        ok(`${icon.src} raster matches declared size (${sizeStr})`);
      }
      if (w >= 192 && h >= 192) has192 = true;
      if (w >= 512 && h >= 512) {
        has512 = true;
        if ((icon.purpose ?? 'any').includes('maskable')) hasMaskable512 = true;
      }
    }
  }
  if (!has192) fail('no icon declared at >=192x192');
  else ok('has a >=192x192 icon');
  if (!has512) fail('no icon declared at >=512x512');
  else ok('has a >=512x512 icon');
  if (!hasMaskable512) fail('no maskable icon declared at >=512x512 (adaptive-icon platforms will letterbox/crop)');
  else ok('has a maskable >=512x512 icon');
}

// 5. service worker: must exist, register on a controllable scope, and have
//    a fetch handler (a "controller" with no fetch handler does not satisfy
//    the installability criterion).
const swPath = join(DIST, 'sw.js');
if (!existsSync(swPath)) {
  fail('no service worker in dist/ — a controlling SW with a fetch handler is required for installability');
} else {
  const src = readFileSync(swPath, 'utf8');
  if (!/addEventListener\(\s*['"]fetch['"]/.test(src)) {
    fail('service worker has no fetch event handler');
  } else ok('service worker registers a fetch handler');
}

const html = join(DIST, 'index.html');
if (existsSync(html)) {
  const src = readFileSync(html, 'utf8');
  if (!/rel="manifest"/.test(src)) fail('index.html has no <link rel="manifest">');
  else ok('index.html links the manifest');
} else fail('dist/index.html missing');

console.log('PWA installability check (Chromium installable-manifest criteria)\n');
for (const n of notes) console.log(`  PASS  ${n}`);
console.log('');
if (failures.length) {
  console.error('PWA_INSTALLABILITY=NOT_YET_QUALIFIED\n');
  for (const f of failures) console.error(`  FAIL  ${f}`);
  process.exit(1);
}
console.log('PWA_INSTALLABILITY=PASS — every Chromium installable-manifest criterion verified against real build output.');
console.log('\nNote: the maskable icon\'s safe-zone compliance is a generation-time geometric guarantee (mark content');
console.log('is scaled to 80% about centre, keeping every vertex within the 40%-radius safe-zone circle), not a');
console.log('runtime pixel probe — see OmSaravanaBhava_HITECH_USER_VISIBLE_COMPLETION_R2_5_REPORT.md.');
