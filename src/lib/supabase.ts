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
    const response = await fetch(url, fetchOptions);
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
