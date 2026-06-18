# Sun AI Production QA Report

Date: 2026-06-18
Project: `/home/sk/sunv2`
Live site: `https://www.sunai.one/`
Vercel project checked: `mdeai/sunaiagencyproject` (`prj_X3YYdpZCzJNxmO9nYhLEha6JAPUs`)
Supabase project checked: `icpzzsslayhywxoniekw`

## 1. Overall Verdict

| Verdict | Summary |
| --- | --- |
| PASS WITH WARNINGS | Production is live, Vite assets load, Supabase schema/RLS/storage checks pass, Edge Function health is OK, and unauthenticated dashboard access redirects to auth. Main warnings are Vercel env hygiene, stale local `.vercel` linkage, `/dashboard` client-side 404, no meta description, large bundle size, and npm audit warnings during Vercel build. |

## 2. Production HTTP Status

| Check | Result |
| --- | --- |
| `curl -I https://www.sunai.one/` | HTTP 200 |
| Redirect loop | None detected |
| Downloaded HTML | 436 bytes, Vite SPA shell |
| Title | `Sun AI Agency Project` |
| Meta description | Missing |
| Root element | Present |
| JS asset | `/assets/index-D0S8Cb3C.js` |
| CSS asset | `/assets/index-D9hHt3YB.css` |

## 3. Route Test Table

HTTP checks return the Vite SPA shell for all paths, including unknown routes. Browser checks are needed to know whether the route is valid after React loads.

| Route | HTTP status | Browser result | Expected? | Issue |
| --- | ---: | --- | --- | --- |
| `/` | 200 | Homepage renders | Yes | None |
| `/wizard` | 200 | Wizard step 1 renders | Yes | None |
| `/dashboard` | 200 | Client-side 404 page | No | Footer/requested route may confuse users; real route is `/app/dashboard` |
| `/app/dashboard` | 200 | Redirects to `/auth?return=%2Fapp%2Fdashboard` | Yes | None |
| `/login` | 200 | Route config redirects to `/auth` | Yes | Legacy alias only |
| `/auth` | 200 | Auth page renders | Yes | None |
| `/auth/callback` | 200 | SPA shell; callback route exists | Yes | Not functionally tested with OAuth |
| `/not-a-real-route` | 200 | SPA shell, client should show 404 | Expected for SPA hosting | HTTP status does not expose 404 |

## 4. Browser / Playwright Findings

| Page | Result |
| --- | --- |
| Homepage | Renders with header, nav, hero, service cards, and visible CTAs |
| Wizard | Renders step 1 form, left step rail, right analysis panel, and save status |
| Auth | Renders sign-in form, Google/LinkedIn buttons, create account tab, and guest link |
| `/app/dashboard` | Correctly redirects unauthenticated user to `/auth?return=%2Fapp%2Fdashboard` |
| `/dashboard` | Renders app-level 404 |

Artifacts:

| Artifact | Path |
| --- | --- |
| Homepage snapshot | `.playwright-cli/page-2026-06-18T14-35-02-370Z.yml` |
| Wizard snapshot | `.playwright-cli/page-2026-06-18T14-35-05-139Z.yml` |
| Auth snapshot | `.playwright-cli/page-2026-06-18T14-35-07-263Z.yml` |
| Protected dashboard redirect snapshot | `.playwright-cli/page-2026-06-18T14-35-09-398Z.yml` |
| `/dashboard` 404 snapshot | `.playwright-cli/page-2026-06-18T14-35-26-177Z.yml` |

Note: The wrapper produced YAML snapshots. PNG screenshots were not saved by the wrapper command syntax used.

## 5. Console / Network Errors

| Area | Result |
| --- | --- |
| Browser console errors | 0 critical errors reported by Playwright wrapper |
| Browser console warnings | 0 warnings reported by Playwright wrapper |
| Failed JS/CSS network assets | None found in tested pages |
| Main JS | HTTP 200, `application/javascript`, 2,727,908 bytes |
| Main CSS | HTTP 200, `text/css`, 198,911 bytes |

## 6. Supabase Frontend Env Safety

| Check | Result |
| --- | --- |
| Frontend Supabase URL source | `import.meta.env.VITE_SUPABASE_URL` |
| Frontend Supabase key source | `import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY` |
| Edge Function base URL | Built from `VITE_SUPABASE_URL` in `src/lib/supabase.ts` |
| Hardcoded old project ref in `src/` | Not found in current scan |
| Service role key in frontend bundle path | Not found in frontend client code |
| Service role references in repo scan | Found only in docs/import notes and server-side Edge Function source under `src/supabase/functions/server` |

Relevant files:

| File | Finding |
| --- | --- |
| `src/lib/supabase.ts` | Uses Vite env and constructs `/functions/v1/make-server-283466b6` safely |
| `src/utils/supabase/info.tsx` | Uses Vite env compatibility shim |

## 7. Edge Function Health Result

| Check | Result |
| --- | --- |
| URL | `https://icpzzsslayhywxoniekw.supabase.co/functions/v1/make-server-283466b6/health` |
| HTTP status | 200 |
| `status` | `ok` |
| `schema` | `migrated` |
| `onboardingSchema` | `migrated` |

## 8. Auth / Protected Route Result

| Test | Result |
| --- | --- |
| Login page renders | Pass |
| Signup UI present | Pass, via `Create Account` tab on `/auth` |
| OAuth buttons render | Pass, Google and LinkedIn buttons visible |
| Dashboard unauthenticated access | Pass, `/app/dashboard` redirects to `/auth?return=%2Fapp%2Fdashboard` |
| Protected data exposure unauthenticated | No protected dashboard data visible during smoke test |
| Real user auth | Not tested; no safe test account was used or created |

## 9. Remote Schema / RLS / Storage Verification

Read-only remote SQL checks passed.

| Check | Expected | Actual | Result |
| --- | ---: | ---: | --- |
| Public tables | 40 | 40 | Pass |
| Public policies | 128 | 128 | Pass |
| RLS-disabled public tables | 0 | 0 | Pass |
| Document bucket exists | Yes | Yes | Pass |
| Document bucket public | `false` | `false` | Pass |

## 10. Vercel Env Verification

| Check | Result |
| --- | --- |
| `vercel whoami` with token | `it-2988` |
| Project list under `mdeai` | `sunaiagencyproject` found with production URL `https://www.sunai.one` |
| Latest production deployment | Ready |
| Required frontend env names | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` present |

Important finding: production Vercel env also contains server/database names:

| Env name present in Vercel Production | Risk |
| --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | Should not live in Vercel frontend project env for a Vite app |
| `SUPABASE_SECRET_KEY` | Should not live in Vercel frontend project env for a Vite app |
| `SUPABASE_JWT_SECRET` | Should not live in Vercel frontend project env for a Vite app |
| `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING` | Not needed by the Vite frontend |
| `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE` | Not needed by the Vite frontend |

Values were not printed. Vercel showed them as encrypted.

## 11. Performance / Asset Findings

| Asset | Status | Type | Size |
| --- | ---: | --- | ---: |
| `/assets/index-D0S8Cb3C.js` | 200 | `application/javascript` | 2,727,908 bytes |
| `/assets/index-D9hHt3YB.css` | 200 | `text/css` | 198,911 bytes |

Build warnings:

| Warning | Impact |
| --- | --- |
| Main JS chunk exceeds 500 kB | Slower first load, especially on mobile |
| `src/lib/supabase.ts` is both statically and dynamically imported | Dynamic import will not split that module |
| Vercel install reported 11 npm vulnerabilities | Needs dependency audit before final launch confidence |

## 12. Blockers

| Priority | Blocker | Why it matters | Fix |
| --- | --- | --- | --- |
| P0 | Server-only/database env vars are present in Vercel Production env | This is a Vite frontend deployment. Service role and DB secrets should not be available to frontend build/deploy env unless a server runtime genuinely needs them. | Remove server-only secrets from the Vercel frontend project after confirming no Vercel server functions require them. Keep them in Supabase Edge Function secrets only. |
| P1 | Local `.vercel/project.json` currently points to new project `mdeai/sunv2`, not production `mdeai/sunaiagencyproject` | Future `vercel` commands from this repo may target the wrong project. | Relink local repo to `prj_X3YYdpZCzJNxmO9nYhLEha6JAPUs` or document exact env variables required for CLI commands. |
| P1 | `/dashboard` is not a valid route and renders 404 | Users and external links may expect `/dashboard`. | Add redirect from `/dashboard` to `/app/dashboard`, or update all references to use `/app/dashboard`. |

## 13. Warnings

| Priority | Warning | Suggested action |
| --- | --- | --- |
| P1 | `envbk.md` secrets must be treated as exposed | Rotate all credentials that ever appeared there. |
| P2 | Homepage lacks meta description | Add production SEO description in `index.html` or metadata handling. |
| P2 | Vite main JS bundle is 2.7 MB before compression | Add route-level code splitting and lazy-load dashboard/heavy pages. |
| P2 | SPA returns HTTP 200 for unknown routes | Acceptable for static SPA, but monitor SEO and analytics. Consider Vercel rewrites plus client 404 handling. |
| P2 | Npm audit found 11 vulnerabilities during Vercel build | Run dependency audit and fix non-breaking updates first. |
| P3 | Wrapper screenshots did not save PNGs | Use Playwright test or a small script with installed browser dependency for durable PNG evidence. |

## 14. Exact Fixes Needed

### Core

1. Remove server-only Supabase and Postgres env vars from Vercel frontend Production and Preview after confirming no Vercel server runtime needs them.
2. Relink `.vercel/project.json` to `mdeai/sunaiagencyproject` (`prj_X3YYdpZCzJNxmO9nYhLEha6JAPUs`) or avoid committing `.vercel`.
3. Add `/dashboard` redirect to `/app/dashboard`.
4. Rotate all credentials that appeared in `envbk.md`.
5. Generate Supabase TypeScript types from the rebuilt remote schema.
6. Reduce or disable runtime schema creation in `ensure-schema.tsx`.

### Advanced

1. Split marketing, wizard, auth, and dashboard routes with `React.lazy`.
2. Split heavy dashboard pages and charts into separate chunks.
3. Add a production smoke test script for:
   - homepage render
   - wizard render
   - auth render
   - protected dashboard redirect
   - Edge Function health
   - asset 200 checks
4. Add a Vercel env drift check that fails when server-only env names appear in the frontend project.
5. Add a Supabase read-only health check to CI for schema counts, RLS disabled count, policy count, bucket presence, and Edge Function health.
6. Add SEO metadata coverage for core public pages.

## 15. Commit / Deploy Readiness Checklist

| Item | Status |
| --- | --- |
| Production site returns HTTP 200 | Done |
| Vite assets load | Done |
| Browser smoke test passes core pages | Done |
| Supabase Edge Function health passes | Done |
| Remote schema/RLS/storage checks pass | Done |
| Protected dashboard blocks unauthenticated access | Done |
| Vercel frontend env names present | Done |
| Server-only env removed from Vercel frontend project | Blocked |
| `.vercel` linkage corrected | Blocked |
| `/dashboard` redirect added or documented | Blocked |
| Secrets from `envbk.md` rotated | Blocked |
| Supabase types generated | Pending |
| Bundle-size cleanup planned | Pending |
| Commit created | Not done |
| GitHub push | Not done |
