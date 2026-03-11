---
id: 034-activity-analytics-dashboard
diagram_id: DASH-10
prd_section: Dashboard
title: Activity and analytics dashboard — usage metrics, engagement tracking, and system health
skill: frontend
phase: LOW
priority: P3
status: Not Started
owner: Frontend
dependencies:
  - 025-dashboard-overview
estimated_effort: M
percent_complete: 0
area: agency-dashboard
wizard_step: null
schema_tables: [activities, ai_run_logs, wizard_sessions, projects, clients, crm_interactions]
figma_prompt: prompts/034-activity-analytics-dashboard.md
---

# 034 — Activity and Analytics Dashboard

## Summary Table

| Field            | Value                                                                      |
| ---------------- | -------------------------------------------------------------------------- |
| **ID**           | 034-activity-analytics-dashboard                                           |
| **Diagram ID**   | DASH-10                                                                    |
| **Section**      | Dashboard                                                                  |
| **Phase**        | LOW                                                                        |
| **Priority**     | P3                                                                         |
| **Effort**       | M (Medium)                                                                 |
| **Owner**        | Frontend                                                                   |
| **Dependencies** | 025-dashboard-overview                                                     |
| **Schema**       | activities, ai_run_logs, wizard_sessions, projects, clients, crm_interactions |
| **Wizard Step**  | None (analyzes wizard funnel data across all sessions)                     |

---

## Description

**Situation.** The platform generates data at every touchpoint — wizard sessions started and completed, AI agents invoked, documents uploaded, invoices sent, deals created, tasks completed. Each event is logged in the `activities` table or in domain-specific tables. But without an analytics layer, this data sits unused. The agency cannot answer questions like: What percentage of wizard sessions convert to projects? Which AI agent runs the most? Are clients engaging with the platform after onboarding?

**Why it matters.** Analytics separate guessing from knowing. The wizard funnel conversion rate tells the agency whether their intake process works or loses prospects. Client engagement patterns reveal who is active and who is churning. AI usage data shows which features deliver value and which are ignored. Platform health metrics catch problems before they affect clients. Without analytics, the agency is flying blind — growing on instinct rather than data.

**What exists.** The `activities` table captures all platform events with type, entity references, and timestamps. The `ai_run_logs` table records every AI agent invocation with tokens, duration, cache hits, and cost. `wizard_sessions` tracks the full funnel from start through each step to completion. `crm_interactions` logs client touchpoints. The raw data is comprehensive — what is missing is the visualization and analysis layer.

**The build.** An analytics dashboard with four sections: (1) wizard funnel visualization showing conversion from session start through each step to project creation; (2) client engagement heatmap showing activity frequency per client over time; (3) AI usage charts showing agent runs, token consumption, cache hit rates, and cost; (4) platform health metrics showing active users, sessions, and error rates. All sections support date range filtering.

**Example.** The agency owner opens Analytics on a Friday afternoon. The wizard funnel shows 47 sessions started this month, 38 reached Step 2, 31 reached Step 3, 24 reached Step 5, and 19 converted to projects — a 40% overall conversion rate. The drop-off between Step 3 and Step 4 is the biggest gap, suggesting the investment tier presentation needs work. The client engagement heatmap shows 3 clients have not logged in for 2+ weeks. The AI usage chart shows the "generate-recommendations" agent consumed 2.1M tokens this month at $34 cost, with a 67% cache hit rate saving an estimated $68.

---

## User Stories

- As an **agency owner**, I want to see wizard funnel conversion rates so I understand where prospects drop off and can optimize the intake process.
- As an **agency owner**, I want to see client engagement patterns so I can identify at-risk clients before they churn.
- As an **operations manager**, I want to monitor AI usage and costs so I can manage the AI budget and optimize cache utilization.
- As an **agency owner**, I want platform health metrics so I can ensure the system is performing well for all users.
- As a **consultant**, I want to know which services and systems are most frequently selected in the wizard so I can focus my expertise on high-demand areas.
- As an **agency owner**, I want automated weekly analytics digests so I stay informed without needing to check the dashboard daily.

---

## Goals & Acceptance Criteria

- [ ] Wizard funnel chart displays conversion from session started -> Step 1 -> Step 2 -> Step 3 -> Step 4 -> Step 5 -> project created, with absolute counts and conversion percentages between each step
- [ ] Funnel is filterable by date range (this week, this month, this quarter, custom)
- [ ] Client engagement heatmap shows a grid of clients (rows) x weeks (columns) with color intensity representing activity count (0 = white, 1-5 = light green, 6-15 = medium green, 16+ = dark green)
- [ ] Heatmap highlights clients with 0 activity in the past 14 days with a warning indicator
- [ ] AI usage section shows: total runs (number + trend), total tokens consumed (number + trend), cache hit rate (percentage), estimated cost ($)
- [ ] AI usage breakdown chart shows runs per agent/model with bar chart (Recharts)
- [ ] Token consumption over time line chart shows daily token usage for the past 30 days
- [ ] Platform health cards show: active users today, sessions today, error rate (percentage), average response time (ms)
- [ ] Top services/systems chart shows the most frequently recommended systems from wizard Step 3 data (horizontal bar chart)
- [ ] Date range picker at the top of the page filters all sections simultaneously
- [ ] All charts are interactive: hover for tooltips, click for drill-down where applicable
- [ ] Anomaly indicators appear on metrics that deviate significantly from their 30-day average (> 2 standard deviations)
- [ ] Page follows design system: #F1EEEA background, #0A211F text, #84CC16 accents, Playfair Display headings, Lora body, 1200px max-width, card-based, no shadows, no gradients

---

## Wiring Plan

| Data need                          | Source table(s)                 | Query / logic                                                                                  |
| ---------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| Wizard funnel counts               | `wizard_sessions`, `wizard_answers` | Count sessions, then count sessions with answers for each step (1-5), then count sessions with linked projects |
| Funnel conversion rates            | Derived                         | (Step N count / Step N-1 count) * 100 for each transition                                      |
| Client engagement heatmap          | `activities`, `clients`         | `SELECT client_id, DATE_TRUNC('week', created_at), COUNT(*) FROM activities GROUP BY 1, 2`     |
| At-risk clients                    | `activities`, `clients`         | `SELECT c.* FROM clients c WHERE c.id NOT IN (SELECT DISTINCT client_id FROM activities WHERE created_at > now() - interval '14 days')` |
| AI usage totals                    | `ai_run_logs`                   | `SELECT COUNT(*), SUM(tokens_used), AVG(CASE WHEN cache_hit THEN 1 ELSE 0 END), SUM(cost) FROM ai_run_logs WHERE created_at BETWEEN ? AND ?` |
| AI runs per agent                  | `ai_run_logs`                   | `SELECT agent_name, COUNT(*) FROM ai_run_logs GROUP BY agent_name ORDER BY count DESC`         |
| Token consumption over time        | `ai_run_logs`                   | `SELECT DATE(created_at), SUM(tokens_used) FROM ai_run_logs GROUP BY 1 ORDER BY 1`            |
| Platform health - active users     | `activities`                    | `SELECT COUNT(DISTINCT user_id) FROM activities WHERE created_at > now() - interval '24 hours'` |
| Platform health - sessions         | `wizard_sessions`               | `SELECT COUNT(*) FROM wizard_sessions WHERE created_at > now() - interval '24 hours'`          |
| Top systems selected               | `wizard_answers`                | Parse ai_results from Step 3 answers, aggregate system recommendations across sessions          |
| Anomaly detection                  | All metric tables               | Compare current period value to 30-day rolling average, flag if > 2 standard deviations         |

---

## Screen Purpose

Analytics hub showing platform usage, client engagement patterns, wizard completion funnel, AI system usage, and operational metrics. Helps the agency understand which services are most popular, where clients drop off in the wizard, how AI resources are consumed, and overall platform health. This is the data-driven decision-making center for the agency.

---

## Target User

Agency owner analyzing business performance and making strategic decisions about service offerings and pricing. Operations team monitoring platform health, AI costs, and system reliability. Consultants understanding demand patterns to focus their expertise. No client-facing access — this is an internal agency tool.

---

## Core Features

1. **Wizard funnel visualization** — Horizontal funnel chart showing the journey from "Session Started" through each wizard step (1: Business Context, 2: Industry Diagnostics, 3: System Recommendations, 4: Executive Summary, 5: Launch Project) to "Project Created". Each stage shows absolute count and conversion rate from the previous stage. Color gradient from light to dark as prospects progress. Drop-off callouts highlight the largest leak.
2. **Client engagement heatmap** — Grid visualization with clients as rows and time periods (weeks) as columns. Cell color intensity maps to activity count. Zero-activity cells are white; high-activity cells are dark #84CC16. Clients with no activity in 14+ days get a red warning icon. Click a client row to see their activity breakdown.
3. **AI usage analytics** — Four AI metric cards (total runs, total tokens, cache hit rate, estimated cost) followed by two charts: (a) runs per agent (horizontal bar chart) showing which AI agents are used most, and (b) token consumption over time (area chart) showing daily usage trends. Cache hit rate trend shows optimization effectiveness.
4. **Platform health metrics** — Four cards showing active users today, sessions today, error rate, and average response time. Each card includes a sparkline showing the 7-day trend. Anomaly alerts appear when any metric deviates from its 30-day average by more than 2 standard deviations.
5. **Service popularity ranking** — Horizontal bar chart showing the most frequently recommended AI systems from wizard Step 3 data. Shows both "recommended by AI" count and "selected by client" count side by side, revealing which recommendations convert best.
6. **Date range filtering** — Global date range picker at the top that filters all sections. Presets: Today, This Week, This Month, This Quarter, This Year, Custom. Charts animate smoothly when the range changes.

---

## Data Displayed

- **Funnel**: Step labels, absolute counts, conversion rates (%), drop-off counts, overall conversion rate
- **Engagement heatmap**: Client names (rows), week labels (columns), activity count per cell, color intensity, warning icons for inactive clients
- **AI usage cards**: Total runs (number + trend), tokens consumed (number + trend), cache hit rate (% + trend), estimated cost ($ + trend)
- **AI agent chart**: Agent name (y-axis), run count (x-axis), percentage of total
- **Token chart**: Date (x-axis), tokens consumed (y-axis, area fill), with 30-day moving average line
- **Health cards**: Active users (count + sparkline), sessions today (count + sparkline), error rate (% + sparkline), avg response time (ms + sparkline)
- **Service chart**: System name (y-axis), recommended count (bar), selected count (overlaid bar), conversion percentage label

---

## UI Components

| Component                | Description                                                              |
| ------------------------ | ------------------------------------------------------------------------ |
| `FunnelChart`            | Horizontal funnel with conversion rates and drop-off callouts            |
| `EngagementHeatmap`      | Client x week grid with color-coded activity intensity                    |
| `AIUsageCards`           | 4-card metrics row for AI totals (runs, tokens, cache rate, cost)         |
| `AIAgentBarChart`        | Horizontal bar chart (Recharts) showing runs per AI agent                 |
| `TokenConsumptionChart`  | Area chart (Recharts) showing daily token usage over time                 |
| `PlatformHealthCards`    | 4-card metrics row with sparklines for user/session/error/latency         |
| `ServicePopularityChart` | Horizontal bar chart showing system recommendation and selection counts   |
| `DateRangePicker`        | Period selector with presets and custom date range                        |
| `MetricsGrid`            | Flexible grid layout for metrics cards (2x2 or 4x1)                      |
| `TrendSparklines`        | Inline mini charts within metric cards showing 7-day trends               |
| `AnomalyIndicator`      | Red dot/badge on metrics that deviate from normal range                    |
| `ClientActivityDetail`  | Expandable panel showing a specific client's activity breakdown            |

---

## Layout Structure

```
+---------------------------------------------------------------+
| Sidebar (240px) | Main Content                                 |
|                 | +-------------------------------------------+ |
| [Navigation]    | | [Date Range Picker]                       | |
|                 | +-------------------------------------------+ |
|                 | | Platform Health Cards (4-up)              | |
|                 | | [Active Users][Sessions][Errors][Latency] | |
|                 | +-------------------------------------------+ |
|                 | +-------------------------------------------+ |
|                 | | Wizard Funnel (full width)                | |
|                 | | Start -> S1 -> S2 -> S3 -> S4 -> S5 -> Project |
|                 | +-------------------------------------------+ |
|                 | +--------------------+----------------------+ |
|                 | | AI Usage Cards     | Service Popularity   | |
|                 | | (4 cards, 2x2)     | (bar chart)          | |
|                 | +--------------------+----------------------+ |
|                 | +--------------------+----------------------+ |
|                 | | AI Agent Chart     | Token Consumption    | |
|                 | | (bar chart)        | (area chart)         | |
|                 | +--------------------+----------------------+ |
|                 | +-------------------------------------------+ |
|                 | | Client Engagement Heatmap (full width)    | |
|                 | | Clients (rows) x Weeks (columns)          | |
|                 | +-------------------------------------------+ |
+---------------------------------------------------------------+
```

- **Sidebar**: 240px, standard dashboard navigation
- **Main content**: Fills remaining width, max-width 1200px, centered
- **Date range picker**: Top-right corner, persists across all sections
- **Health cards**: 4 equal-width cards in a single row
- **Funnel**: Full width, horizontal orientation
- **Charts**: Two-column grid (50/50) for paired visualizations
- **Heatmap**: Full width at bottom, horizontally scrollable if many weeks
- **Background**: #F1EEEA, cards #FFFFFF, borders #D4CFC8

---

## Interaction Patterns

- **Date range change**: Select period -> all charts, metrics, and heatmap re-render with the new data range, smooth transitions
- **Funnel step hover**: Hover over a funnel stage -> tooltip shows count, conversion rate, and top reasons for drop-off (if available)
- **Funnel step click**: Click a funnel stage -> slide-out panel shows the list of wizard sessions at that stage with session details
- **Heatmap cell hover**: Hover -> tooltip shows client name, week, and activity count
- **Heatmap client click**: Click a client row -> expands below to show activity type breakdown (pie chart of activity types for that client)
- **AI chart hover**: Hover over bar/area -> tooltip shows exact values
- **Health card anomaly**: Click anomaly indicator -> popover shows: current value, 30-day average, standard deviation, and when the anomaly started
- **Service chart click**: Click a system bar -> filters the funnel to only sessions where that system was recommended

---

## Example User Workflows

**Workflow 1: Optimizing the wizard funnel**
1. Agency owner opens Analytics, sets date range to "This Month"
2. Wizard funnel shows 47 starts, 38 at Step 2, 31 at Step 3, 22 at Step 4, 24 at Step 5, 19 projects
3. Notices the largest drop is Step 3 -> Step 4 (31 -> 22, only 71% conversion)
4. Step 4 is "Executive Summary/Readiness" — hypothesis: the readiness score presentation discourages some prospects
5. Clicks Step 3 in the funnel -> sees the 9 sessions that dropped off
6. Notes common patterns: all 9 had low readiness scores
7. Decides to redesign Step 4 to be more encouraging for lower-readiness prospects

**Workflow 2: Identifying at-risk clients**
1. Operations manager opens Analytics, scrolls to engagement heatmap
2. Sees that "TechFlow Solutions" has white cells for the past 3 weeks (zero activity)
3. Warning icon confirms: no login in 21 days
4. Clicks TechFlow's row -> sees their last activity was viewing a document on Feb 14
5. Creates a task in the project dashboard to reach out to TechFlow for a check-in call

**Workflow 3: Managing AI costs**
1. Agency owner checks AI usage section
2. Sees estimated cost is $142 this month, up 34% from last month
3. Token consumption chart shows a spike on March 3 — 85K tokens in one day
4. Clicks the spike -> AI agent chart reveals "generate-roadmap" agent had 12 runs that day (normally 2-3)
5. Checks cache hit rate: dropped to 23% that day from typical 67%
6. Investigates: new roadmap template was deployed March 3, invalidating the cache
7. Confirms cache has recovered since then, cost trend normalizing

---

## AI Features

1. **Anomaly detection** — Continuously monitors all metrics against their 30-day rolling average. Flags deviations > 2 standard deviations with visual indicators and generates explanatory notes where possible (e.g., "Error rate spiked to 4.2%, likely due to the API timeout incidents logged at 3:47 PM").
2. **Trend forecasting** — Extends time-series charts with dashed forecast lines using simple regression models. Forecasts wizard session volume, revenue, and AI costs 4 weeks forward.
3. **Churn prediction** — Analyzes client engagement patterns in the heatmap and assigns a churn risk score (low/medium/high) based on declining activity trends, time since last login, and project completion status.
4. **Automated weekly digest** — Every Monday, AI generates a summary of the past week's analytics: funnel conversion rate, notable client engagement changes, AI cost summary, and platform health incidents. Delivered via email or in-app notification.
5. **Insight generation** — AI scans the data and surfaces 2-3 actionable insights per week, such as "Cart Recovery is your fastest-growing system — 40% more selections this month than last" or "Clients in the retail industry convert 23% better than healthcare."

---

## Data Sources

| Source Table         | Data Used                                                            |
| -------------------- | -------------------------------------------------------------------- |
| `activities`         | All platform events for engagement heatmap and platform health        |
| `ai_run_logs`        | AI agent usage: runs, tokens, cache hits, cost, duration              |
| `wizard_sessions`    | Funnel source: session start, step progression, completion            |
| `wizard_answers`     | Step-level completion data, system selections from Step 3             |
| `projects`           | Conversion endpoint: sessions that resulted in project creation       |
| `clients`            | Client names and metadata for heatmap rows and engagement analysis    |
| `crm_interactions`   | Client touchpoints supplementing engagement data                      |

---

## Automation Opportunities

- **Weekly analytics email**: Auto-generated digest sent every Monday with key metrics, notable changes, and AI-surfaced insights.
- **Churn alert automation**: When a client's churn risk score moves from low to medium or medium to high, automatically create a task for the assigned consultant to reach out.
- **Funnel drop-off alerts**: When the conversion rate between any two wizard steps drops below a configured threshold, alert the product team.
- **Cost budget alerts**: When AI costs exceed 80% of the monthly budget, notify the operations team with a breakdown by agent.
- **Anomaly notifications**: Real-time push notification when platform health anomalies are detected (error rate spike, latency increase).

---

## Visual Hierarchy

1. **Primary focus**: Wizard funnel at the center-top — the most actionable visualization showing where prospects convert or drop off
2. **Secondary focus**: Platform health cards at the very top — quick operational health check
3. **Tertiary focus**: AI usage and service popularity charts — resource management and demand intelligence
4. **Supporting focus**: Client engagement heatmap at the bottom — detailed engagement patterns requiring more study time
5. **Typography**: Playfair Display for "Analytics" page heading, section titles ("Wizard Funnel", "AI Usage", "Client Engagement"). Lora for all metric labels, chart labels, tooltips, and body text.
6. **Color palette**: #84CC16 for positive indicators, healthy engagement, and active states. #0A211F for primary text and chart axes. Red (#DC2626) for anomalies, errors, and at-risk indicators. Blue (#3B82F6) for neutral data points. #D4CFC8 for grid lines, borders, and chart backgrounds.
7. **Heatmap colors**: White (#FFFFFF) for zero activity, graduating through light #84CC16 (low), medium #84CC16 (moderate), to dark #0A211F-tinted green (high activity). Red warning icon (#DC2626) for 14+ day inactivity.
8. **Data density**: High density acceptable — this is a power-user analytics view. Tooltips provide detail on hover rather than cluttering the default view.

---

## Frontend Wiring

### Component Tree

```
ActivityAnalyticsDashboardPage
├── DateRangePicker                              # global date filter — presets + custom
├── PlatformHealthCards
│   ├── HealthCard (Active Users)
│   │   └── TrendSparkline
│   ├── HealthCard (Sessions Today)
│   │   └── TrendSparkline
│   ├── HealthCard (Error Rate)
│   │   ├── TrendSparkline
│   │   └── AnomalyIndicator                    # conditional red dot
│   └── HealthCard (Avg Response Time)
│       ├── TrendSparkline
│       └── AnomalyIndicator
├── FunnelChart                                  # wizard funnel visualization
│   └── FunnelStage[] (Start -> S1 -> S2 -> S3 -> S4 -> S5 -> Project)
├── div.grid.grid-cols-2                         # two-column section
│   ├── AIUsageCards
│   │   ├── MetricCard (Total Runs)
│   │   ├── MetricCard (Total Tokens)
│   │   ├── MetricCard (Cache Hit Rate)
│   │   └── MetricCard (Estimated Cost)
│   └── ServicePopularityChart                   # Recharts BarChart (horizontal)
├── div.grid.grid-cols-2                         # two-column section
│   ├── AIAgentBarChart                          # Recharts BarChart
│   └── TokenConsumptionChart                    # Recharts AreaChart
├── EngagementHeatmap                            # full-width heatmap
│   ├── HeatmapRow[] (one per client)
│   │   └── HeatmapCell[] (one per week)
│   └── ClientActivityDetail                     # expandable panel on row click
├── FunnelDetailSlideout                         # slide-out for funnel step drill-down
└── AnomalyPopover                               # popover on anomaly indicator click
```

### TypeScript Interfaces

```typescript
interface WizardFunnelData {
  steps: FunnelStep[];
  overall_conversion: number;    // percentage
  total_sessions: number;
  date_range: DateRange;
}

interface FunnelStep {
  step_number: number;           // 0 = started, 1-5 = wizard steps, 6 = project created
  label: string;                 // "Session Started", "Business Context", etc.
  count: number;
  conversion_from_prev: number;  // percentage (null for step 0)
  dropoff_count: number;
}

interface ClientEngagement {
  client_id: string;
  client_name: string;
  weeks: EngagementWeek[];
  is_at_risk: boolean;           // no activity in 14+ days
  last_activity_date: string | null;
}

interface EngagementWeek {
  week_start: string;            // ISO date (Monday)
  activity_count: number;
}

interface AIUsageMetrics {
  total_runs: number;
  total_runs_trend: number;      // percentage vs prior period
  total_tokens: number;
  total_tokens_trend: number;
  cache_hit_rate: number;        // 0-100
  cache_hit_rate_trend: number;
  estimated_cost: number;
  estimated_cost_trend: number;
}

interface AIAgentUsage {
  agent_name: string;
  run_count: number;
  pct_of_total: number;
}

interface TokenConsumptionPoint {
  date: string;                  // ISO date
  tokens: number;
  moving_avg: number;            // 30-day moving average
}

interface PlatformHealth {
  active_users: number;
  active_users_sparkline: number[];   // 7 daily values
  sessions_today: number;
  sessions_sparkline: number[];
  error_rate: number;                 // percentage
  error_rate_sparkline: number[];
  avg_response_time: number;          // milliseconds
  response_time_sparkline: number[];
  anomalies: AnomalyInfo[];
}

interface AnomalyInfo {
  metric: string;
  current_value: number;
  thirty_day_avg: number;
  std_deviation: number;
  started_at: string;
}

interface ServicePopularity {
  system_name: string;
  recommended_count: number;
  selected_count: number;
  conversion_pct: number;
}

interface ActivityEvent {
  id: string;
  type: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
  metadata: Record<string, unknown>;
}

interface DateRange {
  start: string;
  end: string;
  preset: 'today' | 'this_week' | 'this_month' | 'this_quarter' | 'this_year' | 'custom';
}
```

### Custom Hooks

```typescript
// Platform health metrics with sparklines and anomaly detection
function usePlatformHealth(): {
  health: PlatformHealth | null;
  loading: boolean;
  error: string | null;
};

// Wizard funnel conversion data
function useWizardFunnel(dateRange: DateRange): {
  funnel: WizardFunnelData | null;
  loading: boolean;
  error: string | null;
  sessionsForStep: (step: number) => Promise<WizardSessionDetail[]>;
};

// Client engagement heatmap data
function useEngagementHeatmap(dateRange: DateRange): {
  clients: ClientEngagement[];
  loading: boolean;
  error: string | null;
  getClientDetail: (clientId: string) => Promise<ActivityEvent[]>;
};

// AI usage metrics and chart data
function useAIUsage(dateRange: DateRange): {
  metrics: AIUsageMetrics | null;
  byAgent: AIAgentUsage[];
  tokenTimeline: TokenConsumptionPoint[];
  loading: boolean;
};

// Service/system popularity from wizard Step 3
function useServicePopularity(dateRange: DateRange): {
  services: ServicePopularity[];
  loading: boolean;
};
```

### State Management

| State                 | Location          | Notes                                                               |
| --------------------- | ----------------- | ------------------------------------------------------------------- |
| `dateRange`           | URL search params | `?start=...&end=...&preset=this_month` — filters all sections       |
| `selectedFunnelStep`  | `useState`        | Controls which funnel step is drilled into (slide-out panel)         |
| `expandedClient`      | `useState`        | Which client row in the heatmap is expanded to show activity detail  |
| `anomalyPopover`      | `useState`        | Which anomaly indicator's popover is currently open                   |
| `systemFilter`        | `useState`        | Set when a service bar is clicked — cross-filters the funnel         |

### Data Fetching Pattern

All hooks call the `api<T>()` helper from `src/lib/supabase.ts`:

```typescript
// usePlatformHealth — no date filter, always "now"
api<PlatformHealth>('/dashboard/analytics/health');

// useWizardFunnel
api<WizardFunnelData>('/dashboard/analytics/funnel', {
  method: 'POST',
  body: { start: dateRange.start, end: dateRange.end },
});

// useEngagementHeatmap
api<ClientEngagement[]>('/dashboard/analytics/engagement', {
  method: 'POST',
  body: { start: dateRange.start, end: dateRange.end },
});

// useAIUsage
api<{ metrics: AIUsageMetrics; byAgent: AIAgentUsage[]; tokenTimeline: TokenConsumptionPoint[] }>(
  '/dashboard/analytics/ai-usage',
  { method: 'POST', body: { start: dateRange.start, end: dateRange.end } }
);

// useServicePopularity
api<ServicePopularity[]>('/dashboard/analytics/service-popularity', {
  method: 'POST',
  body: { start: dateRange.start, end: dateRange.end },
});
```

Each hook refetches when `dateRange` changes. No global cache; stale data is replaced on every fetch. `usePlatformHealth` auto-refreshes every 60 seconds via `setInterval`.

### Component Communication

- `DateRangePicker` writes to URL search params; all hooks read from the same parsed params via a shared `useDateRange()` hook.
- `FunnelChart` fires `onStepClick(stepNumber)` — sets `selectedFunnelStep` in the page, which opens `FunnelDetailSlideout`.
- `ServicePopularityChart` fires `onBarClick(systemName)` — sets `systemFilter`, which is passed to `useWizardFunnel` to re-query the funnel filtered by sessions recommending that system.
- `EngagementHeatmap` fires `onClientClick(clientId)` — sets `expandedClient`, causing `ClientActivityDetail` to fetch and render that client's activity breakdown inline.
- `AnomalyIndicator` fires `onClick(metric)` — opens `AnomalyPopover` positioned next to the indicator.

---

## Backend Wiring

### New Edge Function Routes

| Method | Route                                         | Description                                        | Request Body                           | Response Shape                           |
| ------ | --------------------------------------------- | -------------------------------------------------- | -------------------------------------- | ---------------------------------------- |
| GET    | `/dashboard/analytics/health`                 | Platform health metrics (live, no date filter)     | -                                      | `PlatformHealth`                         |
| POST   | `/dashboard/analytics/funnel`                 | Wizard funnel conversion data                      | `{ start, end, systemFilter? }`        | `WizardFunnelData`                       |
| POST   | `/dashboard/analytics/funnel/:step/sessions`  | List wizard sessions at a specific funnel step     | `{ start, end }`                       | `WizardSessionDetail[]`                  |
| POST   | `/dashboard/analytics/engagement`             | Client engagement heatmap data                     | `{ start, end }`                       | `ClientEngagement[]`                     |
| POST   | `/dashboard/analytics/engagement/:clientId`   | Detailed activity breakdown for one client         | `{ start, end }`                       | `ActivityEvent[]`                        |
| POST   | `/dashboard/analytics/ai-usage`               | AI usage metrics, agent breakdown, token timeline  | `{ start, end }`                       | `AIUsageResponse`                        |
| POST   | `/dashboard/analytics/service-popularity`     | System recommendation vs selection counts          | `{ start, end }`                       | `ServicePopularity[]`                    |

### Supabase Client Queries

```typescript
// ── Platform health: active users (last 24h) ──
const { count: activeUsers } = await adminClient()
  .from('activities')
  .select('user_id', { count: 'exact', head: true })
  .gte('created_at', twentyFourHoursAgo);
// Note: COUNT(DISTINCT user_id) not directly supported — fetch and dedupe in JS or use RPC

// ── Platform health: sessions today ──
const { count: sessionsToday } = await adminClient()
  .from('wizard_sessions')
  .select('id', { count: 'exact', head: true })
  .gte('created_at', startOfDay);

// ── Wizard funnel: count sessions per step ──
// Step 0: total sessions in range
const { count: totalSessions } = await adminClient()
  .from('wizard_sessions')
  .select('id', { count: 'exact', head: true })
  .gte('created_at', start)
  .lte('created_at', end);

// Steps 1-5: sessions with answers for that step
const { data: stepCounts } = await adminClient()
  .from('wizard_answers')
  .select('step, wizard_session_id')
  .gte('created_at', start)
  .lte('created_at', end);
// Group by step in JS, count distinct wizard_session_id per step

// Step 6 (project created): sessions linked to a project
const { count: converted } = await adminClient()
  .from('projects')
  .select('id', { count: 'exact', head: true })
  .not('wizard_session_id', 'is', null)
  .gte('created_at', start)
  .lte('created_at', end);

// ── Client engagement heatmap ──
const { data: activities } = await adminClient()
  .from('activities')
  .select('client_id, created_at')
  .gte('created_at', start)
  .lte('created_at', end)
  .not('client_id', 'is', null);
// Bucket by client_id + week in JS

const { data: clients } = await adminClient()
  .from('clients')
  .select('id, name')
  .order('name');

// ── At-risk clients ──
const { data: recentlyActive } = await adminClient()
  .from('activities')
  .select('client_id')
  .gte('created_at', fourteenDaysAgo);
// Clients NOT in recentlyActive set are at-risk

// ── AI usage totals ──
const { data: aiLogs } = await adminClient()
  .from('ai_run_logs')
  .select('agent_name, tokens_used, cache_hit, cost, created_at')
  .gte('created_at', start)
  .lte('created_at', end);
// Aggregate: count, sum tokens_used, avg cache_hit, sum cost
// Group by agent_name for byAgent
// Group by date for token timeline

// ── Service popularity ──
const { data: answers } = await adminClient()
  .from('wizard_answers')
  .select('ai_results, wizard_session_id')
  .eq('step', 3)
  .gte('created_at', start)
  .lte('created_at', end);
// Parse ai_results for recommended systems vs user-selected systems
// Count per system name
```

### RLS Policies Needed

| Table              | Policy Name                | Rule                                                                                 |
| ------------------ | -------------------------- | ------------------------------------------------------------------------------------ |
| `activities`       | `agency_read_all`          | Allow SELECT where `auth.jwt()->>'role' IN ('owner', 'admin', 'consultant')`         |
| `ai_run_logs`      | `agency_read_all`          | Allow SELECT where `auth.jwt()->>'role' IN ('owner', 'admin')`                       |
| `wizard_sessions`  | `agency_read_all`          | Allow SELECT where `auth.jwt()->>'role' IN ('owner', 'admin', 'consultant')`         |
| `wizard_answers`   | `agency_read_all`          | Allow SELECT where `auth.jwt()->>'role' IN ('owner', 'admin', 'consultant')`         |
| `crm_interactions` | `agency_read_all`          | Allow SELECT where `auth.jwt()->>'role' IN ('owner', 'admin', 'consultant')`         |

Note: All analytics routes are agency-internal — no client access. Edge functions use `adminClient()` after JWT role verification.

### API Response TypeScript Interfaces

```typescript
interface PlatformHealthResponse {
  active_users: number;
  active_users_sparkline: number[];
  sessions_today: number;
  sessions_sparkline: number[];
  error_rate: number;
  error_rate_sparkline: number[];
  avg_response_time: number;
  response_time_sparkline: number[];
  anomalies: AnomalyInfo[];
}

interface WizardFunnelResponse {
  steps: FunnelStep[];
  overall_conversion: number;
  total_sessions: number;
  date_range: { start: string; end: string };
}

interface AIUsageResponse {
  metrics: AIUsageMetrics;
  byAgent: AIAgentUsage[];
  tokenTimeline: TokenConsumptionPoint[];
}

interface WizardSessionDetail {
  session_id: string;
  started_at: string;
  last_step_completed: number;
  client_email?: string;
  industry?: string;
  dropped_at_step?: number;
}
```

### Edge Cases

| Scenario                            | Handling                                                                                      |
| ----------------------------------- | --------------------------------------------------------------------------------------------- |
| No wizard sessions in range         | Funnel renders with zero counts; empty state message "No wizard sessions in this period"       |
| Client with no activities ever      | Client appears in heatmap with all white cells and at-risk warning icon                        |
| No AI run logs                      | AI usage cards show 0 with "No AI activity" subtitle; charts show empty axes                   |
| Anomaly detection — insufficient data | If < 30 days of history, skip anomaly detection; show "Insufficient data" tooltip              |
| Large number of clients (100+)      | Heatmap is virtualized — only visible rows are rendered; scroll to see more                    |
| Unauthorized user                   | Edge function verifies JWT role; non-agency users get `403 Forbidden`                          |
| wizard_answers with malformed ai_results | Skip unparseable records; log warning; return partial results                              |
| Date range spans no data            | All sections show empty states with "No data for this period" messages                         |

---

## Detailed ASCII Wireframes

### Desktop Layout (1200px max-width)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER BAR (sticky, 56px)                                                                       │
│  Sun AI Agency          Dashboard  Projects  Clients  ...                         [Avatar ▾]    │
├────────────┬────────────────────────────────────────────────────────────────────────────────────┤
│            │                                                                                    │
│  SIDEBAR   │  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│  (240px)   │  │  Analytics                                           [This Month ▾]          │  │
│            │  └──────────────────────────────────────────────────────────────────────────────┘  │
│ ┌────────┐ │                                                                                    │
│ │Overview│ │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                 │
│ ├────────┤ │  │ Active Users│ │ Sessions    │ │ Error Rate  │ │ Avg Resp.   │                 │
│ │Pipeline│ │  │     42      │ │    18       │ │   0.3%      │ │   142ms     │                 │
│ ├────────┤ │  │ ╱╲╱╲╱╲╱╲ 7d│ │ ╱╲╱╲╱╲╱╲ 7d│ │ ╱╲╱╲╱╲╱╲ 7d│ │ ╱╲╱╲╱╲╱╲ 7d│                 │
│ │Projects│ │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘                 │
│ ├────────┤ │                                                                                    │
│ │CRM     │ │  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│ ├────────┤ │  │ Wizard Funnel                                                                │  │
│ │Finance │ │  │                                                                              │  │
│ ├────────┤ │  │ ┌─────────┐    ┌────────┐    ┌────────┐    ┌──────┐    ┌──────┐    ┌──────┐ │  │
│ │▸Analyti│ │  │ │ Started │───→│ Step 1 │───→│ Step 2 │───→│Step 3│───→│Step 4│───→│Step 5│ │  │
│ ├────────┤ │  │ │   47    │    │   42   │    │   38   │    │  31  │    │  22  │    │  24  │ │  │
│ │Roadmap │ │  │ │         │    │  89%   │    │  90%   │    │ 82%  │    │ 71%  │    │ 109% │ │  │
│ ├────────┤ │  │ └─────────┘    └────────┘    └────────┘    └──────┘    └──────┘    └──────┘ │  │
│ │Systems │ │  │                                                          │                   │  │
│ └────────┘ │  │                              ▼ biggest drop              ▼                   │  │
│            │  │                            9 dropped here          ──→┌──────┐               │  │
│            │  │                                                       │Projct│               │  │
│            │  │                              Overall: 40% conversion  │  19  │               │  │
│            │  │                                                       └──────┘               │  │
│            │  └──────────────────────────────────────────────────────────────────────────────┘  │
│            │                                                                                    │
│            │  ┌────────────────────────────────┬─────────────────────────────────┐              │
│            │  │ AI Usage           (50%)       │ Service Popularity     (50%)    │              │
│            │  │ ┌──────────┐ ┌──────────┐     │ ┌─────────────────────────────┐ │              │
│            │  │ │ Runs     │ │ Tokens   │     │ │ Support Eng ████████ R:24   │ │              │
│            │  │ │   847    │ │  2.1M    │     │ │             ██████   S:18   │ │              │
│            │  │ │ ▲ +12%   │ │ ▲ +18%   │     │ │ Cart Recov  ██████   R:19   │ │              │
│            │  │ └──────────┘ └──────────┘     │ │             ████     S:14   │ │              │
│            │  │ ┌──────────┐ ┌──────────┐     │ │ Growth Eng  ████     R:15   │ │              │
│            │  │ │ Cache    │ │ Cost     │     │ │             ███      S:11   │ │              │
│            │  │ │  67%     │ │  $34     │     │ │ Analytics   ███      R:12   │ │              │
│            │  │ │ ▼ -3%    │ │ ▲ +22%   │     │ │             ██       S:7    │ │              │
│            │  │ └──────────┘ └──────────┘     │ │                             │ │              │
│            │  │   ← 2x2 metric grid →         │ │ ██ Recommended  ██ Selected │ │              │
│            │  └────────────────────────────────┴─────────────────────────────────┘              │
│            │                                                                                    │
│            │  ┌────────────────────────────────┬─────────────────────────────────┐              │
│            │  │ Runs per Agent        (50%)    │ Token Consumption      (50%)    │              │
│            │  │ ┌─────────────────────────────┐│ ┌─────────────────────────────┐ │              │
│            │  │ │ gen-roadmap    ████████  312 ││ │                    ╱╲      │ │              │
│            │  │ │ gen-recommend  ██████    218 ││ │ 100K  ╱╲   ╱╲╱╲╱╯  ╲     │ │              │
│            │  │ │ analyze-biz    ████      147 ││ │  80K ╱  ╲╱╯         ╲╱╲  │ │              │
│            │  │ │ readiness      ███       102 ││ │  60K╱                   ╲ │ │              │
│            │  │ │ industry-diag  ██         68 ││ │  40K                     │ │              │
│            │  │ └─────────────────────────────┘│ │      ──── actual ╌╌ avg   │ │              │
│            │  │                                 │ └─────────────────────────────┘ │              │
│            │  └────────────────────────────────┴─────────────────────────────────┘              │
│            │                                                                                    │
│            │  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│            │  │ Client Engagement Heatmap                                                    │  │
│            │  │                  Wk1  Wk2  Wk3  Wk4  Wk5  Wk6  Wk7  Wk8  Wk9 Wk10 Wk11 W12│  │
│            │  │ Acme Retail      ██   ██   ██   ██   ██   ██   ██   ░░   ██   ██   ██   ██  │  │
│            │  │ TechFlow     ⚠  ░░   ░░   ██   ░░   ░░   ██   ░░   ░░   ░░   ░░   ░░   ░░  │  │
│            │  │ BrightPath      ██   ██   ██   ██   ██   ░░   ██   ██   ██   ██   ██   ██  │  │
│            │  │ GreenLeaf       ░░   ██   ██   ██   ██   ██   ██   ██   ██   ██   ██   ██  │  │
│            │  │ MedCorp     ⚠  ██   ██   ░░   ░░   ░░   ░░   ░░   ░░   ░░   ░░   ░░   ░░  │  │
│            │  │                                                                              │  │
│            │  │ ░░ = 0   ▒▒ = 1-5   ▓▓ = 6-15   ██ = 16+     ⚠ = at-risk (14+ days)       │  │
│            │  └──────────────────────────────────────────────────────────────────────────────┘  │
│            │                                                                                    │
├────────────┴────────────────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Tablet Layout (768px)

```
┌─────────────────────────────────────────────────────┐
│ HEADER (56px)               [☰ Menu]    [Avatar ▾]  │
├─────────────────────────────────────────────────────┤
│ Analytics                        [This Month ▾]     │
├─────────────────────────────────────────────────────┤
│ ┌───────────────────┐ ┌───────────────────┐         │
│ │ Active Users  42  │ │ Sessions   18     │         │
│ │ ╱╲╱╲╱╲╱╲         │ │ ╱╲╱╲╱╲╱╲          │         │
│ └───────────────────┘ └───────────────────┘         │
│ ┌───────────────────┐ ┌───────────────────┐         │
│ │ Error Rate  0.3%  │ │ Avg Resp. 142ms   │         │
│ │ ╱╲╱╲╱╲╱╲         │ │ ╱╲╱╲╱╲╱╲          │         │
│ └───────────────────┘ └───────────────────┘         │
│  ← health cards 2x2 →                              │
├─────────────────────────────────────────────────────┤
│ Wizard Funnel (full width, horizontal scroll)       │
│ ┌────────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌─────┐ │
│ │Start 47│→ │S1  42│→ │S2  38│→ │S3  31│→ │S4 22│ │
│ └────────┘  └──────┘  └──────┘  └──────┘  └─────┘ │
│           → ┌──────┐  → ┌──────┐                    │
│             │S5  24│    │Proj19│                     │
│             └──────┘    └──────┘  Overall: 40%      │
├──────────────────────┬──────────────────────────────┤
│ AI Usage (2x2 cards) │ Service Popularity           │
│ Runs:847 Tok:2.1M    │ Support ████████ R:24/S:18   │
│ Cache:67% Cost:$34   │ Cart    ██████   R:19/S:14   │
├──────────────────────┴──────────────────────────────┤
│ Runs per Agent (full width)                         │
├─────────────────────────────────────────────────────┤
│ Token Consumption (full width)                      │
├─────────────────────────────────────────────────────┤
│ Client Engagement Heatmap (horizontal scroll)       │
│              Wk1 Wk2 Wk3 Wk4 Wk5 Wk6 ...          │
│ Acme Retail   ██  ██  ██  ██  ██  ██  ...           │
│ TechFlow  ⚠  ░░  ░░  ██  ░░  ░░  ██  ...           │
└─────────────────────────────────────────────────────┘
```

### Mobile Layout (375px)

```
┌───────────────────────────────────┐
│ HEADER             [☰]  [Avatar] │
├───────────────────────────────────┤
│ Analytics       [This Month ▾]   │
├───────────────────────────────────┤
│ ┌───────────────────────────────┐ │
│ │ Active Users          42     │ │
│ │ ╱╲╱╲╱╲╱╲ 7d                 │ │
│ └───────────────────────────────┘ │
│ ┌───────────────────────────────┐ │
│ │ Sessions              18     │ │
│ │ ╱╲╱╲╱╲╱╲ 7d                 │ │
│ └───────────────────────────────┘ │
│ ┌───────────────────────────────┐ │
│ │ Error Rate           0.3%    │ │
│ └───────────────────────────────┘ │
│ ┌───────────────────────────────┐ │
│ │ Avg Response Time    142ms   │ │
│ └───────────────────────────────┘ │
│  ← stacked single-column cards → │
├───────────────────────────────────┤
│ Wizard Funnel (vertical layout)  │
│ ┌───────────────────────────────┐ │
│ │  Started         47          │ │
│ │       ↓  89%                 │ │
│ │  Step 1          42          │ │
│ │       ↓  90%                 │ │
│ │  Step 2          38          │ │
│ │       ↓  82%                 │ │
│ │  Step 3          31          │ │
│ │       ↓  71% ← biggest drop │ │
│ │  Step 4          22          │ │
│ │       ↓  109%                │ │
│ │  Step 5          24          │ │
│ │       ↓  79%                 │ │
│ │  Project         19          │ │
│ │                              │ │
│ │  Overall: 40% conversion     │ │
│ └───────────────────────────────┘ │
├───────────────────────────────────┤
│ AI Usage (2x2 grid)              │
│ ┌──────────────┐┌──────────────┐ │
│ │ Runs   847   ││ Tokens 2.1M  │ │
│ └──────────────┘└──────────────┘ │
│ ┌──────────────┐┌──────────────┐ │
│ │ Cache  67%   ││ Cost   $34   │ │
│ └──────────────┘└──────────────┘ │
├───────────────────────────────────┤
│ Service Popularity (full width)  │
├───────────────────────────────────┤
│ Runs per Agent (full width)      │
├───────────────────────────────────┤
│ Token Consumption (full width)   │
├───────────────────────────────────┤
│ Engagement Heatmap               │
│ (horizontal scroll, compact)     │
│ ┌───────────────────────────────┐ │
│ │ Acme    ██ ██ ██ ░░ ██ ██ ██│ │
│ │ Tech ⚠  ░░ ██ ░░ ░░ ░░ ░░ ░░│ │
│ │ Bright  ██ ██ ██ ██ ██ ██ ██│ │
│ └───────────────────────────────┘ │
└───────────────────────────────────┘
```

### Key Component Detail: Funnel Stage

```
                          conversion rate
                             90%
┌───────────────┐       ┌───────────────┐
│               │       │               │
│   Step 1      │──────→│   Step 2      │
│ Biz Context   │       │ Industry Diag │
│               │       │               │
│     42        │       │     38        │
│               │       │               │
│  #84CC16 bg   │       │  #84CC16 bg   │
│  (lighter     │       │  (darker as   │
│   = earlier)  │       │   progresses) │
└───────────────┘       └───────────────┘
  160px × 100px            160px × 100px
  Hover tooltip:
  ┌──────────────────────────────────┐
  │ Step 2: Industry Diagnostics     │
  │ Sessions: 38                     │
  │ Conversion from Step 1: 90.5%    │
  │ Drop-off: 4 sessions             │
  └──────────────────────────────────┘
```

### Key Component Detail: Heatmap Cell

```
  One cell = one client-week intersection

  Zero activity:        Low (1-5):          Medium (6-15):      High (16+):
  ┌────────────┐       ┌────────────┐       ┌────────────┐      ┌────────────┐
  │            │       │  ░░░░░░░░  │       │  ▒▒▒▒▒▒▒▒  │      │  ████████  │
  │  #FFFFFF   │       │  #D4E8A0   │       │  #84CC16   │      │  #4A7A0D   │
  │            │       │  (light)   │       │  (medium)  │      │  (dark)    │
  └────────────┘       └────────────┘       └────────────┘      └────────────┘
     36px × 24px

  Hover tooltip:
  ┌──────────────────────────┐
  │ Acme Retail              │
  │ Week of Mar 2, 2026      │
  │ 12 activities            │
  │ Click to expand          │
  └──────────────────────────┘
```

### Key Component Detail: Anomaly Popover

```
  Health card with anomaly:
  ┌─────────────────────────────────┐
  │ Error Rate              🔴     │  ← red dot = anomaly
  │   4.2%                         │
  │ ╱╲╱╲╱╲╱╲ (spike visible)      │
  └───────────────┬─────────────────┘
                  │
                  ▼ popover on click
  ┌─────────────────────────────────┐
  │ Anomaly Detected                │
  │ ─────────────────────────────── │
  │ Current:    4.2%                │
  │ 30-day avg: 0.8%               │
  │ Std dev:    0.4%               │
  │ Deviation:  8.5x               │
  │ Started:    Mar 7, 3:47 PM     │
  │                                 │
  │ Likely cause: API timeout       │
  │ incidents logged at 3:47 PM     │
  └─────────────────────────────────┘
```

---

## Outcomes

| Outcome                                | Metric                                           | Target          |
| -------------------------------------- | ------------------------------------------------ | --------------- |
| Funnel visibility                      | Can answer "what is our wizard conversion rate"   | < 5 seconds     |
| Conversion optimization                | Overall wizard-to-project conversion rate          | > 40%           |
| Client retention awareness             | At-risk clients identified before churn            | > 80%           |
| AI cost management                     | Monthly AI cost vs budget                          | Within 90%      |
| Platform reliability                   | Uptime and error rate visibility                   | < 1% error rate |
| Data-driven decisions                  | Strategic decisions citing analytics data           | 3+ per month    |
