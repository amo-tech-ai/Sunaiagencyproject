// S01-GEMINI — Gemini AI client utility for Edge Functions
// Handles API calls, caching via ai_cache table, and run logging via ai_run_logs table

import { adminClient } from "./db.tsx";

const GEMINI_MODEL = "gemini-2.0-flash";

function getApiKey(): string {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) throw new Error("GEMINI_API_KEY not configured");
  return key;
}

/** SHA-256 hash of input for cache keying */
async function hashInput(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Check ai_cache table for a previous result */
export async function getCachedResult(
  functionName: string,
  input: Record<string, unknown>
): Promise<unknown | null> {
  try {
    const inputStr = JSON.stringify({ fn: functionName, ...input });
    const hash = await hashInput(inputStr);
    const db = adminClient();

    const { data, error } = await db
      .from("ai_cache")
      .select("response")
      .eq("input_hash", hash)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (error) {
      console.log(`[Gemini] Cache check error: ${error.message}`);
      return null;
    }

    if (data?.response) {
      console.log(`[Gemini] Cache HIT for ${functionName}`);
      return data.response;
    }
    return null;
  } catch (e) {
    console.log(`[Gemini] Cache check exception: ${e}`);
    return null;
  }
}

/** Store result in ai_cache table with TTL via expires_at */
export async function setCachedResult(
  functionName: string,
  input: Record<string, unknown>,
  response: unknown,
  model: string,
  tokensUsed: number,
  ttlHours: number = 24
): Promise<void> {
  try {
    const inputStr = JSON.stringify({ fn: functionName, ...input });
    const hash = await hashInput(inputStr);
    const db = adminClient();

    const { error } = await db.from("ai_cache").upsert({
      input_hash: hash,
      response,
      model,
      tokens_used: tokensUsed,
      expires_at: new Date(Date.now() + ttlHours * 3600000).toISOString(),
    });

    if (error) {
      console.log(`[Gemini] Cache write error: ${error.message}`);
    }
  } catch (e) {
    console.log(`[Gemini] Cache write exception: ${e}`);
  }
}

/** Log an AI run to ai_run_logs table for auditing */
export async function logAIRun(params: {
  sessionId?: string;
  orgId?: string;
  promptType: string;
  model: string;
  tokensUsed: number;
  durationMs: number;
  success: boolean;
  errorMessage?: string;
}): Promise<void> {
  try {
    const db = adminClient();

    const { error } = await db.from("ai_run_logs").insert({
      session_id: params.sessionId || null,
      org_id: params.orgId || null,
      prompt_type: params.promptType,
      model: params.model,
      tokens_used: params.tokensUsed,
      duration_ms: params.durationMs,
      success: params.success,
      error_message: params.errorMessage || null,
    });

    if (error) {
      console.log(`[Gemini] Log write error: ${error.message}`);
    }
  } catch (e) {
    console.log(`[Gemini] Log write exception: ${e}`);
  }
}

/** Call Gemini API with a structured prompt, returning parsed JSON */
export async function callGemini(
  functionName: string,
  systemPrompt: string,
  userPrompt: string,
  input: Record<string, unknown> = {},
  sessionId?: string
): Promise<unknown> {
  // Check cache first
  const cached = await getCachedResult(functionName, input);
  if (cached) return cached;

  const apiKey = getApiKey();
  const startMs = Date.now();

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}\n\n---\n\n${userPrompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Gemini API error (${response.status}): ${errorText.slice(0, 200)}`
      );
    }

    const data = await response.json();
    const durationMs = Date.now() - startMs;

    // Extract text content from Gemini response
    const textContent =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(textContent);
    } catch {
      // If JSON parsing fails, wrap in result object
      parsed = { rawText: textContent };
    }

    // Calculate token usage
    const tokensUsed =
      (data?.usageMetadata?.promptTokenCount || 0) +
      (data?.usageMetadata?.candidatesTokenCount || 0);

    // Log the run to ai_run_logs table
    await logAIRun({
      sessionId,
      promptType: functionName,
      model: GEMINI_MODEL,
      tokensUsed,
      durationMs,
      success: true,
    });

    // Cache the result in ai_cache table
    const ttlHours = functionName === "analyze-business" ? 24 : 168; // 24h or 7 days
    await setCachedResult(functionName, input, parsed, GEMINI_MODEL, tokensUsed, ttlHours);

    return parsed;
  } catch (error) {
    const durationMs = Date.now() - startMs;
    await logAIRun({
      sessionId,
      promptType: functionName,
      model: GEMINI_MODEL,
      tokensUsed: 0,
      durationMs,
      success: false,
      errorMessage: String(error),
    });
    throw error;
  }
}
