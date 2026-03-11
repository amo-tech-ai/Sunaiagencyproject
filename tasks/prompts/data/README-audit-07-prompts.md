# Task Prompts — Master Index

Prompts for all remaining implementation tasks, ordered by priority.

## Remaining Tasks

### Medium (P2) — Schema & Testing

| # | Prompt | Title | Skill | Status |
|---|--------|-------|-------|--------|
| 073 | [073-migrations-path-vs-cli.md](073-migrations-path-vs-cli.md) | Align migrations path with CLI | `data/database-migration` | Not Started |
| 080 | [080-production-smoke-test.md](080-production-smoke-test.md) | Production smoke test | `features/feature-spec` | Not Started |
| 081 | [081-production-oauth-config.md](081-production-oauth-config.md) | Google OAuth + LinkedIn OIDC | `skills/supabase-auth` | Not Started |

### Low (P3) — Infrastructure & Enhancements

| # | Prompt | Title | Skill | Status |
|---|--------|-------|-------|--------|
| 067 | [../067-health-check-cron.md](../067-health-check-cron.md) | Health check CRON | `data/supabase-edge-functions`, `devops/edge-function-creator` | Not Started |
| 068 | [../068-stale-deal-alerts.md](../068-stale-deal-alerts.md) | Stale deal alerts | `data/supabase-edge-functions` | Not Started |
| 082 | [082-cicd-pipeline.md](082-cicd-pipeline.md) | CI/CD pipeline | `devops/cicd-pipeline` | Not Started |
| 083 | [083-error-monitoring.md](083-error-monitoring.md) | Error monitoring (Sentry) | *skill needed* | Not Started |

### Completed (archived to `tasks/archive/`)

| # | Title | Completed |
|---|-------|-----------|
| 064 | Onboarding agent rewrite | v0.25.0 |
| 070 | KV → Supabase tables (workflow, financial, document) | 2026-03-10 |
| 071 | Gemini API key in header | v0.25.0 |
| 072 | Gemini 30s timeout + 3-retry backoff | 2026-03-10 |
| 074 | CORS origin restriction for production | 2026-03-10 |
| 075 | AI schema: single source of truth (ensure-schema cleanup) | 2026-03-10 |
| 076 | Wizard list user_id safety | v0.25.0 |
| 077 | CRM contacts column fix | 2026-03-10 |
| 078 | Enable 4 Realtime broadcast triggers | 2026-03-10 |
| 079 | RLS policy audit (4 tables fixed) | 2026-03-10 |

---

## Skills Coverage

### Available skills that map to remaining tasks

| Skill Path | Used By Tasks |
|-----------|---------------|
| `data/supabase-edge-functions` | 067 |
| `data/database-migration` | 073 |
| `devops/cicd-pipeline` | 082 |
| `devops/edge-function-creator` | 067 |
| `skills/supabase-auth` | 081 |
| `features/feature-spec` | 080 |

### Missing skills (suggested)

| Skill | Needed For | Description |
|-------|-----------|-------------|
| `devops/error-monitoring` | 083 | Sentry integration patterns (React + Deno) |
| `devops/cron-scheduling` | 067, 068 | pg_cron + Supabase scheduled functions |
| `testing/smoke-test` | 080 | Browser smoke testing patterns |
| `features/notification-system` | 068 | In-app + email notification patterns |
