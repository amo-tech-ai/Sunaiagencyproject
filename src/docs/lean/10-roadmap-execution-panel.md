# Task 10 — Roadmap Execution Panel

**ID:** lean-10-roadmap-execution-panel
**Phase:** LEAN (Phase 14d)
**Priority:** P1
**Effort:** M
**Status:** Not Started
**Dependencies:** lean-01-strategy-page-layout
**Target File:** `/components/dashboard/strategy/RoadmapExecutionPanel.tsx`

---

## Objective

Create the center column panel showing the implementation roadmap as phase cards with progress bars and task status indicators. Data sourced from wizard step 5 `ai_results.roadmap.phases`, stored in `canvas.metadata.phases`. Read-only in Phase 1 (no mutation).

---

## Panel Layout

```
┌── Execution Roadmap ──────────────────┐
│                                        │
│  Phase 1 — Foundation                  │
│  ████████████████░░░░ 75%              │
│  ├─ AI CRM setup            done       │
│  ├─ Lead capture forms       done      │
│  └─ Database architecture    in prog   │
│                                        │
│  Phase 2 — Automation                  │
│  ████████░░░░░░░░░░░░ 25%              │
│  ├─ AI Chatbot deployment    in prog   │
│  ├─ Marketing automation     pending   │
│  └─ Analytics setup          pending   │
│                                        │
│  Phase 3 — Optimization                │
│  ░░░░░░░░░░░░░░░░░░░░ 0%              │
│  ├─ Performance tuning       pending   │
│  ├─ A/B testing framework    pending   │
│  └─ Scaling infrastructure   pending   │
│                                        │
└────────────────────────────────────────┘
```

---

## Phase Card Component

### Card styling
- `bg-white border border-[#E8E8E4] rounded-lg p-4 mb-3`

### Phase header
- Phase number + name: `text-sm font-semibold text-[#1A1A1A]`
- Percentage: `text-sm font-bold text-[#00875A]` (right-aligned)

### Progress bar
- Container: `w-full h-2 bg-[#E8E8E4] rounded-full mt-2`
- Fill: `bg-[#00875A] rounded-full` (width %)
- If 0%: empty bar `bg-[#F5F5F0]`

### Task list
- `mt-3 space-y-1`
- Each task: `text-xs text-[#4A4A4A] flex justify-between items-center`
- Tree connectors: `├─` / `└─` via left-padding

### Task status icons
| Status | Icon | Color |
|--------|------|-------|
| Completed | CheckCircle2 | `text-[#00875A]` |
| In Progress | Loader2 | `text-[#3B82F6]` |
| Not Started | Circle (outline) | `text-[#9CA39B]` |

### Phase meta (footer)
- `text-xs text-[#9CA39B] mt-2 pt-2 border-t border-[#E8E8E4]`
- Duration + estimated cost: "3 weeks · $8,200 est."

---

## Progress Calculation

```
completed_tasks / total_tasks * 100
In-progress tasks count as 0.5 completion.
Round to nearest 5% for display.
```

---

## Panel Container

### Header
- "Execution Roadmap" — `text-lg font-serif text-[#1A1A1A] mb-4`

### Scroll
- `overflow-y-auto max-h-[calc(100vh-280px)]`

---

## Empty State

When no wizard roadmap data exists:
```
No roadmap data yet.
Complete the wizard to generate your implementation roadmap.
[Go to Wizard →]
```

- Muted text, centered
- Link to `/wizard` in green

---

## Data Source

- `canvas.metadata.phases` — array of phase objects from wizard step 5
- Each phase: `{ name, tasks: [{ name, status }], duration, cost }`
- Read-only — no mutation endpoints needed for Phase 1

---

## Mobile

- Roadmap becomes second tab: `[Canvas] [Roadmap] [Intelligence]`
- Phase cards stack vertically, full width, same layout
