# Deploy Edge Functions and test (CORS + wizard list)

Deploy the single Hono Edge Function (`server`), set production env (ENVIRONMENT, ALLOWED_ORIGINS), run migrations, then verify CORS and wizard list behavior.

---

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- Project ref: `necxcwhuzylsumlkkmlk` (from `VITE_SUPABASE_URL` in `.env.local`)
- `SUPABASE_ACCESS_TOKEN` or `supabase login` done

---

## 1. Sync function code (source of truth: `src/supabase/functions/server/`)

The CLI deploys from `supabase/functions/` and expects an `index.ts` entrypoint. Sync from source (this repo includes `index.ts` that strips the Supabase path prefix and delegates to the Hono app in `index.tsx`):

```bash
# From repo root
npm run supabase:sync-functions
```

Or manually:

```bash
cp -r src/supabase/functions/server/* supabase/functions/server/
```

---

## 2. Link project (first time only)

```bash
cd /path/to/sunv2
supabase link --project-ref necxcwhuzylsumlkkmlk
```

If you don’t have `supabase/config.toml`, run `supabase init` first, then set `project_id = "necxcwhuzylsumlkkmlk"` in `supabase/config.toml`, or pass `--project-ref` when deploying.

---

## 3. Apply migrations

Apply migrations before deploying functions so `wizard_sessions.user_id` and AI tables exist:

```bash
supabase db push
```

Or, if you use a direct DB URL, run the SQL in `supabase/migrations/` in order against your project.

---

## 4. Set Edge Function secrets (production)

Set these in the Supabase Dashboard (**Project → Edge Functions → Secrets**) or via CLI:

**Required for all environments:**

- `SUPABASE_URL` — e.g. `https://necxcwhuzylsumlkkmlk.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` — from Dashboard → Settings → API (service_role)
- `SUPABASE_ANON_KEY` — from Dashboard → Settings → API (anon)
- `GEMINI_API_KEY` — your Gemini API key

**Production-only (for CORS and behavior):**

- `ENVIRONMENT` = `production`
- `ALLOWED_ORIGINS` = comma-separated list of front-end origins, no trailing slashes  
  Example: `https://yourdomain.com,https://www.yourdomain.com`

CLI example:

```bash
supabase secrets set SUPABASE_URL="https://necxcwhuzylsumlkkmlk.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
supabase secrets set SUPABASE_ANON_KEY="your-anon-key"
supabase secrets set GEMINI_API_KEY="your-gemini-key"
# Production CORS (set only when deploying for production)
supabase secrets set ENVIRONMENT="production"
supabase secrets set ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

For **local/dev** testing, omit `ENVIRONMENT` and `ALLOWED_ORIGINS` (or set `ENVIRONMENT=development`); CORS will allow `*`.

---

## 5. Deploy the Edge Function

```bash
supabase functions deploy server
```

Function URL:

`https://necxcwhuzylsumlkkmlk.supabase.co/functions/v1/server`

All app routes live under the same function with prefix `/make-server-283466b6`, e.g.:

- Health: `.../functions/v1/server/make-server-283466b6/health`
- Wizard list: `.../functions/v1/server/make-server-283466b6/wizard/list/:userId`

---

## 6. Verify and test

### 6.1 Health check

```bash
curl -s "https://necxcwhuzylsumlkkmlk.supabase.co/functions/v1/server/make-server-283466b6/health" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

Expected: `{"status":"ok","timestamp":"...","schema":"migrated"}` or `"schema": "<error>"` if migrations/DB not ready.

### 6.2 CORS (production)

With `ENVIRONMENT=production` and `ALLOWED_ORIGINS=https://yourdomain.com`:

**Allowed origin —** response should include `Access-Control-Allow-Origin: https://yourdomain.com`:

```bash
curl -s -D - -X OPTIONS \
  "https://necxcwhuzylsumlkkmlk.supabase.co/functions/v1/server/make-server-283466b6/health" \
  -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: GET"
```

**Disallowed origin —** either no `Access-Control-Allow-Origin` or a single allowed origin (not the request origin):

```bash
curl -s -D - -X OPTIONS \
  "https://necxcwhuzylsumlkkmlk.supabase.co/functions/v1/server/make-server-283466b6/health" \
  -H "Origin: https://evil.example.com"
```

In development (no `ENVIRONMENT=production` or no `ALLOWED_ORIGINS`), CORS allows `*` for any origin.

### 6.3 Wizard list (migration applied)

With `wizard_sessions.user_id` present (migration applied), list returns 200 and filtered sessions:

```bash
curl -s "https://necxcwhuzylsumlkkmlk.supabase.co/functions/v1/server/make-server-283466b6/wizard/list/YOUR_USER_UUID" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

Expected: `{"sessions":[...]}` (possibly empty array).

### 6.4 Wizard list (migration not applied — 503)

If `user_id` is missing (e.g. old DB before migration), the list endpoint must return **503** and a schema message (no unfiltered sessions):

```bash
curl -s -w "\n%{http_code}" "https://necxcwhuzylsumlkkmlk.supabase.co/functions/v1/server/make-server-283466b6/wizard/list/some-user-id" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

Expected: body contains `"Database schema outdated; please apply migrations (wizard_sessions.user_id)."` and HTTP status **503**.

---

## 7. Checklist

- [ ] Migrations applied: `supabase db push`
- [ ] Secrets set: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `GEMINI_API_KEY`
- [ ] Production: `ENVIRONMENT=production`, `ALLOWED_ORIGINS=https://...`
- [ ] Function deployed: `supabase functions deploy server`
- [ ] Health returns 200 and `status: "ok"`
- [ ] CORS: allowed origin gets `Access-Control-Allow-Origin: <that origin>`; disallowed does not
- [ ] Wizard list: 200 with `sessions` when `user_id` exists; 503 with schema message when column missing

---

## Troubleshooting

- **404 on routes:** Ensure URL includes `/make-server-283466b6/` before the route path.
- **CORS still `*` in prod:** Confirm `ENVIRONMENT=production` and `ALLOWED_ORIGINS` are set in Edge Function secrets (Dashboard or `supabase secrets set`).
- **503 on wizard list:** Apply migration `20260307120000_enhance_wizard_sessions.sql` (or run `supabase db push`).
- **Schema error on health:** Ensure migrations that create `ai_cache` and `ai_run_logs` have been applied; `ensure-schema` is read-only and does not create tables.

Refs: `tasks/lean/12-next-steps-implementation.md`, `tasks/audit/07-supa-audit.md` (§ 2.2, 2.4).
