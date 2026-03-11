---
task_id: 074-SEC
title: Restrict CORS origin in production edge functions
phase: CRITICAL
priority: P0
status: Not Started
estimated_effort: 1 hour
area: infrastructure
skill: [data/supabase-edge-functions, devops/security-hardening]
subagents: [security-auditor]
edge_function: make-server-283466b6
depends_on: []
---

# 074 — CORS Origin Restriction for Production

## Summary Table

| Aspect | Details |
|--------|---------|
| **File** | `src/supabase/functions/server/index.tsx` (line 33) |
| **Current** | `origin: "*"` — any domain can call all 68+ edge function routes |
| **Target** | Production: restrict to Vercel domain(s). Dev: keep `"*"` |
| **Env Var** | `ALLOWED_ORIGINS` — comma-separated list of allowed origins |
| **Real-World** | "Malicious site embeds iframe calling `/crm/clients` with stolen JWT → exfiltrates client data" |

---

## Description

**The situation:** `index.tsx` line 33 has `origin: "*"` in the Hono CORS middleware. This allows any website to make cross-origin requests to all 68+ edge function endpoints, including authenticated CRM, financial, and strategy routes.

**Why it matters:** With `origin: "*"`, a malicious website can make AJAX requests to the edge function API using a victim's browser cookies/tokens. Combined with XSS or social engineering, this enables data exfiltration from authenticated endpoints.

**What already exists:** Hono's `cors()` middleware is already configured at `index.tsx:29-39`. It just needs the `origin` value changed from `"*"` to an environment-aware function.

**The build:**
1. Read `ALLOWED_ORIGINS` from `Deno.env.get("ALLOWED_ORIGINS")`
2. If set: parse as comma-separated list, use Hono's `origin` option as a function that checks against the list
3. If not set (local dev): fall back to `"*"`
4. Set `ALLOWED_ORIGINS` as a Supabase Edge Function secret

**Example:** After fix, `curl -H "Origin: https://evil.com" .../crm/clients` gets no `Access-Control-Allow-Origin` header → browser blocks response. Requests from `https://sunaiagencyproject100.vercel.app` work normally.

---

## Acceptance Criteria

- [ ] `origin: "*"` replaced with environment-aware origin check
- [ ] `ALLOWED_ORIGINS` env var read from `Deno.env.get()`
- [ ] When `ALLOWED_ORIGINS` is set: only listed origins get CORS headers
- [ ] When `ALLOWED_ORIGINS` is unset: falls back to `"*"` (local dev)
- [ ] Supabase secret set: `supabase secrets set ALLOWED_ORIGINS="https://sunaiagencyproject100.vercel.app,https://yourdomain.com"`
- [ ] Preflight (OPTIONS) requests still work for allowed origins
- [ ] Redeploy edge function after change
- [ ] Verify: `curl -H "Origin: https://evil.com" ...` gets no CORS header

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| CORS middleware | `src/supabase/functions/server/index.tsx` | Replace `origin: "*"` with env-aware function |
| Secret | Supabase Dashboard or CLI | Set `ALLOWED_ORIGINS` secret |

---

## Implementation

```typescript
// index.tsx — replace the cors() config
const allowedOrigins = Deno.env.get("ALLOWED_ORIGINS")?.split(",").map(o => o.trim());

app.use("/*", cors({
  origin: allowedOrigins
    ? (origin) => allowedOrigins.includes(origin) ? origin : ""
    : "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));
```

---

## Outcomes

| Before | After |
|--------|-------|
| Any domain can call edge functions | Only listed origins get CORS headers |
| Zero origin validation | Environment-aware: strict in prod, open in dev |
| Security audit finding | Resolved |
