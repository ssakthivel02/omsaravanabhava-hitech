import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
// @ts-expect-error plain .mjs script without type declarations
import { auditProductionRelease } from '../scripts/verify-production-release-workflow.mjs';

const workflow = readFileSync('.github/workflows/production-release.yml', 'utf8');
const wrangler = readFileSync('wrangler.production.jsonc', 'utf8');
const audit = (w: string, c: string): string[] => auditProductionRelease(w, c);

describe('production release workflow safety gate', () => {
  it('passes for the committed workflow and Wrangler config', () => {
    expect(audit(workflow, wrangler)).toEqual([]);
  });

  it('fails if an automatic push trigger is added', () => {
    const mutated = workflow.replace('on:\n  workflow_dispatch:', 'on:\n  push:\n    branches: [main]\n  workflow_dispatch:');
    expect(audit(mutated, wrangler)).toContain(
      'no automatic trigger (push/pull_request/schedule/workflow_run/workflow_call)',
    );
  });

  it('fails if the disabled-by-default kill switch is removed', () => {
    const mutated = workflow.replace("if: ${{ vars.PRODUCTION_RELEASE_ENABLED == 'true' }}\n", '');
    expect(audit(mutated, wrangler)).toContain('disabled by default via PRODUCTION_RELEASE_ENABLED');
  });

  it('fails if the protected environment is removed', () => {
    const mutated = workflow.replace('    environment: production\n', '');
    expect(audit(mutated, wrangler)).toContain('deploy uses protected GitHub Environment');
  });

  it('fails if the confirmation is no longer bound to the SHA', () => {
    const mutated = workflow.replace('DEPLOY_PRODUCTION_${RELEASE_SHA:0:12}', 'DEPLOY_PRODUCTION');
    expect(audit(mutated, wrangler)).toContain('confirmation bound to the exact SHA');
  });

  it('fails if the main-ancestry or CI checks are removed', () => {
    const noAncestry = workflow.replace('compare/${RELEASE_SHA}...main', 'commits/${RELEASE_SHA}');
    expect(audit(noAncestry, wrangler)).toContain('SHA must be an ancestor of main');
    const noCi = workflow.replace('head_sha=${RELEASE_SHA}', 'per_page=1');
    expect(audit(noCi, wrangler)).toContain('exact-SHA successful CI required');
  });

  it('fails if the workflow deploys the preview Wrangler config', () => {
    const mutated = workflow.replace('--config wrangler.production.jsonc', '--config wrangler.preview.jsonc');
    const failures = audit(mutated, wrangler);
    expect(failures).toContain('never deploys the preview Wrangler config');
    expect(failures).toContain('deploys only the production Wrangler config');
  });

  it('fails if production build mode is swapped for preview', () => {
    const mutated = workflow.replace('DEPLOY_ENV=production pnpm run build', 'DEPLOY_ENV=preview pnpm run build');
    expect(audit(mutated, wrangler)).toContain('production-mode build');
  });

  it('fails if the Wrangler config binds the root domain, a route or a zone', () => {
    for (const injected of [
      '"routes": [{ "pattern": "omsaravanabhava.org/*", "zone_name": "omsaravanabhava.org" }],',
      '"custom_domain": true,',
      '"zone_id": "abc",',
    ]) {
      const mutated = wrangler.replace('"workers_dev": true,', `"workers_dev": true,\n  ${injected}`);
      expect(audit(workflow, mutated)).toContain('production config must not bind the root domain or routes');
    }
  });

  it('fails if the deploy job stops invoking the tested route checker', () => {
    const mutated = workflow.replace('node scripts/verify-production-release-workflow.mjs', 'echo route-check-skipped');
    expect(mutated).not.toEqual(workflow);
    expect(audit(mutated, wrangler)).toContain('deploy job runs tested Wrangler route guard');
  });

  it('fails if create-only Worker collision preflight is removed', () => {
    const mutated = workflow.replace('Fail closed if production Worker already exists', 'Skipped Worker preflight');
    expect(mutated).not.toEqual(workflow);
    expect(audit(mutated, wrangler)).toContain('first-release Worker absence preflight before upload');
  });

  it('fails if Worker absence status check or first-release restriction is removed', () => {
    const withoutAbsent = workflow.replace('worker_status" != "404"', 'worker_status" != "200"');
    expect(audit(withoutAbsent, wrangler)).toContain('first-release Worker absence preflight before upload');
    const withoutFirst = workflow.replace('ROLLBACK_SHA" != "FIRST_RELEASE"', 'ROLLBACK_SHA" != "SOME_SHA"');
    expect(audit(withoutFirst, wrangler)).toContain('first-release Worker absence preflight before upload');
  });

  it('rejects misleading post-deploy root isolation claims', () => {
    const unsafe = workflow.replace('Effective root-domain routing: UNVERIFIED', 'Root domain routing: NOT changed by this workflow');
    expect(audit(unsafe, wrangler)).toContain('deployment summary does not assert unverified root isolation');
  });

  it('fails if the production config names the preview Worker or loses its name', () => {
    expect(audit(workflow, wrangler.replace('"omsaravanabhava-hitech"', '"omsaravanabhava-hitech-preview"')))
      .toContain('production config must not name the preview Worker');
    expect(audit(workflow, wrangler.replace('"name": "omsaravanabhava-hitech"', '"name": "other"')))
      .toContain('production Worker name');
  });

  it('ignores explanatory comments that mention the domain', () => {
    // The committed config's header comments mention omsaravanabhava.org and routes.
    expect(wrangler).toMatch(/\/\/.*omsaravanabhava\.org/);
    expect(audit(workflow, wrangler)).toEqual([]);
  });
});
