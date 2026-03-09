# Audit 07 — Improvement prompts index

Prompts in this folder that fix items from **`tasks/audit/07-supa-audit.md`**. Each prompt includes mermaid diagrams and acceptance criteria.

| Audit section | Prompt | Title |
|---------------|--------|--------|
| § 1.1 Blocker | [071-gemini-api-key-in-header.md](071-gemini-api-key-in-header.md) | Move Gemini API key to `x-goog-api-key` header |
| § 1.2 Blocker | [072-gemini-timeout-and-retry.md](072-gemini-timeout-and-retry.md) | Add 30s timeout (and optional retry) for Gemini |
| § 2.1 Amber | [073-migrations-path-vs-cli.md](073-migrations-path-vs-cli.md) | Align migrations path with Supabase CLI |
| § 2.2 Amber | [074-cors-origin-restrict-production.md](074-cors-origin-restrict-production.md) | Restrict CORS origin in production |
| § 2.3 Amber | [075-ai-schema-single-source-migrations.md](075-ai-schema-single-source-migrations.md) | AI schema: migrations as single source of truth |
| § 2.4 Amber | [076-wizard-list-user-id-safety.md](076-wizard-list-user-id-safety.md) | Wizard list: safe behavior when `user_id` missing |
| KV / workflow / financial | [070-migrate-kv-workflow-financial-to-supabase-tables.md](070-migrate-kv-workflow-financial-to-supabase-tables.md) | Migrate workflow + financial off KV to Supabase tables |

**Recommended order:** 071 → 072 (blockers), then 073–076 (amber), then 070 (KV migration).
