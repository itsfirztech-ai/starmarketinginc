# Star Marketing Agency Inc — pre-launch checklist

## Business information
- [ ] Confirm exact legal/brand name display.
- [ ] Add verified public contact email.
- [ ] Add verified business phone, including country code.
- [ ] Add approved social profile URLs.
- [ ] Add real booking calendar URL if consultations can be booked online.
- [ ] Add a legally reviewed privacy policy and terms where needed.
- [ ] Approve all service descriptions and pricing language.
- [ ] Add real team/fleet/client/project photography only with rights and permission.
- [ ] Replace illustrative concept work with approved real case studies when available.
- [ ] Add genuine customer reviews only with permission and source verification.

## GitHub and Netlify
- [ ] Corrected files committed at repository root on `main`.
- [ ] Old incomplete root `package-lock.json` deleted.
- [ ] Netlify production branch is `main`.
- [ ] Build command is `npm run build`.
- [ ] Publish directory is `dist`.
- [ ] Node version is `22`.
- [ ] `VITE_BASE_PATH=/` configured.
- [ ] Production deployment reports Published.
- [ ] All five direct URLs load from the production domain.
- [ ] Netlify primary/custom domain and HTTPS verified.

## Lead capture
- [ ] Create Formspree or compatible JSON form endpoint.
- [ ] Configure notification recipient and spam protection.
- [ ] Set `VITE_FORM_ENDPOINT` in Netlify.
- [ ] Submit a real test inquiry and confirm inbox delivery.
- [ ] Confirm phone preference requires a valid phone number.
- [ ] Confirm no false success state occurs on errors or missing endpoint.
- [ ] Confirm reply handling and data retention process.

## SEO and analytics
- [ ] Set final production URL/custom domain.
- [ ] Check canonical tags on all five pages.
- [ ] Check `robots.txt` and `sitemap.xml` on production.
- [ ] Add production sitemap to Google Search Console.
- [ ] Configure GA4 or GTM only if used.
- [ ] Test events after analytics consent; ensure no personal form data is sent.
- [ ] Add Meta Pixel/Google Ads only after separate consent-aware implementation and conversion tests.

## Final QA
- [ ] Test 320, 375/390, 768, 1024 and 1440 px layouts.
- [ ] Test keyboard navigation and visible focus.
- [ ] Test reduced-motion preference.
- [ ] Test all links, CTAs, form validation, loading, failure and success states.
- [ ] Test Chrome, Safari, Firefox and mobile browsers.
- [ ] Run `npm run typecheck`, `npm run build` and `npm test` after dependency installation.
- [ ] Run Lighthouse against the live production URL; record actual scores rather than estimates.
