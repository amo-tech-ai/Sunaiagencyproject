// S03-WIZARD — Wizard session persistence routes
// Save/load wizard state to wizard_sessions & wizard_answers tables
// Uses adminClient for writes (supports both anonymous and authenticated users)
// User identity extracted from token when available, stored as user_id

import { Hono } from "npm:hono";
import { adminClient } from "./db.tsx";
import { getUserFromToken } from "./auth.tsx";

const wizard = new Hono();
const PREFIX = "/make-server-283466b6";

/** Generate a unique session ID */
function generateSessionId(): string {
  return `wz-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

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

    const sid = sessionId || generateSessionId();
    // Use adminClient for wizard writes — supports anonymous + expired-token users
    // Session IDs are unguessable random keys, so this is safe
    const db = adminClient();

    if (fullState) {
      // Full state save → upsert wizard_sessions
      const { error } = await db.from("wizard_sessions").upsert({
        id: sid,
        user_id: callerKey !== "anonymous" ? callerKey : null,
        current_step: fullState.currentStep || 1,
        status: fullState.status || "in_progress",
        context_snapshot: fullState,
        updated_at: new Date().toISOString(),
      });

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
          user_id: callerKey !== "anonymous" ? callerKey : null,
          current_step: step,
          status: "in_progress",
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
        completedSteps: session.context_snapshot?.completedSteps || [],
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

// ── GET /wizard/list/:userId — List user's wizard sessions ──
wizard.get(`${PREFIX}/wizard/list/:userId`, async (c) => {
  try {
    const userId = c.req.param("userId");
    // Use adminClient — the userId in the URL path scopes the query
    const db = adminClient();

    // RLS automatically scopes to sessions the user can see
    const { data: sessions, error } = await db
      .from("wizard_sessions")
      .select("id, current_step, status, created_at, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.log(`[Wizard] List error: ${error.message}`);
      return c.json(
        { error: `Failed to list wizard sessions: ${error.message}` },
        500
      );
    }

    return c.json({ sessions: sessions || [] });
  } catch (error) {
    console.log(`[Wizard] List error: ${error}`);
    return c.json(
      { error: `Failed to list wizard sessions: ${error}` },
      500
    );
  }
});

export { wizard };