# Task 03 — Strategy Metrics Bar

**ID:** lean-03-metrics-bar
**Phase:** LEAN (Phase 14a)
**Priority:** P0
**Effort:** M
**Status:** Not Started
**Dependencies:** lean-01-strategy-page-layout
**Target Files:** `/components/dashboard/strategy/StrategyMetricsBar.tsx`, `/components/dashboard/strategy/MetricCard.tsx`

---

## Objective

Create the 5-card metrics bar that sits below the strategy header and above the 3-column grid. Each card shows a key strategic KPI with trend indicator.

---

## Card Specifications

| # | Icon (Lucide) | Label | Value Example | Trend | Special |
|---|---------------|-------|---------------|-------|---------|
| 1 | `Heart` | Health Score | `78` (0-100) | `+5 vs last analysis` | Left border colored by score: green >=70, amber 40-69, red <40 |
| 2 | `BarChart3` | Canvas Complete | `70%` | `+10% vs last version` | Small progress bar below value |
| 3 | `Lightbulb` | Opps Detected | `5` | `+2 new this cycle` | — |
| 4 | `Clock` | Pending Approvals | `3` | `needs review` | Amber badge when count > 0 |
| 5 | `DollarSign` | Est. ROI | `$12.4K` | `/month if all approved` | — |

---

## Layout

### Desktop
- `grid grid-cols-5 gap-4`
- Each card: `bg-white border border-[#E8E8E4] rounded-lg p-4`

### Tablet
- `grid grid-cols-3` (top row) + `grid grid-cols-2` (bottom row)

### Mobile
- `grid grid-cols-2` with 5th card spanning full width

---

## MetricCard Component

```
┌─────────────────────┐
│  [Icon]  Label      │   ← icon 20px + label text-sm text-[#9CA39B]
│                     │
│  78                 │   ← value text-3xl font-bold text-[#1A1A1A]
│                     │
│  ▲ +5 vs last       │   ← trend text-xs, green if positive, red if negative
│  ═══════░░░         │   ← optional progress bar (Canvas card only)
└─────────────────────┘
```

### Trend indicators
- Positive: `text-[#00875A]` with `▲` prefix
- Negative: `text-[#DC2626]` with `▼` prefix
- Stable: `text-[#9CA39B]` with `—` prefix

### Health Score color coding
- 70-100: `border-l-4 border-l-[#00875A]`
- 40-69: `border-l-4 border-l-[#D97706]`
- 0-39: `border-l-4 border-l-[#DC2626]`

---

## Data Source

```typescript
interface StrategyMetrics {
  healthScore: number;
  canvasCompleteness: number;
  opportunitiesDetected: number;
  pendingApprovals: number;
  totalROIEstimate: string;
  insightCount: number;
  automationCoverage: number;
}
```

Fetched via `strategyApi.getMetrics(token)` → `GET /strategy/metrics`

---

## States

| State | Behavior |
|-------|----------|
| Loading | 5 skeleton cards (pulse animation, same dimensions) |
| No data | All values show `—` with muted text |
| Normal | Full data as specified |
| Warning | Pending Approvals > 0 shows amber dot badge |
