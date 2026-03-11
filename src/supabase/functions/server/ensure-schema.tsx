// S06-ENSURE-SCHEMA — Read-only schema verification for AI + onboarding tables
// Runs once on server startup. Checks that all required tables exist (created via migrations).
// No DDL — all schema changes go through migration files only.

import postgres from "npm:postgres@3.4.5";

let aiCheckDone = false;
let aiCheckError: string | null = null;
let onboardingCheckDone = false;
let onboardingCheckError: string | null = null;

const AI_TABLES = ["ai_run_logs", "ai_cache"] as const;
const ONBOARDING_TABLES = ["projects", "roadmaps", "roadmap_phases", "activities"] as const;

async function checkTablesExist(
  sql: ReturnType<typeof postgres>,
  tables: readonly string[]
): Promise<string[]> {
  const result = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = ANY(${tables as unknown as string[]})
  `;
  const found = new Set(result.map((r: { table_name: string }) => r.table_name));
  return tables.filter((t) => !found.has(t));
}

/**
 * Verify ai_run_logs and ai_cache tables exist.
 * Read-only — returns error if tables are missing (fix via migration).
 * Runs only once per server lifecycle.
 */
export async function ensureAISchema(): Promise<{ ok: boolean; error?: string }> {
  if (aiCheckDone) return { ok: !aiCheckError, error: aiCheckError || undefined };

  const dbUrl = Deno.env.get("SUPABASE_DB_URL");
  if (!dbUrl) {
    console.log("[Schema] SUPABASE_DB_URL not set — skipping AI schema check");
    aiCheckDone = true;
    aiCheckError = "SUPABASE_DB_URL not configured";
    return { ok: false, error: aiCheckError };
  }

  let sql: ReturnType<typeof postgres> | null = null;

  try {
    sql = postgres(dbUrl, { max: 1, idle_timeout: 5, connect_timeout: 10 });

    const missing = await checkTablesExist(sql, AI_TABLES);

    if (missing.length > 0) {
      const msg = `Missing AI tables: ${missing.join(", ")}. Run migrations to fix.`;
      console.log(`[Schema] ${msg}`);
      aiCheckDone = true;
      aiCheckError = msg;
      return { ok: false, error: msg };
    }

    console.log("[Schema] AI tables verified (ai_run_logs, ai_cache)");
    aiCheckDone = true;
    aiCheckError = null;
    return { ok: true };
  } catch (e) {
    const msg = `AI schema check failed: ${e}`;
    console.log(`[Schema] ${msg}`);
    aiCheckDone = true;
    aiCheckError = msg;
    return { ok: false, error: msg };
  } finally {
    if (sql) {
      try { await sql.end(); } catch { /* ignore close errors */ }
    }
  }
}

/**
 * Verify onboarding tables exist (projects, roadmaps, roadmap_phases, activities).
 * Read-only — returns error if tables are missing (fix via migration).
 * Runs only once per server lifecycle.
 */
export async function ensureOnboardingSchema(): Promise<{ ok: boolean; error?: string }> {
  if (onboardingCheckDone) return { ok: !onboardingCheckError, error: onboardingCheckError || undefined };

  const dbUrl = Deno.env.get("SUPABASE_DB_URL");
  if (!dbUrl) {
    console.log("[Schema] SUPABASE_DB_URL not set — skipping onboarding schema check");
    onboardingCheckDone = true;
    onboardingCheckError = "SUPABASE_DB_URL not configured";
    return { ok: false, error: onboardingCheckError };
  }

  let sql: ReturnType<typeof postgres> | null = null;

  try {
    sql = postgres(dbUrl, { max: 1, idle_timeout: 5, connect_timeout: 10 });

    const missing = await checkTablesExist(sql, ONBOARDING_TABLES);

    if (missing.length > 0) {
      const msg = `Missing onboarding tables: ${missing.join(", ")}. Run migrations to fix.`;
      console.log(`[Schema] ${msg}`);
      onboardingCheckDone = true;
      onboardingCheckError = msg;
      return { ok: false, error: msg };
    }

    console.log("[Schema] Onboarding tables verified (projects, roadmaps, roadmap_phases, activities)");
    onboardingCheckDone = true;
    onboardingCheckError = null;
    return { ok: true };
  } catch (e) {
    const msg = `Onboarding schema check failed: ${e}`;
    console.log(`[Schema] ${msg}`);
    onboardingCheckDone = true;
    onboardingCheckError = msg;
    return { ok: false, error: msg };
  } finally {
    if (sql) {
      try { await sql.end(); } catch { /* ignore close errors */ }
    }
  }
}
