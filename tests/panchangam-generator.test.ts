import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { PANCHANGAM_FIELDS } from '../src/features/panchangam/validation';

describe('Panchangam local JSON generator', () => {
  let dir: string | undefined;
  beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'osb-panchangam-')); });
  afterEach(() => { if (dir) rmSync(dir, { recursive: true, force: true }); });
  const run = (input: string, output: string) => spawnSync(process.execPath, [
    '--experimental-strip-types', resolve('scripts/prepare-panchangam.mjs'), input, output,
  ], { encoding: 'utf8', timeout: 10000 });
  it('replaces existing output with clean pending JSON for malformed input', () => {
    const input = join(dir!, 'input.json');
    const output = join(dir!, 'output.json');
    writeFileSync(input, '{');
    writeFileSync(output, '{"old":true}');
    const result = run(input, output);
    expect(result.status, result.stderr).toBe(0);
    const record = JSON.parse(readFileSync(output, 'utf8'));
    expect(record.status).toBe('pending');
    expect(record.fields).toEqual(Object.fromEntries(PANCHANGAM_FIELDS.map(key => [key, null])));
    expect(record.fieldEvidence).toEqual({});
    expect(readdirSync(dir!).sort()).toEqual(['input.json', 'output.json']);
  });
  it('fails closed for missing input', () => {
    const output = join(dir!, 'output.json');
    expect(run(join(dir!, 'missing.json'), output).status).toBe(0);
    expect(JSON.parse(readFileSync(output, 'utf8')).status).toBe('pending');
  });
  it('rejects identical input and output without modifying input', () => {
    const input = join(dir!, 'input.json');
    writeFileSync(input, '{}');
    expect(run(input, input).status).not.toBe(0);
    expect(readFileSync(input, 'utf8')).toBe('{}');
  });
  it('cleans temporary files when rename fails', () => {
    const input = join(dir!, 'input.json');
    const output = join(dir!, 'output');
    writeFileSync(input, '{}');
    mkdirSync(output);
    expect(run(input, output).status).not.toBe(0);
    expect(readdirSync(dir!).sort()).toEqual(['input.json', 'output']);
  });
});
