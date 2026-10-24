import { readFileSync, writeFileSync } from 'node:fs';

/**
 * Writes dist/sitemap.xml after the build, straight from the real menu.
 * Adding a service in src/data/menu.ts therefore updates the sitemap on the
 * next deploy — nothing to remember.
 *
 * The hostname is the one place to change when the domain moves.
 */
const SITE = process.env.SITE_URL ?? 'https://anna-s-beautistry-new.vercel.app';

const menuSource = readFileSync('src/data/menu.ts', 'utf8');
const items = [...menuSource.matchAll(/slug: '([^']+)',\s*\n\s*service: '([^']+)'/g)].map(
  ([, slug, room]) => ({ slug, room }),
);

const rooms = [...new Set(items.map((item) => item.room))];

const paths = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/book', priority: '0.9', changefreq: 'weekly' },
  { path: '/services', priority: '0.9', changefreq: 'weekly' },
  { path: '/gallery', priority: '0.7', changefreq: 'monthly' },
  ...rooms.map((room) => ({ path: `/services/${room}`, priority: '0.8', changefreq: 'monthly' })),
  ...items.map((item) => ({
    path: `/services/${item.room}/${item.slug}`,
    priority: '0.7',
    changefreq: 'monthly',
  })),
];

const body = paths
  .map(
    ({ path, priority, changefreq }) =>
      `  <url>\n    <loc>${SITE}${path}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

writeFileSync('dist/sitemap.xml', xml, 'utf8');
console.log(`sitemap.xml written — ${paths.length} URLs (${rooms.join(', ')})`);
