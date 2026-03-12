# Agent Screens — Design Specification

**Document:** 05 of Agency Agents series
**Version:** 1.0
**Created:** 2026-03-12
**Parent:** [00-executive-summary.md](./00-executive-summary.md)
**Status:** Implemented

---

## Design System

These 3 screens follow a distinct **Professional SaaS** visual language, differentiated from the BCG-inspired dashboard pages by using:

| Element | Dashboard (BCG) | Agent Screens (SaaS) |
|---|---|---|
| Background | `#F5F5F0` (warm off-white) | `#F8F9FA` (cool light gray) |
| Primary accent | `#00875A` (green) | `#2563EB` (blue) |
| Card borders | `#E8E8E4` (warm) | `#E5E7EB` (cool) |
| Card radius | `rounded-lg` (8px) | `rounded-xl` (12px) |
| Headings | Georgia serif | System sans-serif (600 weight) |
| Avatars | Lucide icon + color circle | Emoji + `#F3F4F6` rounded square |
| Card shadow | none on rest | `shadow-sm` on rest, `shadow-md` on hover |

### Layout Integration

Agent screens break out of the `DashboardLayout` wrapper (which provides `max-w-[1200px] mx-auto px-4...`)
using **negative margins** to extend the cool gray background edge-to-edge:

```tsx
className="-mx-4 -my-5 sm:-mx-6 sm:-my-6 lg:-mx-8 lg:-my-8 min-h-[calc(100vh-3.5rem)] bg-[#F8F9FA]"
```

This ensures the `#F8F9FA` background fills the full content area while each page re-applies
its own max-width and padding internally.

### Color Palette

```
Primary:     #2563EB (blue-600)
Primary dk:  #1D4ED8 (blue-700, hover)
Primary bg:  #EFF6FF (blue-50, light panels)
Primary txt: #1E40AF (blue-800, on blue bg)

Text:
  Heading:   #111827 (gray-900)
  Body:      #374151 (gray-700)
  Secondary: #6B7280 (gray-500)
  Muted:     #9CA3AF (gray-400)

Surface:
  Card:      #FFFFFF
  Page:      #F8F9FA
  Input:     #F9FAFB (gray-50)
  Border:    #E5E7EB (gray-200)
  Divider:   #F3F4F6 (gray-100)

Division badge colors:
  Engineering:  #3B82F6
  Sales:        #F59E0B
  Marketing:    #8B5CF6
  Design:       #EC4899
  Product:      #06B6D4
  PM:           #6366F1
  Testing:      #EF4444
  Paid Media:   #F97316
  Support:      #10B981
  Specialized:  #64748B
```

---

## Screen 1: Agent Catalog

**Route:** `/app/agents/catalog`
**Component:** `AgentCatalogPage.tsx`

### Layout
- Full-width `#F8F9FA` background
- Max-width container: `1280px`
- Grid: 1 col mobile, 2 col `md+`

### Components
1. **Breadcrumb** — Dashboard > Agents > Catalog
2. **Page header** — title, subtitle with filtered count + "120+ available" note
3. **Search input** — right-aligned, blue focus ring, instant filter
4. **Division tab bar** — horizontal scrollable pills, blue active state, count badges
5. **Agent card grid** — emoji avatar, name, one-line role, division badge with color, assignment info, View/Run buttons
6. **Load more button** — 20 per page pagination
7. **Empty state** — search icon + "Clear filters" link

### Agent Card Anatomy
```
+-------------------------------------------+
|  [emoji]  Agent Name                       |
|           One-line role description        |
|                                            |
|           [DIVISION]  Assigned to: 3 proj  |
|                                            |
|           [View]  [Run]                    |
+-------------------------------------------+
```

---

## Screen 2: Agent Detail

**Route:** `/app/agents/catalog/:slug`
**Component:** `AgentDetailPage.tsx`

### Layout
- Max-width: `960px`
- Stacked cards on single column

### Components
1. **Breadcrumb** — Agents > Catalog > {Agent Name}
2. **Hero card** — emoji avatar (64px), name, division badge, tagline (italic), Run/Assign buttons
3. **Tab bar** — About | Capabilities | Use Cases | Run History (blue underline active)
4. **About tab** — description card, 3-col mission/rules/metrics cards, best-for card (industries/goals/pairs-with tags), assigned-to card
5. **Capabilities tab** — numbered capability list (2-col grid), methodology section (3 cards: Approach, Quality Gates, Learning)
6. **Use Cases tab** — input/output paired cards with "Try this use case" link
7. **Run History tab** — table with task, tokens, duration, date, format columns

---

## Screen 3: Agent Runner

**Route:** `/app/agents/catalog/:slug/run`
**Component:** `AgentRunnerPage.tsx`

### Layout
- Max-width: `1280px`
- Split pane: 50/50 on `lg+`, stacked on mobile

### Components
1. **Breadcrumb** — Agents > {Agent Name} > Run
2. **Header** — emoji avatar + "Run: {Agent Name}" + role subtitle
3. **Left pane: Task Input** — context textarea (optional), task textarea (required), output format radio group (highlighted selection), Run Agent button (full-width blue)
4. **Right pane: Agent Output** — empty state (faded emoji), loading state (spinning + emoji), result state (monospace output, token/duration metadata, Copy/Save/Share buttons)

### States
- **Empty:** Faded emoji + "Run the agent to see output here"
- **Running:** Emoji + spinner + "{Agent Name} is working..." + "2-5 seconds"
- **Complete:** Formatted output + metadata bar + action buttons

---

## Sidebar Enhancement

The "AI Agents" nav item now has **2 sub-items** visible in mobile and desktop modes (hidden in tablet icon-only mode):

```
AI Agents       [Bot icon]
  Catalog       (→ /app/agents/catalog)
  Monitor       (→ /app/agents)
```

Sub-items use `text-xs`, `pl-5` indent, `text-[#F5F5F0]/40` default, `text-[#00875A]` active.

---

## Data Model Changes

`CatalogAgent` type updated in `agentCatalog.ts`:
- **Added:** `emoji: string` — Unicode emoji for avatar
- **Added:** `capabilities: string[]` — list of 6 capabilities per agent
- **Changed:** `assignedCount: number` → `assignedTo: string[]` — named project list
- **Added:** `DIVISION_COLORS` map for consistent badge coloring
- **Updated:** Divisions now include `Paid Media` and `Specialized` (replacing `Analytics`, `Finance`, `Strategy`)

---

## File Inventory

| File | Lines | Purpose |
|---|---|---|
| `agentCatalog.ts` | ~500 | Data model, 16 curated agents, search/filter |
| `AgentCatalogPage.tsx` | ~165 | Catalog grid page |
| `AgentDetailPage.tsx` | ~320 | Agent profile page with 4 tabs |
| `AgentRunnerPage.tsx` | ~310 | Split-pane runner page |
| `DashboardSidebar.tsx` | ~170 | Sidebar with Catalog/Monitor sub-items |
| `routes.tsx` | ~175 | 3 new routes under `/app/agents/catalog` |