#!/usr/bin/env node
/** Fail if another user project leaks into runtime source or public assets. */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { extname, join } from 'node:path';

const BANNED = ['KirthiVerse', 'RamaVerse', 'DivyaNexus', 'SakthiAI', 'SaravanAI'];
const ROOTS = ['src', 'public'];
const EXTRA = ['index.html', 'vite.config.ts', 'playwright.config.ts'];
const TEXT = new Set(['.ts', '.tsx', '.js', '.css', '.json', '.html', '.webmanifest', '.txt', '.xml']);
const files = [];

function walk(path) {
  if (!existsSync(path)) return;
  const st = statSync(path);
  if (st.isDirectory()) {
    for (const e of readdirSync(path)) walk(join(path, e));
  } else if (TEXT.has(extname(path)) || path.endsWith('_headers')) files.push(path);
}
for (const root of ROOTS) walk(root);
for (const file of EXTRA) if (existsSync(file)) files.push(file);

const hits = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const term of BANNED) if (text.includes(term)) hits.push(`${term} in ${file}`);
}
if (hits.length) {
  console.error('CROSS_PROJECT_CONTAMINATION=FAIL');
  hits.forEach((h) => console.error(h));
  process.exit(1);
}
console.log(`CROSS_PROJECT_CONTAMINATION=PASS files=${files.length}`);
