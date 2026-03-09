// S03-WIZARD — Wizard session persistence routes
// Save/load wizard state to wizard_sessions & wizard_answers tables
// Uses adminClient for writes (supports both anonymous and authenticated users)
// DB columns on wizard_sessions: id, current_step, user_id, status, context_snapshot, created_at, updated_at
// user_id is nullable (null = anonymous guest). status: in_progress | completed | abandoned.

import { Hono } from "npm:hono";
import { adminClient } from "./db.tsx";
import { getUserFromToken } from "./auth.tsx";

const wizard = new Hono();
const PREFIX = "/make-server-283466b6";

/** Generate a unique session ID (must be valid UUID for the DB column) */
function generateSessionId(): string {
  return crypto.randomUUID();
}

/** Check if a string is a valid UUID */
function isValidUUID(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

// ── GET /wizard/list/:userId — List user's wizard sessions ──
// IMPORTANT: Must be registered BEFORE /wizard/:sessionId to prevent route collision
// Requires wizard_sessions.user_id (migration 20260307120000). No unfiltered fallback (audit 076).
wizard.get(`${PREFIX}/wizard/list/:userId`, async (c) => {
  try {
    const userId = c.req.param("userId");
    const db = adminClient();

    const { data: sessions, error: queryError } = await db
      .from("wizard_sessions")
      .select("id, current_step, user_id, status, created_at, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(20);

    if (queryError) {
      const isColumnMissing = queryError.message?.toLowerCase().includes("column");
      if (isColumnMissing) {
        console.warn("[Wizard] user_id column missing — apply migration 20260307120000_enhance_wizard_sessions.sql");
        return c.json(
          { error: "Database schema outdated; please apply migrations (wizard_sessions.user_id)." },
          503
        );
      }
      console.log(`[Wizard] List error: ${queryError.message}`);
      return c.json(
        { error: `Failed to list wizard sessions: ${queryError.message}` },
        500
      );
    }

    const enriched = (sessions || []).map((s: any) => ({
      ...s,
      status: s.status || (s.current_step >= 5 ? "completed" : "in_progress"),
    }));

    return c.json({ sessions: enriched });
  } catch (error) {
    console.log(`[Wizard] List error: ${error}`);
    return c.json(
      { error: `Failed to list wizard sessions: ${error}` },
      500
    );
  }
});

// ── POST /wizard/save — Save wizard step data ──
wizard.post(`${PREFIX}/wizard/save`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");

    // Extract user ID if available, but don't block on auth failure
    let callerKey: string | null = null;
    try {
      const { userId } = await getUserFromToken(authHeader ?? null);
      callerKey = userId && userId !== "anonymous" ? userId : null;
    } catch {
      // Auth extraction failed — proceed as anonymous save
      callerKey = null;
    }

    const body = await c.req.json();
    const { sessionId, step, data, fullState } = body;

    if (!sessionId && !fullState) {
      return c.json(
        { error: "Missing sessionId or fullState in request body" },
        400
      );
    }

    const sid = sessionId && isValidUUID(sessionId) ? sessionId : generateSessionId();
    // Use adminClient for wizard writes — supports anonymous + expired-token users
    // Session IDs are unguessable random keys, so this is safe
    const db = adminClient();

    if (fullState) {
      // Full state save → upsert wizard_sessions
      // Write all available columns including user_id and status (added in migration)
      const sessionRow: Record<string, unknown> = {
        id: sid,
        current_step: fullState.currentStep || 1,
        updated_at: new Date().toISOString(),
      };
      // Set user_id if we have an authenticated caller
      if (callerKey) {
        sessionRow.user_id = callerKey;
      }
      // Derive status: step 5 = final, so >= 5 means completed
      if ((fullState.currentStep || 1) >= 5) {
        sessionRow.status = "completed";
      }

      const { error } = await db.from("wizard_sessions").upsert(sessionRow);

      if (error) {
        console.log(`[Wizard] Session upsert error: ${error.message}`);
        return c.json(
          { error: `Failed to save wizard session: ${error.message}` },
          500
        );
      }
    }

    if (step !== undefined && data) {
      // Per-step save → upsert wizard_answers
      const { error: ansError } = await db.from("wizard_answers").upsert(
        {
          session_id: sid,
          step_number: step,
          answers: data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "session_id,step_number" }
      );

      if (ansError) {
        console.log(`[Wizard] Answer upsert error: ${ansError.message}`);
        return c.json(
          { error: `Failed to save wizard answer: ${ansError.message}` },
          500
        );
      }

      // Also update session metadata (current_step)
      const { error: metaError } = await db
        .from("wizard_sessions")
        .upsert({
          id: sid,
          current_step: step,
          updated_at: new Date().toISOString(),
        });

      if (metaError) {
        console.log(`[Wizard] Session meta update error: ${metaError.message}`);
      }
    }

    console.log(
      `[Wizard] Saved session ${sid}, step ${step ?? "full"} for user ${callerKey ?? "anonymous"}`
    );

    return c.json({
      success: true,
      sessionId: sid,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.log(`[Wizard] Save error: ${error}`);
    return c.json(
      { error: `Failed to save wizard session: ${error}` },
      500
    );
  }
});

// ── GET /wizard/:sessionId — Load wizard session ──
wizard.get(`${PREFIX}/wizard/:sessionId`, async (c) => {
  try {
    const sessionId = c.req.param("sessionId");

    if (!sessionId) {
      return c.json({ error: "Missing sessionId parameter" }, 400);
    }

    // Use adminClient for reads — session ID is the access key
    const db = adminClient();

    // Load session from wizard_sessions table
    const { data: session, error: sessError } = await db
      .from("wizard_sessions")
      .select("*")
      .eq("id", sessionId)
      .maybeSingle();

    if (sessError) {
      console.log(`[Wizard] Session load error: ${sessError.message}`);
      return c.json(
        { error: `Failed to load session: ${sessError.message}` },
        500
      );
    }

    if (!session) {
      return c.json({ error: `Session ${sessionId} not found` }, 404);
    }

    // Load step answers from wizard_answers table
    const { data: answers, error: ansError } = await db
      .from("wizard_answers")
      .select("step_number, answers, ai_results, updated_at")
      .eq("session_id", sessionId)
      .order("step_number");

    if (ansError) {
      console.log(`[Wizard] Answers load error: ${ansError.message}`);
    }

    console.log(`[Wizard] Loaded session ${sessionId}`);

    return c.json({
      session,
      answers: answers || [],
      progress: {
        currentStep: session.current_step || 1,
        // Derive completedSteps from answers (context_snapshot column doesn't exist in DB)
        completedSteps: (answers || []).map((a: any) => a.step_number),
      },
    });
  } catch (error) {
    console.log(`[Wizard] Load error: ${error}`);
    return c.json(
      { error: `Failed to load wizard session: ${error}` },
      500
    );
  }
});

export { wizard };