// S06-ENSURE-SCHEMA -- read-only schema assertions.
// Migrations are the source of truth. This file must not create, alter, or drop
// database objects at runtime.

import postgres from "npm:postgres@3.4.5";

type SchemaResult = { ok: boolean; error?: string };
type SqlClient = ReturnType<typeof postgres>;

let aiSchemaChecked = false;
let aiSchemaError: string | null = null;
let onboardingSchemaChecked = false;
let onboardingSchemaError: string | null = null;

const AI_TABLE_COLUMNS: Record<string, string[]> = {
  ai_run_logs: [
    "id",
    "session_id",
    "org_id",
    "prompt_type",
    "model",
    "tokens_used",
    "duration_ms",
    "success",
    "error_message",
    "created_at",
  ],
  ai_cache: [
    "input_hash",
    "response",
    "model",
    "tokens_used",
    "expires_at",
    "created_at",
  ],
};

const ONBOARDING_TABLE_COLUMNS: Record<string, string[]> = {
  projects: [
    "id",
    "user_id",
    "wizard_session_id",
    "name",
    "description",
    "industry",
    "company_size",
    "selected_systems",
    "status",
    "created_at",
  ],
  roadmaps: [
    "id",
    "user_id",
    "project_id",
    "title",
    "total_weeks",
    "quick_wins",
    "risk_factors",
    "success_metrics",
    "created_at",
  ],
  roadmap_phases: [
    "id",
    "user_id",
    "roadmap_id",
    "phase_number",
    "name",
    "description",
    "duration_weeks",
    "deliverables",
    "created_at",
  ],
  activities: [
    "id",
    "user_id",
    "project_id",
    "activity_type",
    "title",
    "description",
    "metadata",
    "created_at",
  ],
};

async function withDatabase<T>(callback: (sql: SqlClient) => Promise<T>): Promise<T> {
  const dbUrl = Deno.env.get("SUPABASE_DB_URL");
  if (!dbUrl) {
    throw new Error("SUPABASE_DB_URL not configured");
  }

  const sql = postgres(dbUrl, {
    max: 1,
    idle_timeout: 5,
    connect_timeout: 10,
  });

  try {
    return await callback(sql);
  } finally {
    try {
      await sql.end();
    } catch {
      // Ignore close errors; schema verification already completed or failed.
    }
  }
}

async function assertTablesAndColumns(
  sql: SqlClient,
  expected: Record<string, string[]>,
): Promise<void> {
  const tableNames = Object.keys(expected);
  const rows = await sql<{ table_name: string; column_name: string }[]>`
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name in ${sql(tableNames)}
  `;

  const columnsByTable = new Map<string, Set<string>>();
  for (const row of rows) {
    if (!columnsByTable.has(row.table_name)) {
      columnsByTable.set(row.table_name, new Set());
    }
    columnsByTable.get(row.table_name)?.add(row.column_name);
  }

  const missing: string[] = [];
  for (const [table, columns] of Object.entries(expected)) {
    const actual = columnsByTable.get(table);
    if (!actual) {
      missing.push(`${table}.*`);
      continue;
    }

    for (const column of columns) {
      if (!actual.has(column)) {
        missing.push(`${table}.${column}`);
      }
    }
  }

  if (missing.length) {
    throw new Error(`Missing migrated schema objects: ${missing.join(", ")}`);
  }
}

async function assertRlsEnabled(sql: SqlClient, tableNames: string[]): Promise<void> {
  const rows = await sql<{ tablename: string }[]>`
    select tablename
    from pg_tables
    where schemaname = 'public'
      and tablename in ${sql(tableNames)}
      and rowsecurity = false
  `;

  if (rows.length) {
    throw new Error(`RLS disabled on migrated tables: ${rows.map((row) => row.tablename).join(", ")}`);
  }
}

async function verifySchema(expected: Record<string, string[]>): Promise<void> {
  await withDatabase(async (sql) => {
    await assertTablesAndColumns(sql, expected);
    await assertRlsEnabled(sql, Object.keys(expected));
  });
}

export async function ensureAISchema(): Promise<SchemaResult> {
  if (aiSchemaChecked) {
    return { ok: !aiSchemaError, error: aiSchemaError || undefined };
  }

  try {
    await verifySchema(AI_TABLE_COLUMNS);
    aiSchemaError = null;
    return { ok: true };
  } catch (error) {
    aiSchemaError = `Schema assertion failed: ${error}`;
    console.log(`[Schema] ${aiSchemaError}`);
    return { ok: false, error: aiSchemaError };
  } finally {
    aiSchemaChecked = true;
  }
}

export async function ensureOnboardingSchema(): Promise<SchemaResult> {
  if (onboardingSchemaChecked) {
    return { ok: !onboardingSchemaError, error: onboardingSchemaError || undefined };
  }

  try {
    await verifySchema(ONBOARDING_TABLE_COLUMNS);
    onboardingSchemaError = null;
    return { ok: true };
  } catch (error) {
    onboardingSchemaError = `Onboarding schema assertion failed: ${error}`;
    console.log(`[Schema] ${onboardingSchemaError}`);
    return { ok: false, error: onboardingSchemaError };
  } finally {
    onboardingSchemaChecked = true;
  }
}
