// C90-AUTH — Authentication Context
// Wraps Supabase Auth state, provides login/signup/logout (Email, Google, LinkedIn), persists session

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getSupabaseClient, authApi } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: (returnPath?: string) => Promise<void>;
  signInWithLinkedIn: (returnPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Safe fallback for components outside provider
    return {
      user: null,
      accessToken: null,
      loading: false,
      error: null,
      signIn: async () => ({ success: false, error: 'Auth not available' }),
      signUp: async () => ({ success: false, error: 'Auth not available' }),
      signInWithGoogle: async () => {},
      signInWithLinkedIn: async () => {},
      signOut: async () => {},
      clearError: () => {},
    } as AuthContextType;
  }
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    loading: true,
    error: null,
  });

  // Restore session on mount
  useEffect(() => {
    let mounted = true;
    async function restoreSession() {
      try {
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session && mounted) {
          setState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name,
              avatarUrl: session.user.user_metadata?.avatar_url,
            },
            accessToken: session.access_token,
            loading: false,
            error: null,
          });
        } else if (mounted) {
          setState(s => ({ ...s, loading: false }));
        }
      } catch {
        if (mounted) setState(s => ({ ...s, loading: false }));
      }
    }
    restoreSession();

    // Listen for auth state changes
    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session) {
        setState({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name,
            avatarUrl: session.user.user_metadata?.avatar_url,
          },
          accessToken: session.access_token,
          loading: false,
          error: null,
        });
      } else {
        setState({ user: null, accessToken: null, loading: false, error: null });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const { data, error } = await authApi.signIn(email, password);
      if (error || !data) {
        setState(s => ({ ...s, loading: false, error: error || 'Sign in failed' }));
        return { success: false, error: error || 'Sign in failed' };
      }
      // Auth state change listener will update state
      return { success: true };
    } catch (e) {
      const msg = `Sign in error: ${e}`;
      setState(s => ({ ...s, loading: false, error: msg }));
      return { success: false, error: msg };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const { data, error } = await authApi.signup(email, password, name);
      if (error) {
        setState(s => ({ ...s, loading: false, error }));
        return { success: false, error };
      }
      // After signup, auto-sign in
      const signInResult = await authApi.signIn(email, password);
      if (signInResult.error) {
        setState(s => ({ ...s, loading: false, error: signInResult.error }));
        return { success: false, error: signInResult.error || 'Auto sign-in failed after signup' };
      }
      return { success: true };
    } catch (e) {
      const msg = `Sign up error: ${e}`;
      setState(s => ({ ...s, loading: false, error: msg }));
      return { success: false, error: msg };
    }
  }, []);

  const signInWithGoogle = useCallback(async (returnPath?: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    const { error } = await authApi.signInWithGoogle(returnPath);
    if (error) {
      setState(s => ({ ...s, loading: false, error }));
    }
    // On success: browser redirects to Google — keep loading: true
    // The page will unmount, so no need to reset loading state
  }, []);

  const signInWithLinkedIn = useCallback(async (returnPath?: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    const { error } = await authApi.signInWithLinkedIn(returnPath);
    if (error) {
      setState(s => ({ ...s, loading: false, error }));
    }
    // On success: browser redirects to LinkedIn — keep loading: true
    // The page will unmount, so no need to reset loading state
  }, []);

  const signOut = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    await authApi.signOut();
    setState({ user: null, accessToken: null, loading: false, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState(s => ({ ...s, error: null }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signInWithGoogle, signInWithLinkedIn, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}