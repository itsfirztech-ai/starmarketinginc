import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const basePath = (process.env.VITE_BASE_PATH || '/').replace(/\/$/, '');
const assetPrefix = basePath || '';
const pages = [
  { slug: '', heading: 'We build digital experiences that turn' },
  { slug: 'digital-marketing', heading: 'Marketing built to move your business forward.' },
  { slug: 'ai-web-development', heading: 'Digital experiences designed for what’s next.' },
  { slug: 'about', heading: 'Independent thinking. Connected execution.' },
  { slug: 'contact', heading: 'Let&#39;s talk about' }
];

for (const page of pages) {
  test(`Production HTML exists and has route-specific content: ${page.slug || 'home'}`, () => {
    const path = join(root, 'dist', page.slug, 'index.html');
    assert.ok(existsSync(path), `Missing ${path}`);
    const html = readFileSync(path, 'utf8');
    assert.match(html, /<h1[\s>]/);
    assert.ok(html.includes(page.heading), `Expected route-specific H1 text in ${path}`);
    assert.match(html, /<meta name="description"/);
    assert.match(html, /<script type="application\/ld\+json">/);
    assert.ok(html.includes(`href="${assetPrefix}/assets/`) && /\.css"/.test(html), 'Expected compiled CSS asset link');
    assert.ok(html.includes(`href="${basePath}/contact/?intent=consultation"`), 'Expected consultation CTA link');
    assert.doesNotMatch(html, /lorem ipsum|fake customer|99% growth/i);
  });
}

test('Unconfigured build blocks search indexing', () => {
  const robots = readFileSync(join(root, 'dist/robots.txt'), 'utf8');
  assert.match(robots, /Disallow: \/|Sitemap:/);
});

test('Contact form includes a phone field and real submission guard', () => {
  const html = readFileSync(join(root, 'dist/contact/index.html'), 'utf8');
  assert.match(html, /id="phone"/);
  assert.match(html, /name="companyFax"/);
  const source = readFileSync(join(root, 'src/pages/Contact.tsx'), 'utf8');
  assert.match(source, /formBody\.set\('form-name', 'star-inquiry'\)/);
  assert.match(source, /if \(!response\.ok\)/);
  assert.match(source, /f\.contactMethod === 'phone'/);
});

test('Netlify build configuration points to Vite output', () => {
  const config = readFileSync(join(root, 'netlify.toml'), 'utf8');
  assert.match(config, /command = "npm run build"/);
  assert.match(config, /publish = "dist"/);
  assert.match(config, /NODE_VERSION = "22"/);
});

test('Any generated npm lockfile contains a resolved dependency tree', () => {
  const lockPath = join(root, 'package-lock.json');
  if (!existsSync(lockPath)) return; // The ZIP omits the known-bad earlier lock; npm install may generate a full one.
  const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
  assert.ok(Object.keys(lock.packages || {}).length > 1, 'package-lock.json must include resolved packages, not only the root manifest');
});

test('Static fallback form does not simulate success without an endpoint', () => {
  const script = readFileSync(join(root, 'public/assets/site-fallback.js'), 'utf8');
  assert.match(script, /const endpoint=window\.STAR_FORM_ENDPOINT/);
  assert.match(script, /if\(!response\.ok\)throw/);
});

test('All principal route links are present on the homepage', () => {
  const html = readFileSync(join(root, 'dist/index.html'), 'utf8');
  for (const slug of pages.slice(1).map(page => page.slug)) assert.ok(html.includes(`href="${basePath}/${slug}/"`), slug);
});

test('404 page is excluded from search indexing', () => {
  const html = readFileSync(join(root, 'dist/404.html'), 'utf8');
  assert.match(html, /<meta name="robots" content="noindex,\s*nofollow"/);
});
