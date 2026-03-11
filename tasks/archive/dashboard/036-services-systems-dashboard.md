---
id: 036-services-systems-dashboard
diagram_id: DASH-12
prd_section: Dashboard
title: Services and systems management dashboard — AI system catalog, service packages, and configuration
skill: frontend
phase: LOW
priority: P3
status: Not Started
owner: Frontend
dependencies:
  - 025-dashboard-overview
estimated_effort: M
percent_complete: 0
area: agency-dashboard
wizard_step: null
schema_tables: [systems, services, system_services, project_services, projects]
figma_prompt: prompts/036-services-systems-dashboard.md
---

# 036 — Services and Systems Management Dashboard

## Summary Table

| Field            | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| **ID**           | 036-services-systems-dashboard                                   |
| **Diagram ID**   | DASH-12                                                          |
| **Section**      | Dashboard                                                        |
| **Phase**        | LOW                                                              |
| **Priority**     | P3                                                               |
| **Effort**       | M (Medium)                                                       |
| **Owner**        | Frontend                                                         |
| **Dependencies** | 025-dashboard-overview                                           |
| **Schema**       | systems, services, system_services, project_services, projects   |
| **Wizard Step**  | None (manages the master data that powers wizard Step 3 recommendations) |

---

## Description

**Situation.** The agency offers a catalog of AI systems — Support Engine, Growth Engine, Cart Recovery, Analytics Dashboard, AI Chatbot, and others. Each system is composed of multiple services (e.g., Support Engine includes ticket routing, auto-reply, FAQ bot, escalation management). These systems are what the wizard recommends in Step 3 based on industry diagnostics. The system catalog data lives in the `systems` and `services` tables with a `system_services` junction table. But there is no admin interface to view, manage, or analyze this catalog.

**Why it matters.** The system catalog is the agency's product offering. Without visibility into which systems exist, which services they include, how they are priced, and which clients use them, the agency cannot make informed decisions about product development, pricing strategy, or sales focus. When a new consultant joins, they need a place to learn what the agency offers. When the owner wants to add a new system or adjust pricing, they need an admin interface. This dashboard is the master control panel for the agency's AI product catalog.

**What exists.** The `systems` table stores each AI system (name, description, category). The `services` table stores individual service components (name, description, type). The `system_services` junction connects systems to their component services. `project_services` tracks which services are active for each client project. The wizard Step 3 recommendation engine reads from this catalog to suggest systems to prospects.

**The build.** An admin dashboard with a catalog grid showing all AI systems as cards with descriptions, industry fit, and usage stats. Clicking a system opens a slide-out detail panel showing its component services, pricing tiers, typical ROI, implementation timeline, and which clients/projects use it. An adoption tracker shows system popularity over time. Add/edit forms allow maintaining the catalog.

**Example.** The agency owner opens the Services & Systems dashboard and sees 8 AI systems in a grid. "Support Engine" shows 12 active projects, "Cart Recovery" shows 7, and the newly added "AI Content Generator" shows 0. They click "Support Engine" and the detail panel slides out showing 4 component services (ticket routing, auto-reply, FAQ bot, escalation management), the Starter/Professional/Enterprise pricing tiers, typical ROI of 340%, and a 3-week implementation timeline. They see 12 projects using it, mostly in Retail and E-commerce. They click "AI Content Generator" and realize the description needs work — they edit it inline to better position it for the wizard recommendation engine.

---

## User Stories

- As an **agency owner**, I want to see all AI systems in a visual catalog so I have a complete view of what the agency offers.
- As an **agency owner**, I want to see which systems are most used so I can focus marketing and sales efforts on high-demand offerings.
- As an **agency owner**, I want to add new AI systems and services so the catalog grows with the business.
- As a **consultant**, I want to view system details (services, pricing, ROI, timeline) so I can speak confidently about offerings to prospects.
- As an **agency owner**, I want to manage pricing tiers per system so I can adjust pricing strategy based on market feedback.
- As an **agency owner**, I want to see which clients have adopted which systems so I can identify upsell opportunities.
- As an **agency owner**, I want to understand how the wizard recommendation engine uses this data so I can optimize recommendations.

---

## Goals & Acceptance Criteria

- [ ] System catalog displays all AI systems from the `systems` table as cards in a responsive grid
- [ ] Each system card shows: system icon, name, description (truncated to 2 lines), category badge, industry fit tags, active project count
- [ ] Clicking a system card opens a slide-out right panel with full system details
- [ ] System detail panel includes: full description, component services list (from `system_services` + `services`), pricing tiers table, typical ROI percentage, implementation timeline (weeks), and related industries
- [ ] Service list within a system shows each service's name, description, and type
- [ ] Pricing tier table shows tier name (Starter/Professional/Enterprise or custom), features included, and price
- [ ] Client adoption section within system detail shows which projects use this system (from `project_services`), with project name, client name, and status
- [ ] Usage stats chart shows system adoption over time (new projects per month using this system)
- [ ] "Add System" button opens a form to create a new system with name, description, category, industry fit, and component services selector
- [ ] "Edit System" button on the detail panel allows inline editing of all system fields
- [ ] "Add Service" allows creating new service records and associating them with systems
- [ ] System search bar filters the catalog grid by name, category, or description
- [ ] Category filter buttons (All, Customer Support, Sales & Marketing, Analytics, Operations) filter the grid
- [ ] Adoption tracker chart shows total project count per system as a horizontal bar chart, sortable by count or alphabetically
- [ ] Page follows design system: #F1EEEA background, #0A211F text, #84CC16 accents, Playfair Display headings, Lora body, 1200px max-width, card-based, no shadows, no gradients

---

## Wiring Plan

| Data need                         | Source table(s)                        | Query / logic                                                                              |
| --------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------ |
| System catalog                    | `systems`                              | `SELECT * FROM systems ORDER BY name`                                                      |
| System services                   | `system_services`, `services`          | `SELECT s.* FROM system_services ss JOIN services s ON ss.service_id = s.id WHERE ss.system_id = ?` |
| Active project count per system   | `project_services`, `projects`         | `SELECT ps.service_id, COUNT(DISTINCT ps.project_id) FROM project_services ps JOIN projects p ON ps.project_id = p.id WHERE p.status = 'active' GROUP BY ps.service_id` — aggregate to system level via system_services |
| Client adoption list              | `project_services`, `projects`, `clients` | `SELECT p.name as project_name, c.name as client_name, p.status FROM project_services ps JOIN projects p ON ps.project_id = p.id JOIN clients c ON p.client_id = c.id WHERE ps.service_id IN (SELECT service_id FROM system_services WHERE system_id = ?)` |
| Adoption over time                | `project_services`, `projects`         | `SELECT DATE_TRUNC('month', p.created_at) as month, COUNT(*) FROM project_services ps JOIN projects p ON ps.project_id = p.id WHERE ps.service_id IN (...) GROUP BY month ORDER BY month` |
| Category list                     | `systems`                              | `SELECT DISTINCT category FROM systems`                                                    |
| Create system                     | `systems`                              | `INSERT INTO systems (name, description, category, ...) VALUES (...)`                      |
| Update system                     | `systems`                              | `UPDATE systems SET name = ?, description = ?, ... WHERE id = ?`                           |
| Create service                    | `services`, `system_services`          | Insert into `services`, then insert junction record into `system_services`                  |
| Wizard recommendation data        | `wizard_answers`                       | Parse Step 3 ai_results to count how often each system is recommended vs selected           |

---

## Screen Purpose

Admin view for managing the agency's catalog of AI systems and services. Shows all available systems (Support Engine, Growth Engine, Cart Recovery, Analytics Dashboard, AI Chatbot, etc.), their service components, pricing tiers, and which clients/projects use each. This is the master data that powers wizard Step 3 recommendations. It is also the reference guide for consultants learning the agency's product portfolio.

---

## Target User

Agency owner managing the product catalog, adjusting pricing, adding new systems, and analyzing which offerings drive the most revenue. Consultants reviewing system capabilities and client adoption to prepare for sales conversations and project delivery. Operations team ensuring the catalog is complete and accurate for the wizard recommendation engine.

---

## Core Features

1. **System catalog grid** — Responsive grid of system cards. Each card is a white (#FFFFFF) card on #F1EEEA background showing: system icon (or colored initial circle), system name (Playfair Display), description truncated to 2 lines (Lora), category badge (colored pill), industry fit tags (small gray pills), and active project count with a small bar indicator. Cards are sorted alphabetically by default, with sort options for popularity (project count) and recency (created date).

2. **System detail slide-out** — Right panel (400px wide) that slides in when a system card is clicked. Contains:
   - System name, full description, category, industry fit
   - **Services list**: All component services from the `system_services` junction. Each service shows name, description, and type badge.
   - **Pricing tiers**: Table showing tier name, included features (checkmark list), and price per tier.
   - **Metrics**: Typical ROI (percentage), implementation timeline (weeks), active projects (count).
   - **Client adoption**: List of projects using this system with project name, client name, and project status badge.
   - **Adoption trend**: Small area chart showing monthly new adoptions.
   - **Actions**: Edit, Delete (with confirmation), Duplicate.

3. **Service management** — Services can be created independently and associated with one or more systems. Service records show name, description, type (automated, semi-automated, manual), and which systems include them. Service list view accessible via a tab or sub-section.

4. **Usage stats and adoption tracker** — Horizontal bar chart showing all systems ranked by active project count. Allows quick identification of the most and least popular offerings. Clicking a bar navigates to that system's detail panel.

5. **Pricing/tier management** — Per-system pricing table with editable tiers. Each tier has a name, feature list, and price. Agency owner can add, edit, or remove tiers. Pricing changes do not affect existing projects.

6. **Add/edit system form** — Modal form for creating or editing a system. Fields: name, description, category (dropdown), industry fit (multi-select tags), icon upload, component services (multi-select from existing services or create new), pricing tiers (repeatable tier rows).

7. **Category and search filtering** — Category filter buttons at the top of the grid (All, Customer Support, Sales & Marketing, Analytics, Operations, or derived from actual system categories). Text search bar filters by name, description, or service names within systems.

---

## Data Displayed

- **Catalog grid card**: System icon, name, description (2 lines), category badge, industry tags, active project count
- **Detail panel - services**: Service name, description, type badge (automated/semi-automated/manual)
- **Detail panel - pricing**: Tier name, feature checklist, price per tier
- **Detail panel - metrics**: ROI %, implementation weeks, active projects count
- **Detail panel - adoption**: Project name, client name, project status, start date
- **Adoption chart**: System name (y-axis), active project count (x-axis bar)
- **Adoption trend**: Month (x-axis), new project count (y-axis, area chart) per system

---

## UI Components

| Component              | Description                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| `SystemCatalogGrid`    | Responsive grid of system cards with search and category filters          |
| `SystemCard`           | Individual system card with icon, name, description, stats               |
| `SystemDetailPanel`    | Slide-out right panel with full system information                        |
| `ServiceList`          | Scrollable list of services within a system detail panel                  |
| `PricingTierTable`     | Editable table showing pricing tiers with features and prices             |
| `UsageStatsChart`      | Horizontal bar chart (Recharts) ranking systems by project count          |
| `AdoptionTracker`      | Client/project list showing who uses each system                          |
| `AdoptionTrendChart`   | Small area chart showing monthly adoption within system detail            |
| `SystemForm`           | Modal form for creating/editing systems with all fields                   |
| `ServiceForm`          | Modal form for creating/editing services                                  |
| `CategoryFilter`       | Horizontal button group for filtering by system category                  |
| `SearchBar`            | Text input for filtering systems by name or description                   |
| `IndustryTag`          | Small pill-shaped tag showing industry fit (e.g., "Retail", "Healthcare") |
| `SystemActionMenu`     | Dropdown with Edit, Duplicate, Delete actions on system cards             |

---

## Layout Structure

```
+---------------------------------------------------------------+
| Sidebar (240px) | Main Content                                 |
|                 | +-------------------------------------------+ |
| [Navigation]    | | [Search Bar]            [+ Add System]    | |
|                 | | [All][Support][Sales][Analytics][Ops]     | |
|                 | +-------------------------------------------+ |
|                 | +-------------------------------------------+ |
|                 | | System Catalog Grid                       | |
|                 | | +--------+ +--------+ +--------+         | |
|                 | | | System | | System | | System |         | |
|                 | | | Card 1 | | Card 2 | | Card 3 |         | |
|                 | | +--------+ +--------+ +--------+         | |
|                 | | +--------+ +--------+ +--------+         | |
|                 | | | System | | System | | System |         | |
|                 | | | Card 4 | | Card 5 | | Card 6 |         | |
|                 | | +--------+ +--------+ +--------+         | |
|                 | +-------------------------------------------+ |
|                 | +-------------------------------------------+ |
|                 | | Adoption Tracker Chart (full width)       | |
|                 | | [System bars ranked by project count]     | |
|                 | +-------------------------------------------+ |
+---------------------------------------------------------------+

When a system card is clicked:
+---------------------------------------------------------------+
| Sidebar (240px) | Catalog (shrinks)    | Detail Panel (400px)  |
|                 | +------+ +------+   | System Name           |
|                 | |Card 1| |Card 2|   | Description...        |
|                 | +------+ +------+   | ---                   |
|                 | +------+ +------+   | Services:             |
|                 | |Card 3| |Card 4|   |  - Service A          |
|                 | +------+ +------+   |  - Service B          |
|                 |                      | ---                   |
|                 |                      | Pricing Tiers:        |
|                 |                      | Starter | Pro | Ent   |
|                 |                      | ---                   |
|                 |                      | Adoption: 12 projects |
|                 |                      | [project list]        |
+---------------------------------------------------------------+
```

- **Sidebar**: 240px, standard dashboard navigation
- **Main content**: Fills remaining width, max-width 1200px, centered
- **Catalog grid**: 3 columns (default), compresses to 2 when detail panel is open
- **Detail panel**: 400px slide-out from right, pushes grid content left
- **Adoption chart**: Full width below the grid
- **Background**: #F1EEEA, cards #FFFFFF, borders #D4CFC8

---

## Interaction Patterns

- **Click system card**: Detail panel slides in from the right (400px). Catalog grid compresses to accommodate. Click another card to switch. Click X or click outside to close.
- **Search systems**: Type in search bar -> catalog grid filters in real-time to systems matching the query by name, description, or component service names.
- **Filter by category**: Click category button -> grid filters to show only systems in that category. Multiple categories can be toggled simultaneously. "All" resets.
- **Add system**: Click "+ Add System" -> modal form opens -> fill name, description, category, industry tags, select component services, define pricing tiers -> save -> new card appears in grid.
- **Edit system**: Click "Edit" in detail panel -> fields become editable inline or modal form opens pre-filled -> save changes -> card and panel update.
- **Delete system**: Click "Delete" in detail panel -> confirmation dialog warns about impact on wizard recommendations -> confirm -> system removed from catalog.
- **Adoption chart click**: Click a bar in the adoption chart -> detail panel opens for that system.
- **Sort catalog**: Dropdown to sort by: Name (A-Z), Popularity (most projects), Newest, or Category.

---

## Example User Workflows

**Workflow 1: Reviewing the product catalog**
1. New consultant opens Services & Systems dashboard
2. Sees 8 system cards: Support Engine (12 projects), Cart Recovery (7), Growth Engine (6), Analytics Dashboard (4), AI Chatbot (3), Content Generator (0), Inventory Optimizer (2), Appointment Scheduler (1)
3. Clicks "Support Engine" -> detail panel shows 4 services, 3 pricing tiers (Starter $2,500, Pro $5,000, Enterprise $8,500)
4. Reviews the client adoption list to see which industries are using it most
5. Notes the 340% typical ROI for use in sales conversations
6. Clicks through several other systems to build product knowledge

**Workflow 2: Adding a new system**
1. Agency owner decides to offer a new "AI Email Marketing" system
2. Clicks "+ Add System"
3. Fills in: name "AI Email Marketing", description, category "Sales & Marketing", industry fit ["Retail", "E-commerce", "SaaS"]
4. Selects existing services: "Campaign Automation", "Subject Line Optimization"
5. Creates a new service: "Send Time Optimization" with type "automated"
6. Defines pricing tiers: Starter ($1,500), Professional ($3,000), Enterprise ($5,500)
7. Saves -> new card appears in the catalog grid
8. The wizard Step 3 recommendation engine will now include this system in its analysis

**Workflow 3: Identifying underperforming systems**
1. Agency owner reviews the adoption tracker chart
2. Sees "Content Generator" has 0 projects and "Appointment Scheduler" has only 1
3. Clicks "Content Generator" -> reviews the description and realizes it is too vague
4. Edits the description to be more specific about capabilities and use cases
5. Adds "Healthcare" and "Professional Services" to industry fit tags
6. Considers whether "Appointment Scheduler" should be a standalone system or merged into another system as a service component

---

## AI Features

1. **Recommendation engine tuning** — This dashboard shows how the wizard Step 3 recommendation engine uses the catalog data. A "Recommendation Stats" section shows how often each system is recommended by AI vs how often the client selects it, revealing recommendation-to-selection conversion rates. Systems with high recommendation but low selection may need better positioning.
2. **Popularity trends** — AI analyzes adoption data and surfaces trends: "Cart Recovery adoption grew 40% this quarter" or "Analytics Dashboard adoption has plateaued — consider refreshing the offering."
3. **Gap analysis** — AI identifies industry segments with no strong system offering: "You have no systems specifically targeting the Healthcare scheduling workflow. Consider creating an Appointment Management system."
4. **Pricing optimization suggestions** — Based on deal values and project margins, AI suggests pricing adjustments: "Support Engine Professional tier could increase to $5,500 based on client willingness-to-pay data from CRM deals."
5. **Cross-sell recommendations** — AI identifies system combinations frequently adopted together: "78% of clients using Support Engine also adopt Cart Recovery within 3 months. Consider bundling."

---

## Data Sources

| Source Table         | Data Used                                                           |
| -------------------- | ------------------------------------------------------------------- |
| `systems`            | System catalog: name, description, category, industry fit, metadata |
| `services`           | Service components: name, description, type                         |
| `system_services`    | Junction mapping systems to their component services                |
| `project_services`   | Adoption data: which projects use which services                    |
| `projects`           | Project metadata for adoption context: name, client_id, status      |
| `clients`            | Client names for adoption display                                   |
| `wizard_answers`     | Step 3 ai_results for recommendation vs selection analysis          |
| `crm_deals`          | Deal values for pricing optimization analysis                       |

---

## Automation Opportunities

- **Catalog sync to wizard**: When a system is added or edited, the wizard Step 3 recommendation engine automatically picks up the changes on the next session. No manual cache invalidation needed.
- **Adoption milestone alerts**: When a system reaches a milestone (e.g., 10th project, 25th project), notify the agency owner as a celebration and marketing opportunity.
- **Underperformance alerts**: If a system has been in the catalog for 30+ days with zero adoptions, automatically flag it for review.
- **Pricing review reminders**: Quarterly automated reminder to review pricing tiers with attached analytics (margin data, competitor benchmarks).
- **Service dependency check**: When deleting a service, automatically check for active projects using it and warn about the impact before allowing deletion.

---

## Visual Hierarchy

1. **Primary focus**: System catalog grid — the main visual area where users browse and discover systems
2. **Secondary focus**: System detail panel (when open) — rich information about a specific system occupying the right 400px
3. **Tertiary focus**: Adoption tracker chart — quantitative view of system popularity for strategic analysis
4. **Supporting elements**: Search bar, category filters, and add/edit actions — tools for managing the catalog
5. **Typography**: Playfair Display for "Services & Systems" page heading and system names (both in cards and detail panel). Lora for descriptions, service names, pricing details, and all body text.
6. **Color coding**: Category badges use consistent colors: Customer Support (blue), Sales & Marketing (#84CC16 lime), Analytics (teal), Operations (amber). Industry fit tags are gray (#D4CFC8 background, #0A211F text). Active project count uses #84CC16 when > 0, gray when 0.
7. **Card design**: White (#FFFFFF) cards with #D4CFC8 border on #F1EEEA background. Hover state adds #84CC16 top border accent. Selected card (detail panel open) has a persistent #84CC16 left border.
8. **Information density**: Low to medium — the catalog grid is visually clean with key info only. The detail panel is denser with comprehensive system data, but organized into clear sections with dividers.

---

## Frontend Wiring

### Component Tree

```
ServicesSystemsDashboardPage
├── div.flex.justify-between (top bar)
│   ├── SearchBar                                    # text filter on system name/description
│   └── Button "+ Add System"
├── CategoryFilter                                   # horizontal button group
│   └── CategoryButton[] (All, Customer Support, Sales & Marketing, Analytics, Operations)
├── SortDropdown                                     # Name A-Z, Popularity, Newest, Category
├── div.flex (main area — grid + optional detail panel)
│   ├── SystemCatalogGrid                            # responsive grid of cards
│   │   └── SystemCard[]
│   │       ├── SystemIcon (or colored initial circle)
│   │       ├── h3 (system name)                     # Playfair Display
│   │       ├── p (description, 2-line clamp)        # Lora
│   │       ├── CategoryBadge (colored pill)
│   │       ├── IndustryTag[] (gray pills)
│   │       ├── ProjectCountIndicator (bar + number)
│   │       └── SystemActionMenu (⋯ dropdown)
│   └── SystemDetailPanel (400px slide-out, conditional)
│       ├── PanelHeader (name + close button)
│       ├── FullDescription
│       ├── ServiceList
│       │   └── ServiceRow[] (name, description, type badge)
│       ├── PricingTierTable
│       │   └── TierRow[] (name, features checklist, price)
│       ├── MetricsRow (ROI %, impl weeks, active projects)
│       ├── AdoptionTracker
│       │   └── AdoptionRow[] (project name, client name, status badge)
│       ├── AdoptionTrendChart                       # Recharts AreaChart (small)
│       └── PanelActions (Edit, Duplicate, Delete)
├── UsageStatsChart                                  # Recharts BarChart (horizontal)
│   └── (full-width below the grid)
├── SystemForm (modal, for create/edit)
│   ├── NameInput
│   ├── DescriptionTextarea
│   ├── CategoryDropdown
│   ├── IndustryFitMultiSelect
│   ├── IconUploader
│   ├── ServiceSelector (multi-select from existing + create new)
│   └── PricingTierEditor (repeatable rows)
├── ServiceForm (modal, for create/edit service)
└── DeleteConfirmDialog
```

### TypeScript Interfaces

```typescript
interface SystemCatalogItem {
  id: string;
  name: string;
  description: string;
  category: string;
  industry_fit: string[];        // e.g. ["Retail", "E-commerce", "Healthcare"]
  icon_url: string | null;
  active_project_count: number;
  created_at: string;
  updated_at: string;
}

interface SystemDetail extends SystemCatalogItem {
  services: ServiceItem[];
  pricing_tiers: PricingTier[];
  typical_roi: number | null;          // percentage
  implementation_weeks: number | null;
  adoption: AdoptionRecord[];
  adoption_trend: AdoptionTrendPoint[];
  recommendation_stats: {
    recommended_count: number;
    selected_count: number;
    conversion_pct: number;
  } | null;
}

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  type: 'automated' | 'semi_automated' | 'manual';
  system_ids: string[];          // which systems include this service
}

interface PricingTier {
  id: string;
  name: string;                  // e.g. "Starter", "Professional", "Enterprise"
  features: string[];            // list of included features
  price: number;
}

interface AdoptionRecord {
  project_id: string;
  project_name: string;
  client_name: string;
  project_status: string;
  start_date: string;
}

interface AdoptionTrendPoint {
  month: string;                 // YYYY-MM
  new_projects: number;
}

interface SystemFormData {
  name: string;
  description: string;
  category: string;
  industry_fit: string[];
  icon_url: string | null;
  service_ids: string[];
  pricing_tiers: Omit<PricingTier, 'id'>[];
  typical_roi: number | null;
  implementation_weeks: number | null;
}

type SortOption = 'name_asc' | 'popularity' | 'newest' | 'category';
```

### Custom Hooks

```typescript
// Fetches the system catalog with filtering and sorting
function useSystemCatalog(filters: {
  search: string;
  category: string | null;
  sort: SortOption;
}): {
  systems: SystemCatalogItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

// Fetches full detail for a single system (on card click)
function useSystemDetail(systemId: string | null): {
  detail: SystemDetail | null;
  loading: boolean;
  error: string | null;
};

// CRUD operations for systems
function useSystemMutations(): {
  createSystem: (data: SystemFormData) => Promise<SystemCatalogItem>;
  updateSystem: (id: string, data: Partial<SystemFormData>) => Promise<void>;
  deleteSystem: (id: string) => Promise<void>;
  duplicateSystem: (id: string) => Promise<SystemCatalogItem>;
  loading: boolean;
};

// CRUD operations for services
function useServiceMutations(): {
  createService: (data: Omit<ServiceItem, 'id' | 'system_ids'>) => Promise<ServiceItem>;
  updateService: (id: string, data: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  loading: boolean;
};

// Fetches all services (for the multi-select in SystemForm)
function useServicesList(): {
  services: ServiceItem[];
  loading: boolean;
};

// Fetches adoption stats for the full-width bar chart
function useAdoptionStats(): {
  stats: { system_name: string; active_project_count: number }[];
  loading: boolean;
};
```

### State Management

| State                  | Location          | Notes                                                               |
| ---------------------- | ----------------- | ------------------------------------------------------------------- |
| `searchQuery`          | `useState`        | Debounced text input (300ms) — filters catalog grid                  |
| `activeCategory`       | `useState`        | Selected category filter button; `null` = "All"                      |
| `sortOption`           | `useState`        | Current sort: `'name_asc'` default                                   |
| `selectedSystemId`     | `useState`        | Which system card is selected — controls `SystemDetailPanel` slide-out |
| `formModalOpen`        | `useState`        | Controls `SystemForm` modal (create or edit mode)                    |
| `editingSystemId`      | `useState`        | If set, `SystemForm` is in edit mode with pre-filled data            |
| `serviceFormOpen`      | `useState`        | Controls `ServiceForm` modal                                         |
| `deleteConfirmId`      | `useState`        | Which system is pending deletion — controls `DeleteConfirmDialog`    |

### Data Fetching Pattern

All hooks call the `api<T>()` helper from `src/lib/supabase.ts`:

```typescript
// useSystemCatalog
api<SystemCatalogItem[]>('/dashboard/systems/catalog', {
  method: 'POST',
  body: { search, category, sort },
});

// useSystemDetail
api<SystemDetail>(`/dashboard/systems/${systemId}`);

// useSystemMutations — create
api<SystemCatalogItem>('/dashboard/systems/create', {
  method: 'POST',
  body: formData,
});

// useSystemMutations — update
api<void>(`/dashboard/systems/${id}`, {
  method: 'PUT',
  body: partialData,
});

// useSystemMutations — delete
api<void>(`/dashboard/systems/${id}`, {
  method: 'DELETE',
});

// useServicesList
api<ServiceItem[]>('/dashboard/services');

// useAdoptionStats
api<{ system_name: string; active_project_count: number }[]>(
  '/dashboard/systems/adoption-stats'
);
```

Each hook fetches on mount and when filter/sort dependencies change. Mutations trigger `refetch()` on the catalog hook. `useSystemDetail` fetches when `selectedSystemId` changes.

### Component Communication

- `SearchBar` updates `searchQuery` state via debounced `onChange`; `useSystemCatalog` re-fetches when query stabilizes.
- `CategoryFilter` sets `activeCategory`; `useSystemCatalog` re-fetches.
- `SortDropdown` sets `sortOption`; `useSystemCatalog` re-fetches.
- `SystemCard` fires `onClick(systemId)` — sets `selectedSystemId`, causing `SystemDetailPanel` to slide in. Catalog grid compresses from 3 columns to 2.
- `SystemDetailPanel` close button clears `selectedSystemId`; grid restores to 3 columns.
- `SystemActionMenu` "Edit" sets `editingSystemId` + `formModalOpen=true`; "Delete" sets `deleteConfirmId`.
- `SystemForm` `onSubmit` calls `createSystem` or `updateSystem`, then triggers `refetch()` on catalog.
- `UsageStatsChart` bar `onClick(systemName)` sets `selectedSystemId` to that system, opening the detail panel.
- `PanelActions` "Duplicate" calls `duplicateSystem`, then `refetch()`.

---

## Backend Wiring

### New Edge Function Routes

| Method | Route                                    | Description                                     | Request Body                                                               | Response Shape                               |
| ------ | ---------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------- |
| POST   | `/dashboard/systems/catalog`             | List systems with search, category, sort        | `{ search?, category?, sort }`                                             | `SystemCatalogItem[]`                        |
| GET    | `/dashboard/systems/:id`                 | Full system detail (services, pricing, adoption) | -                                                                          | `SystemDetail`                               |
| POST   | `/dashboard/systems/create`              | Create a new system                             | `{ name, description, category, industry_fit, service_ids, pricing_tiers }`| `{ system: SystemCatalogItem }`              |
| PUT    | `/dashboard/systems/:id`                 | Update a system                                 | `{ name?, description?, category?, industry_fit?, pricing_tiers? }`        | `{ system: SystemCatalogItem }`              |
| DELETE | `/dashboard/systems/:id`                 | Delete a system (with dependency check)         | -                                                                          | `{ success: boolean }`                       |
| POST   | `/dashboard/systems/:id/duplicate`       | Duplicate a system with "(Copy)" suffix         | -                                                                          | `{ system: SystemCatalogItem }`              |
| GET    | `/dashboard/services`                    | List all services                               | -                                                                          | `ServiceItem[]`                              |
| POST   | `/dashboard/services/create`             | Create a new service                            | `{ name, description, type }`                                              | `{ service: ServiceItem }`                   |
| PUT    | `/dashboard/services/:id`                | Update a service                                | `{ name?, description?, type? }`                                           | `{ service: ServiceItem }`                   |
| DELETE | `/dashboard/services/:id`                | Delete a service (with active project check)    | -                                                                          | `{ success: boolean }`                       |
| GET    | `/dashboard/systems/adoption-stats`      | System adoption bar chart data                  | -                                                                          | `{ system_name, active_project_count }[]`    |

### Supabase Client Queries

```typescript
// ── System catalog with search and category ──
let query = adminClient()
  .from('systems')
  .select('id, name, description, category, industry_fit, icon_url, created_at, updated_at');

if (search) {
  query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
}
if (category) {
  query = query.eq('category', category);
}

// Sort
switch (sort) {
  case 'name_asc': query = query.order('name'); break;
  case 'newest':   query = query.order('created_at', { ascending: false }); break;
  case 'category': query = query.order('category').order('name'); break;
  // 'popularity' handled after fetching project counts
}

// ── Active project count per system ──
// Join through system_services -> project_services -> projects
const { data: adoption } = await adminClient()
  .from('system_services')
  .select('system_id, service_id, project_services(project_id, projects(status))')
  .eq('project_services.projects.status', 'active');
// Aggregate: group by system_id, count distinct project_id

// ── System detail: services ──
const { data: services } = await adminClient()
  .from('system_services')
  .select('services(id, name, description, type)')
  .eq('system_id', systemId);

// ── System detail: client adoption list ──
const { data: adoptionList } = await adminClient()
  .from('system_services')
  .select('service_id')
  .eq('system_id', systemId);

const serviceIds = adoptionList.map(r => r.service_id);

const { data: projects } = await adminClient()
  .from('project_services')
  .select('projects(id, name, status, created_at, clients(name))')
  .in('service_id', serviceIds);
// Deduplicate by project_id

// ── Adoption trend (monthly new projects for a system) ──
const { data: trendData } = await adminClient()
  .from('project_services')
  .select('projects(created_at)')
  .in('service_id', serviceIds);
// Bucket by month in JS

// ── Recommendation stats from wizard ──
const { data: wizardAnswers } = await adminClient()
  .from('wizard_answers')
  .select('ai_results')
  .eq('step', 3);
// Parse each ai_results to count how many times this system was recommended vs selected

// ── Create system ──
const { data: newSystem } = await adminClient()
  .from('systems')
  .insert({ name, description, category, industry_fit, icon_url })
  .select()
  .single();

// Link services via junction
const junctionRows = service_ids.map(sid => ({
  system_id: newSystem.id,
  service_id: sid,
}));
await adminClient().from('system_services').insert(junctionRows);

// ── Update system ──
const { data } = await adminClient()
  .from('systems')
  .update({ name, description, category, industry_fit })
  .eq('id', systemId)
  .select()
  .single();

// ── Delete system (with dependency check) ──
const { count: activeProjects } = await adminClient()
  .from('project_services')
  .select('id', { count: 'exact', head: true })
  .in('service_id', serviceIdsForSystem)
  .eq('projects.status', 'active');

if (activeProjects > 0) {
  throw new Error(`Cannot delete: ${activeProjects} active projects use this system`);
}

await adminClient().from('system_services').delete().eq('system_id', systemId);
await adminClient().from('systems').delete().eq('id', systemId);

// ── Create service ──
const { data: newService } = await adminClient()
  .from('services')
  .insert({ name, description, type })
  .select()
  .single();

// ── Delete service (with active project check) ──
const { count: usingProjects } = await adminClient()
  .from('project_services')
  .select('id', { count: 'exact', head: true })
  .eq('service_id', serviceId);

if (usingProjects > 0) {
  throw new Error(`Cannot delete: ${usingProjects} projects use this service`);
}

await adminClient().from('system_services').delete().eq('service_id', serviceId);
await adminClient().from('services').delete().eq('id', serviceId);
```

### RLS Policies Needed

| Table              | Policy Name                | Rule                                                                           |
| ------------------ | -------------------------- | ------------------------------------------------------------------------------ |
| `systems`          | `agency_read_all`          | Allow SELECT for all authenticated users (catalog is public within the app)    |
| `systems`          | `admin_write`              | Allow INSERT/UPDATE/DELETE where `auth.jwt()->>'role' IN ('owner', 'admin')`   |
| `services`         | `agency_read_all`          | Allow SELECT for all authenticated users                                       |
| `services`         | `admin_write`              | Allow INSERT/UPDATE/DELETE where `auth.jwt()->>'role' IN ('owner', 'admin')`   |
| `system_services`  | `agency_read_all`          | Allow SELECT for all authenticated users                                       |
| `system_services`  | `admin_write`              | Allow INSERT/DELETE where `auth.jwt()->>'role' IN ('owner', 'admin')`          |
| `project_services` | (existing policies apply)  | Read access for project members; write for consultants                         |

Note: Catalog is readable by all agency roles (including consultants who need product knowledge). Write operations (create/edit/delete systems and services) are restricted to owner and admin roles.

### API Response TypeScript Interfaces

```typescript
interface SystemCatalogResponse {
  systems: SystemCatalogItem[];
}

interface SystemDetailResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  industry_fit: string[];
  icon_url: string | null;
  active_project_count: number;
  created_at: string;
  updated_at: string;
  services: ServiceItem[];
  pricing_tiers: PricingTier[];
  typical_roi: number | null;
  implementation_weeks: number | null;
  adoption: AdoptionRecord[];
  adoption_trend: AdoptionTrendPoint[];
  recommendation_stats: {
    recommended_count: number;
    selected_count: number;
    conversion_pct: number;
  } | null;
}

interface CreateSystemResponse {
  system: SystemCatalogItem;
}

interface DeleteSystemResponse {
  success: boolean;
}

interface AdoptionStatsResponse {
  stats: { system_name: string; active_project_count: number }[];
}
```

### Edge Cases

| Scenario                                  | Handling                                                                                           |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| No systems in catalog                     | Empty grid with "No systems yet. Add your first AI system." CTA button                             |
| Search returns no results                 | Grid shows "No systems match your search" with clear filter button                                  |
| Delete system with active projects        | Server rejects with error; UI shows "Cannot delete: X active projects use this system"              |
| Delete service with active projects       | Server rejects with error; similar message                                                          |
| System with no services                   | Detail panel shows services section with "No services assigned. Add services to this system." link   |
| System with no pricing tiers              | Detail panel shows pricing section with "No pricing defined. Add pricing tiers." link                |
| Duplicate system                          | Creates copy with name "{original} (Copy)" and all services/pricing cloned; adoption data not copied |
| Category filter returns empty             | Show "No systems in this category" with option to view all                                          |
| wizard_answers Step 3 not parseable       | Recommendation stats show "N/A" instead of numbers                                                  |
| Concurrent edit (two admins editing)      | Last write wins; no real-time collaboration needed for this low-frequency admin task                 |

---

## Detailed ASCII Wireframes

### Desktop Layout (1200px max-width) — Grid View (no detail panel)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER BAR (sticky, 56px)                                                                       │
│  Sun AI Agency          Dashboard  Projects  Clients  ...                         [Avatar ▾]    │
├────────────┬────────────────────────────────────────────────────────────────────────────────────┤
│            │                                                                                    │
│  SIDEBAR   │  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│  (240px)   │  │  Services & Systems                                                          │  │
│            │  │  ┌─────────────────────────────────┐                    [+ Add System]        │  │
│ ┌────────┐ │  │  │ 🔍 Search systems...            │   [Sort: Name A-Z ▾]                    │  │
│ │Overview│ │  │  └─────────────────────────────────┘                                         │  │
│ ├────────┤ │  │  [All] [Customer Support] [Sales & Marketing] [Analytics] [Operations]       │  │
│ │Pipeline│ │  └──────────────────────────────────────────────────────────────────────────────┘  │
│ ├────────┤ │                                                                                    │
│ │Projects│ │  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│ ├────────┤ │  │                                                                              │  │
│ │CRM     │ │  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐           │  │
│ ├────────┤ │  │  │ 🤖                │  │ 🛒                │  │ 📈                │           │  │
│ │Finance │ │  │  │ Support Engine    │  │ Cart Recovery    │  │ Growth Engine    │           │  │
│ ├────────┤ │  │  │ AI-powered custom │  │ Recover abandon- │  │ Data-driven grow │           │  │
│ │Analytics│ │  │  │ er support auto.. │  │ ed carts with..  │  │ th engine for..  │           │  │
│ ├────────┤ │  │  │                   │  │                   │  │                   │           │  │
│ │Roadmap │ │  │  │ ┌───────────────┐ │  │ ┌───────────────┐ │  │ ┌───────────────┐ │           │  │
│ ├────────┤ │  │  │ │ Support   ●   │ │  │ │ Sales     ●   │ │  │ │ Sales     ●   │ │           │  │
│ │▸Systems│ │  │  │ └───────────────┘ │  │ └───────────────┘ │  │ └───────────────┘ │           │  │
│ └────────┘ │  │  │ Retail E-comm     │  │ Retail E-comm     │  │ Retail SaaS       │           │  │
│            │  │  │ ████████████ 12   │  │ █████████ 7       │  │ ████████ 6        │           │  │
│            │  │  │              [⋯]  │  │              [⋯]  │  │              [⋯]  │           │  │
│            │  │  └──────────────────┘  └──────────────────┘  └──────────────────┘           │  │
│            │  │                                                                              │  │
│            │  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐           │  │
│            │  │  │ 📊                │  │ 💬                │  │ ✏️                │           │  │
│            │  │  │ Analytics Dash   │  │ AI Chatbot       │  │ Content Generator│           │  │
│            │  │  │ Business intelli │  │ Conversational   │  │ AI-powered conte │           │  │
│            │  │  │ gence and data.. │  │ AI for custom..  │  │ nt creation for. │           │  │
│            │  │  │                   │  │                   │  │                   │           │  │
│            │  │  │ ┌───────────────┐ │  │ ┌───────────────┐ │  │ ┌───────────────┐ │           │  │
│            │  │  │ │ Analytics ●   │ │  │ │ Support   ●   │ │  │ │ Sales     ●   │ │           │  │
│            │  │  │ └───────────────┘ │  │ └───────────────┘ │  │ └───────────────┘ │           │  │
│            │  │  │ All industries    │  │ Healthcare Retail │  │ Retail SaaS       │           │  │
│            │  │  │ █████ 4           │  │ ████ 3            │  │ 0                 │           │  │
│            │  │  │              [⋯]  │  │              [⋯]  │  │              [⋯]  │           │  │
│            │  │  └──────────────────┘  └──────────────────┘  └──────────────────┘           │  │
│            │  │                                                                              │  │
│            │  └──────────────────────────────────────────────────────────────────────────────┘  │
│            │                                                                                    │
│            │  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│            │  │ System Adoption Tracker                                                      │  │
│            │  │ ┌──────────────────────────────────────────────────────────────────────────┐ │  │
│            │  │ │ Support Engine    ████████████████████████ 12                             │ │  │
│            │  │ │ Cart Recovery     ██████████████ 7                                        │ │  │
│            │  │ │ Growth Engine     ████████████ 6                                          │ │  │
│            │  │ │ Analytics Dash    ████████ 4                                              │ │  │
│            │  │ │ AI Chatbot        ██████ 3                                                │ │  │
│            │  │ │ Inventory Opt     ████ 2                                                  │ │  │
│            │  │ │ Appt Scheduler    ██ 1                                                    │ │  │
│            │  │ │ Content Generator ░ 0                                                     │ │  │
│            │  │ └──────────────────────────────────────────────────────────────────────────┘ │  │
│            │  └──────────────────────────────────────────────────────────────────────────────┘  │
│            │                                                                                    │
├────────────┴────────────────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Desktop Layout — With Detail Panel Open (400px)

```
┌────────────┬──────────────────────────────────────────┬──────────────────────────────────────────┐
│  SIDEBAR   │  Catalog Grid (shrinks to ~560px)        │  System Detail Panel (400px)              │
│  (240px)   │                                          │                                          │
│            │  ┌────────────┐  ┌────────────┐         │  Support Engine                     [✕]  │
│            │  │ 🤖          │  │ 🛒          │         │  ─────────────────────────────────────── │
│            │  │ Support     │  │ Cart        │         │  AI-powered customer support              │
│            │  │ Engine      │  │ Recovery    │         │  automation including ticket routing,     │
│            │  │ ██████  12  │  │ ████ 7      │         │  auto-reply, FAQ bots, and escalation     │
│            │  │  ← selected │  │             │         │  management.                              │
│            │  │  #84CC16    │  │             │         │                                          │
│            │  │  left border│  │             │         │  Category: Customer Support               │
│            │  └────────────┘  └────────────┘         │  Industries: Retail, E-commerce,           │
│            │                                          │             Healthcare                    │
│            │  ┌────────────┐  ┌────────────┐         │                                          │
│            │  │ 📈          │  │ 📊          │         │  ── Services (4) ────────────────────── │
│            │  │ Growth      │  │ Analytics   │         │  ┌─────────────────────────────────────┐ │
│            │  │ Engine      │  │ Dashboard   │         │  │ Ticket Routing          automated  │ │
│            │  │ ██████ 6    │  │ ████ 4      │         │  │ Auto-Reply System       automated  │ │
│            │  └────────────┘  └────────────┘         │  │ FAQ Bot                  automated  │ │
│            │                                          │  │ Escalation Mgmt    semi_automated   │ │
│            │  ← 2 columns when panel open →           │  └─────────────────────────────────────┘ │
│            │                                          │                                          │
│            │                                          │  ── Pricing Tiers ───────────────────── │
│            │                                          │  ┌────────┬──────────────┬────────────┐ │
│            │                                          │  │Starter │ Professional │ Enterprise │ │
│            │                                          │  ├────────┼──────────────┼────────────┤ │
│            │                                          │  │$2,500  │ $5,000       │ $8,500     │ │
│            │                                          │  │ ✓ FAQ  │ ✓ FAQ        │ ✓ FAQ      │ │
│            │                                          │  │ ✓ Route│ ✓ Route      │ ✓ Route    │ │
│            │                                          │  │        │ ✓ Auto-reply │ ✓ Auto-rep │ │
│            │                                          │  │        │              │ ✓ Escalat. │ │
│            │                                          │  └────────┴──────────────┴────────────┘ │
│            │                                          │                                          │
│            │                                          │  ── Metrics ──────────────────────────  │
│            │                                          │  ROI: 340%  ·  Impl: 3 weeks  ·  12 prj │
│            │                                          │                                          │
│            │                                          │  ── Client Adoption (12) ────────────── │
│            │                                          │  Acme Retail     AI Transform    active  │
│            │                                          │  TechFlow        Support Setup   active  │
│            │                                          │  BrightPath      Phase 1         active  │
│            │                                          │  ... 9 more                              │
│            │                                          │                                          │
│            │                                          │  ── Adoption Trend ───────────────────  │
│            │                                          │  ┌─────────────────────────────────────┐ │
│            │                                          │  │  4─     ╱╲                          │ │
│            │                                          │  │  2─ ╱╲╱╯  ╲╱╲                      │ │
│            │                                          │  │  0─╯          ╲                     │ │
│            │                                          │  │    J  F  M  A  M  J                 │ │
│            │                                          │  └─────────────────────────────────────┘ │
│            │                                          │                                          │
│            │                                          │  [Edit]  [Duplicate]  [Delete]           │
│            │                                          │                                          │
└────────────┴──────────────────────────────────────────┴──────────────────────────────────────────┘
```

### Tablet Layout (768px)

```
┌─────────────────────────────────────────────────────┐
│ HEADER (56px)               [☰ Menu]    [Avatar ▾]  │
├─────────────────────────────────────────────────────┤
│ Services & Systems                 [+ Add System]   │
│ ┌──────────────────────────────────────────────┐    │
│ │ 🔍 Search systems...                         │    │
│ └──────────────────────────────────────────────┘    │
│ [All][Support][Sales][Analytics][Ops] [Sort ▾]      │
├─────────────────────────────────────────────────────┤
│ ┌───────────────────┐ ┌───────────────────┐         │
│ │ 🤖 Support Engine  │ │ 🛒 Cart Recovery   │         │
│ │ AI-powered custo- │ │ Recover abandoned │         │
│ │ mer support auto..│ │ carts with AI..   │         │
│ │ Support ●         │ │ Sales ●           │         │
│ │ Retail E-comm     │ │ Retail E-comm     │         │
│ │ ████████████ 12   │ │ █████████ 7       │         │
│ └───────────────────┘ └───────────────────┘         │
│ ┌───────────────────┐ ┌───────────────────┐         │
│ │ 📈 Growth Engine   │ │ 📊 Analytics Dash  │         │
│ │ Data-driven grow- │ │ Business intelli- │         │
│ │ th engine for..   │ │ gence and data..  │         │
│ │ Sales ●           │ │ Analytics ●       │         │
│ │ ████████ 6        │ │ █████ 4           │         │
│ └───────────────────┘ └───────────────────┘         │
│  ← 2 column grid →                                 │
├─────────────────────────────────────────────────────┤
│ On card click → full-screen detail overlay          │
│ (no side panel — detail takes full width)           │
├─────────────────────────────────────────────────────┤
│ Adoption Tracker (full width)                       │
│ Support    ████████████████████████ 12               │
│ Cart       ██████████████ 7                          │
│ Growth     ████████████ 6                            │
└─────────────────────────────────────────────────────┘
```

### Mobile Layout (375px)

```
┌───────────────────────────────────┐
│ HEADER             [☰]  [Avatar] │
├───────────────────────────────────┤
│ Services & Systems                │
│ ┌───────────────────────────────┐ │
│ │ 🔍 Search...                   │ │
│ └───────────────────────────────┘ │
│ [All][Support][Sales][Analytics]  │
│ ← horizontally scrollable pills → │
│                   [+ Add] [Sort▾] │
├───────────────────────────────────┤
│ ┌───────────────────────────────┐ │
│ │ 🤖 Support Engine              │ │
│ │ AI-powered customer support   │ │
│ │ automation including...       │ │
│ │ ┌───────────┐                 │ │
│ │ │ Support ● │ Retail E-comm   │ │
│ │ └───────────┘                 │ │
│ │ ████████████████████████ 12   │ │
│ └───────────────────────────────┘ │
│ ┌───────────────────────────────┐ │
│ │ 🛒 Cart Recovery               │ │
│ │ Recover abandoned carts with  │ │
│ │ AI-powered reminders...       │ │
│ │ ┌───────────┐                 │ │
│ │ │ Sales   ● │ Retail E-comm   │ │
│ │ └───────────┘                 │ │
│ │ ██████████████████ 7          │ │
│ └───────────────────────────────┘ │
│  ← single column, full-width →   │
│  (more cards below...)            │
├───────────────────────────────────┤
│ On card tap → full-screen detail  │
│ page with back arrow              │
├───────────────────────────────────┤
│ Adoption Tracker                  │
│ Support ████████████████ 12       │
│ Cart    ██████████ 7              │
│ Growth  ████████ 6                │
│ (horizontally scrollable)         │
└───────────────────────────────────┘
```

### Key Component Detail: System Card

```
┌──────────────────────────────────────┐
│  🤖                            [⋯]  │   ← icon (40px circle), action menu
│                                      │
│  Support Engine                      │   ← Playfair Display, 18px, #0A211F
│  AI-powered customer support         │   ← Lora, 14px, #6B7280
│  automation including ticket...      │      2-line clamp with ellipsis
│                                      │
│  ┌───────────────────┐              │   ← category badge pill
│  │ Customer Support ● │              │      bg: #DBEAFE, text: #1E40AF
│  └───────────────────┘              │
│                                      │
│  Retail  E-commerce  Healthcare      │   ← industry tags, small gray pills
│                                      │      bg: #D4CFC8, text: #0A211F
│                                      │
│  ████████████████████████ 12 projects│   ← project count bar
│                                      │      bar: #84CC16 if > 0, #D4CFC8 if 0
└──────────────────────────────────────┘
  ~350px wide × 260px tall
  bg: #FFFFFF, border: 1px #D4CFC8
  Hover: top border changes to #84CC16
  Selected: left border 3px #84CC16
```

### Key Component Detail: Add/Edit System Modal

```
┌─────────────────────────────────────────────────┐
│  Add New System                            [✕]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  System Name *                                  │
│  ┌─────────────────────────────────────────┐    │
│  │ AI Email Marketing                      │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Description *                                  │
│  ┌─────────────────────────────────────────┐    │
│  │ AI-powered email marketing automation   │    │
│  │ for personalized campaigns, optimized   │    │
│  │ send times, and subject line testing.   │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Category *            [Sales & Marketing  ▾]   │
│                                                 │
│  Industry Fit          [Retail ✕] [E-comm ✕]    │
│                        [SaaS ✕] [+ Add]         │
│                                                 │
│  Icon                  [Upload] or [Choose]     │
│                                                 │
│  ── Component Services ──────────────────────── │
│  ☑ Campaign Automation                          │
│  ☑ Subject Line Optimization                    │
│  ☐ A/B Testing                                  │
│  ☐ Audience Segmentation                        │
│  [+ Create New Service]                         │
│                                                 │
│  ── Pricing Tiers ───────────────────────────── │
│  Tier Name      Features               Price    │
│  ┌────────────┬──────────────────┬────────────┐ │
│  │ Starter    │ Campaign Auto    │ $1,500     │ │
│  ├────────────┼──────────────────┼────────────┤ │
│  │ Profession │ Campaign Auto,   │ $3,000     │ │
│  │            │ Subject Opt      │            │ │
│  ├────────────┼──────────────────┼────────────┤ │
│  │ Enterprise │ All features     │ $5,500     │ │
│  └────────────┴──────────────────┴────────────┘ │
│  [+ Add Tier]                                   │
│                                                 │
│  ┌──────────────────┐ ┌──────────────────────┐  │
│  │     Cancel       │ │    Save System  →    │  │
│  └──────────────────┘ └──────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## Outcomes

| Outcome                                  | Metric                                            | Target           |
| ---------------------------------------- | ------------------------------------------------- | ---------------- |
| Catalog completeness                     | Systems with full description, services, and pricing | 100%             |
| Consultant product knowledge             | Time for new consultant to review full catalog      | < 30 minutes     |
| System utilization                       | Systems with at least 1 active project              | > 80%            |
| Recommendation-to-selection rate         | Wizard Step 3 recommendations that clients accept   | > 60%            |
| Catalog freshness                        | Systems updated in the last 90 days                 | > 90%            |
| Pricing review cadence                   | Pricing reviewed and confirmed per quarter           | 100% of systems  |
