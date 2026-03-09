// S05-DB — Supabase client factory for edge functions
// adminClient: service-role for server-internal ops (ai_cache, ai_run_logs)
// userClient: per-request JWT-scoped client (wizard_sessions, wizard_answers — respects RLS)

import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

/** Service-role client for server-side operations (caching, logging, admin) */
export const adminClient = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

/** Per-request client scoped to the caller's JWT (respects RLS) */
export const userClient = (authHeader: string | undefined) =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    }
  );
