/* Compatibility shim. Prefer importing from src/lib/supabase.ts. */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";

export const projectId = supabaseUrl
  .replace(/^https?:\/\//, "")
  .replace(/\.supabase\.co\/?$/, "");
export const publicAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
