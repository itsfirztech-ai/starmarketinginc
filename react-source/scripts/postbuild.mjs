import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const root = resolve('dist');
const rawBase = process.env.VITE_BASE_PATH || '/';
const base = `/${rawBase.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/');
const context = process.env.CONTEXT || '';
const isPreviewDeploy = context === 'deploy-preview' || context === 'branch-deploy';
const configuredOrigin = process.env.VITE_SITE_URL || (context === 'production' ? process.env.URL : '') || '';
const site = configuredOrigin.replace(/\/$/, '');
const configured = !isPreviewDeploy && /^https:\/\//i.test(site) && !/example\.com|yourdomain/i.test(site);

const pages = [
  { slug: '', title: 'Digital Marketing & AI Web Development Agency', description: 'Star Marketing Agency Inc combines strategic digital marketing, AI web development and conversion-led design to help businesses build better digital experiences.' },
  { slug: 'digital-marketing', title: 'Digital Marketing, SEO & PPC Services', description: 'Explore SEO, local SEO, Google Ads, Meta campaigns, CRO, content strategy and analytics from Star Marketing Agency Inc.' },
  { slug: 'ai-web-development', title: 'AI Web Development & Conversion-Focused Websites', description: 'Custom websites, AI-ready customer experiences, lead qualification integrations, CRM automation and high-performance web design.' },
  { slug: 'about', title: 'About Star Marketing Agency Inc', description: 'Learn how Star Marketing Agency Inc brings clear strategy, thoughtful design, technology and measurable improvement together.' },
  { slug: 'contact', title: 'Contact Star Marketing Agency Inc | Request a Consultation', description: 'Talk with Star Marketing Agency Inc about your digital marketing, AI web development or growth project. Send an inquiry to start the conversation.' }
];

const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const safeJson = value => JSON.stringify(value).replace(/</g, '\\u003c');

for (const page of pages) {
  const routePath = `${base}${page.slug ? `${page.slug}/` : ''}`;
  const canonical = configured ? `${site}${routePath}` : '';
  const title = `${page.title} | Star Marketing Agency Inc`;
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Star Marketing Agency Inc',
    ...(configured ? { url: `${site}${base}`, logo: `${site}${base}assets/star-mark.svg` } : {})
  };
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Star Marketing Agency Inc',
    ...(configured ? { url: `${site}${base}` } : {})
  };
  const webpage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: page.description,
    ...(canonical ? { url: canonical } : {})
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: configured ? `${site}${base}` : undefined },
      ...(page.slug ? [{ '@type': 'ListItem', position: 2, name: page.title.split('|')[0].trim(), ...(canonical ? { item: canonical } : {}) }] : [])
    ]
  };
  const service = page.slug === 'digital-marketing' || page.slug === 'ai-web-development'
    ? [{
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: page.slug === 'digital-marketing' ? 'Digital marketing services' : 'AI web development services',
        provider: { '@type': 'Organization', name: 'Star Marketing Agency Inc', ...(configured ? { url: `${site}${base}` } : {}) }
      }]
    : [];
  const schema = [organization, website, webpage, breadcrumbs, ...service];
  const pageHtmlPath = join(root, page.slug, 'index.html');
  let html = (await readFile(pageHtmlPath, 'utf8'))
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/i, `<meta name="description" content="${esc(page.description)}" />`)
    .replace(/<link rel="canonical"[^>]*>/gi, '')
    .replace(/<meta name="robots"[^>]*>/gi, '')
    .replace(/<meta property="og:[^"]+"[^>]*>/gi, '')
    .replace(/<meta name="twitter:[^"]+"[^>]*>/gi, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
  const tags = [
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="Star Marketing Agency Inc" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    configured ? `<link rel="canonical" href="${esc(canonical)}" />` : '<meta name="robots" content="noindex, nofollow" />',
    configured ? `<meta property="og:url" content="${esc(canonical)}" />` : '',
    configured ? `<meta property="og:image" content="${esc(`${site}${base}assets/og-preview.png`)}" />` : '',
    `<script type="application/ld+json">${safeJson(schema)}</script>`
  ].filter(Boolean).join('\n');
  html = html.replace('</head>', `${tags}\n</head>`);
  const folder = join(root, page.slug);
  await mkdir(folder, { recursive: true });
  await writeFile(join(folder, 'index.html'), html);
}

// A dedicated 404 must never be indexed or claim to be the homepage.
let notFound = await readFile(join(root, '404.html'), 'utf8');
if (!/<meta name="robots"/i.test(notFound)) notFound = notFound.replace('</head>', '<meta name="robots" content="noindex, nofollow" /></head>');
await writeFile(join(root, '404.html'), notFound);

const sitemapUrls = pages.map(page => `${site}${base}${page.slug ? `${page.slug}/` : ''}`);
const sitemap = configured
  ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map(url => `  <url><loc>${esc(url)}</loc></url>`).join('\n')}\n</urlset>\n`
  : '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n';
await writeFile(join(root, 'sitemap.xml'), sitemap);
await writeFile(join(root, 'robots.txt'), configured
  ? `User-agent: *\nAllow: /\nSitemap: ${site}${base}sitemap.xml\n`
  : 'User-agent: *\nDisallow: /\n');

console.log(`Generated ${pages.length} route documents, sitemap.xml and robots.txt. Indexing ${configured ? 'enabled for production origin' : 'disabled until a production HTTPS URL is configured'}.`);
