#!/usr/bin/env node
/**
 * Fail-closed static audit of the production release workflow and its Wrangler
 * config. Pure function `auditProductionRelease` is unit-tested with negative
 * mutations in tests/production-release-gate.test.ts.
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const stripYamlComments = (s) => s.replace(/^\s*#.*$/gm, '');
const stripJsoncComments = (s) => s.replace(/^\s*\/\/.*$/gm, '');

export function auditProductionRelease(workflowSource, wranglerSource) {
  const wf = stripYamlComments(workflowSource);
  const wr = stripJsoncComments(wranglerSource);
  const failures = [];
  const need = (label, ok) => { if (!ok) failures.push(label); };
  const forbid = (label, bad) => { if (bad) failures.push(label); };

  // --- Trigger and kill-switch ---------------------------------------------
  need('manual dispatch only', /^on:\s*\n\s+workflow_dispatch:/m.test(wf));
  forbid('no automatic trigger (push/pull_request/schedule/workflow_run/workflow_call)',
    /^\s{0,4}(?:push|pull_request|pull_request_target|schedule|workflow_run|workflow_call|release|repository_dispatch):/m.test(wf));
  need('disabled by default via PRODUCTION_RELEASE_ENABLED',
    /if:\s*\$\{\{\s*vars\.PRODUCTION_RELEASE_ENABLED == 'true'\s*\}\}/.test(wf));
  need('deploy depends on verification job', /needs:\s*verify-request/.test(wf));
  need('deploy uses protected GitHub Environment', /environment:\s*production\b/.test(wf));
  need('least-privilege token permissions', /permissions:\s*\n\s+contents:\s*read\s*\n\s+actions:\s*read/.test(wf));
  forbid('no write permissions', /:\s*write\b/.test(wf));

  // --- Request validation --------------------------------------------------
  need('release_sha must be 40-hex', /\^\[0-9a-f\]\{40\}\$/.test(wf));
  need('confirmation bound to the exact SHA',
    /DEPLOY_PRODUCTION_\$\{RELEASE_SHA:0:12\}/.test(wf) && /"\$DEPLOY_CONFIRMATION" != "\$expected"/.test(wf));
  need('rollback target required', /rollback_sha:/.test(wf) && /FIRST_RELEASE/.test(wf));
  need('SHA must be an ancestor of main', /compare\/\$\{RELEASE_SHA\}\.\.\.main/.test(wf) && /identical\|ahead/.test(wf));
  need('exact-SHA successful CI required', /head_sha=\$\{RELEASE_SHA\}/.test(wf) && /conclusion == "success"/.test(wf));

  // --- Build and identity --------------------------------------------------
  need('checkout exact input SHA', /ref:\s*\$\{\{\s*inputs\.release_sha\s*\}\}/.test(wf));
  need('detached exact-SHA verification', /git rev-parse HEAD/.test(wf) && /git rev-parse --abbrev-ref HEAD/.test(wf));
  need('repository identity check', /ssakthivel02\/omsaravanabhava-hitech/.test(wf));
  need('frozen lockfile install', /pnpm install --frozen-lockfile/.test(wf));
  need('source quality gates',
    /pnpm run typecheck[\s\S]*pnpm run lint[\s\S]*pnpm run test[\s\S]*pnpm run scan:contamination/.test(wf));
  need('production-mode build', /DEPLOY_ENV=production pnpm run build/.test(wf));
  need('release identity verified',
    /release\.commit !== sha/.test(wf) && /release\.environment !== 'production'/.test(wf));
  need('robots/sitemap/headers verified', /dist\/robots\.txt/.test(wf) && /dist\/sitemap\.xml/.test(wf) && /dist\/_headers/.test(wf));
  need('PWA check', /check-pwa-installability\.mjs/.test(wf));
  need('legacy runtime rejected in dist', /osb-r5/.test(wf) && /phase2\*\.js/.test(wf));

  // --- Cloudflare isolation ------------------------------------------------
  need('deploys only the production Wrangler config',
    /wrangler@4\.129\.0 deploy --config wrangler\.production\.jsonc/.test(wf));
  forbid('never deploys the preview Wrangler config', /--config wrangler\.preview\.jsonc/.test(wf));
  forbid('workflow must not mention DNS/zone/route commands', /\b(?:dns|zone|routes?)\s+(?:add|create|update|put)\b/i.test(wf));
  need('config check rejects domain bindings', /domain\/route binding/.test(wf));
  need('deploy job runs tested Wrangler route guard',
    /node scripts\/verify-production-release-workflow\.mjs/.test(wf));

  need('production Worker name', /"name":\s*"omsaravanabhava-hitech"/.test(wr));
  forbid('production config must not name the preview Worker', /omsaravanabhava-hitech-preview/.test(wr));
  forbid('production config must not bind the root domain or routes',
    /omsaravanabhava\.org|custom_domain|zone_id|zone_name|"routes?"\s*:/i.test(wr));
  need('explicit dist directory', /"directory":\s*"\.\/dist"/.test(wr));
  need('single-page-app fallback', /"not_found_handling":\s*"single-page-application"/.test(wr));

  return failures;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const failures = auditProductionRelease(
    readFileSync('.github/workflows/production-release.yml', 'utf8'),
    readFileSync('wrangler.production.jsonc', 'utf8'),
  );
  if (failures.length) {
    for (const f of failures) console.error('FAIL: ' + f);
    process.exit(1);
  }
  console.log('Production release workflow static gate: PASS');
}
