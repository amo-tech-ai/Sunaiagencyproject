// S03-WIZARD — Wizard session persistence routes
// Save/load wizard state to wizard_sessions + wizard_answers tables

import { Hono } from "jsr:@hono/hono@4";
import { adminClient, stepToScreenId, screenIdToStep } from "./db.tsx";
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
wizard.get(`${PREFIX}/wizard/list/:userId`, async (c) => {
  try {
    const userId = c.req.param("userId");
    const db = adminClient();

    const { data: sessions, error } = await db
      .from("wizard_sessions")
      .select("id, current_step, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(20);

    if (error) {
      console.log(`[Wizard] List error: ${error.message}`);
      return c.json(
        { error: `Failed to list wizard sessions: ${error.message}` },
        500
      );
    }

    // Derive status from current_step since status column doesn't exist in DB
    // Step 5 = final wizard step, so current_step >= 5 means completed
    const enriched = (sessions || []).map((s: any) => ({
      ...s,
      status: s.current_step >= 5 ? "completed" : "in_progress",
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
    const { userId } = await getUserFromToken(authHeader);
    const isAnonymous = !userId || userId === "anonymous";

    const body = await c.req.json();
    const { sessionId, step, data, fullState } = body;

    if (!sessionId && !fullState) {
      return c.json(
        { error: "Missing sessionId or fullState in request body" },
        400
      );
    }

    const db = adminClient();
    let sid = sessionId;

    if (fullState) {
      // Save entire wizard state — atomic upsert on PK
      if (!sid) {
        sid = generateSessionId();
      }

      await db.from("wizard_sessions").upsert({
        id: sid,
        org_id: null,
        project_id: null,
        current_step: fullState.currentStep || 1,
        updated_at: new Date().toISOString(),
      });

      // Save all step data — atomic upsert on unique(session_id, screen_id)
      if (fullState.answers && typeof fullState.answers === "object") {
        for (const [stepKey, stepData] of Object.entries(fullState.answers)) {
          const stepNum = parseInt(stepKey, 10);
          if (isNaN(stepNum) || stepNum < 1 || stepNum > 5) continue;
          const screenId = stepToScreenId(stepNum);

          await db.from("wizard_answers").upsert(
            {
              session_id: sid,
              org_id: null,
              screen_id: screenId,
              step_number: stepNum,
              data: stepData,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "session_id,screen_id" }
          );
        }
      }
    } else if (step && data) {
      // Save individual step data
      if (!sid) {
        sid = generateSessionId();
      }

      const screenId = stepToScreenId(step);

      // Atomic upsert session on PK
      await db.from("wizard_sessions").upsert({
        id: sid,
        org_id: null,
        project_id: null,
        current_step: step,
        updated_at: new Date().toISOString(),
      });

      // Atomic upsert answer on unique(session_id, screen_id)
      await db.from("wizard_answers").upsert(
        {
          session_id: sid,
          org_id: null,
          screen_id: screenId,
          step_number: step,
          data: data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "session_id,screen_id" }
      );
    }

    console.log(
      `[Wizard] Saved session ${sid}, step ${step || "full"} for user ${isAnonymous ? "anonymous" : userId}`
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

    const db = adminClient();

    // Load session
    const { data: session, error: sessionError } = await db
      .from("wizard_sessions")
      .select("*")
      .eq("id", sessionId)
      .maybeSingle();

    if (sessionError || !session) {
      return c.json({ error: `Session ${sessionId} not found` }, 404);
    }

    // Load all answers for this session
    const { data: answers } = await db
      .from("wizard_answers")
      .select("screen_id, step_number, data, ai_results, created_at, updated_at")
      .eq("session_id", sessionId)
      .order("screen_id");

    // Build completed steps list
    const completedSteps = (answers || [])
      .filter((a: any) => a.data && Object.keys(a.data).length > 0)
      .map((a: any) => screenIdToStep(a.screen_id));

    console.log(`[Wizard] Loaded session ${sessionId}`);

    return c.json({
      session,
      answers: (answers || []).map((a: any) => ({
        step: screenIdToStep(a.screen_id),
        screenId: a.screen_id,
        data: a.data,
        aiResults: a.ai_results,
        updatedAt: a.updated_at,
      })),
      progress: {
        currentStep: session.current_step || 1,
        completedSteps,
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
