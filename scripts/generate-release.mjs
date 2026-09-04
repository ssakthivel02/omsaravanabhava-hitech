#!/usr/bin/env node
/** Build-time machine-readable release identity. */
import { writeFileSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const EXPECTED_REPOSITORY = 'ssakthivel02/omsaravanabhava-hitech';
const runtimeRepository = process.env.GITHUB_REPOSITORY ?? EXPECTED_REPOSITORY;
if (runtimeRepository !== EXPECTED_REPOSITORY) {
  throw new Error(`Wrong build repository: ${runtimeRepository}`);
}

const SOURCE_AUTHORITY = {
  archive: 'OmSaravanaBhava_R6_FINAL_MANUS_MASTER_SOURCE.zip',
  sha256: '3477dd375e9545bd51482f9cacabe851adc6a841cdf111ffd5eb408f76c26585',
  verified: true,
  role: 'governed-data-and-provenance-only',
  legacyApplicationShellAuthorized: false,
};

const git = (cmd, fallback) => {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return fallback;
  }
};

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const environment = process.env.DEPLOY_ENV ?? 'development';
const commit = process.env.GITHUB_SHA ?? git('git rev-parse HEAD', 'UNCOMMITTED');
const branch = process.env.GITHUB_REF_NAME ?? git('git rev-parse --abbrev-ref HEAD', 'unknown');

if (['ci', 'preview', 'production'].includes(environment) && commit === 'UNCOMMITTED') {
  throw new Error(`${environment} release requires a real Git commit SHA`);
}

const release = {
  schemaVersion: 2,
  repository: EXPECTED_REPOSITORY,
  commit,
  branch,
  version: pkg.version,
  buildTimestamp: new Date().toISOString(),
  environment,
  sourceAuthority: SOURCE_AUTHORITY,
  application: 'omsaravanabhava-hitech',
  cacheNamespace: 'omsaravanabhava-hitech-v1',
  pwaInstallability: 'NOT_YET_QUALIFIED',
  antiReversion: {
    legacyRuntimeAuthorized: false,
    exactRepositoryRequired: true,
  },
};

writeFileSync('public/release.json', JSON.stringify(release, null, 2) + '\n');
console.log(`release.json: ${release.repository}@${release.commit.slice(0, 8)} (${release.environment})`);
