#!/usr/bin/env node
/**
 * Sitemap only includes routes with enough publishable substance to deserve
 * indexing. Directory records can remain publicly browsable without creating
 * hundreds of thin search-engine landing pages.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const ORIGIN = process.env.SITE_ORIGIN ?? 'https://omsaravanabhava.org';
const env = process.env.DEPLOY_ENV ?? 'development';
const production = env === 'production';
const read = (f) => JSON.parse(readFileSync(`src/content/${f}`, 'utf8'));

const staticRoutes = [
  '/', '/arupadai-veedu', '/temples', '/thiruppugazh', '/works', '/prayers',
  '/practice', '/search', '/sources', '/content-completeness', '/about',
  '/privacy', '/terms', '/disclaimer', '/accessibility', '/contact',
];

const temples = read('temples.json');
const thiruppugazh = read('thiruppugazh.json');

const templeIndexable = (t) => {
  const substantive = [
    Boolean(t.history),
    Boolean(t.architecture),
    Boolean(t.visitorInformation),
    Boolean(t.officialWebsite),
    Number.isFinite(t.latitude) && Number.isFinite(t.longitude),
  ].filter(Boolean).length;
  return substantive >= 2;
};

const songIndexable = (s) => Boolean(s.canonicalText && String(s.canonicalText).trim());

const detailRoutes = [
  ...temples.filter(templeIndexable).map((t) => `/temples/${t.id}`),
  ...thiruppugazh.filter(songIndexable).map((s) => `/thiruppugazh/${s.id}`),
];
const routes = [...staticRoutes, ...detailRoutes];

// Preview/CI should not publish a production sitemap at all. Keep a tiny
// non-indexable placeholder so accidental preview discovery does not advertise
// production URLs.
if (!production) {
  writeFileSync(
    'public/sitemap.xml',
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n',
  );
  console.log(`sitemap.xml: preview/ci empty (candidate routes=${routes.length})`);
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${ORIGIN}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync('public/sitemap.xml', xml);
console.log(
  `sitemap.xml: ${routes.length} routes (${detailRoutes.length} substantive detail routes; ` +
    `${temples.length - temples.filter(templeIndexable).length} temple details held out; ` +
    `${thiruppugazh.length - thiruppugazh.filter(songIndexable).length} Thiruppugazh details held out)`,
);
