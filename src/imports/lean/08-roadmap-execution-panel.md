---
id: lean-08-roadmap-execution-panel
title: Strategy Engine — Roadmap Execution Panel
skill: frontend
phase: LEAN
priority: P1
status: Not Started
dependencies: [lean-01-strategy-page-layout]
estimated_effort: M
percent_complete: 0
area: dashboard
figma_screens: [Roadmap Execution Panel, Phase Card]
spec_refs: [tasks/lean/02-wireframes.md §1 center column]
---

# Strategy Engine — Roadmap Execution Panel

## Summary

| Field       | Value |
|-------------|-------|
| Position    | Center column of 3-column layout (~25% width) |
| Content     | Phase cards from wizard step 5 roadmap data |
| Mode        | Read-only in Phase 1 (no mutation) |
| Data source | Wizard step 5 `ai_results.roadmap.phases` |

---

## Panel Layout

```
┌── Execution Roadmap ──────────────────┐
│                                        │
│  Phase 1 — Foundation                  │
│  ████████████████░░░░ 75%              │
│  ├─ AI CRM setup            ✅         │
│  ├─ Lead capture forms       ✅         │
│  └─ Database architecture    🔄         │
│                                        │
│  Phase 2 — Automation                  │
│  ████████░░░░░░░░░░░░ 25%              │
│  ├─ AI Chatbot deployment    🔄         │
│  ├─ Marketing automation     ⬚         │
│  └─ Analytics setup          ⬚         │
│                                        │
│  Phase 3 — Optimization                │
│  ░░░░░░░░░░░░░░░░░░░░ 0%              │
│  ├─ Performance tuning       ⬚         │
│  ├─ A/B testing framework    ⬚         │
│  └─ Scaling infrastructure   ⬚         │
│                                        │
└────────────────────────────────────────┘
```

---

## Phase Card Component

```
┌────────────────────────────────────────┐
│  Phase 1 — Foundation          75%    │
│  ████████████████░░░░                  │
│                                        │
│  ├─ AI CRM setup            ✅         │
│  ├─ Lead capture forms       ✅         │
│  └─ Database architecture    🔄         │
│                                        │
│  3 weeks · $8,200 est.                │
└────────────────────────────────────────┘
```

### Card styling
- Background: `bg-white`
- Border: `border border-[#E8E8E4] rounded-lg`
- Padding: `p-4`
- Margin: `mb-3`

### Phase header
- Phase number + name: `text-sm font-semibold text-[#1A1A1A]`
  - "Phase 1 — Foundation"
- Percentage: `text-sm font-bold text-[#00875A]` (right-aligned)

### Progress bar
- Container: `w-full h-2 bg-[#E8E8E4] rounded-full mt-2`
- Fill: `bg-[#00875A] rounded-full` (width based on %)
- If 0%: empty bar with `bg-[#F5F5F0]`

### Task list
- `mt-3 space-y-1`
- Each task: `text-xs text-[#4A4A4A] flex justify-between items-center`
- Tree connector: `├─` / `└─` using left-padding and border trick
  - Or simpler: just indented bullet list

### Task status icons
| Status | Icon | Color |
|--------|------|-------|
| Completed | ✅ | `text-[#00875A]` |
| In Progress | 🔄 | `text-[#3B82F6]` |
| Not Started | ⬚ | `text-[#9CA39B]` |

### Phase meta (footer)
- `text-xs text-[#9CA39B] mt-2 pt-2 border-t border-[#E8E8E4]`
- Duration + estimated cost

---

## Panel Container

### Header
- "Execution Roadmap" — `text-lg font-serif text-[#1A1A1A] mb-4`

### Scroll
- `overflow-y-auto max-h-[calc(100vh-280px)]`
- Scrollbar: thin/auto-hide

---

## Phase Progress Calculation

```
completed_tasks / total_tasks * 100

Phase 1: 2/3 complete = 67% (rounded to nearest 5% for display)
Phase 2: 0.5/3 = 17% (in-progress counts as 0.5)
Phase 3: 0/3 = 0%
```

---

## Empty State

When no wizard roadmap data exists:
```
┌── Execution Roadmap ──────────────────┐
│                                        │
│  No roadmap data yet.                  │
│                                        │
│  Complete the wizard to generate       │
│  your implementation roadmap.          │
│                                        │
│  [Go to Wizard →]                      │
│                                        │
└────────────────────────────────────────┘
```

---

## Mobile

- Roadmap becomes second tab: `[Canvas] [Roadmap] [Intelligence]`
- Phase cards stack vertically, full width
- Same layout, no change needed

---

## Figma Deliverables

1. **Full roadmap panel** — 3 phases with varying progress
2. **Phase card variants** — 0%, partial, 100% complete
3. **Task status icons** — Completed, In Progress, Not Started
4. **Empty state** — No roadmap data
5. **Mobile tab** — Roadmap as full-width tab content
