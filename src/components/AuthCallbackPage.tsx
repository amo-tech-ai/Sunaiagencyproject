// C92-AUTH-CALLBACK — OAuth Callback Handler
// Handles redirect from Supabase after OAuth consent (Google, LinkedIn, etc.)
// Provider-agnostic: works with any Supabase OAuth provider via onAuthStateChange
// Restores session, then redirects to /app/dashboard or /login on error
//
// Flow:
// 1. Supabase client auto-detects access_token in URL hash fragment
// 2. onAuthStateChange fires SIGNED_IN with the new session
// 3. We navigate to /app/dashboard (or ?return= path)
// 4. If nothing fires within 8s, fall back to /login

import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { getSupabaseClient } from '../lib/supabase';
import { Sun, Loader2, AlertCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const handledRef = useRef(false);

  // Read return path from query params (passed via Google OAuth redirectTo)
  const returnPath = searchParams.get('return') || '/app/dashboard';

  useEffect(() => {
    // Track all timeouts for clean teardown
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let subscription: { unsubscribe: () => void } | null = null;

    function navigateOnce(path: string) {
      if (handledRef.current) return;
      handledRef.current = true;
      // Clean up before navigating
      if (subscription) subscription.unsubscribe();
      timeouts.forEach(clearTimeout);
      navigate(path, { replace: true });
    }

    async function handleCallback() {
      try {
        const supabase = getSupabaseClient();

        // PRIMARY: Listen for the SIGNED_IN event that fires when
        // Supabase JS parses the #access_token from the URL hash
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if (handledRef.current) return;
          console.log(`[AuthCallback] onAuthStateChange: ${event}`);
          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
            console.log('[AuthCallback] Session established for:', session.user.email);
            navigateOnce(returnPath);
          }
        });
        subscription = data.subscription;

        // SECONDARY: Check if session already exists (e.g. from a fast hash parse)
        // Small delay so onAuthStateChange has time to register first
        const checkTimeout = setTimeout(async () => {
          if (handledRef.current) return;
          try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
              console.error('[AuthCallback] getSession error:', sessionError.message);
              setError(sessionError.message);
              const errTimeout = setTimeout(() => navigateOnce('/login'), 3000);
              timeouts.push(errTimeout);
              return;
            }
            if (session) {
              console.log('[AuthCallback] getSession found session for:', session.user.email);
              navigateOnce(returnPath);
            }
          } catch (err) {
            console.error('[AuthCallback] getSession exception:', err);
          }
        }, 500);
        timeouts.push(checkTimeout);

        // SAFETY NET: If nothing fires within 8 seconds, redirect to login
        const safetyTimeout = setTimeout(() => {
          if (handledRef.current) return;
          console.warn('[AuthCallback] Timeout — no session after 8s, redirecting to /login');
          setError('Authentication timed out. Please try again.');
          const finalTimeout = setTimeout(() => navigateOnce('/login'), 2000);
          timeouts.push(finalTimeout);
        }, 8000);
        timeouts.push(safetyTimeout);
      } catch (err) {
        console.error('[AuthCallback] Unexpected error:', err);
        setError(`Authentication error: ${err}`);
        const errTimeout = setTimeout(() => navigateOnce('/login'), 3000);
        timeouts.push(errTimeout);
      }
    }

    handleCallback();

    // Cleanup on unmount
    return () => {
      handledRef.current = true;
      if (subscription) subscription.unsubscribe();
      timeouts.forEach(clearTimeout);
    };
  }, [navigate, returnPath]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#F5F5F0' }}
    >
      <div className="text-center max-w-sm px-6">
        <div className="flex justify-center mb-6">
          <Sun className="w-8 h-8" style={{ color: '#00875A' }} />
        </div>

        {error ? (
          <>
            <div
              className="flex items-center gap-2 px-4 py-3 rounded mb-4 text-sm text-left"
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #DC2626',
                color: '#DC2626',
                borderRadius: '4px',
              }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <p className="text-sm" style={{ color: '#9CA39B' }}>
              Redirecting to sign in…
            </p>
          </>
        ) : (
          <>
            <Loader2
              className="w-6 h-6 animate-spin mx-auto mb-4"
              style={{ color: '#00875A' }}
            />
            <h2
              className="text-lg mb-2"
              style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', fontWeight: 400 }}
            >
              Completing sign in…
            </h2>
            <p className="text-sm" style={{ color: '#9CA39B' }}>
              Setting up your session
            </p>
          </>
        )}
      </div>
    </div>
  );
}