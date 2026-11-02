# Star Marketing Agency Inc — Website

A five-page, responsive agency website built with **React 18, TypeScript, Vite 6, Tailwind CSS 3, React Router 6 and Lucide React**. The design uses custom CSS for restrained motion and does not add Framer Motion as an unnecessary runtime dependency.

The project is configured for **Netlify first**, with Vercel and GitHub Pages deployment support. Each route is pre-rendered to crawlable HTML after the Vite build, then the React bundle mounts on the page for interactive behavior.

## 1. Pages and features

- `/` — Home, value proposition, services, process, illustrative concept work, FAQ and consultation CTAs.
- `/digital-marketing/` — SEO, local SEO, paid search, paid social, social media, content, CRO and analytics.
- `/ai-web-development/` — custom sites, AI-assisted experiences, chatbots, landing pages, redesigns, responsive design, technical SEO, CRM/forms and workflow automation.
- `/about/` — mission, approach and values without invented history, awards, staff or client claims.
- `/contact/` — validated project inquiry form with name, business email, company, phone, website, service, budget, goals, contact preference and consent.

The portfolio items are explicitly labelled illustrative concepts. Reviews, client names, awards, performance statistics, phone numbers, addresses and social accounts are not fabricated.

## 2. Requirements

- Node.js 22 LTS (20.19+ supported)
- npm 10+
- Internet access to the npm registry for dependency installation

## 3. Run locally

```bash
# Extract the ZIP, then enter the project folder
cd star-marketing-agency-website

# Install exact direct dependency versions
npm install

# Start local development
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173/`.

After the first successful `npm install`, npm creates a complete `package-lock.json` using the registry's resolved transitive dependency versions. Commit that generated file for reproducible future installs:

```bash
npm run typecheck
npm run build
npm test
git add package-lock.json
git commit -m "Add resolved npm lockfile"
```

### Why this ZIP does not include a package lock

The earlier package lock in the supplied project was incomplete: it declared the root package but omitted the resolved dependency tree. That can make Netlify's `npm ci` fail. The incomplete file has been removed rather than shipping a misleading lockfile. Netlify will use `npm install` from `package.json`; after a successful local install, commit the newly generated full lockfile. **If the old `package-lock.json` is already in your GitHub repository, delete it before the next Netlify production deploy.**

## 4. Build and test

```bash
npm run typecheck
npm run check:syntax
npm run build
npm test
npm run preview
```

`npm run build` performs TypeScript checking, Vite compilation, static route generation, SEO metadata generation and automated HTML checks. The final `dist/` includes pre-rendered HTML for all five routes plus the React bundle and compiled CSS.

If the npm registry is unavailable, you can test the standalone fallback without installing Vite/React packages (the TypeScript compiler must be available):

```bash
npm run build:static-fallback
```

That fallback is for preview or emergency static hosting. The normal Netlify deployment uses the Vite/React build.

## 5. Netlify deployment (recommended)

`netlify.toml` already sets the correct build command, publish directory, Node version, root base path, security headers and SPA fallback.

In Netlify → **Site configuration → Build & deploy → Build settings**, use:

| Setting | Value |
|---|---|
| Base directory | Leave blank |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `22` |

The same values are committed in `netlify.toml`. If Netlify shows a separate install-command override, use `npm install --no-audit --no-fund` (not `npm ci` while the old incomplete lock is absent). Connect the GitHub repository and production branch (`main`). A commit to `main` triggers a production deploy; pull requests create Deploy Previews only.

### Netlify environment variables

In Netlify → **Site configuration → Environment variables**, add only values you have verified:

| Variable | Value |
|---|---|
| `VITE_BASE_PATH` | `/` |
| `VITE_SITE_URL` | Optional. Your final HTTPS origin, e.g. `https://your-site.netlify.app`, no trailing slash. If blank, the production build uses Netlify's `URL` value. |
| `VITE_CONTACT_EMAIL` | Real agency inbox |
| `VITE_CONTACT_PHONE` | Verified business phone |
| `VITE_BOOKING_URL` | Real calendar booking URL; leave blank to send visitors to the inquiry form |
| `VITE_FORM_ENDPOINT` | Formspree or compatible HTTPS JSON form endpoint |
| `VITE_GA4_ID` | Optional GA4 Measurement ID |
| `VITE_GTM_ID` | Optional GTM container ID; prioritized over standalone GA4 |

After changing environment variables, trigger **Deploys → Trigger deploy → Clear cache and deploy site**.

Deploy Previews and branch deploys are automatically marked `noindex`. Production pages get page-specific canonical URLs, Open Graph metadata, structured data, `sitemap.xml` and an indexable `robots.txt` when a real HTTPS origin is configured.

### Important: update an existing repository

The previous ZIP may have put an incomplete `package-lock.json` in GitHub. Before redeploying the corrected project:

1. Upload/replace the files from this corrected project in the repository root.
2. Delete the old root-level `package-lock.json` if it remains.
3. Commit the update directly to `main` (or merge a reviewed PR into `main`).
4. In Netlify, check that the production branch is `main` and that the build settings above are active.
5. Trigger a clear-cache production deploy.

A Deploy Preview URL is not the final production URL. Check the production deploy's Published status and the main site URL in Netlify.

## 6. Connect the contact form

The form deliberately does not display a success state unless the configured endpoint returns HTTP 2xx. Until an endpoint is configured, it displays a clear not-configured message. It includes validation, a honeypot, duplicate-submit prevention, a 15-second timeout and accessible error/status messaging.

### Formspree setup

1. Create a Formspree form and set the notification recipient to the verified agency inbox.
2. Copy the form's HTTPS endpoint, usually `https://formspree.io/f/FORM_ID`.
3. Add it to Netlify as `VITE_FORM_ENDPOINT`.
4. Redeploy the site.
5. Submit a real test inquiry and verify receipt, spam filtering and reply-to behavior.

This project sends JSON with `Accept: application/json` and `Content-Type: application/json`. If you choose a different provider, confirm it accepts that format and returns 2xx only after accepting the submission. The endpoint is visible in the browser bundle; never put API secrets or private keys in a `VITE_` variable.

The form submission is an inquiry, not a confirmed appointment. A calendar integration requires a real `VITE_BOOKING_URL`.

## 7. Company configuration

Edit `src/data/site.ts` for company name, navigation labels, service copy, social profile URLs and page descriptions. Add only verified contact details. The runtime reads email, phone, booking URL, site URL and form endpoint from Vite environment variables.

The current brand logo is an original SVG at `public/assets/star-mark.svg`. The visual system uses CSS-built illustrations and does not rely on an external stock-image host. Replace/add images only when you have appropriate rights and descriptive alt text.

## 8. SEO and routing

- Each page has unique title and description metadata.
- The postbuild step creates route-specific HTML, canonical URLs, Open Graph/Twitter tags, Organization, WebSite, WebPage, BreadcrumbList and Service JSON-LD where applicable.
- It generates `sitemap.xml` and `robots.txt` from the production origin.
- Deploy Previews are noindex to avoid duplicate search listings.
- No LocalBusiness schema or physical address is invented because no verified office/location details were supplied.
- The app uses React Router with Vite's `BASE_URL`; the Netlify base path is `/`.

After launch, verify the canonical domain, sitemap and Search Console property. Add a legally reviewed privacy policy before collecting real customer data at scale.

## 9. Analytics and consent

Analytics stays off until a visitor grants analytics consent. Supported event names include `page_view`, `consultation_cta_click`, `email_click`, `phone_click` and `generate_lead`. The lead event fires only after the form endpoint returns success and sends only service/inquiry category values—not names, email addresses, phone numbers, website URLs or message content.

GTM is used instead of standalone GA4 if both IDs are present, to reduce duplicate tracking. Meta Pixel and Google Ads conversion IDs are documented placeholders and are not automatically installed. Add them only after a consent-aware implementation is reviewed and verified.

## 10. Vercel

- Import the GitHub repository into Vercel.
- Framework preset: Vite.
- Build command: `npm run build`.
- Output directory: `dist`.
- Add `VITE_BASE_PATH=/`, your verified environment variables and the final `VITE_SITE_URL`.
- Deploy and test all five direct routes.

## 11. GitHub Pages

The included `.github/workflows/deploy-pages.yml` builds and deploys the site to GitHub Pages. In repository **Settings → Pages**, select **GitHub Actions**. Configure repository Actions variables for `VITE_SITE_URL`, contact details and analytics. Set `VITE_BASE_PATH` to `/REPOSITORY_NAME/` for a project site, or `/` for a root/custom domain. The workflow uses `npm install` until you generate and commit the complete lockfile; then you may change it to `npm ci` and restore npm caching.

## 12. Security and launch checklist

- Never commit `.env.local`, credentials, private keys or provider API secrets.
- Use HTTPS form endpoints and enable provider spam protection.
- Add a privacy policy and data-retention rules appropriate to your jurisdictions.
- Test the form end-to-end with a real notification inbox.
- Confirm the production branch is `main` and the Netlify site URL/domain is correct.
- Test all five pages, direct URLs, navigation, mobile layout, keyboard focus and reduced-motion behavior.
- Verify GA4/GTM in DebugView/Preview only after consent and configuration.
- Add real client work, reviews, contact details and social links only after approval.

## 13. Verification status for this delivery

The source TS/TSX syntax pass and the standalone pre-rendered site tests were run successfully in the delivery environment. The environment could not resolve `registry.npmjs.org` (`EAI_AGAIN`), so a full `npm install`, TypeScript semantic typecheck with installed React/Vite typings, and actual Vite production compile could not be run here. The known incomplete lockfile has been removed to avoid the Netlify `npm ci` failure; Netlify's online build should resolve the pinned direct dependencies from `package.json`. Do not treat the Vite build as certified until the first Netlify production deploy completes successfully.
