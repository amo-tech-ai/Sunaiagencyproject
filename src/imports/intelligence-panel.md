---
id: lean-06-intelligence-panel
title: Strategy Engine — Intelligence Panel
skill: frontend
phase: LEAN
priority: P0
status: Not Started
dependencies: [lean-01-strategy-page-layout]
estimated_effort: L
percent_complete: 0
area: dashboard
figma_screens: [Intelligence Panel, Pending Approvals, Insights Feed, Opportunities List]
spec_refs: [tasks/lean/02-wireframes.md §3-4, tasks/lean/05-content-data.md §3-5]
---

# Strategy Engine — Intelligence Panel

## Summary

| Field       | Value |
|-------------|-------|
| Position    | Right column of 3-column layout (~30% width) |
| Sections    | Pending Approvals → Insights → Opportunities (vertical stack) |
| Scrolls     | Independently from other columns |
| Data source | `strategyApi.listRecommendations()`, `listInsights()`, `listOpportunities()` |

---

## Panel Structure

```
┌── Intelligence ─────────────────────────┐
│                                          │
│  ⚠ Pending Approvals (3)                │
│  ─────────────────────                   │
│                                          │
│  ┌─ RecommendationCard ──────────────┐  │
│  │ 📝 Canvas Update                  │  │
│  │ Update Problem block              │  │
│  │ Confidence: 91% | Synthesizer     │  │
│  │              [✓ Approve] [✗ Reject]│  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌─ RecommendationCard ──────────────┐  │
│  │ 🆕 New System                     │  │
│  │ AI Recommendation Engine          │  │
│  │ Fit: 92% | System Recommender     │  │
│  │              [✓ Approve] [✗ Reject]│  │
│  └────────────────────────────────────┘  │
│                                          │
│  ── Insights ────────────────────────    │
│                                          │
│  ┌─ InsightCard ─────────────────────┐  │
│  │ 🟢 AI Readiness Improving         │  │
│  │ Score increased from 68 to 73     │  │
│  │ Priority: Low | metrics-interpreter│  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌─ InsightCard ─────────────────────┐  │
│  │ 🟡 Pipeline Velocity Slowing      │  │
│  │ Deal cycle time: 14d → 21d        │  │
│  │ Priority: Medium                   │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ── Opportunities ───────────────────    │
│                                          │
│  ┌─ OpportunityCard (compact) ───────┐  │
│  │ 🔵 Automate Lead Qualification    │  │
│  │ Impact: 85 | ROI: 300-500%        │  │
│  │ [▶ Evaluate]                      │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

---

## Section 1: Pending Approvals

### Section header
- "⚠ Pending Approvals (N)" — `text-sm font-semibold text-[#1A1A1A]`
- Count badge: `text-xs bg-[#D97706]/10 text-[#D97706] rounded-full px-2 py-0.5`
- If count = 0: "No pending approvals" in muted text, section collapsed

### RecommendationCard (see `07-recommendation-cards.md` for full spec)

Compact version in intelligence panel:
```
┌────────────────────────────────────────┐
│ 📝 Canvas Update                       │
│ ──────────────                          │
│ Update Problem block — add WhatsApp    │
│ support volume data                    │
│                                         │
│ Agent: Strategy Synthesizer            │
│ Confidence: 91%                        │
│                                         │
│ ┌──────────┐ ┌──────────┐             │
│ │✓ Approve │ │✗ Reject  │             │
│ └──────────┘ └──────────┘             │
└────────────────────────────────────────┘
```

- Recommendation type icons:
  - `canvas_update` → 📝
  - `roadmap_change` → 🗺️
  - `new_system` → 🆕
  - `task_creation` → ✅
  - `metric_alert` → 📊

---

## Section 2: Insights

### Section header
- "Insights" — `text-sm font-semibold text-[#1A1A1A] mt-6`
- Divider line above: `border-t border-[#E8E8E4] pt-4`

### InsightCard

```
┌────────────────────────────────────────┐
│ 🟢 AI Readiness Improving              │
│                                         │
│ Readiness score increased from 68 to   │
│ 73 after implementing AI chatbot.      │
│                                         │
│ Priority: Low | metrics-interpreter    │
└────────────────────────────────────────┘
```

- Background: `bg-white`
- Border: `border border-[#E8E8E4] rounded-md`
- Padding: `p-3`
- Margin: `mb-2`

### Priority indicator colors
| Priority | Color | Icon |
|----------|-------|------|
| High | `#DC2626` (red) | 🔴 |
| Medium | `#D97706` (amber) | 🟡 |
| Low | `#00875A` (green) | 🟢 |

### Insight type icons
| Type | Icon |
|------|------|
| opportunity | 💡 |
| risk | ⚠️ |
| recommendation | 📋 |
| trend | 📈 |

### Title
- `text-sm font-medium text-[#1A1A1A]`
- Priority indicator as colored dot before title

### Description
- `text-xs text-[#4A4A4A] mt-1`
- Max 3 lines, truncated with "Show more"

### Meta
- `text-xs text-[#9CA39B] mt-2`
- Agent name + priority label

---

## Section 3: Opportunities

### Section header
- "Opportunities" — `text-sm font-semibold text-[#1A1A1A] mt-6`
- Divider line above

### OpportunityCard (compact)

```
┌────────────────────────────────────────┐
│ 🔵 Automate Lead Qualification         │
│                                         │
│ Impact: 85  |  ROI: 300-500%           │
│ Complexity: Low | 2 weeks              │
│                                         │
│ Status: Detected                        │
│ [▶ Evaluate]                           │
└────────────────────────────────────────┘
```

- Background: `bg-white`
- Border: `border border-[#E8E8E4] rounded-md`
- Left accent: `border-l-4 border-l-[#3B82F6]` (detected = blue)

### Status colors
| Status | Color | Label |
|--------|-------|-------|
| detected | `#3B82F6` (blue) | "New" |
| evaluating | `#D97706` (amber) | "Evaluating" |
| approved | `#00875A` (green) | "Approved" |
| in_progress | `#7C3AED` (purple) | "In Progress" |
| completed | `#059669` (emerald) | "Done" |
| dismissed | `#9CA39B` (gray) | "Dismissed" |

### Impact score bar
- Small horizontal bar: `w-16 h-1.5 bg-gray-200 rounded`
- Fill: proportional to score (0-100), colored by threshold
  - ≥80: `#00875A`, 50-79: `#D97706`, <50: `#DC2626`

### Action button
- "▶ Evaluate": `text-xs text-[#3B82F6] font-medium cursor-pointer`
- Changes status to `evaluating`

---

## Panel Container Styling

- Background: `bg-[#F5F5F0]` or `bg-white`
- Border: `border border-[#E8E8E4] rounded-lg`
- Padding: `p-4`
- Overflow: `overflow-y-auto max-h-[calc(100vh-280px)]` (sticky scroll)

---

## Empty States

| Section | Empty message |
|---------|--------------|
| Pending Approvals | "No pending approvals — all caught up!" |
| Insights | "Run an analysis to generate insights" |
| Opportunities | "No opportunities detected yet" |

---

## Mobile

- Intelligence panel becomes a tab in the mobile tab bar
- Full-width when active
- Sections stack vertically (no change in structure)

---

## Figma Deliverables

1. **Full intelligence panel** — All 3 sections populated with sample data
2. **Recommendation card variants** — canvas_update, roadmap_change, new_system, task_creation
3. **Insight card variants** — High/Medium/Low priority
4. **Opportunity card variants** — All 6 status states
5. **Empty states** — Each section empty
6. **Mobile tab** — Intelligence as full-width tab content
