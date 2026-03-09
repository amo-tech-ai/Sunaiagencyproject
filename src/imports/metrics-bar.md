---
id: lean-03-metrics-bar
title: Strategy Engine — Metrics Bar
skill: frontend
phase: LEAN
priority: P0
status: Not Started
dependencies: [lean-01-strategy-page-layout]
estimated_effort: M
percent_complete: 0
area: dashboard
figma_screens: [Strategy Metrics Bar, Metrics Bar Mobile]
spec_refs: [tasks/lean/02-wireframes.md §5, tasks/lean/05-content-data.md §4]
---

# Strategy Engine — Metrics Bar

## Summary

| Field       | Value |
|-------------|-------|
| Position    | Below header, above 3-column grid |
| Cards       | 5 metric cards in a horizontal row |
| Data source | `strategyApi.getMetrics()` → `StrategyMetrics` |

---

## Card Specifications

### Card 1: Health Score
| Property  | Value |
|-----------|-------|
| Icon      | Heart / `❤️` |
| Label     | "Health Score" |
| Value     | `78` (0-100 integer) |
| Trend     | `▲ +5 vs last analysis` |
| Color     | Green if ≥70, Amber if 40-69, Red if <40 |

### Card 2: Canvas Completeness
| Property  | Value |
|-----------|-------|
| Icon      | BarChart / `📊` |
| Label     | "Canvas Complete" |
| Value     | `70%` |
| Trend     | `▲ +10% vs last version` |
| Visual    | Small progress bar below value |

### Card 3: Opportunities Detected
| Property  | Value |
|-----------|-------|
| Icon      | Lightbulb / `💡` |
| Label     | "Opps Detected" |
| Value     | `5` (count) |
| Trend     | `▲ +2 new this cycle` |

### Card 4: Pending Approvals
| Property  | Value |
|-----------|-------|
| Icon      | Clock / `⏳` |
| Label     | "Pending Approvals" |
| Value     | `3` with warning badge if >0 |
| Trend     | `needs review` |
| Color     | Amber badge when count > 0 |

### Card 5: Estimated ROI
| Property  | Value |
|-----------|-------|
| Icon      | DollarSign / `💰` |
| Label     | "Est. ROI" |
| Value     | `$12.4K` |
| Trend     | `/month if all approved` |

---

## Layout

### Desktop
```
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│  ❤️ Health  │ │  📊 Canvas  │ │  💡 Opps   │ │  ⏳ Pending │ │  💰 Est ROI│
│   Score    │ │  Complete  │ │  Detected  │ │  Approvals │ │            │
│    78      │ │    70%     │ │     5      │ │   3 ⚠      │ │  $12.4K    │
│   ▲ +5     │ │   ▲ +10%  │ │   ▲ +2     │ │   needs    │ │  /month    │
│            │ │   ═══░░   │ │            │ │   review   │ │            │
└────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘
```

- `grid grid-cols-5 gap-4`
- Each card: `bg-white border border-[#E8E8E4] rounded-lg p-4`

### Tablet
- `grid grid-cols-3` (top row) + `grid grid-cols-2` (bottom row)

### Mobile
- `grid grid-cols-2` with 5th card spanning full width
- Or 2×2 + 1

---

## Card Component Design

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
- 70-100: card border-left `4px solid #00875A`
- 40-69: card border-left `4px solid #D97706`
- 0-39: card border-left `4px solid #DC2626`

---

## Data Shape

```typescript
interface StrategyMetrics {
  healthScore: number;           // 0-100
  canvasCompleteness: number;    // 0-100
  opportunitiesDetected: number; // count
  pendingApprovals: number;      // count
  totalROIEstimate: string;      // "$12.4K/month"
  insightCount: number;          // for badge
  automationCoverage: number;    // 0-100
}
```

---

## States

| State    | Behavior |
|----------|----------|
| Loading  | 5 skeleton cards (pulse animation, same dimensions) |
| No data  | All values show `—` with muted text |
| Normal   | Full data as specified above |
| Warning  | Pending Approvals > 0 shows amber dot badge |

---

## Figma Deliverables

1. **Desktop metrics bar** — 5 cards at full width
2. **Individual card variants** — Normal, Warning, Skeleton
3. **Mobile metrics bar** — 2×2+1 grid
4. **Color-coded health states** — Green/Amber/Red left borders
