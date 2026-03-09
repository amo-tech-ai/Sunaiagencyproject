---
id: lean-05-canvas-block-editor
title: Strategy Engine — Canvas Block Editor
skill: frontend
phase: LEAN
priority: P0
status: Not Started
dependencies: [lean-04-lean-canvas-grid]
estimated_effort: L
percent_complete: 0
area: dashboard
figma_screens: [Canvas Block Editor, AI Suggestion Card, Block Edit Item]
spec_refs: [tasks/lean/02-wireframes.md §2, tasks/lean/03-agent-workflows.md §3]
---

# Strategy Engine — Canvas Block Editor

## Summary

| Field       | Value |
|-------------|-------|
| Trigger     | User clicks a canvas block in the 3×3 grid |
| Display     | Expanded inline panel (replaces collapsed block) or modal on mobile |
| Features    | View items, edit/delete items, add new, request AI suggestions, accept/dismiss AI |

---

## Wireframe — Expanded Edit State

```
┌─────────────────────────────────────────────┐
│  Problem                          [🤖 Ask AI]│
│  ─────────                                   │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ 🟢 Manual customer support response    │  │
│  │    Source: user  |  Added Mar 7        │  │
│  │                              [Edit][✕] │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ 🟢 Data silos across departments      │  │
│  │    Source: user  |  Added Mar 7        │  │
│  │                              [Edit][✕] │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌─ AI Suggestion ───────────────────────┐  │
│  │ 🤖 WhatsApp support volume growing    │  │
│  │    35% — becoming primary channel     │  │
│  │    Confidence: 85%                    │  │
│  │    Source: CRM activity analysis      │  │
│  │                      [Accept] [Dismiss]│  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌─────────────────────────────────┐        │
│  │ + Add new item...               │        │
│  └─────────────────────────────────┘        │
│                                              │
└─────────────────────────────────────────────┘
```

---

## Item Card — User-Created

```
┌────────────────────────────────────────────┐
│ 🟢 Manual customer support response time   │
│    Source: user  |  Added Mar 7, 2:30 PM   │
│                                [Edit] [✕]  │
└────────────────────────────────────────────┘
```

### Styling
- Background: `bg-white`
- Border: `border border-[#E8E8E4] rounded-md`
- Padding: `p-3`
- Margin: `mb-2`

### Indicator dot
- User items: `🟢` — `bg-[#00875A] w-2 h-2 rounded-full inline-block`
- AI items: `🤖` — robot emoji or `bg-[#3B82F6]` blue dot

### Text
- Item text: `text-sm text-[#1A1A1A] font-medium`
- Meta line: `text-xs text-[#9CA39B]` — "Source: user | Added Mar 7"

### Actions (shown on hover)
- `[Edit]`: `text-xs text-[#00875A] cursor-pointer`
- `[✕]`: `text-xs text-[#DC2626] cursor-pointer` with confirmation

---

## Item Card — AI-Created

Same as user card but:
- Blue dot indicator instead of green
- Shows "Source: ai | Confidence: 85%"
- Confidence displayed as percentage

---

## AI Suggestion Card (Pending Acceptance)

```
┌─ AI Suggestion ──────────────────────────┐
│ 🤖 WhatsApp support volume growing 35%   │
│    — becoming primary support channel     │
│                                           │
│    Confidence: 85%                        │
│    Based on: CRM activity analysis        │
│                                           │
│    ┌─────────┐  ┌──────────┐             │
│    │ Accept  │  │ Dismiss  │             │
│    └─────────┘  └──────────┘             │
└───────────────────────────────────────────┘
```

### Styling
- Background: `bg-[#3B82F6]/5` (light blue tint)
- Border: `border border-[#3B82F6]/30 rounded-md`
- Left accent: `border-l-4 border-l-[#3B82F6]`
- Padding: `p-4`

### Header
- "AI Suggestion" label: `text-xs font-semibold text-[#3B82F6] uppercase tracking-wide`

### Content
- Suggestion text: `text-sm text-[#1A1A1A] mt-2`
- Confidence: `text-xs text-[#9CA39B] mt-2`
  - Confidence bar: `w-full h-1 bg-gray-200 rounded` with fill colored by confidence level
- Source: `text-xs text-[#9CA39B]`

### Action buttons
- Accept: `px-3 py-1.5 bg-[#00875A] text-white text-xs rounded hover:bg-[#006B48]`
- Dismiss: `px-3 py-1.5 bg-white border border-[#E8E8E4] text-[#4A4A4A] text-xs rounded hover:bg-[#F5F5F0]`

---

## "Ask AI" Button

- Position: top-right of the expanded block header
- Label: `🤖 Ask AI`
- Style: `px-3 py-1.5 bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-medium rounded-md hover:bg-[#3B82F6]/20`
- Loading state: spinner replaces 🤖, text changes to "Thinking..."
- Calls: `strategyApi.synthesizeBlock(canvasId, blockKey, context, token)`

---

## Add New Item

```
┌─────────────────────────────────────┐
│ + Add new item...                   │
└─────────────────────────────────────┘
```

- Idle: `text-sm text-[#9CA39B] cursor-pointer border border-dashed border-[#E8E8E4] rounded-md p-2`
- Active: transforms into text input
  ```
  ┌─────────────────────────────────────┐
  │ [text input                    ] ↵  │
  └─────────────────────────────────────┘
  ```
- Input: `text-sm p-2 border border-[#00875A] rounded-md focus:ring-1 focus:ring-[#00875A]`
- Submit: Enter key or click submit icon
- Cancel: Escape key or click outside

---

## Edit Mode (Inline)

When user clicks [Edit] on an existing item:
- Text becomes editable input pre-filled with current text
- [Edit] changes to [Save] [Cancel]
- Save: `text-xs text-[#00875A]`
- Cancel: `text-xs text-[#9CA39B]`

---

## States

| State | Behavior |
|-------|----------|
| Collapsed | Shows in 3×3 grid (see `04-lean-canvas-grid.md`) |
| Expanded | Shows full item list with edit capabilities |
| Asking AI | "Ask AI" button shows spinner, suggestions appear when ready |
| AI suggestions loaded | 1-4 suggestion cards appear below existing items |
| Editing item | Inline text input |
| Adding item | Bottom input field active |
| Saving | Brief disable of actions during API call |

---

## Mobile

- Block editor opens as a bottom sheet (full-width, slides up)
- Same content layout but full-screen width
- Close button in top-right corner

---

## Figma Deliverables

1. **Expanded block** — Full edit state with 2 user items + 1 AI suggestion
2. **Item card variants** — User item, AI item, AI suggestion pending
3. **Edit mode** — Item in inline edit state
4. **Add new item** — Idle + active input states
5. **Ask AI loading** — Button in spinner state
6. **Mobile bottom sheet** — Block editor as sheet overlay
