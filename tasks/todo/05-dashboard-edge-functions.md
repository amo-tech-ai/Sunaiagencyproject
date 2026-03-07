# P4: Dashboard Edge Functions

> **Priority:** HIGH -- Dashboard pages need real data from backend endpoints
> **Depends on:** P0 (auth wiring), P3 (dashboard pages exist)
> **Est:** ~4 hours

---

## Status

| Endpoint | Route | Handler | Status |
|----------|-------|---------|--------|
| `/dashboard-insights` | `ai-routes.tsx` | Gemini summary | Exists |
| `/dashboard/overview` | -- | -- | Missing |
| `/dashboard/activities` | -- | -- | Missing |
| `/dashboard/readiness` | -- | -- | Missing |
| `/dashboard/metrics` | -- | -- | Missing |

**Built: 1/5 (20%)**

---

## Architecture

```mermaid
flowchart LR
    subgraph "Dashboard Pages (React)"
        DH[DashboardHome]
        CL[ClientsListPage]
        IN[InsightsPage]
        AG[AgentsPage]
    end

    subgraph "Edge Functions (Hono)"
        EI[/dashboard-insights\nExists]
        OV[/dashboard/overview\nNEW]
        AC[/dashboard/activities\nNEW]
        RD[/dashboard/readiness\nNEW]
        MT[/dashboard/metrics\nNEW]
    end

    subgraph "Supabase"
        DB[(Tables)]
    end

    DH --> OV
    DH --> AC
    DH --> EI
    IN --> RD
    AG --> MT
    OV --> DB
    AC --> DB
    RD --> DB
    MT --> DB

    style EI fill:#c6efce
    style OV fill:#ffc7ce
    style AC fill:#ffc7ce
    style RD fill:#ffc7ce
    style MT fill:#ffc7ce
```

---

## Implementation Steps

### Step 1: `/dashboard/overview` endpoint

**File:** `supabase/functions/server/dashboard-routes.tsx` (new file)

Returns aggregated dashboard data for the authenticated user:

```tsx
import { Hono } from 'hono';
import { adminClient, userClient } from './db.tsx';

const dashboard = new Hono();

dashboard.get('/overview', async (c) => {
  const authHeader = c.req.header('Authorization');
  const supabase = userClient(authHeader);

  const [projects, clients, sessions] = await Promise.all([
    supabase.from('projects').select('id, name, status, progress').limit(10),
    supabase.from('clients').select('id, name, status').limit(10),
    supabase.from('wizard_sessions').select('id, session_id, updated_at').order('updated_at', { ascending: false }).limit(5),
  ]);

  return c.json({
    projects: projects.data || [],
    clients: clients.data || [],
    recentSessions: sessions.data || [],
  });
});

export default dashboard;
```

### Step 2: `/dashboard/activities` endpoint

Returns recent activity feed:

```tsx
dashboard.get('/activities', async (c) => {
  const authHeader = c.req.header('Authorization');
  const supabase = userClient(authHeader);

  const { data } = await supabase
    .from('activities')
    .select('id, type, description, metadata, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  return c.json({ activities: data || [] });
});
```

### Step 3: `/dashboard/readiness` endpoint

Returns AI readiness score from wizard data:

```tsx
dashboard.get('/readiness', async (c) => {
  const authHeader = c.req.header('Authorization');
  const supabase = userClient(authHeader);

  const { data: sessions } = await supabase
    .from('wizard_sessions')
    .select('id, state')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  // Parse readiness from wizard state if available
  const state = sessions?.state || {};
  return c.json({
    score: state.readinessScore || null,
    signals: state.diagnosticSignals || [],
    lastUpdated: sessions?.updated_at || null,
  });
});
```

### Step 4: `/dashboard/metrics` endpoint

Returns AI agent usage metrics:

```tsx
dashboard.get('/metrics', async (c) => {
  const authHeader = c.req.header('Authorization');
  const supabase = userClient(authHeader);

  const { data: logs } = await supabase
    .from('ai_run_logs')
    .select('agent_name, model, input_tokens, output_tokens, latency_ms, success, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  // Aggregate
  const totalRuns = logs?.length || 0;
  const successRate = totalRuns > 0
    ? (logs.filter(l => l.success).length / totalRuns * 100).toFixed(1)
    : 0;
  const totalTokens = logs?.reduce((sum, l) => sum + (l.input_tokens || 0) + (l.output_tokens || 0), 0) || 0;

  return c.json({
    totalRuns,
    successRate,
    totalTokens,
    recentLogs: logs?.slice(0, 20) || [],
  });
});
```

### Step 5: Mount routes in main server

**File:** `supabase/functions/server/index.tsx`

```tsx
import dashboard from './dashboard-routes.tsx';

// Add alongside existing routes:
app.route('/dashboard', dashboard);
```

### Step 6: Wire frontend hooks

**File:** `src/lib/hooks/useDashboardData.ts`

Update the existing hook (or create it) to call the new endpoints instead of using localStorage/mock data.

---

## Data Source Mapping

| Endpoint | Tables Queried | RLS Required |
|----------|---------------|--------------|
| `/dashboard/overview` | `projects`, `clients`, `wizard_sessions` | Yes (user-scoped) |
| `/dashboard/activities` | `activities` | Yes (org-scoped) |
| `/dashboard/readiness` | `wizard_sessions` | Yes (user-scoped) |
| `/dashboard/metrics` | `ai_run_logs` | Yes (user-scoped) |

---

## Verification

1. `supabase functions deploy server` -- deploys updated edge function
2. `curl -H "Authorization: Bearer <token>" <fn-url>/dashboard/overview` -- returns JSON
3. Dashboard pages show real data instead of mock/empty states
