// S03-WIZARD — Wizard session persistence routes
// Save/load wizard state to KV store with session management

import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";
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
    const { userId } = await getUserFromToken(authHeader);
    const callerKey = userId || "anonymous";

    const body = await c.req.json();
    const { sessionId, step, data, fullState } = body;

    if (!sessionId && !fullState) {
      return c.json(
        { error: "Missing sessionId or fullState in request body" },
        400
      );
    }

    const sid = sessionId || generateSessionId();

    if (fullState) {
      // Save entire wizard state
      await kv.set(`wizard:session:${sid}`, {
        ...fullState,
        userId: callerKey,
        updatedAt: new Date().toISOString(),
      });
    } else if (step && data) {
      // Save individual step data
      await kv.set(`wizard:answer:${sid}:step${step}`, {
        step,
        data,
        updatedAt: new Date().toISOString(),
      });

      // Update session metadata
      const session = (await kv.get(`wizard:session:${sid}`)) || {};
      await kv.set(`wizard:session:${sid}`, {
        ...session,
        userId: callerKey,
        currentStep: step,
        updatedAt: new Date().toISOString(),
      });
    }

    console.log(
      `[Wizard] Saved session ${sid}, step ${step || "full"} for user ${callerKey}`
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

    const session = await kv.get(`wizard:session:${sessionId}`);

    if (!session) {
      return c.json({ error: `Session ${sessionId} not found` }, 404);
    }

    // Load step answers
    const stepKeys = [1, 2, 3, 4, 5].map(
      (s) => `wizard:answer:${sessionId}:step${s}`
    );
    const answers = await kv.mget(stepKeys);

    console.log(`[Wizard] Loaded session ${sessionId}`);

    return c.json({
      session,
      answers: answers.filter(Boolean),
      progress: {
        currentStep: session.currentStep || 1,
        completedSteps: session.completedSteps || [],
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
    const sessions = await kv.getByPrefix(`wizard:session:`);

    // Filter by userId
    const userSessions = sessions.filter(
      (s: any) => s.userId === userId || s.userId === "anonymous"
    );

    return c.json({ sessions: userSessions });
  } catch (error) {
    console.log(`[Wizard] List error: ${error}`);
    return c.json(
      { error: `Failed to list wizard sessions: ${error}` },
      500
    );
  }
});

export { wizard };
