/*
 * Static page generator for the five authored React/TSX pages.
 * - Normal mode: standalone HTML + lightweight fallback JS/CSS (no Vite required).
 * - --vite-build mode: emits the same pre-rendered HTML content plus the Vite-built
 *   React bundle and compiled CSS, so Netlify gets crawlable HTML and full React UX.
 * This is a small SSG step, not a replacement for the Vite production build.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
let ts;
try { ts = require('typescript'); }
catch {
  const candidates = [
    process.env.TYPESCRIPT_PATH,
    '/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript'
  ].filter(Boolean);
  for (const candidate of candidates) { try { ts = require(candidate); break; } catch {} }
  if (!ts) throw new Error('TypeScript is required for the static page generation step. Run npm install first.');
}

const root = path.resolve(__dirname, '..');
const base = (process.env.VITE_BASE_PATH || '/').replace(/\/$/, '') + '/';
const context = process.env.CONTEXT || '';
const previewDeploy = context === 'deploy-preview' || context === 'branch-deploy';
const site = (process.env.VITE_SITE_URL || (context === 'production' ? process.env.URL : '') || '').replace(/\/$/, '');
const configured = !previewDeploy && /^https:\/\//i.test(site) && !/example\.com|yourdomain/i.test(site);
const viteBuild = process.argv.includes('--vite-build');
const outRoot = path.join(root, 'dist');
if (!viteBuild) fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(outRoot, { recursive: true });

let currentPath = '/';
let currentComponent = null;
const node = (type, props = {}) => ({ type, props });
const jsxRuntime = { jsx: node, jsxs: node, Fragment: Symbol('fragment') };
const React = {
  useEffect: () => {},
  useState: value => [typeof value === 'function' ? value() : value, () => {}],
  useMemo: fn => fn(),
  useRef: value => ({ current: value }),
  createElement: node
};
const router = {
  Outlet: () => currentComponent ? node(currentComponent, {}) : null,
  useLocation: () => ({ pathname: currentPath }),
  useNavigate: () => () => {},
  useSearchParams: () => [new URLSearchParams(), () => {}],
  Link: props => node('a', { ...props, href: toHref(props.to), to: undefined }),
  NavLink: props => node('a', { ...props, href: toHref(props.to), className: typeof props.className === 'function' ? props.className({ isActive: props.to === currentPath }) : props.className, to: undefined })
};
const makeIcon = name => props => node('svg', {
  xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: props?.size || 24, height: props?.size || 24,
  stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', className: props?.className, 'aria-hidden': 'true',
  children: [node('circle', { cx: 12, cy: 12, r: 8 }), node('path', { d: name === 'ArrowRight' || name === 'ArrowUpRight' ? 'M7 12h10m-5-5 5 5-5 5' : 'M8 12l3 3 5-6' })]
});
const icons = new Proxy({}, { get: (_, name) => makeIcon(String(name)) });
const modules = {};
function toHref(to) {
  if (!to || typeof to !== 'string') return '#';
  return to.startsWith('/') ? base.replace(/\/$/, '') + to : to;
}
function load(file) {
  let resolved = path.resolve(file);
  if (!fs.existsSync(resolved)) resolved = path.resolve(resolved + '.tsx');
  if (!fs.existsSync(resolved)) resolved = path.resolve(resolved.replace(/\.tsx$/, '.ts'));
  if (modules[resolved]) return modules[resolved].exports;
  let source = fs.readFileSync(resolved, 'utf8')
    .replace(/import\.meta\.env\.BASE_URL/g, 'process.env.VITE_BASE_PATH')
    .replace(/import\.meta\.env\.VITE_([A-Z_]+)/g, (_, key) => `process.env.VITE_${key}`);
  const compiled = ts.transpileModule(source, {
    reportDiagnostics: true,
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  });
  const errors = (compiled.diagnostics || []).filter(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error);
  if (errors.length) throw new Error(`TSX transpile failed for ${resolved}: ${errors.map(x => ts.flattenDiagnosticMessageText(x.messageText, '\n')).join('; ')}`);
  const module = { exports: {} };
  modules[resolved] = module;
  const requireLocal = name => {
    if (name === 'react') return React;
    if (name === 'react/jsx-runtime') return jsxRuntime;
    if (name === 'react-router-dom') return router;
    if (name === 'lucide-react') return icons;
    if (name === 'framer-motion') return {};
    if (name.startsWith('.')) return load(path.resolve(path.dirname(resolved), name));
    return require(name);
  };
  vm.runInNewContext(`(function(require,module,exports,process){${compiled.outputText}\n})`, { console, URLSearchParams, Date, Math, Array, Set, Map, JSON }, { filename: resolved })(
    requireLocal, module, module.exports,
    { env: { ...process.env, VITE_BASE_PATH: base, VITE_SITE_URL: site } }
  );
  return module.exports;
}
function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
const voidTags = new Set(['img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'source', 'embed', 'wbr']);
function render(value) {
  if (value == null || value === false || value === true) return '';
  if (typeof value === 'string' || typeof value === 'number') return escapeHtml(value);
  if (Array.isArray(value)) return value.map(render).join('');
  const { type, props = {} } = value;
  if (typeof type === 'symbol') return render(props.children);
  if (typeof type === 'function') return render(type(props));
  if (typeof type !== 'string') return '';
  let attributes = '';
  let body = props.children;
  for (let [name, item] of Object.entries(props)) {
    if (item == null || item === false || name === 'children' || name === 'key' || name === 'ref' || name === 'to' || name === 'dangerouslySetInnerHTML' || name.startsWith('on') || typeof item === 'function') continue;
    if (name === 'className') name = 'class';
    if (name === 'htmlFor') name = 'for';
    if (name === 'tabIndex') name = 'tabindex';
    if (name === 'autoComplete') name = 'autocomplete';
    if (name === 'strokeWidth') name = 'stroke-width';
    if (name === 'readOnly') name = 'readonly';
    if (name === 'value' && type === 'textarea') { body = item; continue; }
    if (item === true) { attributes += ` ${name}`; continue; }
    attributes += ` ${name}="${escapeHtml(item)}"`;
  }
  if (voidTags.has(type)) return `<${type}${attributes}>`;
  return `<${type}${attributes}>${render(body)}</${type}>`;
}

const pages = [
  { path: '/', mod: 'Home', slug: '', title: 'Digital Marketing & AI Web Development Agency', desc: 'Star Marketing Agency Inc combines strategic digital marketing, AI web development and conversion-first experiences to help businesses move forward.' },
  { path: '/digital-marketing/', mod: 'Marketing', slug: 'digital-marketing', title: 'SEO, PPC & Digital Marketing Services', desc: 'Search engine optimization, local SEO, Google Ads, Meta Ads, content marketing, conversion optimization and analytics.' },
  { path: '/ai-web-development/', mod: 'Development', slug: 'ai-web-development', title: 'AI Web Development & Custom Business Websites', desc: 'Explore custom websites, lead qualification experiences, responsive design, AI-powered workflows and smart business integrations.' },
  { path: '/about/', mod: 'About', slug: 'about', title: 'About Star Marketing Agency Inc', desc: 'Our integrated approach to digital marketing, web development, innovation and thoughtful business growth.' },
  { path: '/contact/', mod: 'Contact', slug: 'contact', title: 'Contact & Get a Project Quote', desc: 'Contact Star Marketing Agency Inc to discuss digital marketing, website development and AI integrations.' }
];

const layout = load(path.join(root, 'src/components/Layout.tsx')).default;
const schemaFor = page => JSON.stringify([
  { '@context': 'https://schema.org', '@type': 'Organization', name: 'Star Marketing Agency Inc', ...(configured ? { url: site + base } : {}) },
  { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Star Marketing Agency Inc', ...(configured ? { url: site + base } : {}) },
  { '@context': 'https://schema.org', '@type': 'WebPage', name: page.title, description: page.desc },
  ...(page.slug === 'digital-marketing' || page.slug === 'ai-web-development' ? [{ '@context': 'https://schema.org', '@type': 'Service', serviceType: page.title, provider: { '@type': 'Organization', name: 'Star Marketing Agency Inc' } }] : [])
]).replace(/</g, '\\u003c');

let viteHeadAssets = '';
let viteScript = '';
if (viteBuild) {
  const builtIndex = fs.readFileSync(path.join(outRoot, 'index.html'), 'utf8');
  const links = [...builtIndex.matchAll(/<link\s+(?:rel="(?:stylesheet|modulepreload)"[^>]*|[^>]*rel="(?:stylesheet|modulepreload)"[^>]*)>/gi)].map(match => match[0]);
  const script = builtIndex.match(/<script\s+type="module"[^>]*src="[^"]+"[^>]*><\/script>/i);
  if (!script) throw new Error('Vite build entry script was not found in dist/index.html.');
  viteHeadAssets = links.join('\n');
  viteScript = script[0];
}

for (const page of pages) {
  currentPath = page.path;
  currentComponent = load(path.join(root, `src/pages/${page.mod}.tsx`)).default;
  const contents = render(node(layout, {}));
  const url = site + base + (page.slug ? `${page.slug}/` : '');
  const title = `${page.title} | Star Marketing Agency Inc`;
  const robots = configured ? '' : '<meta name="robots" content="noindex,nofollow">';
  const canonical = configured ? `<link rel="canonical" href="${escapeHtml(url)}">` : '';
  const social = configured ? `<meta property="og:url" content="${escapeHtml(url)}"><meta property="og:image" content="${escapeHtml(site + base + 'assets/og-preview.png')}">` : '';
  const stylesheet = viteBuild ? viteHeadAssets : `<link href="${base}assets/site.css" rel="stylesheet">`;
  const icon = `<link rel="icon" href="${base}assets/star-mark.svg" type="image/svg+xml">`;
  const schema = schemaFor(page);
  const body = viteBuild
    ? `<div id="root">${contents}</div>${viteScript}`
    : `${contents}<script defer src="${base}assets/site-fallback.js"></script>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#071022"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(page.desc)}">${robots}${canonical}<meta property="og:type" content="website"><meta property="og:site_name" content="Star Marketing Agency Inc"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(page.desc)}">${social}<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(page.desc)}">${icon}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">${stylesheet}<script type="application/ld+json">${schema}</script></head><body>${body}</body></html>`;
  const directory = path.join(outRoot, page.slug);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), html);
}

if (!viteBuild) {
  fs.cpSync(path.join(root, 'public/assets'), path.join(outRoot, 'assets'), { recursive: true });
  fs.copyFileSync(path.join(root, 'src/styles.css'), path.join(outRoot, 'assets/site.css'));
}
let notFound = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Star Marketing Agency Inc</title><meta name="robots" content="noindex,nofollow"></head><body><main><h1>Page not found</h1><p>The page may have moved or no longer exists.</p><a href="${base}">Return home</a></main></body></html>`;
fs.writeFileSync(path.join(outRoot, '404.html'), notFound);
console.log(`Generated ${pages.length} pre-rendered route pages${viteBuild ? ' with the Vite React bundle' : ' as a standalone static preview'}.`);
