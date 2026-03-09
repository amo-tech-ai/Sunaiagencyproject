---
id: lean-01-strategy-page-layout
title: Strategy Engine — Full Page Layout
skill: frontend
phase: LEAN
priority: P0
status: Not Started
dependencies: []
estimated_effort: L
percent_complete: 0
area: dashboard
figma_screens: [Strategy Engine Full, Strategy Engine Mobile]
spec_refs: [tasks/lean/02-wireframes.md §1, tasks/lean/02-wireframes.md §8]
---

# Strategy Engine — Full Page Layout

## Summary

| Field       | Value |
|-------------|-------|
| Route       | `/app/strategy` |
| Parent      | DashboardLayout (sidebar + header already exist) |
| Breakpoints | Desktop 3-column, Tablet 2-column, Mobile stacked tabs |
| Design      | Georgia serif headings, #1A1A1A dark, #F5F5F0 beige, #00875A green, #E8E8E4 borders |

---

## Desktop Layout (≥1280px)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Strategy Header (title + "Run Analysis" btn + last-run timestamp)  │
├──────────────────────────────────────────────────────────────────────┤
│  Metrics Bar — 5 cards in a row (Health, Canvas%, Opps, Pending, ROI)│
├────────────────────┬──────────────────┬──────────────────────────────┤
│  Lean Canvas Panel │ Roadmap Panel    │ Intelligence Panel           │
│  (left, ~45%)      │ (center, ~25%)   │ (right, ~30%)               │
│                    │                  │                              │
│  3×3 grid of       │ Phase cards      │ Pending Approvals           │
│  canvas blocks     │ with progress    │ Insights feed               │
│                    │ bars + tasks     │ Opportunities list          │
│                    │                  │                              │
└────────────────────┴──────────────────┴──────────────────────────────┘
```

### Grid specification
- Container: `max-w-[1400px] mx-auto px-6`
- 3-column grid: `grid grid-cols-[1fr_0.6fr_0.75fr] gap-6`
- Each column scrolls independently (sticky header)

## Tablet Layout (768px–1279px)

- 2-column: Canvas (left 60%) + Intelligence (right 40%)
- Roadmap moves below Canvas panel
- Metrics bar wraps to 3+2 cards

## Mobile Layout (<768px)

- Full-width stacked with tab navigation:
  ```
  [Canvas] [Roadmap] [Intelligence]
  ```
- Only active tab content visible
- Metrics bar collapses to 2×2 grid + 1

---

## Component Tree

```
StrategyEnginePage
├── StrategyHeader
│   ├── h1 "AI Strategy Engine" (Georgia serif)
│   ├── "Last analyzed: 2h ago" (text-sm text-gray-500)
│   └── Button "▶ Run Analysis" (bg-[#00875A] text-white)
├── StrategyMetricsBar
│   ├── MetricCard × 5
├── (Desktop) 3-column grid
│   ├── LeanCanvasPanel
│   ├── RoadmapExecutionPanel
│   └── IntelligencePanel
├── (Mobile) Tab bar + conditional render
```

---

## Design Tokens

| Token           | Value          | Usage |
|-----------------|----------------|-------|
| bg-page         | `#F5F5F0`      | Page background |
| bg-card         | `#FFFFFF`      | Card backgrounds |
| border          | `#E8E8E4`      | Card borders |
| text-heading    | `#1A1A1A`      | Headings (Georgia) |
| text-body       | `#4A4A4A`      | Body text |
| text-muted      | `#9CA39B`      | Timestamps, secondary |
| accent-green    | `#00875A`      | Primary buttons, positive indicators |
| accent-red      | `#DC2626`      | High priority, alerts |
| accent-amber    | `#D97706`      | Medium priority, warnings |
| accent-blue     | `#3B82F6`      | New items, links |
| accent-purple   | `#7C3AED`      | In-progress status |
| radius          | `8px`          | Card border-radius |
| shadow          | `0 1px 3px rgba(0,0,0,0.08)` | Card shadow |

---

## States

| State | Behavior |
|-------|----------|
| Loading | Skeleton cards for metrics + canvas blocks (pulse animation) |
| Empty (no canvas) | Full-page empty state — see `02-empty-state.md` |
| Canvas exists | Full 3-column layout |
| Analysis running | Overlay sheet with agent progress — see `09-analysis-progress-sheet.md` |
| Error | Toast notification with retry action |

---

## Figma Deliverables

1. **Desktop frame** (1440×900) — Full page with all 3 columns populated
2. **Tablet frame** (1024×768) — 2-column layout
3. **Mobile frame** (390×844) — Tab navigation with Canvas tab active
4. **Loading state** — Skeleton version of desktop frame
5. **Component specs** — Auto-layout, spacing, typography tokens
