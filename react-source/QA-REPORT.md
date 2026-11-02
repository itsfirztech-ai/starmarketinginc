# QA report — Star Marketing Agency Inc

## Checks completed

- TypeScript/TSX syntax transpilation passed for all 11 source files.
- A temporary declaration-based TypeScript check passed with `noUnusedLocals` and `noUnusedParameters` enabled. This is supplementary only; it is not a substitute for the real project typecheck with installed dependency typings.
- Standalone HTML generation passed for all five routes.
- Automated site checks: **12 passed, 0 failed**.
- Browser QA: **34 checks passed** across five routes at 320, 375, 390, 768, 1024 and 1440 px; no horizontal overflow or page errors were detected.
- Mobile navigation open/close behavior was checked.
- Contact form invalid-input validation was checked.
- Valid form input with no endpoint correctly shows a not-configured error and never displays success.
- Phone contact preference correctly requires a phone number.
- Each route has its own H1, title, description and JSON-LD in generated HTML.
- A Vite-output fixture test verified that the static route generator preserves Vite CSS/JS bundle references while producing route-specific pre-rendered pages.
- Production-origin simulation generated five canonical URLs and a five-entry sitemap.
- Deploy Preview and unconfigured builds are set to `noindex`.
- Netlify config points to `npm run build`, publishes `dist`, uses Node 22, and sets the Netlify base path to `/`.
- The incomplete prior `package-lock.json` has been removed so Netlify does not try to run `npm ci` against an invalid lockfile.

## Not certified in this environment

The npm registry DNS lookup failed with `EAI_AGAIN registry.npmjs.org`. Therefore these could not be run here:

- Full `npm install` / resolved dependency installation.
- The real `npm run typecheck` using installed React, Vite and Lucide typings.
- Actual `vite build` production compilation against the installed dependencies.
- Netlify's remote production deployment.
- End-to-end real form delivery to an agency inbox.
- Live Lighthouse scores or cross-browser certification.

The project is configured for Netlify to resolve the pinned direct dependencies from `package.json` using `npm install`. The known incomplete lockfile failure has been removed. A successful online Netlify production build is still required before calling the release fully production-certified.
