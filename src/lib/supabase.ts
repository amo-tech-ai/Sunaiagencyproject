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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || publicAnonKey}`,
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

    // If user token caused a 401 (expired JWT), try refreshing the session first
    // then fall back to anon key so the edge function gateway accepts the request
    if (response.status === 401 && token && token !== publicAnonKey) {
      // Attempt to refresh the Supabase session for a fresh token
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
  session: {
    id: string;
    org_id?: string | null;
    user_id?: string | null;
    current_step: number;
    status?: string;
    context_snapshot?: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
  };
  answers: {
    step_number: number;
    answers: Record<string, unknown>;
    ai_results: Record<string, unknown> | null;
    updated_at: string;
  }[];
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
  save: (sessionId: string, fullState: Record<string, unknown>, token?: string) =>
    api<WizardSaveResponse>('/wizard/save', {
      method: 'POST',
      body: { sessionId, fullState },
      token,
    }),

  saveStep: (sessionId: string, step: number, data: unknown, token?: string) =>
    api<WizardSaveResponse>('/wizard/save', {
      method: 'POST',
      body: { sessionId, step, data },
      token,
    }),

  load: (sessionId: string, token?: string) =>
    api<WizardLoadResponse>(`/wizard/${sessionId}`, { token }),

  list: (userId: string, token?: string) =>
    api<{ sessions: { id: string; current_step: number; status: string; created_at: string; updated_at: string }[] }>(
      `/wizard/list/${userId}`, { token }
    ),
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

  dashboardInsights: (params: {
    sessionId: string;
    orgData: Record<string, unknown>;
    readinessScore: number;
    projectState: Record<string, unknown>;
    recentActivities: unknown[];
  }, token?: string) =>
    api<{
      success: boolean;
      insights: {
        insights: Array<{
          id: string;
          title: string;
          description: string;
          priority: 'high' | 'medium' | 'low';
          actionLabel?: string;
          actionRoute?: string;
        }>;
        greeting?: string;
        summary?: string;
      };
    }>('/dashboard-insights', {
      method: 'POST',
      body: params as Record<string, unknown>,
      token,
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

// ── Health check ──
export const healthCheck = () => api('/health');

// ── Agent Management API (reads from ai_run_logs + ai_cache tables) ──
export interface RunLogEntry {
  id: string;
  session_id: string | null;
  org_id: string | null;
  prompt_type: string;
  model: string;
  tokens_used: number;
  duration_ms: number;
  success: boolean;
  error_message: string | null;
  created_at: string;
}

export interface AggregateStats {
  totalRuns: number;
  successRuns: number;
  failedRuns: number;
  successRate: number;
  totalTokens: number;
  avgDuration: number;
  activeCacheEntries: number;
  byType: Record<string, { count: number; tokens: number; avgMs: number; successRate: number }>;
  model: string;
}

export interface CacheStats {
  totalEntries: number;
  activeEntries: number;
  expiredEntries: number;
  totalTokensCached: number;
  entries: Array<{ input_hash: string; model: string; tokens_used: number; expires_at: string; created_at: string }>;
}

export const agentApi = {
  getRunLogs: (params?: { limit?: number; offset?: number; promptType?: string }, token?: string) => {
    const qs = new URLSearchParams();
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    if (params?.promptType) qs.set('prompt_type', params.promptType);
    const query = qs.toString();
    return api<{ logs: RunLogEntry[]; total: number }>(`/ai/run-logs${query ? `?${query}` : ''}`, { token });
  },

  getAggregateStats: (token?: string) =>
    api<AggregateStats>('/ai/aggregate-stats', { token }),

  getCacheStats: (token?: string) =>
    api<CacheStats>('/ai/cache-stats', { token }),
};

// ── CRM API (reads from clients + crm_contacts Supabase tables) ──
export interface Client {
  id: string;
  name: string;
  industry: string;
  status: 'active' | 'prospect' | 'churned' | 'onboarding';
  health_score: number;
  contact_email: string;
  contact_name: string;
  revenue: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CRMContact {
  id: string;
  client_id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  is_primary: boolean;
  created_at: string;
}

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
    api<{ success: boolean }>(`/crm/clients/${id}`, { method: 'DELETE', token }),

  createContact: (clientId: string, data: Partial<CRMContact>, token?: string) =>
    api<{ contact: CRMContact }>(`/crm/clients/${clientId}/contacts`, { method: 'POST', body: data as Record<string, unknown>, token }),
};