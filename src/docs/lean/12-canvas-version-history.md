# Task 12 — Canvas Version History Sheet

**ID:** lean-12-canvas-version-history
**Phase:** LEAN (Phase 14d)
**Priority:** P1
**Effort:** S
**Status:** Not Started
**Dependencies:** lean-04-lean-canvas-grid
**Target File:** `/components/dashboard/strategy/CanvasVersionHistory.tsx`

---

## Objective

Create a right-side sheet showing chronological version history of the Lean Canvas. Triggered by "View History" link in the canvas panel footer. Supports viewing past snapshots and reverting to previous versions.

---

## Wireframe

```
┌─────────────────────────────────────────────┐
│  Version History                    [X]     │
│  ───────────────                            │
│                                              │
│  ● v3 (current)          Mar 8, 2:30 PM     │
│  │ Changed by: AI Strategy Synthesizer       │
│  │ Updated Problem + Channels blocks         │
│  │                          [View] [Revert]  │
│  │                                           │
│  ○ v2                    Mar 7, 4:15 PM      │
│  │ Changed by: User                          │
│  │ Added cost structure and metrics           │
│  │                          [View]           │
│  │                                           │
│  ○ v1 (initial)         Mar 7, 10:00 AM      │
│    Changed by: System (wizard seed)           │
│    Canvas created from wizard session         │
│                              [View]           │
│                                              │
└─────────────────────────────────────────────┘
```

---

## Sheet Container

- Side sheet from right: `fixed top-0 right-0 h-full w-[400px] bg-white shadow-xl z-50`
- Overlay: `fixed inset-0 bg-black/30 z-40`
- Animation: slide in from right via Motion, 200ms ease-out
- Close: Lucide `X` icon, `text-[#9CA39B] hover:text-[#1A1A1A]`

---

## Version Card

### Styling
- `bg-white border border-[#E8E8E4] rounded-lg p-4 mb-3`
- Current version: `border-l-4 border-l-[#00875A]`

### Version badge
- Current: `text-sm font-semibold text-[#1A1A1A]` + `bg-[#00875A]/10 text-[#00875A] text-xs rounded-full px-2 py-0.5 ml-2` "(current)"
- Past: `text-sm font-semibold text-[#1A1A1A]`

### Timestamp
- Right-aligned: `text-xs text-[#9CA39B]` — "Mar 8, 2:30 PM"

### Changed by
- `text-xs text-[#9CA39B] mt-1`
- Values: "User", agent name (e.g. "AI Strategy Synthesizer"), "System (wizard seed)"

### Change summary
- `text-sm text-[#4A4A4A] mt-2` — 1-2 lines

### Actions
- `flex gap-2 mt-3`
- View: `text-xs text-[#3B82F6] hover:underline cursor-pointer`
- Revert: `text-xs text-[#DC2626] hover:underline cursor-pointer` — only on non-current versions

---

## Timeline Connector

Between version cards, a vertical timeline:
- Line: `border-l-2 border-[#E8E8E4] ml-4`
- Current dot: `w-3 h-3 rounded-full bg-[#00875A]`
- Past dots: `w-3 h-3 rounded-full bg-[#E8E8E4]`

---

## View Version Overlay

When user clicks [View]:
- Full canvas snapshot in read-only overlay
- Same 3x3 grid layout as LeanCanvasPanel
- Header: "Version 2 — Mar 7, 4:15 PM" with close button
- All blocks read-only (no edit, no AI buttons)
- Subtle `bg-[#F5F5F0]` background to differentiate from live canvas

---

## Revert Confirmation Dialog

```
Revert to Version 2?

This will create a new version (v4) with the contents from v2.
Your current canvas won't be lost — it stays in the history.

[Revert]  [Cancel]
```

- Revert: `bg-[#DC2626] text-white rounded`
- Cancel: `border border-[#E8E8E4] text-[#4A4A4A] rounded`
- On confirm: calls `strategyApi.updateCanvasBlocks()` with snapshot data

---

## Data Source

```typescript
interface CanvasVersion {
  id: string;
  canvas_id: string;
  version: number;
  snapshot: Record<string, unknown>;
  change_summary: string;
  changed_by: string;
  created_at: string;
}
```

Fetched via `strategyApi.getCanvasVersions(canvasId, token)`

---

## Mobile

- Full-screen sheet: `fixed inset-0 bg-white z-50` instead of side panel
- Close button in top-right
- Same content, scrollable
