# Task 11 — Analysis Progress Sheet

**ID:** lean-11-analysis-progress-sheet
**Phase:** LEAN (Phase 14c)
**Priority:** P1
**Effort:** M
**Status:** Not Started
**Dependencies:** lean-01-strategy-page-layout
**Target File:** `/components/dashboard/strategy/StrategyAnalysisSheet.tsx`

---

## Objective

Create the modal overlay that appears when the user clicks "Run Analysis". Shows real-time progress of 5 AI agents running in 2 parallel phases, with status updates, timing, and a completion summary.

---

## Wireframe

```
┌─────────────────────────────────────────────┐
│  Running Strategy Analysis...        [X]    │
│  ─────────────────────────                  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ✅ Strategy Synthesizer    1.2s  42tk  │  │
│  │    Found 2 canvas update suggestions   │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ✅ Opportunity Detector    0.8s  38tk  │  │
│  │    Detected 3 automation opportunities │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ 🔄 Roadmap Planner        ...         │  │
│  │    Analyzing current roadmap...        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ⬚ System Recommender      waiting     │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ⬚ Metrics Interpreter     waiting     │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Progress: ████████████░░░░░ 60%            │
│                                              │
└─────────────────────────────────────────────┘
```

---

## Agent Execution Phases

| # | Agent Name | Phase | Depends On |
|---|-----------|-------|------------|
| 1 | Strategy Synthesizer | A (parallel) | — |
| 2 | Opportunity Detector | A (parallel) | — |
| 3 | Metrics Interpreter | A (parallel) | — |
| 4 | Roadmap Planner | B (parallel) | Phase A |
| 5 | System Recommender | B (parallel) | Phase A |

- Phase A agents start simultaneously
- Phase B agents start when all Phase A agents complete
- Duration: 5-15 seconds total

---

## Agent Row States

### Waiting (not started)
- Icon: Lucide `Circle` (outline), `text-[#9CA39B]`
- Name: `text-sm text-[#9CA39B]`
- Status: "waiting" — `text-xs text-[#9CA39B]`
- Background: `bg-[#F5F5F0]`

### Running (in progress)
- Icon: Lucide `Loader2` with `animate-spin`, `text-[#3B82F6]`
- Name: `text-sm font-medium text-[#1A1A1A]`
- Status: elapsed time or `...` — `text-xs text-[#3B82F6]`
- Description: dynamic status message — `text-xs text-[#4A4A4A] mt-0.5`
- Background: `bg-[#3B82F6]/5`, left border: `border-l-4 border-l-[#3B82F6]`

### Completed (success)
- Icon: Lucide `CheckCircle2`, `text-[#00875A]`
- Name: `text-sm font-medium text-[#1A1A1A]`
- Stats: "1.2s 42tk" — `text-xs text-[#9CA39B]`
- Description: brief result summary — `text-xs text-[#00875A] mt-0.5`
- Background: `bg-[#00875A]/5`, left border: `border-l-4 border-l-[#00875A]`

### Failed (error)
- Icon: Lucide `XCircle`, `text-[#DC2626]`
- Stats: "error" — `text-xs text-[#DC2626]`
- Description: error message — `text-xs text-[#DC2626]`
- Background: `bg-[#DC2626]/5`, left border: `border-l-4 border-l-[#DC2626]`

---

## Progress Bar

- Container: `w-full h-3 bg-[#E8E8E4] rounded-full mt-4`
- Fill: `bg-[#00875A] rounded-full transition-all duration-500`
- Each agent = 20% (5 total)
- Percentage label: `text-sm font-medium text-[#1A1A1A] mt-2 text-center`

---

## Sheet Container

- Overlay: `fixed inset-0 bg-black/50 z-50 flex items-center justify-center`
- Sheet: `bg-white rounded-xl shadow-xl max-w-[500px] w-full mx-4 p-6`
- Close button: `absolute top-4 right-4` — only appears when all agents complete
- Animation: fade in overlay + scale up sheet via Motion

### Header states
- Running: "Running Strategy Analysis..." with animated dots
- Complete: "Analysis Complete ✓" — `text-[#00875A]`
- Partial failure: "Analysis Complete (1 error)" — `text-[#D97706]`

---

## Completion State

```
Analysis Complete ✓

Results: 4 recommendations · 3 insights
         · 3 opportunities · Health: 78

[View Results]
```

- "View Results" button: `w-full py-2 bg-[#00875A] text-white rounded-lg`
- Closes sheet and scrolls to Intelligence Panel

---

## Frontend Implementation Notes

Since the backend `POST /strategy/analyze` returns all results in a single response (not streamed), the progress sheet simulates agent progress on the frontend:

1. On "Run Analysis" click → show sheet with all agents in "waiting" state
2. Start a timer that transitions agents through phases A→B based on estimated durations
3. When the actual API response arrives, snap all agents to their real final states
4. Show completion summary with actual results

This gives the user a sense of progress during the 5-15 second wait without requiring server-sent events.

---

## Mobile

- Full-screen sheet: `fixed inset-0 bg-white z-50`
- Close button in top-right
- Same content layout, scrollable
