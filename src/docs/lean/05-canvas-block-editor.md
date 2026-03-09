# Task 05 — Canvas Block Editor

**ID:** lean-05-canvas-block-editor
**Phase:** LEAN (Phase 14a)
**Priority:** P0
**Effort:** L
**Status:** Not Started
**Dependencies:** lean-04-lean-canvas-grid
**Target File:** `/components/dashboard/strategy/CanvasBlockEditor.tsx`

---

## Objective

Create the inline expanded editor for a single canvas block. Appears when user clicks a block in the 3x3 grid. Supports viewing items, adding/editing/deleting items, requesting AI suggestions, and accepting/dismissing AI-generated items.

---

## Wireframe — Expanded Edit State

```
┌─────────────────────────────────────────────┐
│  Problem                          [Ask AI]  │
│  ─────────                                  │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │ * Manual customer support response     │ │
│  │   Source: user  |  Added Mar 7         │ │
│  │                             [Edit] [x] │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │ * Data silos across departments        │ │
│  │   Source: user  |  Added Mar 7         │ │
│  │                             [Edit] [x] │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  ┌─ AI Suggestion ───────────────────────┐ │
│  │ WhatsApp support volume growing 35%   │ │
│  │ — becoming primary channel            │ │
│  │ Confidence: 85%                       │ │
│  │ Source: CRM activity analysis         │ │
│  │                     [Accept] [Dismiss] │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  ┌─────────────────────────────────┐       │
│  │ + Add new item...               │       │
│  └─────────────────────────────────┘       │
└─────────────────────────────────────────────┘
```

---

## Item Card — User-Created

- Background: `bg-white`, border: `border border-[#E8E8E4] rounded-md`, padding: `p-3`, margin: `mb-2`
- Green indicator dot: `bg-[#00875A] w-2 h-2 rounded-full`
- Text: `text-sm text-[#1A1A1A] font-medium`
- Meta: `text-xs text-[#9CA39B]` — "Source: user | Added Mar 7"
- Actions (shown on hover): `[Edit]` green, `[x]` red with confirmation

## Item Card — AI-Created

- Same as user card but blue dot indicator (`bg-[#3B82F6]`)
- Shows "Source: ai | Confidence: 85%"

---

## AI Suggestion Card (Pending Acceptance)

- Background: `bg-[#3B82F6]/5`
- Border: `border border-[#3B82F6]/30 rounded-md`
- Left accent: `border-l-4 border-l-[#3B82F6]`
- Header: "AI Suggestion" — `text-xs font-semibold text-[#3B82F6] uppercase tracking-wide`
- Content: suggestion text `text-sm text-[#1A1A1A] mt-2`
- Confidence bar: `w-full h-1 bg-gray-200 rounded` with colored fill
- Buttons:
  - Accept: `px-3 py-1.5 bg-[#00875A] text-white text-xs rounded`
  - Dismiss: `px-3 py-1.5 bg-white border border-[#E8E8E4] text-[#4A4A4A] text-xs rounded`

---

## "Ask AI" Button

- Position: top-right of expanded block header
- Label: "Ask AI" with robot icon
- Style: `px-3 py-1.5 bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-medium rounded-md`
- Loading: spinner replaces icon, text → "Thinking..."
- Calls: `strategyApi.synthesizeBlock(canvasId, blockKey, context, token)`
- Returns 1-4 suggestion cards that appear below existing items

---

## Add New Item

- Idle: `text-sm text-[#9CA39B] cursor-pointer border border-dashed border-[#E8E8E4] rounded-md p-2` — "+ Add new item..."
- Active: transforms into text input with `border-[#00875A]`
- Submit: Enter key or click icon
- Cancel: Escape key or click outside
- On submit: calls `strategyApi.updateBlock()` to add item with `source: 'manual'`

---

## Edit Mode (Inline)

- Click [Edit] → text becomes editable input pre-filled with current value
- [Edit] changes to [Save] [Cancel]
- Save calls `strategyApi.updateBlock()` with updated item text

---

## States

| State | Behavior |
|-------|----------|
| Collapsed | Shows in 3x3 grid (Task 04) |
| Expanded | Full item list with edit capabilities |
| Asking AI | "Ask AI" button spinner, suggestions appear when ready |
| AI suggestions loaded | 1-4 suggestion cards below existing items |
| Editing item | Inline text input |
| Adding item | Bottom input field active |
| Saving | Brief disable of actions during API call |

---

## Mobile

- Block editor opens as a bottom sheet (full-width, slides up via Motion)
- Same content layout but full-screen width
- Close button (X) in top-right corner

---

## Accept/Dismiss Flow

- **Accept**: AI suggestion item moves into the block's `items` array with `source: 'ai'`, confidence preserved. Card animates with green flash → slides into item list.
- **Dismiss**: Card fades out. Suggestion removed. Not persisted.
- Both actions call `strategyApi.updateBlock()` to persist.
