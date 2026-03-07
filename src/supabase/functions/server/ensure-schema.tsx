// S06-ENSURE-SCHEMA — Auto-migration for AI tables
// Runs once on server startup. Connects to Postgres directly via SUPABASE_DB_URL
// to ensure ai_run_logs and ai_cache have all required columns.
// This fixes the "column does not exist" errors when tables were created
// via Supabase UI with incomplete schemas.

import postgres from "npm:postgres@3.4.5";

let migrationDone = false;
let migrationError: string | null = null;

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
    await sql`ALTER TABLE ai_run_logs ADD COLUMN IF NOT EXISTS model text NOT NULL DEFAULT 'gemini-2.0-flash'`;
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
        model text NOT NULL DEFAULT 'gemini-2.0-flash',
        tokens_used integer NOT NULL DEFAULT 0,
        expires_at timestamptz NOT NULL DEFAULT now(),
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    // Add missing columns for an existing table that has input_hash but is incomplete
    await sql`ALTER TABLE ai_cache ADD COLUMN IF NOT EXISTS response jsonb NOT NULL DEFAULT '{}'::jsonb`;
    await sql`ALTER TABLE ai_cache ADD COLUMN IF NOT EXISTS model text NOT NULL DEFAULT 'gemini-2.0-flash'`;
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
