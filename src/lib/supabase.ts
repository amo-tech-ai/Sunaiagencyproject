// L01-SUPABASE — Frontend Supabase client singleton + API helpers
// All backend communication goes through this module

import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const SUPABASE_URL = `https://${projectId}.supabase.co`;
const BASE_URL = `${SUPABASE_URL}/functions/v1/make-server-283466b6`;

// ── Singleton Supabase client ──
let _client: ReturnType<typeof createClient> | null = null;
export function getSupabaseClient() {
  if (!_client) {
    _client = createClient(SUPABASE_URL, publicAnonKey);
  }
  return _client;
}

// ── Fresh token helper — always gets the latest access token from Supabase ──
// Supabase JS auto-refreshes expired tokens internally, so getSession()
// returns a valid token even if the original one expired.
async function getFreshAccessToken(): Promise<string | null> {
  try {
    const supabase = getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  } catch {
    return null;
  }
}

// Convenience export used by auth pages (LoginPage, SignupPage)
export const supabase = getSupabaseClient();

// ── API helper — calls Edge Functions ──
interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  token?: string; // access_token for authenticated requests
}

export async function api<T = unknown>(
  route: string,
  options: ApiOptions = {}
): Promise<{ data: T | null; error: string | null }> {
  const { method = 'GET', body, token } = options;

  try {
    // If a token was provided (authenticated request), always get a fresh one
    // from the Supabase session to avoid stale JWT errors. The Supabase JS
    // client handles auto-refresh internally.
    let activeToken = token;
    if (token && token !== publicAnonKey) {
      const fresh = await getFreshAccessToken();
      if (fresh) {
        activeToken = fresh;
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${activeToken || publicAnonKey}`,
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    const url = `${BASE_URL}${route.startsWith('/') ? route : `/${route}`}`;
    let response = await fetch(url, fetchOptions);

    // If still 401 after using a fresh token, try one explicit refresh cycle
    // then fall back to anon key so the edge function gateway accepts the request
    if (response.status === 401 && activeToken && activeToken !== publicAnonKey) {
      // Attempt to force-refresh the Supabase session for a new token
      try {
        const supabase = getSupabaseClient();
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (refreshData?.session?.access_token) {
          const refreshedHeaders = { ...headers, Authorization: `Bearer ${refreshData.session.access_token}` };
          const refreshedResponse = await fetch(url, { ...fetchOptions, headers: refreshedHeaders });
          if (refreshedResponse.ok) {
            const refreshedData = await refreshedResponse.json();
            return { data: refreshedData as T, error: null };
          }
        }
      } catch {
        // Refresh failed — fall through to anon key retry
      }

      console.warn(`[API] ${method} ${route}: token expired, retrying with anon key`);
      const retryHeaders = { ...headers, Authorization: `Bearer ${publicAnonKey}` };
      response = await fetch(url, {
        ...fetchOptions,
        headers: retryHeaders,
      });
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.error || `API error: ${response.status} ${response.statusText}`;
      console.error(`[API] ${method} ${route} failed:`, errorMsg);
      return { data: null, error: errorMsg };
    }

    return { data: data as T, error: null };
  } catch (err) {
    const errorMsg = `Network error calling ${route}: ${err}`;
    console.error(`[API]`, errorMsg);
    return { data: null, error: errorMsg };
  }
}

// ── Typed API methods ──

export interface WizardSaveResponse {
  success: boolean;
  sessionId: string;
  updatedAt: string;
}

export interface WizardLoadResponse {
  session: Record<string, unknown>;
  answers: Record<string, unknown>[];
  progress: { currentStep: number; completedSteps: number[] };
}

export interface AnalysisResponse {
  success: boolean;
  analysis: {
    companySummary: string;
    detectedIndustry: string;
    productsServices: string[];
    teamSizeEstimate: string;
    technologySignals: string[];
    aiOpportunities: string[];
    competitivePosition?: string;
    readinessIndicators?: {
      digital_maturity: string;
      automation_level: string;
      data_readiness: string;
    };
  };
  timestamp: string;
}

export interface RoadmapResponse {
  success: boolean;
  roadmap: {
    title: string;
    totalWeeks: number;
    totalInvestment: string;
    phases: {
      phaseNumber: number;
      title: string;
      weekRange: string;
      systems: string[];
      deliverables: string[];
      milestones: string[];
      estimatedCost: string;
    }[];
    quickWins: string[];
    riskFactors: { risk: string; mitigation: string }[];
    successMetrics: { metric: string; target: string; timeframe: string }[];
  };
  timestamp: string;
}

// ── Wizard API ──
export const wizardApi = {
  save: (sessionId: string, fullState: Record<string, unknown>) =>
    api<WizardSaveResponse>('/wizard/save', {
      method: 'POST',
      body: { sessionId, fullState },
    }),

  saveStep: (sessionId: string, step: number, data: unknown) =>
    api<WizardSaveResponse>('/wizard/save', {
      method: 'POST',
      body: { sessionId, step, data },
    }),

  load: (sessionId: string) =>
    api<WizardLoadResponse>(`/wizard/${sessionId}`),
};

// ── AI API ──
export const aiApi = {
  analyzeBusiness: (params: {
    url?: string;
    description?: string;
    industry?: string;
    sessionId?: string;
  }) =>
    api<AnalysisResponse>('/analyze-business', {
      method: 'POST',
      body: params as Record<string, unknown>,
    }),

  industryDiagnostics: (params: {
    industryId: string;
    companyProfile?: Record<string, unknown>;
    sessionId?: string;
  }) =>
    api('/industry-diagnostics', {
      method: 'POST',
      body: params as Record<string, unknown>,
    }),

  systemRecommendations: (params: {
    sessionId?: string;
    wizardAnswers?: Record<string, unknown>;
    industry?: string;
    signals?: unknown[];
  }) =>
    api('/system-recommendations', {
      method: 'POST',
      body: params as Record<string, unknown>,
    }),

  readinessScore: (sessionId: string) =>
    api('/readiness-score', {
      method: 'POST',
      body: { sessionId },
    }),

  generateRoadmap: (params: {
    sessionId?: string;
    selectedSystems: string[];
    industry?: string;
    companySize?: string;
  }) =>
    api<RoadmapResponse>('/generate-roadmap', {
      method: 'POST',
      body: params as Record<string, unknown>,
    }),
};

// ── Auth API ──
export const authApi = {
  signup: (email: string, password: string, name?: string) =>
    api('/signup', {
      method: 'POST',
      body: { email, password, name },
    }),

  signIn: async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { data: null, error: error.message };
    return { data: { session: data.session, user: data.user }, error: null };
  },

  signInWithGoogle: async (returnPath?: string) => {
    const supabase = getSupabaseClient();
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    if (returnPath) {
      callbackUrl.searchParams.set('return', returnPath);
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });
    if (error) {
      console.error('[Auth] Google OAuth error:', error.message);
      return { error: error.message };
    }
    // Browser will redirect — no return value needed
    return { error: null };
  },

  signInWithLinkedIn: async (returnPath?: string) => {
    const supabase = getSupabaseClient();
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    if (returnPath) {
      callbackUrl.searchParams.set('return', returnPath);
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });
    if (error) {
      console.error('[Auth] LinkedIn OIDC OAuth error:', error.message);
      return { error: error.message };
    }
    // Browser will redirect — no return value needed
    return { error: null };
  },

  signOut: async () => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  },

  getSession: async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) return { data: null, error: error.message };
    return { data: data.session, error: null };
  },
};

// ── CRM Types ──
export interface Client {
  id: string;
  name: string;
  industry?: string;
  status: string;
  health_score?: number;
  revenue?: number;
  contact_name?: string;
  contact_email?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  org_id?: string;
}

export interface CRMContact {
  id: string;
  client_id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  is_primary?: boolean;
}

// ── CRM API ──
export const crmApi = {
  listClients: (token?: string) =>
    api<{ clients: Client[] }>('/crm/clients', { token }),

  getClient: (id: string, token?: string) =>
    api<{ client: Client; contacts: CRMContact[] }>(`/crm/clients/${id}`, { token }),

  createClient: (data: Partial<Client>, token?: string) =>
    api<{ client: Client }>('/crm/clients', { method: 'POST', body: data as Record<string, unknown>, token }),

  updateClient: (id: string, data: Partial<Client>, token?: string) =>
    api<{ client: Client }>(`/crm/clients/${id}`, { method: 'PUT', body: data as Record<string, unknown>, token }),

  deleteClient: (id: string, token?: string) =>
    api(`/crm/clients/${id}`, { method: 'DELETE', token }),
};

// ── Agent Types ──
export interface RunLogEntry {
  id: string;
  agent_name: string;
  model: string;
  prompt_type?: string;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  success: boolean;
  error?: string;
  created_at: string;
}

export interface AggregateStats {
  totalRuns: number;
  successRate: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  avgLatency: number;
  byAgent: Record<string, { runs: number; successRate: number; avgLatency: number }>;
}

export interface CacheStats {
  totalEntries: number;
  hitRate: number;
  totalSizeBytes: number;
  oldestEntry?: string;
}

// ── Agent API ──
export const agentApi = {
  getAggregateStats: (token?: string) =>
    api<AggregateStats>('/agents/stats', { token }),

  getCacheStats: (token?: string) =>
    api<CacheStats>('/agents/cache-stats', { token }),

  getRunLogs: (params: { limit?: number; offset?: number; promptType?: string }, token?: string) => {
    const query = new URLSearchParams();
    if (params.limit) query.set('limit', String(params.limit));
    if (params.offset) query.set('offset', String(params.offset));
    if (params.promptType) query.set('prompt_type', params.promptType);
    const qs = query.toString();
    return api<{ logs: RunLogEntry[]; total: number }>(`/agents/logs${qs ? `?${qs}` : ''}`, { token });
  },
};

// ── Health check ──
export const healthCheck = () => api('/health');
