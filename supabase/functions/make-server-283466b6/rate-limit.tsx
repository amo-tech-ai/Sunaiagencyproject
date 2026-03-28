// S15-RATELIMIT — Per-user rate limiting for AI endpoints
// Uses ai_run_logs table as sliding window counter
// Pattern: follows auth.tsx utility pattern (no routes, just helpers)

import { adminClient } from "./db.tsx";
import { getUserFromToken } from "./auth.tsx";

const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_SECONDS = 60;
const ANON_LIMIT = 3;

/** Check if user has exceeded their AI request limit */
export async function checkRateLimit(
  userId: string,
  windowSeconds: number = DEFAULT_WINDOW_SECONDS
): Promise<{ allowed: boolean; remaining: number; retryAfter?: number }> {
  const limit =
    userId === "anonymous"
      ? ANON_LIMIT
      : parseInt(Deno.env.get("AI_RATE_LIMIT") || String(DEFAULT_LIMIT));

  const db = adminClient();
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();

  try {
    // Query by prompt_type prefix to count recent runs for this user
    // Note: ai_run_logs stores wizard sessionId in session_id column, not userId.
    // We use a created_at window and count all recent runs as a global rate limit.
    const { count, error } = await db
      .from("ai_run_logs")
      .select("*", { count: "exact", head: true })
      .gt("created_at", since);

    if (error) {
      // Fail open — don't block on DB error
      console.log(`[RateLimit] Check error: ${error.message}`);
      return { allowed: true, remaining: limit };
    }

    const used = count || 0;
    const remaining = Math.max(0, limit - used);

    if (used >= limit) {
      return { allowed: false, remaining: 0, retryAfter: windowSeconds };
    }

    return { allowed: true, remaining };
  } catch (e) {
    console.log(`[RateLimit] Exception: ${e}`);
    return { allowed: true, remaining: limit };
  }
}

/** Hono middleware factory for rate-limiting AI endpoints */
export function rateLimitMiddleware() {
  return async (c: any, next: () => Promise<void>) => {
    const authHeader = c.req.header("Authorization") ?? null;
    const { userId } = await getUserFromToken(authHeader);

    // Unauthenticated or anonymous requests: apply strict anon limit
    // (auth will be enforced by the route handler — rate limit is a defense-in-depth layer)
    const effectiveUserId = userId || "anonymous";

    const { allowed, remaining, retryAfter } = await checkRateLimit(effectiveUserId);

    // Set rate limit headers on all responses
    c.header("X-RateLimit-Remaining", String(remaining));

    if (!allowed) {
      c.header("Retry-After", String(retryAfter));
      console.log(`[RateLimit] User ${effectiveUserId} exceeded limit`);
      return c.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          retryAfter,
        },
        429
      );
    }

    await next();
  };
}
