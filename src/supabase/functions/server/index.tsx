// S00-SERVER — Main Hono server entry point
// Mounts all route modules: health, wizard, AI, auth

import { Hono } from "jsr:@hono/hono@4";
import { cors } from "jsr:@hono/hono@4/cors";
import { logger } from "jsr:@hono/hono@4/logger";
import { wizard } from "./wizard-routes.tsx";
import { ai } from "./ai-routes.tsx";
import { crm } from "./crm-routes.tsx";
import { createUser } from "./auth.tsx";

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
app.get(`${PREFIX}/health`, (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
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
app.route("/", ai);

// ── Mount CRM routes ──
app.route("/", crm);

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
