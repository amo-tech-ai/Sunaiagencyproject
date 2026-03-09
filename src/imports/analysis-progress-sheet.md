---
id: lean-09-analysis-progress-sheet
title: Strategy Engine — Analysis Progress Sheet
skill: frontend
phase: LEAN
priority: P1
status: Not Started
dependencies: [lean-01-strategy-page-layout]
estimated_effort: M
percent_complete: 0
area: dashboard
figma_screens: [Analysis Progress Sheet]
spec_refs: [tasks/lean/02-wireframes.md §7]
---

# Strategy Engine — Analysis Progress Sheet

## Summary

| Field       | Value |
|-------------|-------|
| Trigger     | User clicks "▶ Run Analysis" button |
| Display     | Sheet/modal overlay on top of strategy page |
| Duration    | 5-15 seconds (5 AI agents running in parallel phases) |
| Dismissable | Close button appears when complete |

---

## Wireframe

```
┌─────────────────────────────────────────────┐
│  Running Strategy Analysis...        [✕]    │
│  ─────────────────────────                  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ✅ Strategy Synthesizer    1.2s  42tk  │  │
│  │    Found 2 canvas update suggestions  │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ✅ Opportunity Detector    0.8s  38tk  │  │
│  │    Detected 3 automation opportunities│  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ 🔄 Roadmap Planner        ...         │  │
│  │    Analyzing current roadmap...       │  │
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

## Agent Row States

### Waiting (not started)
```
┌────────────────────────────────────────┐
│ ⬚ System Recommender      waiting     │
└────────────────────────────────────────┘
```
- Icon: `⬚` — empty square, `text-[#9CA39B]`
- Name: `text-sm text-[#9CA39B]`
- Status: "waiting" — `text-xs text-[#9CA39B]`
- Background: `bg-[#F5F5F0]`

### Running (in progress)
```
┌────────────────────────────────────────┐
│ 🔄 Roadmap Planner        ...         │
│    Analyzing current roadmap...       │
└────────────────────────────────────────┘
```
- Icon: `🔄` — spinning loader or Lucide `Loader2` with `animate-spin`
- Name: `text-sm font-medium text-[#1A1A1A]`
- Status: `...` or elapsed time — `text-xs text-[#3B82F6]`
- Description: `text-xs text-[#4A4A4A] mt-0.5` — dynamic status message
- Background: `bg-[#3B82F6]/5`
- Left border: `border-l-4 border-l-[#3B82F6]`

### Completed (success)
```
┌────────────────────────────────────────┐
│ ✅ Strategy Synthesizer    1.2s  42tk  │
│    Found 2 canvas update suggestions  │
└────────────────────────────────────────┘
```
- Icon: `✅` — checkmark or Lucide `CheckCircle2` in green
- Name: `text-sm font-medium text-[#1A1A1A]`
- Stats: `text-xs text-[#9CA39B]` — "1.2s 42tk" (duration + token count)
- Description: `text-xs text-[#00875A] mt-0.5` — brief result summary
- Background: `bg-[#00875A]/5`
- Left border: `border-l-4 border-l-[#00875A]`

### Failed (error)
```
┌────────────────────────────────────────┐
│ ❌ Strategy Synthesizer    error       │
│    Request timed out                  │
└────────────────────────────────────────┘
```
- Icon: `❌` — Lucide `XCircle` in red
- Stats: "error" — `text-xs text-[#DC2626]`
- Description: error message — `text-xs text-[#DC2626]`
- Background: `bg-[#DC2626]/5`
- Left border: `border-l-4 border-l-[#DC2626]`

---

## Agent List (5 agents in order)

| # | Agent Name | Phase | Depends On |
|---|-----------|-------|------------|
| 1 | Strategy Synthesizer | A (parallel) | — |
| 2 | Opportunity Detector | A (parallel) | — |
| 3 | Metrics Interpreter | A (parallel) | — |
| 4 | Roadmap Planner | B (parallel) | Phase A |
| 5 | System Recommender | B (parallel) | Phase A |

- Phase A agents start simultaneously
- Phase B agents start when Phase A completes
- Visual: Phase A agents animate together, Phase B waits

---

## Progress Bar

- Position: bottom of agent list
- Container: `w-full h-3 bg-[#E8E8E4] rounded-full mt-4`
- Fill: `bg-[#00875A] rounded-full transition-all duration-500`
- Percentage: `text-sm font-medium text-[#1A1A1A] mt-2 text-center`

### Progress calculation
- Each agent = 20% (5 agents total)
- Partial progress for running agents (estimate based on average duration)

---

## Sheet Container

- Overlay: `fixed inset-0 bg-black/50 z-50 flex items-center justify-center`
- Sheet: `bg-white rounded-xl shadow-xl max-w-[500px] w-full mx-4 p-6`
- Close button: `absolute top-4 right-4` — only appears when all agents complete

### Header
- Running: "Running Strategy Analysis..." with animated dots
- Complete: "Analysis Complete ✓" — `text-[#00875A]`
- Partial failure: "Analysis Complete (1 error)" — `text-[#D97706]`

---

## Completion State

When all 5 agents finish:
```
┌─────────────────────────────────────────────┐
│  Analysis Complete ✓                  [✕]   │
│  ─────────────────                          │
│                                              │
│  ✅ Strategy Synthesizer ... (collapsed)     │
│  ✅ Opportunity Detector ... (collapsed)     │
│  ✅ Metrics Interpreter ... (collapsed)      │
│  ✅ Roadmap Planner ... (collapsed)          │
│  ✅ System Recommender ... (collapsed)       │
│                                              │
│  Results: 4 recommendations · 3 insights    │
│           · 3 opportunities · Health: 78     │
│                                              │
│  ┌──────────────────────────────────┐       │
│  │     View Results                 │       │
│  └──────────────────────────────────┘       │
│                                              │
└─────────────────────────────────────────────┘
```

- "View Results" button: `w-full py-2 bg-[#00875A] text-white rounded-lg`
- Closes sheet and scrolls to Intelligence Panel

---

## Figma Deliverables

1. **Running state** — 2 complete, 1 running, 2 waiting
2. **All complete** — Summary with "View Results" CTA
3. **Error state** — 1 failed agent
4. **Mobile sheet** — Full-width bottom sheet variant
