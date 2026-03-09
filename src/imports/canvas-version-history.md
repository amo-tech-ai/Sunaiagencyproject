---
id: lean-10-version-history-sheet
title: Strategy Engine — Canvas Version History Sheet
skill: frontend
phase: LEAN
priority: P1
status: Not Started
dependencies: [lean-04-lean-canvas-grid]
estimated_effort: S
percent_complete: 0
area: dashboard
figma_screens: [Version History Sheet]
spec_refs: [tasks/lean/02-wireframes.md §6]
---

# Strategy Engine — Canvas Version History Sheet

## Summary

| Field       | Value |
|-------------|-------|
| Trigger     | User clicks "View History" link in Lean Canvas panel footer |
| Display     | Side sheet sliding in from right (or modal on mobile) |
| Content     | Chronological list of canvas versions with change summaries |
| Data source | `strategyApi.getCanvasVersions(canvasId)` |

---

## Wireframe

```
┌─────────────────────────────────────────────┐
│  Version History                    [✕]     │
│  ───────────────                            │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ v3 (current)          Mar 8, 2:30 PM  │  │
│  │ Changed by: AI Strategy Synthesizer   │  │
│  │ Updated Problem + Channels blocks     │  │
│  │ Added WhatsApp as primary channel     │  │
│  │                          [View] [Revert]│ │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ v2                    Mar 7, 4:15 PM  │  │
│  │ Changed by: User                      │  │
│  │ Added cost structure and metrics      │  │
│  │                          [View]        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ v1 (initial)         Mar 7, 10:00 AM  │  │
│  │ Changed by: System (wizard seed)      │  │
│  │ Canvas created from wizard session    │  │
│  │                          [View]        │  │
│  └────────────────────────────────────────┘  │
│                                              │
└─────────────────────────────────────────────┘
```

---

## Sheet Container

- Side sheet from right: `fixed top-0 right-0 h-full w-[400px] bg-white shadow-xl z-50`
- Overlay: `fixed inset-0 bg-black/30 z-40`
- Animation: slide in from right, 200ms ease-out
- Close: `absolute top-4 right-4` X button

### Header
- "Version History" — `text-lg font-serif text-[#1A1A1A]`
- Close button: Lucide `X` icon, `text-[#9CA39B] hover:text-[#1A1A1A]`

---

## Version Card

```
┌────────────────────────────────────────┐
│  v3 (current)          Mar 8, 2:30 PM │
│  Changed by: AI Strategy Synthesizer  │
│  Updated Problem + Channels blocks    │
│  Added WhatsApp as primary channel    │
│                        [View] [Revert] │
└────────────────────────────────────────┘
```

### Card styling
- Background: `bg-white`
- Border: `border border-[#E8E8E4] rounded-lg`
- Padding: `p-4`
- Margin: `mb-3`
- Current version: `border-l-4 border-l-[#00875A]`

### Version badge
- Current: `v3 (current)` — `text-sm font-semibold text-[#1A1A1A]` + `bg-[#00875A]/10 text-[#00875A] text-xs rounded-full px-2 py-0.5 ml-2`
- Past: `v2` — `text-sm font-semibold text-[#1A1A1A]`

### Timestamp
- Right-aligned: `text-xs text-[#9CA39B]`
- Format: "Mar 8, 2:30 PM"

### Changed by
- `text-xs text-[#9CA39B] mt-1`
- Possible values: "User", "AI Strategy Synthesizer", "System (wizard seed)"
- AI changes: show agent name
- System changes: show "(wizard seed)" or "(initial)"

### Change summary
- `text-sm text-[#4A4A4A] mt-2`
- 1-2 lines describing what changed
- From `lean_canvas_versions.change_summary`

### Actions
- Right-aligned: `flex gap-2 mt-3`
- View: `text-xs text-[#3B82F6] hover:underline cursor-pointer` — opens version snapshot in read-only overlay
- Revert: `text-xs text-[#DC2626] hover:underline cursor-pointer` — only on non-current versions, confirms before reverting

---

## Timeline connector

Between version cards, a vertical timeline line:
```
  │  (card)
  │
  ├─── (dot)
  │
  │  (card)
```
- Line: `border-l-2 border-[#E8E8E4] ml-4`
- Dot: `w-3 h-3 rounded-full bg-[#00875A]` for current, `bg-[#E8E8E4]` for past

---

## View Version Overlay

When user clicks [View]:
- Full canvas snapshot displayed in a read-only overlay
- Uses same 3×3 grid layout as LeanCanvasPanel
- Header shows "Version 2 — Mar 7, 4:15 PM" with close button
- All blocks read-only (no edit, no AI buttons)
- Subtle `bg-[#F5F5F0]` background to differentiate from live canvas

---

## Revert Confirmation

When user clicks [Revert]:
```
┌─────────────────────────────────────────┐
│  Revert to Version 2?                   │
│                                         │
│  This will create a new version (v4)    │
│  with the contents from v2. Your        │
│  current canvas won't be lost — it      │
│  stays in the history.                  │
│                                         │
│  ┌────────────┐  ┌──────────┐          │
│  │ ▶ Revert  │  │  Cancel  │          │
│  └────────────┘  └──────────┘          │
└─────────────────────────────────────────┘
```

---

## Data Shape

```typescript
interface CanvasVersion {
  id: string;
  canvas_id: string;
  version: number;
  snapshot: Record<string, unknown>; // full canvas data
  change_summary: string;
  changed_by: string; // 'user' | agent name | 'system'
  created_at: string;
}
```

---

## Figma Deliverables

1. **Side sheet** — 3 version cards with timeline connector
2. **Version card variants** — Current (highlighted), Past, Initial (wizard seed)
3. **View overlay** — Read-only canvas snapshot
4. **Revert confirmation** — Dialog
5. **Mobile** — Full-screen sheet instead of side panel
