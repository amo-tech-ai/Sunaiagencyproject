---
id: lean-02-empty-state
title: Strategy Engine — Empty State
skill: frontend
phase: LEAN
priority: P0
status: Not Started
dependencies: [lean-01-strategy-page-layout]
estimated_effort: S
percent_complete: 0
area: dashboard
figma_screens: [Strategy Empty State]
spec_refs: [tasks/lean/02-wireframes.md §9]
---

# Strategy Engine — Empty State

## Summary

| Field       | Value |
|-------------|-------|
| When shown  | No `lean_canvases` record exists for current user/session |
| Goal        | Guide user to create their first canvas (from wizard data or blank) |
| Tone        | Welcoming, clear, low friction |

---

## Wireframe

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                        🧠                                        │
│                                                                  │
│              AI Strategy Engine                                  │
│              ───────────────────                                 │
│                                                                  │
│    Your strategy canvas isn't set up yet.                       │
│    Create one from your wizard data or start fresh.             │
│                                                                  │
│    ┌──────────────────────────┐  ┌──────────────────────┐       │
│    │ 🔮 Create from Wizard   │  │ 📝 Start Fresh       │       │
│    │    Auto-populate from   │  │    Empty canvas       │       │
│    │    your analysis data   │  │    for manual entry   │       │
│    └──────────────────────────┘  └──────────────────────┘       │
│                                                                  │
│    What the Strategy Engine does:                               │
│    • Monitors your business signals continuously                │
│    • Suggests canvas updates based on real data                 │
│    • Detects automation opportunities                           │
│    • Recommends new AI systems as you grow                      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Design Specifications

### Container
- Centered vertically and horizontally within the page content area
- `min-h-[60vh] flex items-center justify-center`
- `max-w-[600px] mx-auto text-center`

### Icon
- Brain emoji or Lucide `Brain` icon at 48px
- Color: `#00875A`
- `mb-6`

### Heading
- "AI Strategy Engine"
- Font: Georgia serif, `text-3xl`, color `#1A1A1A`
- `mb-3`

### Subtitle
- "Your strategy canvas isn't set up yet. Create one from your wizard data or start fresh."
- `text-lg text-[#4A4A4A] mb-8`

### CTA Cards (2 side by side)
- `flex gap-4 justify-center mb-10`
- Each card: `p-6 border border-[#E8E8E4] rounded-lg hover:border-[#00875A] hover:shadow-md transition-all cursor-pointer bg-white`
- Width: `min-w-[240px]`
- Icon line: emoji + bold title
- Subtitle: `text-sm text-[#9CA39B] mt-1`

### "Create from Wizard" card
- Primary visual weight — slightly emphasized
- Border: `border-[#00875A]` by default (or left-accent stripe)
- Only shown when user has a completed wizard session
- If no wizard session: show only "Start Fresh" centered

### "Start Fresh" card
- Secondary visual weight
- Default border color `#E8E8E4`

### Feature List
- Left-aligned within the centered container
- Bullet points with `text-sm text-[#4A4A4A]`
- Green bullet markers `text-[#00875A]`
- 4 items describing the engine

---

## States

| Condition | Behavior |
|-----------|----------|
| Has wizard session | Show both CTA cards |
| No wizard session | Show only "Start Fresh" card, centered |
| Creating canvas (loading) | Button shows spinner, disabled |
| Canvas created | Navigate to full strategy page |

---

## Mobile
- Cards stack vertically
- Full-width cards
- Feature list remains bullet points

---

## Figma Deliverables

1. **Desktop empty state** (1440×900) — Both CTAs visible
2. **Desktop empty state (no wizard)** — Only "Start Fresh"
3. **Mobile empty state** (390×844) — Stacked cards
