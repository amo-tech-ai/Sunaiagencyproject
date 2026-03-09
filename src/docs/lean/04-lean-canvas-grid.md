# Task 04 — Lean Canvas 3x3 Grid

**ID:** lean-04-lean-canvas-grid
**Phase:** LEAN (Phase 14a)
**Priority:** P0
**Effort:** L
**Status:** Not Started
**Dependencies:** lean-01-strategy-page-layout
**Target Files:** `/components/dashboard/strategy/LeanCanvasPanel.tsx`, `/components/dashboard/strategy/CanvasBlock.tsx`

---

## Objective

Create the left column panel containing a classic 9-block Lean Canvas displayed in a 3x3 grid. Each block is clickable and expands into an inline editor (see Task 05).

---

## Grid Layout (Classic Lean Canvas)

```
┌──────────────────────────────────────────────────────────┐
│  Lean Canvas                           [View History] v3 │
├────────────┬──────────────┬──────────────────────────────┤
│  Problem   │ Solution     │ Unique Value Proposition     │
│  * Item 1  │ * Item 1     │ * Item 1                     │
│  * Item 2  │ * Item 2     │                              │
│       [AI] │ * Item 3 [AI]│                     [AI]     │
├────────────┼──────────────┼──────────────────────────────┤
│  Key       │ Channels     │ Customer Segments            │
│  Metrics   │ * Web        │ * SaaS companies             │
│  * CAC     │ * Email      │ * Retail brands              │
│  * LTV     │ * WhatsApp   │                     [AI]     │
├────────────┼──────────────┼──────────────────────────────┤
│  Cost      │ Revenue      │ Unfair Advantage             │
│  Structure │ Streams      │ * First-mover in AI          │
│  * Dev $8K │ * Sales $45K │ * 50K followers              │
│  * AI $2K  │              │                     [AI]     │
└────────────┴──────────────┴──────────────────────────────┘
│  [AI] = AI suggestions available       [View History] v3 │
```

### Grid order (9 blocks):

| Row | Col 1 | Col 2 | Col 3 |
|-----|-------|-------|-------|
| 1 | `problem` | `solution` | `value_proposition` |
| 2 | `key_metrics` | `channels` | `customer_segments` |
| 3 | `cost_structure` | `revenue_streams` | `unfair_advantage` |

---

## Block Labels & Placeholders

| Block Key | Label | Placeholder |
|-----------|-------|-------------|
| `problem` | Problem | What pain points does the business face? |
| `solution` | Solution | What AI systems solve these problems? |
| `value_proposition` | Unique Value Proposition | What makes the approach unique? |
| `key_metrics` | Key Metrics | Which KPIs matter most? |
| `channels` | Channels | How do customers find and engage? |
| `customer_segments` | Customer Segments | Who are the primary customer groups? |
| `cost_structure` | Cost Structure | What are the main cost drivers? |
| `revenue_streams` | Revenue Streams | How does the business make money? |
| `unfair_advantage` | Unfair Advantage | What sustainable edge exists? |

---

## CanvasBlock Component (Collapsed State)

```
┌─────────────────────────────┐
│  Problem              [AI]  │  ← Header: label + AI badge
│  ─────────                  │
│  * Manual customer support  │  ← Items (max 3-4 visible)
│  * No personalization       │
│  * Cart abandonment 72%     │
│                             │
│  3 items                    │  ← Count footer
└─────────────────────────────┘
```

### Block styling
- `bg-white border border-[#E8E8E4] rounded-lg p-4 min-h-[140px]`
- `hover:border-[#00875A] hover:shadow-sm transition-all cursor-pointer`

### Header
- Label: `text-sm font-semibold text-[#1A1A1A]` (Georgia serif)
- AI badge: `text-xs bg-[#00875A]/10 text-[#00875A] rounded-full px-2 py-0.5` — shown when `aiSuggestionsAvailable`

### Items
- `text-sm text-[#4A4A4A] space-y-1`
- Max 4 items shown; if more: "+N more"
- AI-source items get subtle robot indicator

### Footer
- `text-xs text-[#9CA39B] mt-2` — "N items"

---

## Empty Block State

```
┌─────────────────────────────┐
│  Revenue Streams            │
│  ─────────                  │
│  How does the business      │  ← Placeholder text (italic, muted)
│  make money?                │
│  + Add first item           │  ← CTA link (green)
└─────────────────────────────┘
```

---

## Panel Container

### Header row
- "Lean Canvas" — `text-xl font-serif text-[#1A1A1A]`
- Right: version badge `text-xs bg-[#E8E8E4] rounded px-2 py-0.5` + "View History" link `text-sm text-[#00875A]`

### Grid
- `grid grid-cols-3 gap-3`
- All 9 blocks equal column width, rows auto-adjust

### Footer legend
- `text-xs text-[#9CA39B] mt-3` — "[AI] = AI suggestions available"

---

## Mobile Layout

- Blocks stack vertically in single column (full-width)
- Collapsible accordion-style (tap to expand)

---

## Interaction

- Click any collapsed block → expands inline into `CanvasBlockEditor` (Task 05)
- Only one block expanded at a time (clicking another collapses the current)
- Use `useState<CanvasBlockKey | null>` for active expanded block
