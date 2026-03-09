// S06-ENSURE-SCHEMA — Read-only schema check for AI tables (audit 075)
// No DDL: migrations are the single source of truth for ai_run_logs and ai_cache.
// This module only verifies tables exist (optional); run migrations before deploy.

import { adminClient } from "./db.tsx";

let checkDone = false;
let checkResult: { ok: boolean; error?: string } = { ok: true };

/**
 * Verify AI tables exist (read-only). Does not create or alter schema.
 * Run migrations (supabase/migrations) before deploying Edge Functions.
 */
export async function ensureAISchema(): Promise<{ ok: boolean; error?: string }> {
  if (checkDone) return checkResult;

  try {
    const db = adminClient();
    const { error: cacheErr } = await db.from("ai_cache").select("input_hash").limit(1).maybeSingle();
    const { error: logsErr } = await db.from("ai_run_logs").select("id").limit(1).maybeSingle();

    if (cacheErr && logsErr) {
      const msg = "AI tables missing; run migrations (supabase db push).";
      console.log(`[Schema] ${msg}`);
      checkDone = true;
      checkResult = { ok: false, error: msg };
      return checkResult;
    }

    checkDone = true;
    checkResult = { ok: true };
    return checkResult;
  } catch (e) {
    const msg = String(e);
    console.log(`[Schema] Check failed: ${msg}`);
    checkDone = true;
    checkResult = { ok: false, error: msg };
    return checkResult;
  }
}
