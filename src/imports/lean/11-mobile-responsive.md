---
id: lean-11-mobile-responsive
title: Strategy Engine — Mobile & Tablet Responsive Layout
skill: frontend
phase: LEAN
priority: P1
status: Not Started
dependencies: [lean-01-strategy-page-layout]
estimated_effort: M
percent_complete: 0
area: dashboard
figma_screens: [Strategy Mobile Canvas, Strategy Mobile Roadmap, Strategy Mobile Intelligence, Strategy Tablet]
spec_refs: [tasks/lean/02-wireframes.md §8]
---

# Strategy Engine — Mobile & Tablet Responsive Layout

## Summary

| Field       | Value |
|-------------|-------|
| Mobile      | <768px — Tab navigation, stacked single-column |
| Tablet      | 768px–1279px — 2-column layout |
| Desktop     | ≥1280px — 3-column layout (primary spec) |

---

## Mobile Layout (<768px)

### Tab Bar

```
┌──────────────────────────┐
│ ☰  Strategy Engine   🔔  │
├──────────────────────────┤
│                           │
│ [▶ Run Analysis]          │
│                           │
│ ┌───────┬────────┬──────┐│
│ │Canvas │Roadmap │Intel ││
│ └───────┴────────┴──────┘│
│  ▲ active tab             │
│                           │
│ (active tab content)      │
│                           │
└──────────────────────────┘
```

### Tab bar styling
- Sticky below header: `sticky top-[header-height] z-10 bg-white border-b border-[#E8E8E4]`
- Tab row: `flex`
- Each tab: `flex-1 py-3 text-center text-sm font-medium`
- Active tab: `text-[#00875A] border-b-2 border-[#00875A]`
- Inactive tab: `text-[#9CA39B]`

### Tab labels with badges
- "Canvas" — no badge
- "Roadmap" — no badge
- "Intel" — badge with pending count: `bg-[#D97706] text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center ml-1`

---

### Canvas Tab (Mobile)

```
┌──────────────────────────┐
│ ┌───────────────────────┐│
│ │  Problem              ││
│ │  • Slow response  🤖  ││
│ │  • Data silos         ││
│ └───────────────────────┘│
│                           │
│ ┌───────────────────────┐│
│ │  Customer Segments    ││
│ │  • SaaS companies     ││
│ │  • Retail brands  🤖  ││
│ └───────────────────────┘│
│                           │
│ ┌───────────────────────┐│
│ │  Value Proposition    ││
│ │  • AI-first ops  🤖   ││
│ └───────────────────────┘│
│                           │
│ ... (scrollable)          │
│                           │
└──────────────────────────┘
```

- All 9 blocks stack vertically, full width
- Each block is a collapsed card (same as desktop collapsed state)
- Tap to expand → opens block editor as bottom sheet

### Metrics (mobile)
- Collapsed to a summary strip above tabs:
  ```
  ┌── Metrics ────────────┐
  │ Health: 78 | Canvas:70%│
  │ Opps: 5  | Pending: 3 │
  └───────────────────────┘
  ```
- `grid grid-cols-2 gap-2 text-xs p-3 bg-white border border-[#E8E8E4] rounded-lg mb-4`
- Tap to expand full metrics bar

---

### Roadmap Tab (Mobile)

- Full-width phase cards, same as desktop
- Vertically scrollable

### Intelligence Tab (Mobile)

- Full-width cards for each section
- Pending Approvals → Insights → Opportunities (vertical scroll)
- Same card designs, just full width

---

## Tablet Layout (768px–1279px)

### 2-Column Split

```
┌────────────────────────────────────────────────────┐
│  Strategy Header (full width)                       │
│  Metrics Bar (3+2 wrap)                             │
├────────────────────────┬───────────────────────────┤
│  Lean Canvas Panel     │ Intelligence Panel         │
│  (60%)                 │ (40%)                       │
│                        │                             │
│  3×3 grid (smaller)    │ Pending Approvals          │
│                        │ Insights                    │
│                        │ Opportunities               │
├────────────────────────┴───────────────────────────┤
│  Roadmap Execution Panel (full width below)         │
│  Phase cards in horizontal scroll or 3-column grid  │
└────────────────────────────────────────────────────┘
```

### Metrics bar (tablet)
- `grid grid-cols-3` (first row) + `grid grid-cols-2` (second row)
- Same card design, slightly smaller padding

### Canvas grid (tablet)
- 3×3 grid maintained but smaller blocks
- Block text truncated more aggressively

### Roadmap (tablet)
- Below the 2-column section
- Phase cards in a horizontal scrollable row or 2-column grid

---

## Block Editor (Mobile)

Opens as a bottom sheet:

```
┌──────────────────────────┐
│  ─── (drag handle)       │
│                           │
│  Problem          [🤖 AI]│
│  ─────────                │
│                           │
│  [Item cards...]          │
│  [AI suggestions...]      │
│  [+ Add new item]         │
│                           │
└──────────────────────────┘
```

- Bottom sheet: `fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl z-50`
- Height: `max-h-[80vh]`
- Drag handle: `w-10 h-1 bg-[#E8E8E4] rounded-full mx-auto mt-2`
- Scrollable content area

---

## Sheets (Mobile)

All sheets (Version History, Analysis Progress) become full-screen:
- `fixed inset-0 bg-white z-50`
- Close button in top-right
- Content scrollable

---

## Responsive Breakpoint Summary

| Element | Mobile (<768) | Tablet (768-1279) | Desktop (≥1280) |
|---------|---------------|-------------------|-----------------|
| Layout | Single column + tabs | 2-column + roadmap below | 3-column |
| Metrics | 2×2 compact strip | 3+2 grid | 5-column row |
| Canvas | Stacked blocks | 3×3 (small) | 3×3 (full) |
| Roadmap | Tab content | Full-width section | Center column |
| Intelligence | Tab content | Right column | Right column |
| Block editor | Bottom sheet | Inline expansion | Inline expansion |
| Version history | Full screen | Side sheet | Side sheet |
| Analysis | Full screen | Modal | Modal |

---

## Figma Deliverables

1. **Mobile Canvas tab** (390×844) — Stacked blocks with metrics strip
2. **Mobile Roadmap tab** (390×844) — Phase cards full width
3. **Mobile Intelligence tab** (390×844) — Cards full width with pending badge
4. **Mobile block editor** — Bottom sheet
5. **Tablet 2-column** (1024×768) — Canvas + Intelligence with Roadmap below
6. **Tab bar component** — Active/inactive states with badge
