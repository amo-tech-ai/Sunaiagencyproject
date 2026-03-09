# Task 06 — Intelligence Panel

**ID:** lean-06-intelligence-panel
**Phase:** LEAN (Phase 14b)
**Priority:** P0
**Effort:** L
**Status:** Not Started
**Dependencies:** lean-01-strategy-page-layout
**Target File:** `/components/dashboard/strategy/IntelligencePanel.tsx`

---

## Objective

Create the right column panel containing three vertically stacked sections: Pending Approvals (recommendations requiring human action), Insights (auto-approved observations), and Opportunities (detected automation candidates).

---

## Panel Structure

```
┌── Intelligence ─────────────────────────┐
│                                          │
│  Pending Approvals (3)                  │
│  ─────────────────────                   │
│  [RecommendationCard]                   │
│  [RecommendationCard]                   │
│  [RecommendationCard]                   │
│                                          │
│  ── Insights ────────────────────────    │
│  [InsightCard]                          │
│  [InsightCard]                          │
│                                          │
│  ── Opportunities ───────────────────    │
│  [OpportunityCard]                      │
│  [OpportunityCard]                      │
│                                          │
└──────────────────────────────────────────┘
```

---

## Section 1: Pending Approvals

### Section header
- "Pending Approvals (N)" — `text-sm font-semibold text-[#1A1A1A]`
- Count badge: `text-xs bg-[#D97706]/10 text-[#D97706] rounded-full px-2 py-0.5`
- If count = 0: "No pending approvals — all caught up!" in muted text, section collapsed

### Content
- List of `RecommendationCard` components (Task 07)
- Compact variant for panel display
- Approve/reject actions inline

---

## Section 2: Insights

### Section header
- "Insights" — `text-sm font-semibold text-[#1A1A1A] mt-6`
- Divider line above: `border-t border-[#E8E8E4] pt-4`

### Content
- List of `InsightCard` components (Task 07)
- Priority-colored left border (red/amber/green)
- Dismiss action on each card

---

## Section 3: Opportunities

### Section header
- "Opportunities" — `text-sm font-semibold text-[#1A1A1A] mt-6`
- Divider line above

### Content
- List of `OpportunityCard` components (compact variant, Task 07)
- Status-colored left accent
- "Evaluate" action button

---

## Panel Container Styling

- Background: `bg-[#F5F5F0]` or `bg-white`
- Border: `border border-[#E8E8E4] rounded-lg`
- Padding: `p-4`
- Overflow: `overflow-y-auto max-h-[calc(100vh-280px)]` (sticky scroll)

---

## Empty States

| Section | Empty message |
|---------|--------------|
| Pending Approvals | "No pending approvals — all caught up!" |
| Insights | "Run an analysis to generate insights" |
| Opportunities | "No opportunities detected yet" |

---

## Data Sources

```typescript
// Fetched in parent StrategyEnginePage, passed as props
recommendations: Recommendation[]  // strategyApi.listRecommendations(token)
insights: Insight[]                // strategyApi.listInsights(token)
opportunities: Opportunity[]       // strategyApi.listOpportunities(token)
```

---

## Callbacks

```typescript
interface IntelligencePanelProps {
  recommendations: Recommendation[];
  insights: Insight[];
  opportunities: Opportunity[];
  onApproveRecommendation: (id: string) => void;
  onRejectRecommendation: (id: string) => void;
  onDismissInsight: (id: string) => void;
  onEvaluateOpportunity: (id: string) => void;
  loading: boolean;
}
```

---

## Mobile

- Intelligence panel becomes a tab in the mobile tab bar
- Full-width when active
- Sections stack vertically (no structural change)
