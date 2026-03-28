// S06-ENSURE-SCHEMA — Auto-migration for AI tables
// Runs once on server startup. Connects to Postgres directly via SUPABASE_DB_URL
// to ensure ai_run_logs and ai_cache have all required columns.
// This fixes the "column does not exist" errors when tables were created
// via Supabase UI with incomplete schemas.

import postgres from "npm:postgres@3.4.5";

let migrationDone = false;
let migrationError: string | null = null;
let onboardingMigrationDone = false;

/**
 * Ensure the ai_run_logs and ai_cache tables have the correct columns.
 * Uses ALTER TABLE ADD COLUMN IF NOT EXISTS — safe to run multiple times.
 * Runs only once per server lifecycle (idempotent guard via `migrationDone`).
 */
export async function ensureAISchema(): Promise<{ ok: boolean; error?: string }> {
  if (migrationDone) return { ok: !migrationError, error: migrationError || undefined };

  const dbUrl = Deno.env.get("SUPABASE_DB_URL");
  if (!dbUrl) {
    console.log("[Schema] SUPABASE_DB_URL not set — skipping auto-migration");
    migrationDone = true;
    migrationError = "SUPABASE_DB_URL not configured";
    return { ok: false, error: migrationError };
  }

  let sql: ReturnType<typeof postgres> | null = null;

  try {
    sql = postgres(dbUrl, {
      max: 1,
      idle_timeout: 5,
      connect_timeout: 10,
    });

    console.log("[Schema] Running AI table auto-migration...");

    // ─── ai_run_logs ──────────────────────────────────────────────────
    // Create table if it doesn't exist at all
    await sql`
      CREATE TABLE IF NOT EXISTS ai_run_logs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    // Add each expected column if missing (safe on existing tables)
    await sql`ALTER TABLE ai_run_logs ADD COLUMN IF NOT EXISTS session_id text`;
    await sql`ALTER TABLE ai_run_logs ADD COLUMN IF NOT EXISTS org_id uuid`;
    await sql`ALTER TABLE ai_run_logs ADD COLUMN IF NOT EXISTS prompt_type text NOT NULL DEFAULT 'unknown'`;
    await sql`ALTER TABLE ai_run_logs ADD COLUMN IF NOT EXISTS model text NOT NULL DEFAULT 'gemini-3-flash-preview'`;
    await sql`ALTER TABLE ai_run_logs ADD COLUMN IF NOT EXISTS tokens_used integer NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE ai_run_logs ADD COLUMN IF NOT EXISTS duration_ms integer NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE ai_run_logs ADD COLUMN IF NOT EXISTS success boolean NOT NULL DEFAULT true`;
    await sql`ALTER TABLE ai_run_logs ADD COLUMN IF NOT EXISTS error_message text`;
    await sql`ALTER TABLE ai_run_logs ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now()`;

    // Enable RLS (idempotent)
    await sql`ALTER TABLE ai_run_logs ENABLE ROW LEVEL SECURITY`;

    // Indexes (IF NOT EXISTS)
    await sql`CREATE INDEX IF NOT EXISTS idx_ai_run_logs_created_at ON ai_run_logs (created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_ai_run_logs_prompt_type ON ai_run_logs (prompt_type)`;

    console.log("[Schema] ai_run_logs OK");

    // ─── ai_cache ─────────────────────────────────────────────────────
    // The ai_cache table needs input_hash as PK.
    // If table exists with a different PK (e.g. "id"), we must drop & recreate.
    const cacheExists = await sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'ai_cache'
      ) AS exists
    `;

    if (cacheExists[0]?.exists) {
      // Check if input_hash column exists
      const hasInputHash = await sql`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'ai_cache' AND column_name = 'input_hash'
        ) AS exists
      `;

      if (!hasInputHash[0]?.exists) {
        // Table exists but without input_hash — likely created with wrong schema.
        // Check if it's the primary key issue or just a missing column.
        const pkCol = await sql`
          SELECT a.attname FROM pg_index i
          JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
          JOIN pg_class c ON c.oid = i.indrelid
          WHERE c.relname = 'ai_cache' AND i.indisprimary
          LIMIT 1
        `;

        const currentPk = pkCol[0]?.attname;
        if (currentPk && currentPk !== 'input_hash') {
          // DROP and recreate — cache data is ephemeral
          console.log(`[Schema] ai_cache has PK "${currentPk}" instead of "input_hash" — recreating`);
          await sql`DROP TABLE ai_cache CASCADE`;
        }
      }
    }

    await sql`
      CREATE TABLE IF NOT EXISTS ai_cache (
        input_hash text PRIMARY KEY,
        response jsonb NOT NULL DEFAULT '{}'::jsonb,
        model text NOT NULL DEFAULT 'gemini-3-flash-preview',
        tokens_used integer NOT NULL DEFAULT 0,
        expires_at timestamptz NOT NULL DEFAULT now(),
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    // Add missing columns for an existing table that has input_hash but is incomplete
    await sql`ALTER TABLE ai_cache ADD COLUMN IF NOT EXISTS response jsonb NOT NULL DEFAULT '{}'::jsonb`;
    await sql`ALTER TABLE ai_cache ADD COLUMN IF NOT EXISTS model text NOT NULL DEFAULT 'gemini-3-flash-preview'`;
    await sql`ALTER TABLE ai_cache ADD COLUMN IF NOT EXISTS tokens_used integer NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE ai_cache ADD COLUMN IF NOT EXISTS expires_at timestamptz NOT NULL DEFAULT now()`;
    await sql`ALTER TABLE ai_cache ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now()`;

    await sql`ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY`;
    await sql`CREATE INDEX IF NOT EXISTS idx_ai_cache_created_at ON ai_cache (created_at DESC)`;

    console.log("[Schema] ai_cache OK");
    console.log("[Schema] Auto-migration complete");

    migrationDone = true;
    migrationError = null;
    return { ok: true };
  } catch (e) {
    const msg = `Auto-migration failed: ${e}`;
    console.log(`[Schema] ${msg}`);
    migrationDone = true; // Don't retry every request
    migrationError = msg;
    return { ok: false, error: msg };
  } finally {
    if (sql) {
      try { await sql.end(); } catch { /* ignore close errors */ }
    }
  }
}

/**
 * Ensure the onboarding tables exist (projects, roadmaps, roadmap_phases, activities).
 * Uses CREATE TABLE IF NOT EXISTS — safe to run multiple times.
 * Runs only once per server lifecycle.
 */
export async function ensureOnboardingSchema(): Promise<{ ok: boolean; error?: string }> {
  if (onboardingMigrationDone) return { ok: true };

  const dbUrl = Deno.env.get("SUPABASE_DB_URL");
  if (!dbUrl) {
    console.log("[Schema] SUPABASE_DB_URL not set — skipping onboarding migration");
    onboardingMigrationDone = true;
    return { ok: false, error: "SUPABASE_DB_URL not configured" };
  }

  let sql: ReturnType<typeof postgres> | null = null;

  try {
    sql = postgres(dbUrl, { max: 1, idle_timeout: 5, connect_timeout: 10 });

    console.log("[Schema] Running onboarding table auto-migration...");

    // ─── projects ────────────────────────────────────────────────────
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id       uuid        NULL,
        user_id         uuid        NULL,
        wizard_session_id uuid      NULL,
        name            text        NOT NULL,
        description     text        NOT NULL DEFAULT '',
        industry        text        NOT NULL DEFAULT '',
        company_size    text        NOT NULL DEFAULT '',
        selected_systems jsonb      NOT NULL DEFAULT '[]'::jsonb,
        status          text        NOT NULL DEFAULT 'active',
        current_phase   integer     NOT NULL DEFAULT 1,
        total_weeks     integer     NOT NULL DEFAULT 0,
        total_investment text       NOT NULL DEFAULT '',
        wizard_snapshot  jsonb      NULL,
        created_at      timestamptz NOT NULL DEFAULT now(),
        updated_at      timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`ALTER TABLE projects ENABLE ROW LEVEL SECURITY`;
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects (user_id) WHERE user_id IS NOT NULL`;
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_wizard_session ON projects (wizard_session_id) WHERE wizard_session_id IS NOT NULL`;
    console.log("[Schema] projects OK");

    // ─── roadmaps ────────────────────────────────────────────────────
    await sql`
      CREATE TABLE IF NOT EXISTS roadmaps (
        id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id      uuid        NULL,
        title           text        NOT NULL DEFAULT '',
        total_weeks     integer     NOT NULL DEFAULT 0,
        total_investment text       NOT NULL DEFAULT '',
        quick_wins      jsonb       NOT NULL DEFAULT '[]'::jsonb,
        risk_factors    jsonb       NOT NULL DEFAULT '[]'::jsonb,
        success_metrics jsonb       NOT NULL DEFAULT '[]'::jsonb,
        ai_response     jsonb       NULL,
        created_at      timestamptz NOT NULL DEFAULT now(),
        updated_at      timestamptz NOT NULL DEFAULT now()
      )
    `;
    // Self-healing: add columns if table existed with different schema
    await sql`ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS project_id uuid`;
    await sql`ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS title text DEFAULT ''`;
    await sql`ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS total_weeks integer DEFAULT 0`;
    await sql`ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS total_investment text DEFAULT ''`;
    await sql`ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS quick_wins jsonb DEFAULT '[]'::jsonb`;
    await sql`ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS risk_factors jsonb DEFAULT '[]'::jsonb`;
    await sql`ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS success_metrics jsonb DEFAULT '[]'::jsonb`;
    await sql`ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS ai_response jsonb`;
    await sql`ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS user_id uuid`;
    await sql`ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY`;
    await sql`CREATE INDEX IF NOT EXISTS idx_roadmaps_project_id ON roadmaps (project_id)`;
    console.log("[Schema] roadmaps OK");

    // ─── roadmap_phases ──────────────────────────────────────────────
    await sql`
      CREATE TABLE IF NOT EXISTS roadmap_phases (
        id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
        roadmap_id      uuid        NULL,
        phase_number    integer     NOT NULL DEFAULT 0,
        name            text        NOT NULL DEFAULT '',
        description     text        NOT NULL DEFAULT '',
        duration_weeks  integer     NOT NULL DEFAULT 0,
        systems         jsonb       NOT NULL DEFAULT '[]'::jsonb,
        deliverables    jsonb       NOT NULL DEFAULT '[]'::jsonb,
        estimated_cost  text        NOT NULL DEFAULT '',
        dependencies    jsonb       NOT NULL DEFAULT '[]'::jsonb,
        created_at      timestamptz NOT NULL DEFAULT now()
      )
    `;
    // Self-healing: add columns if table existed with different schema
    await sql`ALTER TABLE roadmap_phases ADD COLUMN IF NOT EXISTS roadmap_id uuid`;
    await sql`ALTER TABLE roadmap_phases ADD COLUMN IF NOT EXISTS phase_number integer DEFAULT 0`;
    await sql`ALTER TABLE roadmap_phases ADD COLUMN IF NOT EXISTS name text DEFAULT ''`;
    await sql`ALTER TABLE roadmap_phases ADD COLUMN IF NOT EXISTS description text DEFAULT ''`;
    await sql`ALTER TABLE roadmap_phases ADD COLUMN IF NOT EXISTS duration_weeks integer DEFAULT 0`;
    await sql`ALTER TABLE roadmap_phases ADD COLUMN IF NOT EXISTS systems jsonb DEFAULT '[]'::jsonb`;
    await sql`ALTER TABLE roadmap_phases ADD COLUMN IF NOT EXISTS deliverables jsonb DEFAULT '[]'::jsonb`;
    await sql`ALTER TABLE roadmap_phases ADD COLUMN IF NOT EXISTS estimated_cost text DEFAULT ''`;
    await sql`ALTER TABLE roadmap_phases ADD COLUMN IF NOT EXISTS dependencies jsonb DEFAULT '[]'::jsonb`;
    await sql`ALTER TABLE roadmap_phases ADD COLUMN IF NOT EXISTS user_id uuid`;
    await sql`ALTER TABLE roadmap_phases ENABLE ROW LEVEL SECURITY`;
    await sql`CREATE INDEX IF NOT EXISTS idx_roadmap_phases_roadmap_id ON roadmap_phases (roadmap_id)`;
    console.log("[Schema] roadmap_phases OK");

    // ─── activities ──────────────────────────────────────────────────
    await sql`
      CREATE TABLE IF NOT EXISTS activities (
        id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id         uuid        NULL,
        project_id      uuid        NULL,
        session_id      text        NULL,
        activity_type   text        NOT NULL DEFAULT 'system',
        title           text        NOT NULL DEFAULT '',
        description     text        NOT NULL DEFAULT '',
        metadata        jsonb       NOT NULL DEFAULT '{}'::jsonb,
        created_at      timestamptz NOT NULL DEFAULT now()
      )
    `;
    // Self-healing: add columns if table existed with different schema
    await sql`ALTER TABLE activities ADD COLUMN IF NOT EXISTS project_id uuid`;
    await sql`ALTER TABLE activities ADD COLUMN IF NOT EXISTS activity_type text DEFAULT 'system'`;
    await sql`ALTER TABLE activities ADD COLUMN IF NOT EXISTS title text DEFAULT ''`;
    await sql`ALTER TABLE activities ADD COLUMN IF NOT EXISTS description text DEFAULT ''`;
    await sql`ALTER TABLE activities ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb`;
    await sql`ALTER TABLE activities ADD COLUMN IF NOT EXISTS user_id uuid`;
    await sql`ALTER TABLE activities ENABLE ROW LEVEL SECURITY`;
    await sql`CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities (created_at DESC)`;
    console.log("[Schema] activities OK");

    // ─── RLS policies (service role bypasses these, but good practice) ──
    // Using DO blocks to avoid "already exists" errors
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'projects_service_all') THEN
          CREATE POLICY projects_service_all ON projects FOR ALL TO service_role USING (true);
        END IF;
      END $$
    `;
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'roadmaps_service_all') THEN
          CREATE POLICY roadmaps_service_all ON roadmaps FOR ALL TO service_role USING (true);
        END IF;
      END $$
    `;
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'roadmap_phases_service_all') THEN
          CREATE POLICY roadmap_phases_service_all ON roadmap_phases FOR ALL TO service_role USING (true);
        END IF;
      END $$
    `;
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'activities_service_all') THEN
          CREATE POLICY activities_service_all ON activities FOR ALL TO service_role USING (true);
        END IF;
      END $$
    `;

    console.log("[Schema] Onboarding auto-migration complete");
    onboardingMigrationDone = true;
    return { ok: true };
  } catch (e) {
    const msg = `Onboarding migration failed: ${e}`;
    console.log(`[Schema] ${msg}`);
    onboardingMigrationDone = true; // Don't retry every request
    return { ok: false, error: msg };
  } finally {
    if (sql) {
      try { await sql.end(); } catch { /* ignore close errors */ }
    }
  }
}