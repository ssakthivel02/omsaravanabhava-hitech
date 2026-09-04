#!/usr/bin/env node
/**
 * Generate deployment-environment-specific crawler and header controls.
 * Preview/CI builds fail safe to non-indexable. Production is explicit.
 */
import { writeFileSync } from 'node:fs';

const env = process.env.DEPLOY_ENV ?? 'development';
const production = env === 'production';

const robots = production
  ? `User-agent: *\nAllow: /\n\nSitemap: https://omsaravanabhava.org/sitemap.xml\n`
  : `User-agent: *\nDisallow: /\n`;

// release/SECURITY_HEADERS_POLICY_V1.json cspMinimumDirectives, serialised.
// Preview ships this as Report-Only (cspMode:
// REPORT_ONLY_THEN_ENFORCE_WHEN_GREEN) so a misconfigured directive cannot
// break the preview outright; production enforcement is a separate,
// deliberate step taken only after a clean preview report-only run.
const CSP = [
  "default-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self' blob:",
].join('; ');

const security = [
  '/*',
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  X-Frame-Options: DENY',
  // R2Q-004: no functional geolocation feature exists in this app. Never
  // grant it to 'self' merely as a default — require a real, privacy-reviewed
  // feature before this is anything but denied outright.
  '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
];
if (production) {
  // R2Q-004: production ships CSP enforced, never silently absent. This
  // only happens after preview has run the identical directive set as
  // Report-Only (below) and come back clean.
  security.push(`  Content-Security-Policy: ${CSP}`);
} else {
  security.push('  X-Robots-Tag: noindex, nofollow, noarchive');
  security.push(`  Content-Security-Policy-Report-Only: ${CSP}`);
}

// Fingerprinted Vite assets can be cached aggressively by the browser.
security.push('', '/assets/*', '  Cache-Control: public, max-age=31536000, immutable');

writeFileSync('public/robots.txt', robots);
writeFileSync('public/_headers', security.join('\n') + '\n');
console.log(`deployment files: ${env} (${production ? 'indexable' : 'noindex'})`);
