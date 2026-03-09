# Task 13 — Mobile & Tablet Responsive Layout

**ID:** lean-13-responsive-layout
**Phase:** LEAN (Phase 14d)
**Priority:** P1
**Effort:** M
**Status:** Not Started
**Dependencies:** lean-01-strategy-page-layout
**Target File:** Updates to `StrategyEnginePage.tsx` + all child components

---

## Objective

Ensure the Strategy Engine is fully responsive across mobile (<768px), tablet (768-1279px), and desktop (>=1280px) breakpoints. Mobile uses tab navigation with bottom sheet block editor. Tablet uses 2-column with roadmap below.

---

## Breakpoint Summary

| Element | Mobile (<768) | Tablet (768-1279) | Desktop (>=1280) |
|---------|---------------|-------------------|------------------|
| Layout | Single column + tabs | 2-column + roadmap below | 3-column |
| Metrics | 2x2 compact strip | 3+2 grid | 5-column row |
| Canvas | Stacked blocks | 3x3 (small) | 3x3 (full) |
| Roadmap | Tab content | Full-width section | Center column |
| Intelligence | Tab content | Right column | Right column |
| Block editor | Bottom sheet | Inline expansion | Inline expansion |
| Version history | Full screen | Side sheet | Side sheet |
| Analysis | Full screen | Modal | Modal |

---

## Mobile Layout (<768px)

### Tab Bar
- Sticky below header: `sticky top-[header-height] z-10 bg-white border-b border-[#E8E8E4]`
- `flex` — 3 equal tabs
- Each tab: `flex-1 py-3 text-center text-sm font-medium`
- Active: `text-[#00875A] border-b-2 border-[#00875A]`
- Inactive: `text-[#9CA39B]`

### Tab labels with badges
- "Canvas" — no badge
- "Roadmap" — no badge
- "Intel" — amber badge with pending count if > 0

### Canvas Tab
- All 9 blocks stack vertically, full-width
- Each block is collapsed card (same as desktop collapsed)
- Tap → opens block editor as bottom sheet

### Metrics (mobile)
- Collapsed summary strip above tabs:
  ```
  Health: 78 | Canvas: 70%
  Opps: 5   | Pending: 3
  ```
- `grid grid-cols-2 gap-2 text-xs p-3 bg-white border border-[#E8E8E4] rounded-lg mb-4`
- Tap to expand full metrics bar

### Block Editor (mobile bottom sheet)
- `fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl z-50`
- `max-h-[80vh]`
- Drag handle: `w-10 h-1 bg-[#E8E8E4] rounded-full mx-auto mt-2`
- Same content as inline editor, full-width

### Sheets (mobile)
- All sheets (Version History, Analysis Progress) become `fixed inset-0 bg-white z-50`
- Close button in top-right, content scrollable

---

## Tablet Layout (768-1279px)

### 2-Column Split
```
┌────────────────────────────────────────────────────┐
│  Strategy Header (full width)                       │
│  Metrics Bar (3+2 wrap)                             │
├────────────────────────┬───────────────────────────┤
│  Lean Canvas Panel     │ Intelligence Panel         │
│  (60%)                 │ (40%)                       │
│  3x3 grid (smaller)    │ Sections stacked           │
├────────────────────────┴───────────────────────────┤
│  Roadmap Execution Panel (full width below)         │
│  Phase cards in horizontal scroll or 3-column grid  │
└────────────────────────────────────────────────────┘
```

### Metrics bar (tablet)
- `grid grid-cols-3` (first 3) + `grid grid-cols-2` (last 2)

### Canvas grid (tablet)
- 3x3 maintained, smaller blocks
- Text truncated more aggressively

### Roadmap (tablet)
- Below the 2-column section, full-width
- Phase cards in horizontal scrollable row or 2-column grid

---

## Implementation Notes

- Use `useMediaQuery` hook or Tailwind responsive classes (`md:`, `lg:`, `xl:`)
- Mobile tab state: `useState<'canvas' | 'roadmap' | 'intelligence'>('canvas')`
- Bottom sheet: use Motion `animate` for slide-up
- Prefer Tailwind responsive classes over JS breakpoint detection where possible
- Test touch interactions (tap to expand, swipe to dismiss bottom sheet)
