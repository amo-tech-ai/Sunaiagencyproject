// S00-SERVER — Main Hono server entry point
// Mounts all route modules: health, wizard, AI, auth
// All data persistence uses proper Supabase tables (no KV store)
// Runs auto-migration on startup to ensure AI tables have correct columns

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { wizard } from "./wizard-routes.tsx";
import { ai } from "./ai-routes.tsx";
import { crm } from "./crm-routes.tsx";
import { pipeline } from "./pipeline-routes.tsx";
import { documents } from "./document-routes.tsx";
import { workflows } from "./workflow-routes.tsx";
import { financial } from "./financial-routes.tsx";
import { createUser } from "./auth.tsx";
import { ensureAISchema } from "./ensure-schema.tsx";

const app = new Hono();
const PREFIX = "/make-server-283466b6";

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// ── Health check ──
app.get(`${PREFIX}/health`, async (c) => {
  const schema = await ensureAISchema();
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    schema: schema.ok ? "migrated" : schema.error,
  });
});

// ── Signup ──
app.post(`${PREFIX}/signup`, async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: "Email and password are required for signup" }, 400);
    }

    const { user, error } = await createUser({ email, password, name });

    if (error) {
      console.log(`[Auth] Signup error: ${error}`);
      return c.json({ error }, 400);
    }

    console.log(`[Auth] User created: ${email}`);
    return c.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.log(`[Auth] Signup exception: ${error}`);
    return c.json({ error: `Signup failed: ${error}` }, 500);
  }
});

// ── Mount wizard routes ──
app.route("/", wizard);

// ── Mount AI routes ──
// Run auto-migration before first AI request
app.use(`${PREFIX}/ai/*`, async (c, next) => {
  await ensureAISchema();
  await next();
});
app.route("/", ai);

// ── Mount CRM routes ──
app.route("/", crm);

// ── Mount Pipeline routes (Phase 7) ──
app.route("/", pipeline);

// ── Mount Document routes (Phase 8) ──
app.route("/", documents);

// ── Mount Workflow routes (Phase 11) ──
app.route("/", workflows);

// ── Mount Financial routes (Phase 13) ──
app.route("/", financial);

// ── 404 handler ──
app.notFound((c) => {
  console.log(`[Server] 404: ${c.req.method} ${c.req.url}`);
  return c.json({ error: `Route not found: ${c.req.url}` }, 404);
});

// ── Global error handler ──
app.onError((err, c) => {
  console.log(`[Server] Unhandled error: ${err.message}`);
  return c.json({ error: `Internal server error: ${err.message}` }, 500);
});

Deno.serve(app.fetch);