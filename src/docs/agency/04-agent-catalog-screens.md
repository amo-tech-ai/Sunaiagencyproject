# Agent Catalog, Detail & Runner — New Screens

**Document:** 04 of Agency Agents series
**Version:** 1.0
**Created:** 2026-03-12
**Parent:** [00-executive-summary.md](./00-executive-summary.md)
**Status:** Implementing

---

## Implementation Plan (Sequential Order)

| # | Task | File(s) | Status |
|---|---|---|---|
| 1 | Planning doc | `docs/agency/04-agent-catalog-screens.md` | Done |
| 2 | Expand agent catalog data | `components/wizard/data/agentCatalog.ts` | Done |
| 3 | Agent Catalog page | `components/dashboard/agents/AgentCatalogPage.tsx` | Done |
| 4 | Agent Detail page | `components/dashboard/agents/AgentDetailPage.tsx` | Done |
| 5 | Agent Runner page | `components/dashboard/agents/AgentRunnerPage.tsx` | Done |
| 6 | Wire routes | `routes.tsx` | Done |

---

## Routes

| Route | Component | Purpose |
|---|---|---|
| `/app/agents/catalog` | AgentCatalogPage | Browse all agents by division |
| `/app/agents/catalog/:slug` | AgentDetailPage | Single agent profile |
| `/app/agents/catalog/:slug/run` | AgentRunnerPage | Execute agent on a task |

---

## Data Model

Extends `agentData.ts` with a new `agentCatalog.ts` file containing:
- Full 120+ agent definitions (15-20 curated shown by default)
- Division taxonomy with counts
- Agent profiles: about, mission, rules, metrics, use cases, pairings
- Search/filter support

---

## Best Practices

- [x] BCG design system (Georgia headings, #00875A accent, flat white cards)
- [x] Mobile-first responsive (single col → 2 col grid)
- [x] Motion/React animations (stagger, fade-in)
- [x] Proper TypeScript (no `any`)
- [x] Unique `key` props on all lists
- [x] Accessible (ARIA labels, keyboard nav, semantic HTML)
- [x] react-router (not react-router-dom)
- [x] Consistent with existing DashboardLayout sidebar
