# Dashboard Enhancements — Wireframes & Implementation

**Document:** 03 of Agency Agents series
**Version:** 1.0
**Created:** 2026-03-12
**Parent:** [00-executive-summary.md](./00-executive-summary.md)
**Status:** Implementing

---

## Implementation Plan (Sequential Order)

| # | Task | File(s) | Status | Depends On |
|---|---|---|---|---|
| 1 | Create planning doc | `docs/agency/03-dashboard-wireframes.md` | Done | — |
| 2 | Create AgentTeamWidget component | `components/dashboard/AgentTeamWidget.tsx` | Done | agentData.ts |
| 3 | Update MetricsRow with "Active Agents" metric | `components/dashboard/MetricsRow.tsx` | Done | — |
| 4 | Wire AgentTeamWidget into DashboardHome | `components/dashboard/DashboardHome.tsx` | Done | #2, #3 |
| 5 | Enhance InsightDetailCards with agent attribution | `components/dashboard/insights/InsightDetailCards.tsx` | Done | — |
| 6 | Enhance DealCard with agent health score | `components/dashboard/crm/DealCard.tsx` + `lib/types/crm-pipeline.ts` | Done | — |
| 7 | Add Finance Tracker projection widget | `components/dashboard/financial/FinancialDashboardPage.tsx` | Done | — |
| 8 | Add agent-as-node to workflow types | `lib/types/workflows.ts` + `WorkflowAutomationPage.tsx` | Done | — |

---

## Dashboard Home — `/app/dashboard`

### New Widget: "Your AI Team"

**Location:** Below Project Summary + Activity Feed, above Quick Actions
**Layout:** Two-column grid alongside "Latest Insights" (stacked on mobile)

#### Data Source
- Uses `matchAgents()` from `/components/wizard/data/agentData.ts`
- Agents matched from wizard data stored in `useDashboardData` hook
- Each agent shows: name, icon, status (simulated), last output

#### Component: AgentTeamWidget
- Props: `agents: AssignedAgent[]`, `projectSystems: string[]`
- Cards: 3-5 primary agents with colored icon circles
- Footer: "View full team" link → `/app/agents/catalog`

### Updated Metrics Row
- Replace "Investment" card with "Active Agents" card
- Shows `${count} of ${total}` with "All active" subtitle

---

## Insights Page — `/app/insights`

### Enhancement: Agent Attribution Badges

Each insight card gains:
- **Agent badge:** Colored pill showing source agent name (e.g., "Growth Hacker")
- **Impact metric:** One-line impact statement below description
- **Relative timestamp:** "2 hrs ago", "1 day ago"

#### InsightItem Type Extension
```typescript
// Extended fields (optional, backward-compatible)
interface InsightItem {
  // existing...
  agentName?: string;     // e.g. "Growth Hacker"
  agentColor?: string;    // e.g. "#06B6D4"
  impactMetric?: string;  // e.g. "+35% new patient bookings"
  timestamp?: string;     // ISO string for relative display
}
```

---

## CRM Pipeline — `/app/crm/pipelines`

### Enhancement: Agent Health Score on Deal Cards

Each deal card gains:
- **Health score bar:** 0-100 progress bar (green/amber/red)
- **Risk/strength callout:** One-line agent insight
- **Agent badge:** Small text showing analyzing agent

#### Deal Type Extension
```typescript
// Extended fields (optional, backward-compatible)
interface Deal {
  // existing...
  healthScore?: number;      // 0-100
  healthLabel?: string;      // "HIGH" | "MEDIUM" | "LOW"
  healthInsight?: string;    // "No exec sponsor identified"
  scoringAgent?: string;     // "Pipeline Analyst"
}
```

---

## Financial Page — `/app/financial`

### New Widget: Agent Projection Card

**Location:** Below metric cards, above invoice list
**Content:** Finance Tracker agent projection narrative with month-by-month breakdown

---

## Workflows Page — `/app/workflows`

### Enhancement: Agent as Workflow Node

**Type change:** Add `'run_agent'` to `ActionType` union
**Builder change:** Agent action type shows agent selector + task input
**Display change:** Agent nodes use purple/indigo accent instead of green

---

## Mobile Behavior

- Metrics row: 2×2 grid (agent count fits in 4th slot)
- Agent Team widget: Full-width, vertically stacked cards
- Insight cards: Agent badge wraps below title
- Deal cards: Health bar spans full width below value
- Financial projection: Full-width card

---

## Best Practices Checklist

- [x] All new components follow BCG design system (Georgia headings, #00875A accent, flat white cards)
- [x] All types are backward-compatible (new fields are optional)
- [x] Mobile-first responsive design with sm/lg breakpoints
- [x] Motion/React animations (fade-in, stagger) for new widgets
- [x] Proper TypeScript types (no `any`)
- [x] Proper `key` props on all list renders
- [x] Accessible: ARIA labels, semantic HTML, keyboard nav
- [x] No direct Supabase calls — all through API layer
- [x] Agent data reuses agentData.ts (single source of truth)
