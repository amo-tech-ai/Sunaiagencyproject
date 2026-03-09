# Task 01 — Strategy Engine Full Page Layout

**ID:** lean-01-strategy-page-layout
**Phase:** LEAN (Phase 14a)
**Priority:** P0
**Effort:** L
**Status:** Not Started
**Dependencies:** None
**Target File:** `/components/dashboard/strategy/StrategyEnginePage.tsx`

---

## Objective

Create the main `StrategyEnginePage` component that serves as the shell for the entire Strategy Engine at route `/app/strategy`. This is the top-level layout component that arranges the header, metrics bar, and three content columns (canvas, roadmap, intelligence).

---

## Route Registration

```typescript
// routes.tsx — add inside /app children:
import StrategyEnginePage from './components/dashboard/strategy/StrategyEnginePage';
{ path: 'strategy', Component: StrategyEnginePage },
```

---

## Desktop Layout (>=1280px)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Strategy Header (title + "Run Analysis" btn + last-run timestamp)  │
├──────────────────────────────────────────────────────────────────────┤
│  Metrics Bar — 5 cards in a row (Health, Canvas%, Opps, Pending, ROI)│
├────────────────────┬──────────────────┬──────────────────────────────┤
│  Lean Canvas Panel │ Roadmap Panel    │ Intelligence Panel           │
│  (left, ~45%)      │ (center, ~25%)   │ (right, ~30%)               │
│  3x3 grid of       │ Phase cards      │ Pending Approvals           │
│  canvas blocks     │ with progress    │ Insights feed               │
│                    │ bars + tasks     │ Opportunities list          │
└────────────────────┴──────────────────┴──────────────────────────────┘
```

### Grid spec
- Container: `max-w-[1400px] mx-auto px-6`
- 3-column grid: `grid grid-cols-[1fr_0.6fr_0.75fr] gap-6`
- Each column scrolls independently (sticky header)

## Tablet Layout (768-1279px)

- 2-column: Canvas (left 60%) + Intelligence (right 40%)
- Roadmap moves below Canvas panel
- Metrics bar wraps to 3+2 cards

## Mobile Layout (<768px)

- Full-width stacked with tab navigation: `[Canvas] [Roadmap] [Intelligence]`
- Only active tab content visible
- Metrics bar collapses to 2x2 grid + 1

---

## Component Tree

```
StrategyEnginePage
├── StrategyHeader
│   ├── h1 "AI Strategy Engine" (Georgia serif)
│   ├── "Last analyzed: 2h ago" (text-sm text-[#9CA39B])
│   └── Button "Run Analysis" (bg-[#00875A] text-white)
├── StrategyMetricsBar
│   └── MetricCard x5
├── (Desktop) 3-column grid
│   ├── LeanCanvasPanel
│   ├── RoadmapExecutionPanel
│   └── IntelligencePanel
├── (Mobile) Tab bar + conditional render
```

---

## Page States

| State | Behavior |
|-------|----------|
| Loading | Skeleton cards for metrics + canvas blocks (pulse animation) |
| Empty (no canvas) | Full-page empty state — `StrategyEmptyState` component |
| Canvas exists | Full 3-column layout |
| Analysis running | Overlay sheet with agent progress |
| Error | Toast notification with retry action |

---

## Data Fetching

On mount:
1. Check if user has a canvas: `strategyApi.getCanvas()` — if 404/empty, show empty state
2. If canvas exists, parallel fetch: `strategyApi.getMetrics()`, `strategyApi.listRecommendations()`, `strategyApi.listInsights()`, `strategyApi.listOpportunities()`
3. Use `useAuth()` hook for `accessToken` with fresh-token pattern

---

## Implementation Notes

- Use `useState` for active mobile tab: `'canvas' | 'roadmap' | 'intelligence'`
- Use `useMediaQuery` or CSS breakpoint detection for responsive switching
- Header's "Run Analysis" button triggers `strategyApi.runAnalysis()` and shows progress overlay
- Last-run timestamp stored on canvas object (`updatedAt`) or separate analysis run log
