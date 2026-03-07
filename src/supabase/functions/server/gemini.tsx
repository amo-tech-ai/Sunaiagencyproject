// S01-GEMINI — Gemini AI client utility for Edge Functions
// Handles API calls, caching, and run logging via KV store

import * as kv from "./kv_store.tsx";

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

/** Check AI cache for a previous result */
export async function getCachedResult(
  functionName: string,
  input: Record<string, unknown>
): Promise<unknown | null> {
  try {
    const inputStr = JSON.stringify({ fn: functionName, ...input });
    const hash = await hashInput(inputStr);
    const cached = await kv.get(`ai:cache:${hash}`);
    if (cached && cached.expires_at && Date.now() < cached.expires_at) {
      console.log(`[Gemini] Cache HIT for ${functionName}`);
      return cached.result;
    }
    return null;
  } catch (e) {
    console.log(`[Gemini] Cache check error: ${e}`);
    return null;
  }
}

/** Store result in AI cache */
export async function setCachedResult(
  functionName: string,
  input: Record<string, unknown>,
  result: unknown,
  ttlMs: number = 24 * 60 * 60 * 1000 // 24h default
): Promise<void> {
  try {
    const inputStr = JSON.stringify({ fn: functionName, ...input });
    const hash = await hashInput(inputStr);
    await kv.set(`ai:cache:${hash}`, {
      result,
      created_at: Date.now(),
      expires_at: Date.now() + ttlMs,
    });
  } catch (e) {
    console.log(`[Gemini] Cache write error: ${e}`);
  }
}

/** Log an AI run for auditing */
export async function logAIRun(params: {
  functionName: string;
  inputHash?: string;
  tokensUsed?: number;
  durationMs: number;
  success: boolean;
  error?: string;
}): Promise<void> {
  try {
    const logId = `ai:log:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await kv.set(logId, {
      ...params,
      model: GEMINI_MODEL,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.log(`[Gemini] Log write error: ${e}`);
  }
}

/** Call Gemini API with a structured prompt, returning parsed JSON */
export async function callGemini(
  functionName: string,
  systemPrompt: string,
  userPrompt: string,
  input: Record<string, unknown> = {}
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

    // Log the run
    const tokensUsed =
      (data?.usageMetadata?.promptTokenCount || 0) +
      (data?.usageMetadata?.candidatesTokenCount || 0);

    await logAIRun({
      functionName,
      tokensUsed,
      durationMs,
      success: true,
    });

    // Cache the result
    const ttl =
      functionName === "analyze-business"
        ? 24 * 60 * 60 * 1000
        : 7 * 24 * 60 * 60 * 1000;
    await setCachedResult(functionName, input, parsed, ttl);

    return parsed;
  } catch (error) {
    const durationMs = Date.now() - startMs;
    await logAIRun({
      functionName,
      durationMs,
      success: false,
      error: String(error),
    });
    throw error;
  }
}
