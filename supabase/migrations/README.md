# Supabase migrations — single source of truth

All database migrations for this project live in this directory. Apply them from the **repository root** with the Supabase CLI:

```bash
# From repo root
supabase db push
```

Or link your project and run:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

**Canonical path:** `supabase/migrations/` (this directory).  
Migrations in `src/supabase/migrations/` are legacy; copies of the same files were added here so CLI and CI use one path. Do not add new migrations under `src/supabase/migrations/`.

**Order:** Files are applied in timestamp order (`YYYYMMDDHHmmss_description.sql`).  
**Ref:** `tasks/lean/12-next-steps-implementation.md` (073).

### Applying a single migration (when `db push` isn’t possible)

If remote migration history doesn’t match local (e.g. different timestamps) or you prefer to run one file:

1. **Supabase Dashboard** → SQL Editor → paste and run the contents of  
   `supabase/migrations/20260309100000_workflow_financial_tables.sql`.
2. **psql** (from a host that can reach your DB):  
   `psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/20260309100000_workflow_financial_tables.sql`
