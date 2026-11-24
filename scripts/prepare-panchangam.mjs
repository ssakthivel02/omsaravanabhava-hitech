import { readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { resolve, dirname, basename, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { prepareDailyPanchangam } from '../src/features/panchangam/validation.ts';

// Explicit local input and output only; no network or scheduled execution.
const [input, output, ...extra] = process.argv.slice(2);
if (!input || !output || extra.length || resolve(input) === resolve(output)) {
  throw new Error('Usage: prepare-panchangam <input.json> <output.json>');
}
let candidate;
try {
  candidate = JSON.parse(await readFile(input, 'utf8'));
} catch {
  // Missing or malformed input must never preserve unverified daily values.
  candidate = null;
}
const record = prepareDailyPanchangam(candidate);
const destination = resolve(output);
const temporary = join(dirname(destination), '.' + basename(destination) + '.' + randomUUID() + '.tmp');
try {
  await writeFile(temporary, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
  await rename(temporary, destination);
} finally {
  await unlink(temporary).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
}
console.log('Prepared Panchangam: ' + record.status + ' (' + record.date + ')');
