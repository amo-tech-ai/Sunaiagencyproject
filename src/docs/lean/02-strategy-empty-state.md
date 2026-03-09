# Task 02 — Strategy Engine Empty State

**ID:** lean-02-empty-state
**Phase:** LEAN (Phase 14a)
**Priority:** P0
**Effort:** S
**Status:** Not Started
**Dependencies:** lean-01-strategy-page-layout
**Target File:** `/components/dashboard/strategy/StrategyEmptyState.tsx`

---

## Objective

Create the empty state shown when a user has no `lean_canvases` record. Guides the user to create their first canvas — either auto-populated from wizard data or starting fresh.

---

## Wireframe

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                     [Brain icon, 48px, #00875A]                  │
│                                                                  │
│              AI Strategy Engine                                  │
│                                                                  │
│    Your strategy canvas isn't set up yet.                       │
│    Create one from your wizard data or start fresh.             │
│                                                                  │
│    ┌──────────────────────────┐  ┌──────────────────────┐       │
│    │ Create from Wizard       │  │ Start Fresh           │       │
│    │ Auto-populate from       │  │ Empty canvas           │       │
│    │ your analysis data       │  │ for manual entry       │       │
│    └──────────────────────────┘  └──────────────────────┘       │
│                                                                  │
│    What the Strategy Engine does:                               │
│    * Monitors your business signals continuously                │
│    * Suggests canvas updates based on real data                 │
│    * Detects automation opportunities                           │
│    * Recommends new AI systems as you grow                      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Design Specs

### Container
- Centered: `min-h-[60vh] flex items-center justify-center`
- `max-w-[600px] mx-auto text-center`

### Icon
- Lucide `Brain` icon at 48px, color `#00875A`, `mb-6`

### Heading
- "AI Strategy Engine" — Georgia serif, `text-3xl`, color `#1A1A1A`, `mb-3`

### Subtitle
- `text-lg text-[#4A4A4A] mb-8`

### CTA Cards (2 side by side)
- `flex gap-4 justify-center mb-10`
- Each card: `p-6 border border-[#E8E8E4] rounded-lg hover:border-[#00875A] hover:shadow-md transition-all cursor-pointer bg-white min-w-[240px]`
- "Create from Wizard" card: emphasized with `border-[#00875A]` default — only shown if user has completed wizard session
- "Start Fresh" card: secondary, default border `#E8E8E4`
- If no wizard session: show only "Start Fresh" centered

### Feature List
- Left-aligned within centered container
- Green bullet markers `text-[#00875A]`
- `text-sm text-[#4A4A4A]`

---

## States

| Condition | Behavior |
|-----------|----------|
| Has wizard session | Show both CTA cards |
| No wizard session | Show only "Start Fresh" card, centered |
| Creating canvas (loading) | Card shows spinner, disabled |
| Canvas created | Navigate to full strategy page (re-fetch) |

---

## Mobile
- Cards stack vertically, full-width
- Feature list remains bullet points

---

## Actions

- **"Create from Wizard"** → calls `strategyApi.createCanvasFromWizard(wizardSessionId, token)` → on success, parent re-fetches canvas
- **"Start Fresh"** → calls `strategyApi.createCanvas(token)` → blank canvas with all 9 empty blocks
