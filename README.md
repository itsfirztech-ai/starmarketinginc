# Star Marketing Agency Inc — Netlify-ready website

This deployment package serves a **five-page, pre-rendered, dependency-free static build** on Netlify to avoid Vite/npm installation problems. The full original React + Vite + TypeScript + Tailwind source is included under `react-source/` for future development. **The production site currently uses the progressively enhanced static build, not the React runtime.** Changes to React source must be regenerated and copied to `static-site/` before publishing; this is explained below.

## One-click-safe GitHub → Netlify setup
1. In GitHub **replace the old repository files completely** with the CONTENTS of this ZIP, not the ZIP itself. Ensure `package.json`, `netlify.toml`, `static-site/`, `scripts/`, `tests/` and `react-source/` are directly at repository root. Do not retain an old root `package-lock.json`.
2. Commit changes to `main`.
3. In Netlify open the **existing site**, ensure **Project configuration → Build & deploy → Continuous deployment** is linked to the correct repository's `main` branch.
4. Use **Base directory** blank, **Build command** `npm run build`, **Publish directory** `dist`. Clear any older overrides pointing to `react-source`, `build`, or a prior branch. Node version 22 is set in `netlify.toml`.
5. Open **Deploys**, select **Trigger deploy → Clear cache and deploy site** if needed. A successful production deploy shows **Published**. The `netlify.app` URL is live; a Deploy Preview is not the production URL.
6. Go to **Forms**, find `star-inquiry` (Netlify detection happens after successful deploy), enable notifications to a verified marketing-agency email. A REAL test submission must appear in Forms and trigger a notification before promising lead delivery.
7. Open all five pages, test navigation and mobile layout. Form will not submit on a localhost preview; this is intentional.

## Contact details and business facts
Business phone `+1 631 397 6692` is published in click-to-call links. The Long Island limousine Gmail address is **not** used on Star Marketing Agency. The agency email, booking calendar, verified testimonials and project cases remain unset; add real details before launch.

## SEO and domain
Netlify automatically supplies the production `URL` variable, and `scripts/postbuild.mjs` sets canonical URLs, sitemap and robots. Production builds get indexable metadata; Deploy Previews remain `noindex`. If a custom domain is verified, set `VITE_SITE_URL=https://your-real-domain.com` in Netlify environment variables and redeploy. Check `/robots.txt`, `/sitemap.xml`, HTML titles and canonical after publication.

## Codebase and local test
From the ZIP root, with Node 20 or newer:
```
npm ci
npm run build
npm run preview
```
`npm ci` is dependency-free with the included valid lockfile. Visit `http://localhost:4173`. `npm test` checks five pages, contact form markup, assets and phone number. The live form requires Netlify.

### Advanced React source editing
`react-source/` contains the editable Vite/React/TypeScript application and the standalone static generator. On a machine with npm internet access:
```
cd react-source
npm install
npm run build:static-fallback
```
The script builds `react-source/dist/`; copy its contents to **root** `static-site/` and commit. Use `npm run build` inside `react-source/` to build the full React bundle and verify TypeScript when dependencies are available; this optional mode was NOT verified in this offline environment. Do not overwrite root `package.json` with the React package.json.

## Privacy and integrations
Form data is processed by Netlify Forms. It is not a confirmed meeting or guaranteed delivery to email until notifications are enabled and tested. GA4/GTM and other analytics IDs remain blank; implement only consent-gated tracking and never send PII to analytics. Vite environment files containing secrets must not be committed. No fabricated client reviews, office location or performance claims are included.
