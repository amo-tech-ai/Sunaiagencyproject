# Task 14 — Sidebar Navigation & Header Integration

**ID:** lean-14-sidebar-navigation
**Phase:** LEAN (Phase 14a)
**Priority:** P0
**Effort:** S
**Status:** Not Started
**Dependencies:** None
**Target Files:** `/components/dashboard/DashboardSidebar.tsx`, `/components/dashboard/DashboardHeader.tsx`

---

## Objective

Add the Strategy Engine navigation item to the dashboard sidebar with a pending approvals badge, and add the route label to the header breadcrumb system.

---

## Sidebar Position

```
📊 Dashboard
📁 Projects
🗺️ Roadmap
👥 Clients
🔀 CRM Pipeline
💡 AI Insights
🧠 Strategy  ⚠3    ← NEW (after AI Insights, before Documents)
📄 Documents
💰 Financial
⚡ Workflows
🤖 AI Agents
⚙️ Settings
```

---

## Nav Item Spec

```typescript
{
  to: '/app/strategy',
  label: 'Strategy',
  icon: Brain,  // from lucide-react
  badge: pendingApprovals > 0 ? pendingApprovals : undefined,
}
```

### Badge styling
- When `pendingApprovals > 0`:
  - `bg-[#D97706] text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5`
  - Position: right side of nav item label
- When 0: no badge shown

### Active state
- Background: `bg-[#00875A]/10`
- Text: `text-[#00875A] font-medium`
- Icon: `text-[#00875A]`
- Left accent: `border-l-3 border-[#00875A]`

### Hover state
- Background: `bg-[#F5F5F0]`
- Text: `text-[#1A1A1A]`

---

## Badge Data Source

Option A (lightweight): Fetch `strategyApi.getMetrics(token)` on sidebar mount, read `pendingApprovals` count. Cache for 60 seconds.

Option B (shared): Use a context or zustand store that `StrategyEnginePage` populates. Sidebar reads from the store.

Recommendation: Option A for simplicity — sidebar makes a single lightweight API call.

---

## Header Route Label

Add to `ROUTE_LABELS` map in `DashboardHeader.tsx`:

```typescript
strategy: 'Strategy Engine',
```

Breadcrumb displays: `Dashboard / Strategy Engine`

---

## Mobile Sidebar

Same nav item appears in the mobile hamburger menu drawer. No changes needed to the drawer structure — the nav item array drives both desktop and mobile.

---

## Files Modified

```
/components/dashboard/DashboardSidebar.tsx — ADD: Brain import, nav item with badge
/components/dashboard/DashboardHeader.tsx — ADD: 'strategy' route label
```
