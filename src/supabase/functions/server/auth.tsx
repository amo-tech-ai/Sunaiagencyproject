// S02-AUTH — Authentication utilities for Edge Functions
// Signup, session validation, user extraction

import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

function getServiceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

function getAnonClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );
}

/** Create a new user account with auto-confirmed email */
export async function createUser(params: {
  email: string;
  password: string;
  name?: string;
}): Promise<{ user: any; error: string | null }> {
  const supabase = getServiceClient();
  const { data, error } = await supabase.auth.admin.createUser({
    email: params.email,
    password: params.password,
    user_metadata: { name: params.name || "" },
    // Automatically confirm — no email server configured
    email_confirm: true,
  });

  if (error) {
    return { user: null, error: `Signup error: ${error.message}` };
  }
  return { user: data.user, error: null };
}

/** Extract user ID from Authorization header */
export async function getUserFromToken(
  authHeader: string | null
): Promise<{ userId: string | null; error: string | null }> {
  if (!authHeader) {
    return { userId: null, error: "No Authorization header provided" };
  }

  const token = authHeader.replace("Bearer ", "");
  
  // Check if this is the anon key (public unauthenticated access)
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (token === anonKey) {
    // Public access — return a session-based ID
    return { userId: "anonymous", error: null };
  }

  const supabase = getServiceClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return {
      userId: null,
      error: `Auth validation error: ${error?.message || "Invalid token"}`,
    };
  }
  return { userId: user.id, error: null };
}

/** Require authenticated user — returns userId or throws */
export async function requireAuth(
  authHeader: string | null
): Promise<string> {
  const { userId, error } = await getUserFromToken(authHeader);
  if (!userId || userId === "anonymous") {
    throw new Error(error || "Authentication required");
  }
  return userId;
}
