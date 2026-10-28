#!/usr/bin/env node
/** Fail-closed static audit of the R2.14 isolated preview release workflow. */
import { readFileSync } from 'node:fs';

const path = '.github/workflows/preview-manual-r214.yml';
const source = readFileSync(path, 'utf8');
const candidate = '9fa0a4d450f09f4cbc0eff3f8f4146c945e28028';
const failures = [];
function requireMatch(label, pattern) {
  if (!pattern.test(source)) failures.push(label);
}
function forbidMatch(label, pattern) {
  if (pattern.test(source)) failures.push(label);
}
requireMatch('manual dispatch only', /^on:\s*\n\s+workflow_dispatch:\s*$/m);
forbidMatch('no automatic push/PR/deployment trigger', /^\s+(?:push|pull_request|schedule|workflow_run):\s*$/m);
requireMatch('explicit confirmation input', /confirmation:\s*\n\s+description:/);
requireMatch('typed confirmation must fail closed', /DEPLOY_CONFIRMATION[^\n]*!= 'DEPLOY_R214_ISOLATED_PREVIEW'/);
requireMatch('pinned qualified code SHA', new RegExp('AUTHORITATIVE_R2_14_SHA: '+candidate));
requireMatch('checkout immutable SHA', new RegExp('ref: '+candidate));
requireMatch('verify actual checkout SHA', /git rev-parse HEAD/);
requireMatch('detached checkout check', /git rev-parse --abbrev-ref HEAD/);
requireMatch('expected repository check', /ssakthivel02\/omsaravanabhava-hitech/);
requireMatch('Cloudflare authentication check', /Workers Scripts API preflight/);
requireMatch('static asset identity verification', /Verify sacred hero assets reached dist/);
requireMatch('source quality gates', /pnpm run typecheck[\s\S]*pnpm run lint[\s\S]*pnpm run test[\s\S]*pnpm run scan:contamination/);
requireMatch('preview environment build', /DEPLOY_ENV=preview pnpm run build/);
requireMatch('verify immutable release identity', /release\.commit !== sha \|\| release\.branch !== branch \|\| release\.environment !== 'preview'/);
requireMatch('verify PWA assets', /check-pwa-installability\.mjs/);
requireMatch('verify isolated worker', /omsaravanabhava-hitech-preview/);
requireMatch('reject production-domain bindings', /Assert preview config cannot bind production domain/);
requireMatch('preview-only Wrangler config', /wrangler@4\.129\.0 deploy --config wrangler\.preview\.jsonc/);
forbidMatch('no production Wrangler configuration', /wrangler(?:\.production)?\.jsonc/);
if (failures.length) {
  for (const failure of failures) console.error('FAIL: '+failure);
  process.exit(1);
}
console.log('R2.14 isolated preview launcher static gate: PASS ('+candidate+')');
