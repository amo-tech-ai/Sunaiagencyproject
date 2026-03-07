// S01-GEMINI — Production Gemini AI client for Edge Functions
// Features: per-call model selection, retry with backoff, 30s timeout, 5-level JSON repair,
// API key in header (not URL), caching via ai_cache, logging via ai_run_logs

import { adminClient } from "./db.tsx";

const GEMINI_MODELS = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
} as const;

type GeminiModel = keyof typeof GEMINI_MODELS;

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

// ---------------------------------------------------------------------------
// 5-level JSON repair
// ---------------------------------------------------------------------------

function repairJSON(raw: string): unknown {
  // Level 1: Direct parse
  try {
    return JSON.parse(raw);
  } catch {}

  // Level 2: Trim whitespace + markdown fences
  let trimmed = raw.trim();
  if (trimmed.startsWith("```json")) trimmed = trimmed.slice(7);
  else if (trimmed.startsWith("```")) trimmed = trimmed.slice(3);
  if (trimmed.endsWith("```")) trimmed = trimmed.slice(0, -3);
  trimmed = trimmed.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}

  // Level 3: Close open braces/brackets
  let balanced = trimmed;
  const openBraces = (balanced.match(/{/g) || []).length;
  const closeBraces = (balanced.match(/}/g) || []).length;
  const openBrackets = (balanced.match(/\[/g) || []).length;
  const closeBrackets = (balanced.match(/\]/g) || []).length;
  balanced += "]".repeat(Math.max(0, openBrackets - closeBrackets));
  balanced += "}".repeat(Math.max(0, openBraces - closeBraces));
  try {
    return JSON.parse(balanced);
  } catch {}

  // Level 4: Extract JSON block from mixed content
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {}
    let extracted = jsonMatch[0];
    const eo = (extracted.match(/{/g) || []).length;
    const ec = (extracted.match(/}/g) || []).length;
    extracted += "}".repeat(Math.max(0, eo - ec));
    try {
      return JSON.parse(extracted);
    } catch {}
  }

  // Level 5: Regex key-value extraction (last resort)
  const pairs: Record<string, string> = {};
  const kvRegex = /"(\w+)"\s*:\s*"([^"]*?)"/g;
  let match;
  while ((match = kvRegex.exec(raw)) !== null) {
    pairs[match[1]] = match[2];
  }
  if (Object.keys(pairs).length > 0) return pairs;

  throw new Error("JSON repair failed at all 5 levels");
}

// ---------------------------------------------------------------------------
// Fetch with retry + timeout
// ---------------------------------------------------------------------------

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  timeoutMs = 30000,
): Promise<Response> {
  const delays = [1000, 2000, 4000];
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) return response;

      const status = response.status;
      // Don't retry 4xx client errors (except 429 rate limit)
      if (status !== 429 && status >= 400 && status < 500) {
        throw new Error(`Gemini API error ${status}: ${(await response.text()).slice(0, 200)}`);
      }

      // Retry on 429, 500, 503
      lastError = new Error(`Gemini API error ${status}`);
      console.log(`[Gemini] Attempt ${attempt + 1}/${maxRetries + 1} failed (${status}), retrying...`);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        lastError = new Error(`Gemini API timeout (${timeoutMs}ms)`);
        console.log(`[Gemini] Attempt ${attempt + 1}/${maxRetries + 1} timed out, retrying...`);
      } else if ((err as Error).message?.match(/^Gemini API error 4[0-2]/)) {
        throw err; // Don't retry non-retryable client errors
      } else {
        lastError = err as Error;
        console.log(`[Gemini] Attempt ${attempt + 1}/${maxRetries + 1} error: ${(err as Error).message}`);
      }
    }

    if (attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }
  throw lastError || new Error("Gemini API: all retries exhausted");
}

// ---------------------------------------------------------------------------
// Cache + Logging
// ---------------------------------------------------------------------------

/** Check ai_cache table for a previous result */
export async function getCachedResult(
  functionName: string,
  input: Record<string, unknown>,
): Promise<unknown | null> {
  try {
    const inputStr = JSON.stringify({ fn: functionName, ...input });
    const hash = await hashInput(inputStr);
    const db = adminClient();
    const { data } = await db
      .from("ai_cache")
      .select("response")
      .eq("hash", hash)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (data?.response) {
      console.log(`[Gemini] Cache HIT for ${functionName}`);
      return data.response;
    }
    return null;
  } catch (e) {
    console.log(`[Gemini] Cache check error: ${e}`);
    return null;
  }
}

/** Store result in ai_cache table */
export async function setCachedResult(
  functionName: string,
  input: Record<string, unknown>,
  result: unknown,
  model: string,
  ttlMs: number = 24 * 60 * 60 * 1000,
): Promise<void> {
  try {
    const inputStr = JSON.stringify({ fn: functionName, ...input });
    const hash = await hashInput(inputStr);
    const db = adminClient();
    await db.from("ai_cache").upsert({
      hash,
      prompt_hash: hash,
      response: result,
      model,
      tokens_used: 0,
      expires_at: new Date(Date.now() + ttlMs).toISOString(),
    });
  } catch (e) {
    console.log(`[Gemini] Cache write error: ${e}`);
  }
}

/** Log an AI run to ai_run_logs table */
export async function logAIRun(params: {
  functionName: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  durationMs: number;
  success: boolean;
  error?: string;
  sessionId?: string;
  orgId?: string;
}): Promise<void> {
  try {
    const db = adminClient();
    await db.from("ai_run_logs").insert({
      org_id: params.orgId || null,
      project_id: null,
      agent_name: params.functionName,
      model_name: params.model,
      input_tokens: params.inputTokens || 0,
      output_tokens: params.outputTokens || 0,
      duration_ms: params.durationMs,
      success: params.success,
      error_message: params.error || null,
    });
  } catch (e) {
    console.log(`[Gemini] Log write error: ${e}`);
  }
}

// ---------------------------------------------------------------------------
// Main API — callGemini
// ---------------------------------------------------------------------------

export async function callGemini(
  functionName: string,
  systemPrompt: string,
  userPrompt: string,
  input: Record<string, unknown> = {},
  model: GeminiModel = "flash",
): Promise<unknown> {
  // Check cache first
  const cached = await getCachedResult(functionName, input);
  if (cached) return cached;

  const apiKey = getApiKey();
  const modelId = GEMINI_MODELS[model];
  const startMs = Date.now();

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;

    const response = await fetchWithRetry(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          ...(systemPrompt
            ? [{ role: "user", parts: [{ text: `System instructions:\n${systemPrompt}` }] }]
            : []),
          { role: "user", parts: [{ text: userPrompt }] },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      }),
    });

    const data = await response.json();
    const durationMs = Date.now() - startMs;

    // Extract and repair JSON
    const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) throw new Error("No text content in Gemini response");

    const parsed = repairJSON(textContent);

    // Log the run
    const inputTokens = data?.usageMetadata?.promptTokenCount || 0;
    const outputTokens = data?.usageMetadata?.candidatesTokenCount || 0;

    await logAIRun({
      functionName,
      model: modelId,
      inputTokens,
      outputTokens,
      durationMs,
      success: true,
    });

    // Cache the result
    const ttl =
      functionName === "analyze-business"
        ? 24 * 60 * 60 * 1000
        : 7 * 24 * 60 * 60 * 1000;
    await setCachedResult(functionName, input, parsed, modelId, ttl);

    return parsed;
  } catch (error) {
    const durationMs = Date.now() - startMs;
    await logAIRun({
      functionName,
      model: modelId,
      durationMs,
      success: false,
      error: String(error),
    });
    throw error;
  }
}
