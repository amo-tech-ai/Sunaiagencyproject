---
id: lean-07-recommendation-cards
title: Strategy Engine — Recommendation, Insight & Opportunity Cards
skill: frontend
phase: LEAN
priority: P0
status: Not Started
dependencies: [lean-06-intelligence-panel]
estimated_effort: M
percent_complete: 0
area: dashboard
figma_screens: [Recommendation Card Full, Insight Card, Opportunity Card Full]
spec_refs: [tasks/lean/02-wireframes.md §3-4, tasks/lean/05-content-data.md §3-5]
---

# Strategy Engine — Card Components

## Summary

Three card types used throughout the Intelligence Panel and potentially in notification overlays.

---

## 1. RecommendationCard (Full)

Shown in Pending Approvals section. Each represents an AI-generated suggestion requiring human approval.

```
┌────────────────────────────────────────────┐
│  📝 Canvas Update                          │
│  ──────────────                             │
│  Update Problem block                      │
│                                             │
│  Add: "WhatsApp support volume grew 35%,   │
│  now primary support channel"              │
│                                             │
│  Rationale: CRM interaction data shows     │
│  60% of new support requests come via      │
│  WhatsApp, up from 25% last month.         │
│                                             │
│  Agent: Strategy Synthesizer               │
│  Confidence: 91%  ███████████░  91%        │
│                                             │
│  ┌──────────┐  ┌──────────┐               │
│  │✓ Approve │  │✗ Reject  │               │
│  └──────────┘  └──────────┘               │
└────────────────────────────────────────────┘
```

### Type badge
| Type | Icon | Color |
|------|------|-------|
| `canvas_update` | 📝 | `bg-[#3B82F6]/10 text-[#3B82F6]` |
| `roadmap_change` | 🗺️ | `bg-[#7C3AED]/10 text-[#7C3AED]` |
| `new_system` | 🆕 | `bg-[#00875A]/10 text-[#00875A]` |
| `task_creation` | ✅ | `bg-[#D97706]/10 text-[#D97706]` |
| `metric_alert` | 📊 | `bg-[#DC2626]/10 text-[#DC2626]` |

### Card styling
- Background: `bg-white`
- Border: `border border-[#E8E8E4] rounded-lg`
- Padding: `p-4`
- Margin: `mb-3`

### Layout
- **Type badge**: `text-xs font-semibold uppercase tracking-wide` with colored background
- **Title**: `text-sm font-medium text-[#1A1A1A] mt-2`
- **Proposed change**: `text-sm text-[#4A4A4A] mt-2 bg-[#F5F5F0] p-2 rounded border-l-2 border-l-[#3B82F6]`
- **Rationale**: `text-xs text-[#4A4A4A] mt-3` — italicized or lighter weight
- **Agent & Confidence**: `text-xs text-[#9CA39B] mt-3 flex justify-between`
  - Confidence bar: `w-20 h-1.5 bg-gray-200 rounded` with colored fill

### Action buttons
- Approve: `px-4 py-2 bg-[#00875A] text-white text-sm rounded hover:bg-[#006B48] flex items-center gap-1`
- Reject: `px-4 py-2 bg-white border border-[#E8E8E4] text-[#4A4A4A] text-sm rounded hover:bg-[#F5F5F0]`
- Button row: `flex gap-2 mt-4`

### Approval animation
- On approve: card slides right + fades, green flash
- On reject: card fades out, brief strikethrough

---

## 2. InsightCard (Full)

Auto-approved observations from the Metrics Interpreter agent.

```
┌────────────────────────────────────────────┐
│  🟡 Pipeline Velocity Slowing              │
│                                             │
│  Average deal cycle time increased from    │
│  14 to 21 days. Two deals in 'Proposal     │
│  Sent' stage for over 14 days without      │
│  interaction.                               │
│                                             │
│  Type: risk | Agent: metrics-interpreter   │
│  Impact: 65                                │
│                                             │
│  ┌──────────┐                              │
│  │ Dismiss  │                              │
│  └──────────┘                              │
└────────────────────────────────────────────┘
```

### Priority-based styling
| Priority | Left border | Dot color |
|----------|-------------|-----------|
| High | `border-l-4 border-l-[#DC2626]` | 🔴 `bg-[#DC2626]` |
| Medium | `border-l-4 border-l-[#D97706]` | 🟡 `bg-[#D97706]` |
| Low | `border-l-4 border-l-[#00875A]` | 🟢 `bg-[#00875A]` |

### Layout
- **Title**: Priority dot + `text-sm font-medium text-[#1A1A1A]`
- **Description**: `text-xs text-[#4A4A4A] mt-2 leading-relaxed`
- **Meta row**: `text-xs text-[#9CA39B] mt-3` — type badge + agent name + impact score
- **Dismiss button**: `text-xs text-[#9CA39B] hover:text-[#DC2626] cursor-pointer mt-2`

### Insight type badge
| Type | Label | Background |
|------|-------|------------|
| opportunity | "Opportunity" | `bg-[#00875A]/10 text-[#00875A]` |
| risk | "Risk" | `bg-[#DC2626]/10 text-[#DC2626]` |
| recommendation | "Recommendation" | `bg-[#3B82F6]/10 text-[#3B82F6]` |
| trend | "Trend" | `bg-[#7C3AED]/10 text-[#7C3AED]` |

---

## 3. OpportunityCard (Full)

Detected automation opportunities with impact/ROI/complexity scores.

```
┌────────────────────────────────────────────┐
│  🔵 Automate Lead Qualification            │
│  ───────────────────────────               │
│                                             │
│  Area: Sales                               │
│                                             │
│  Current: Manual review of wizard          │
│  submissions takes 2-3 hours per lead      │
│                                             │
│  Proposed: AI scores leads in real-time,   │
│  routes hot leads to senior team           │
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │Impact: 85│ │ROI: 300% │ │Low       │   │
│  │ ████████ │ │          │ │Complexity│   │
│  └──────────┘ └──────────┘ └──────────┘   │
│                                             │
│  Est: 3 weeks | System: sales-automation   │
│                                             │
│  Status: Detected                          │
│  ┌────────────┐  ┌──────────┐             │
│  │ ▶ Evaluate │  │ Dismiss  │             │
│  └────────────┘  └──────────┘             │
└────────────────────────────────────────────┘
```

### Card styling
- Background: `bg-white`
- Border: `border border-[#E8E8E4] rounded-lg`
- Left accent: `border-l-4` colored by status (see status colors in `06-intelligence-panel.md`)
- Padding: `p-4`

### Layout
- **Title**: `text-sm font-semibold text-[#1A1A1A]` with status color dot
- **Process area badge**: `text-xs bg-[#E8E8E4] text-[#4A4A4A] rounded px-2 py-0.5`
  - Areas: sales, operations, support, marketing
- **Current state**: `text-xs text-[#4A4A4A] mt-3` — "Current:" label in bold
- **Proposed state**: `text-xs text-[#1A1A1A] mt-2 bg-[#00875A]/5 p-2 rounded` — "Proposed:" label in bold

### Score cards (3 inline)
- `flex gap-2 mt-4`
- Each: `bg-[#F5F5F0] rounded p-2 text-center flex-1`
  - Label: `text-xs text-[#9CA39B]`
  - Value: `text-sm font-bold text-[#1A1A1A]`
  - Impact bar: `h-1 mt-1 rounded` with fill colored by score

### Meta
- `text-xs text-[#9CA39B] mt-3`
- "Est. N weeks | System: name"

### Status badge
- `text-xs font-medium rounded-full px-2 py-0.5` with status-specific colors

### Action buttons
- Evaluate: `px-3 py-1.5 bg-[#3B82F6] text-white text-xs rounded`
- Dismiss: `px-3 py-1.5 bg-white border border-[#E8E8E4] text-[#9CA39B] text-xs rounded`

---

## Shared Card Patterns

### Hover
- All cards: `hover:shadow-sm transition-shadow`

### Loading skeleton
- Same card dimensions with pulse animation
- 3 lines of varying width for text areas

### Animation on action
- Approve/Accept: brief green highlight flash, then card slides up
- Reject/Dismiss: fade out, then cards below shift up

---

## Figma Deliverables

1. **RecommendationCard** — All 5 type variants (canvas_update, roadmap_change, new_system, task_creation, metric_alert)
2. **InsightCard** — All 3 priority variants (high, medium, low) × 4 types
3. **OpportunityCard** — All 6 status variants
4. **Skeleton versions** — Loading state for each card type
5. **Action states** — Hover, approve animation, reject animation
