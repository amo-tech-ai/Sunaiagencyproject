# Task 07 — Recommendation, Insight & Opportunity Cards

**ID:** lean-07-recommendation-cards
**Phase:** LEAN (Phase 14b)
**Priority:** P0
**Effort:** M
**Status:** Not Started
**Dependencies:** lean-06-intelligence-panel
**Target Files:** `/components/dashboard/strategy/RecommendationCard.tsx`, `/components/dashboard/strategy/InsightCard.tsx`, `/components/dashboard/strategy/OpportunityCard.tsx`

---

## Objective

Create three reusable card components used in the Intelligence Panel and potentially in notification overlays throughout the dashboard.

---

## 1. RecommendationCard

AI-generated suggestion requiring human approval.

```
┌────────────────────────────────────────────┐
│  [type badge] Canvas Update                │
│  ──────────────                            │
│  Update Problem block                      │
│                                            │
│  Add: "WhatsApp support volume grew 35%,   │
│  now primary support channel"              │
│                                            │
│  Rationale: CRM interaction data shows     │
│  60% of new support requests come via      │
│  WhatsApp, up from 25% last month.         │
│                                            │
│  Agent: Strategy Synthesizer               │
│  Confidence: 91%  ███████████░             │
│                                            │
│  [Approve]  [Reject]                       │
└────────────────────────────────────────────┘
```

### Type badges
| Type | Icon | Color |
|------|------|-------|
| `canvas_update` | Pencil / text | `bg-[#3B82F6]/10 text-[#3B82F6]` |
| `roadmap_change` | Map | `bg-[#7C3AED]/10 text-[#7C3AED]` |
| `new_system` | Plus | `bg-[#00875A]/10 text-[#00875A]` |
| `task_creation` | Check | `bg-[#D97706]/10 text-[#D97706]` |
| `metric_alert` | BarChart | `bg-[#DC2626]/10 text-[#DC2626]` |

### Styling
- Card: `bg-white border border-[#E8E8E4] rounded-lg p-4 mb-3 hover:shadow-sm transition-shadow`
- Type badge: `text-xs font-semibold uppercase tracking-wide` with colored bg
- Title: `text-sm font-medium text-[#1A1A1A] mt-2`
- Proposed change: `text-sm text-[#4A4A4A] mt-2 bg-[#F5F5F0] p-2 rounded border-l-2 border-l-[#3B82F6]`
- Rationale: `text-xs text-[#4A4A4A] mt-3 italic`
- Agent & confidence: `text-xs text-[#9CA39B] mt-3 flex justify-between`
- Confidence bar: `w-20 h-1.5 bg-gray-200 rounded` with colored fill

### Action buttons
- Approve: `px-4 py-2 bg-[#00875A] text-white text-sm rounded hover:bg-[#006B48]`
- Reject: `px-4 py-2 bg-white border border-[#E8E8E4] text-[#4A4A4A] text-sm rounded hover:bg-[#F5F5F0]`
- Button row: `flex gap-2 mt-4`

### Animations (Motion)
- Approve: card slides right + fades, green flash
- Reject: card fades out, brief strikethrough

---

## 2. InsightCard

Auto-approved observations from AI analysis.

```
┌────────────────────────────────────────────┐
│  [dot] Pipeline Velocity Slowing           │
│                                            │
│  Average deal cycle time increased from    │
│  14 to 21 days. Two deals in 'Proposal     │
│  Sent' stage for over 14 days without      │
│  interaction.                              │
│                                            │
│  Type: risk | Agent: metrics-interpreter   │
│  Impact: 65                                │
│                                            │
│  [Dismiss]                                 │
└────────────────────────────────────────────┘
```

### Priority-based styling
| Priority | Left border | Dot color |
|----------|-------------|-----------|
| High | `border-l-4 border-l-[#DC2626]` | `bg-[#DC2626]` |
| Medium | `border-l-4 border-l-[#D97706]` | `bg-[#D97706]` |
| Low | `border-l-4 border-l-[#00875A]` | `bg-[#00875A]` |

### Insight type badges
| Type | Label | Background |
|------|-------|------------|
| `opportunity` | "Opportunity" | `bg-[#00875A]/10 text-[#00875A]` |
| `risk` | "Risk" | `bg-[#DC2626]/10 text-[#DC2626]` |
| `recommendation` | "Recommendation" | `bg-[#3B82F6]/10 text-[#3B82F6]` |
| `trend` | "Trend" | `bg-[#7C3AED]/10 text-[#7C3AED]` |

### Layout
- Title: priority dot + `text-sm font-medium text-[#1A1A1A]`
- Description: `text-xs text-[#4A4A4A] mt-2 leading-relaxed` — max 3 lines, "Show more" if truncated
- Meta: `text-xs text-[#9CA39B] mt-3` — type badge + agent + impact
- Dismiss: `text-xs text-[#9CA39B] hover:text-[#DC2626] cursor-pointer mt-2`

---

## 3. OpportunityCard

Detected automation opportunities with impact/ROI/complexity.

```
┌────────────────────────────────────────────┐
│  [dot] Automate Lead Qualification         │
│  ───────────────────────────               │
│                                            │
│  Area: Sales                               │
│                                            │
│  Current: Manual review of wizard          │
│  submissions takes 2-3 hours per lead      │
│                                            │
│  Proposed: AI scores leads in real-time,   │
│  routes hot leads to senior team           │
│                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Impact: 85│ │ROI: 300% │ │Low       │  │
│  │ ████████ │ │          │ │Complexity│  │
│  └──────────┘ └──────────┘ └──────────┘  │
│                                            │
│  Est: 3 weeks | System: sales-automation   │
│                                            │
│  Status: Detected                          │
│  [Evaluate]  [Dismiss]                     │
└────────────────────────────────────────────┘
```

### Status colors (left accent border)
| Status | Color | Label |
|--------|-------|-------|
| `detected` | `#3B82F6` (blue) | "New" |
| `evaluating` | `#D97706` (amber) | "Evaluating" |
| `approved` | `#00875A` (green) | "Approved" |
| `in_progress` | `#7C3AED` (purple) | "In Progress" |
| `completed` | `#059669` (emerald) | "Done" |
| `dismissed` | `#9CA39B` (gray) | "Dismissed" |

### Score cards (3 inline)
- `flex gap-2 mt-4`
- Each: `bg-[#F5F5F0] rounded p-2 text-center flex-1`
- Label: `text-xs text-[#9CA39B]`
- Value: `text-sm font-bold text-[#1A1A1A]`
- Impact bar: `h-1 mt-1 rounded` — fill colored by threshold (>=80 green, 50-79 amber, <50 red)

### Area badge
- `text-xs bg-[#E8E8E4] text-[#4A4A4A] rounded px-2 py-0.5`
- Areas: sales, operations, support, marketing

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

### Animation on action (Motion)
- Approve/Accept: brief green highlight flash, card slides up out of list
- Reject/Dismiss: fade out, cards below shift up
- Use `motion.div` with `layout` prop for smooth list reflow
