---
id: lean-04-lean-canvas-grid
title: Strategy Engine — Lean Canvas 3×3 Grid
skill: frontend
phase: LEAN
priority: P0
status: Not Started
dependencies: [lean-01-strategy-page-layout]
estimated_effort: L
percent_complete: 0
area: dashboard
figma_screens: [Lean Canvas Panel, Canvas Block Collapsed, Canvas Block Hover]
spec_refs: [tasks/lean/02-wireframes.md §1, tasks/lean/05-content-data.md §1-2]
---

# Strategy Engine — Lean Canvas 3×3 Grid

## Summary

| Field       | Value |
|-------------|-------|
| Position    | Left column of 3-column layout (~45% width) |
| Structure   | 9 blocks in a 3×3 grid layout (classic Lean Canvas) |
| Interaction | Click block to expand into editor (see `05-canvas-block-editor.md`) |
| Footer      | Version indicator + "View History" link |

---

## Grid Layout (Classic Lean Canvas)

```
┌──────────────────────────────────────────────────────────┐
│  Lean Canvas                           [View History] v3 │
├────────────┬──────────────┬──────────────────────────────┤
│  Problem   │ Solution     │ Unique Value Proposition     │
│            │              │                              │
│  • Item 1  │ • Item 1     │ • Item 1                     │
│  • Item 2  │ • Item 2     │                              │
│  • Item 3  │ • Item 3 🤖  │                              │
│       🤖   │              │                     🤖       │
├────────────┼──────────────┼──────────────────────────────┤
│  Key       │ Channels     │ Customer Segments            │
│  Metrics   │              │                              │
│  • CAC     │ • Web        │ • SaaS companies             │
│  • LTV     │ • Email      │ • Retail brands              │
│  • Churn   │ • WhatsApp🤖 │                     🤖       │
│       🤖   │              │                              │
├────────────┼──────────────┼──────────────────────────────┤
│  Cost      │ Revenue      │ Unfair Advantage             │
│  Structure │ Streams      │                              │
│  • Dev $8K │ • Sales $45K │ • First-mover in AI          │
│  • AI $2K  │              │ • 50K followers              │
│            │              │                     🤖       │
└────────────┴──────────────┴──────────────────────────────┘
│  🤖 = AI suggestions available    [View History] [v3]    │
└──────────────────────────────────────────────────────────┘
```

### Traditional Lean Canvas grid order:
| Row | Col 1 | Col 2 | Col 3 |
|-----|-------|-------|-------|
| 1   | Problem | Solution | Unique Value Proposition |
| 2   | Key Metrics | Channels | Customer Segments |
| 3   | Cost Structure | Revenue Streams | Unfair Advantage |

---

## Block Labels & Descriptions

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

## Canvas Block (Collapsed State)

```
┌─────────────────────────────┐
│  Problem              [🤖]  │  ← Header: label + AI badge
│  ─────────                  │
│  • Manual customer support  │  ← Items (max 3-4 visible)
│  • No personalization       │
│  • Cart abandonment 72%     │
│                             │
│  3 items                    │  ← Count footer
└─────────────────────────────┘
```

### Block styling
- Background: `bg-white`
- Border: `border border-[#E8E8E4] rounded-lg`
- Hover: `hover:border-[#00875A] hover:shadow-sm transition-all`
- Cursor: `cursor-pointer`
- Padding: `p-4`
- Min height: `min-h-[140px]`

### Header
- Label: `text-sm font-semibold text-[#1A1A1A]` (Georgia serif)
- AI badge (🤖): shown when AI suggestions are available for this block
  - `text-xs bg-[#00875A]/10 text-[#00875A] rounded-full px-2 py-0.5`

### Items
- Bullet list: `text-sm text-[#4A4A4A] space-y-1`
- Max 4 items shown; if more, show "+N more"
- Each item: single line, truncated with ellipsis if too long
- Items from AI source get a subtle `🤖` indicator

### Footer
- `text-xs text-[#9CA39B] mt-2`
- "N items" count

---

## Canvas Block Item Shape

```typescript
interface CanvasBlockItem {
  id: string;
  text: string;
  source: 'manual' | 'ai';
  confidence?: number;     // 0-1, only for AI items
  updatedAt: string;       // ISO timestamp
}
```

---

## Panel Container

### Header row
- "Lean Canvas" — `text-xl font-serif text-[#1A1A1A]`
- Right side: "v3" badge + "View History" link
  - Version badge: `text-xs bg-[#E8E8E4] rounded px-2 py-0.5`
  - History link: `text-sm text-[#00875A] hover:underline cursor-pointer`

### Grid
- `grid grid-cols-3 gap-3`
- All 9 blocks have equal column width
- Row heights auto-adjust based on content

### Footer
- `🤖 = AI suggestions available` — legend text
- `text-xs text-[#9CA39B] mt-3`

---

## Empty Block State

When a block has no items:
```
┌─────────────────────────────┐
│  Revenue Streams            │
│  ─────────                  │
│                             │
│  How does the business      │  ← Placeholder text
│  make money?                │
│                             │
│  + Add first item           │  ← CTA link
└─────────────────────────────┘
```

- Placeholder text: `text-sm text-[#9CA39B] italic`
- CTA: `text-sm text-[#00875A] cursor-pointer`

---

## Mobile Layout

- Blocks stack vertically in a single column
- Each block is full-width
- Collapsible accordion-style (tap to expand)

---

## Sample Data

```json
{
  "problem": [
    { "text": "Manual customer support across 3 channels", "source": "ai" },
    { "text": "No personalized product recommendations", "source": "ai" },
    { "text": "Cart abandonment rate at 72%", "source": "ai" }
  ],
  "customer_segments": [
    { "text": "Fashion-conscious women 25-40", "source": "ai" },
    { "text": "Online-first shoppers preferring mobile", "source": "ai" }
  ],
  "solution": [
    { "text": "AI Chatbot — Automated customer support", "source": "ai" },
    { "text": "Recommendation Engine — Personalized suggestions", "source": "ai" },
    { "text": "CRM Automation — Lead nurturing workflows", "source": "ai" }
  ]
}
```

---

## Figma Deliverables

1. **Full canvas panel** — 3×3 grid with sample data filled in
2. **Individual block states** — Empty, 1-2 items, 3+ items, with AI badge
3. **Block hover state** — Highlighted border
4. **Mobile canvas** — Stacked vertical blocks
5. **Canvas header** — With version badge and history link
