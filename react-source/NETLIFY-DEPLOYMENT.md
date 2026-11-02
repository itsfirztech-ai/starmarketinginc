# Netlify deployment — Star Marketing Agency Inc

This project is configured to build on Netlify from the GitHub `main` branch.

## A. Fix the previous repository before deploying

1. Open the GitHub repository `star-marketing-agency-website`.
2. Replace/update the project files with this corrected ZIP's contents at the repository root.
3. If a root `package-lock.json` from the earlier project is still present, open it in GitHub, use the delete/trash action, and commit that deletion. It was incomplete and can trigger an `npm ci` failure.
4. Commit the corrected files to `main`, or merge a pull request only after checking its diff.

## B. Check Netlify build settings

Open Netlify → your Star Marketing site → Site configuration → Build & deploy → Build settings.

- Base directory: blank
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `22`

These values are also defined in `netlify.toml`.

## C. Set environment variables

Open Site configuration → Environment variables. Set:

- `VITE_BASE_PATH` = `/`
- `VITE_CONTACT_EMAIL` = verified agency email (optional until known)
- `VITE_CONTACT_PHONE` = verified phone (optional until known)
- `VITE_FORM_ENDPOINT` = HTTPS Formspree JSON endpoint (required for real lead delivery)
- `VITE_BOOKING_URL` = real scheduling URL (optional; otherwise consultation CTAs lead to the inquiry form)
- `VITE_GA4_ID` or `VITE_GTM_ID` = only if configured and tested
- `VITE_SITE_URL` = final HTTPS primary domain if you want to override Netlify's production URL

Do not add secret API keys as `VITE_` variables; they become public in the browser bundle.

## D. Publish

1. Open Deploys.
2. Confirm Production branch is `main`.
3. Select Trigger deploy → Clear cache and deploy site.
4. Open the deployment log and wait for Published.
5. Open the main Netlify site URL, not the Deploy Preview URL.
6. Test `/`, `/digital-marketing/`, `/ai-web-development/`, `/about/` and `/contact/` directly.

A PR/Deploy Preview is a review build. It does not become production until the changes reach the production branch (`main`).

## E. Configure the form

Create a Formspree form, configure notifications and spam controls, then set its HTTPS endpoint as `VITE_FORM_ENDPOINT`. Redeploy and submit a real test. The website intentionally shows an error/not-configured state until a real endpoint returns HTTP 2xx.

## F. If the build still fails

Open the failed deploy → Deploy log and inspect the first actual `npm ERR!` or TypeScript error. Do not merge an auto-generated PR blindly. The most likely old-project failure addressed by this release was the incomplete `package-lock.json`; confirm it is deleted from the GitHub root before retrying.
