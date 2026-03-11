---
id: 026-client-management-dashboard
diagram_id: DASH-02
prd_section: Dashboard
title: Client management dashboard — CRM contacts, profiles, and engagement tracking
skill: frontend
phase: HIGH
priority: P1
status: Not Started
owner: Frontend
dependencies:
  - 025-dashboard-overview
estimated_effort: L
percent_complete: 0
area: agency-dashboard
wizard_step: null
schema_tables: [clients, crm_contacts, organizations, projects, wizard_sessions, activities]
figma_prompt: prompts/026-client-management-dashboard.md
---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screens** | Client Management (`/app/clients`) |
| **Features** | Client table with search/filter, detail panel, wizard progress tracking, health scores, bulk actions |
| **Edge Functions** | assistant (client health scoring) |
| **Tables** | clients, crm_contacts, organizations, projects, wizard_sessions, activities |
| **Agents** | assistant (gemini-3-flash-preview, low thinking) |
| **Real-World** | "Agency owner reviews 12 active clients, sorts by last activity to find disengaged clients, clicks one to see wizard abandoned at Step 3" |

---

## Description

**The situation:** The agency manages multiple client organizations, each at different stages of the wizard and project delivery. There is no centralized view of all clients — their status, engagement level, wizard progress, or project health. Consultants must check individual wizard sessions and projects manually to understand where each client stands.

**Why it matters:** Without a client management view, the agency cannot prioritize outreach, identify at-risk clients, or manage the sales-to-delivery pipeline. A client who abandoned the wizard at Step 3 looks identical to one who completed it and has an active project. The agency loses revenue from clients who disengage without follow-up.

**What already exists:** The `clients` table stores client records with status and industry fields. The `crm_contacts` table has contact details (email, phone, role). The `organizations` table links clients to their org context. The `wizard_sessions` table tracks wizard completion status per session. The `projects` table shows active project counts. The `activities` table logs engagement events. shadcn/ui provides Table, Badge, Sheet (slide-out panel), Input, Select, and Button components.

**The build:** Create a `ClientManagement` page at `/app/clients` with a full-width data table as the primary view. The table shows client name, primary contact, industry, status badge, wizard progress dots (1-5), active project count, last activity date, and assigned consultant. A search bar and filter chips (by status, industry, tier) sit above the table. Clicking a row opens a slide-out detail panel (Sheet component) showing full client profile, engagement timeline, wizard step-by-step progress, and linked projects. Bulk actions (export, assign consultant, change status) operate on selected rows.

**Example:** Apex Marketing Agency manages 18 clients. The agency owner opens `/app/clients` and sees the full table. She filters by status "Active" (12 results), then sorts by "Last Activity" ascending. The bottom 3 clients haven't logged in for 2+ weeks. She clicks "TechNova Solutions" — the detail panel slides out showing: wizard completed Step 1-4 but abandoned at Step 5 (no project created), last activity "Wizard Step 4 completed" 16 days ago, primary contact sarah@technova.com. She selects the row and clicks "Assign Consultant" to route a follow-up to her senior consultant.

---

## Rationale

**Problem:** Agency has no single view of all clients with their engagement status, wizard progress, and project health. Manual tracking leads to missed follow-ups and lost revenue.

**Solution:** A master-detail client table with filtering, sorting, wizard progress indicators, and a slide-out detail panel. Integrates wizard_sessions data to show exactly where each client is in the journey.

**Impact:** Agency can identify disengaged clients within seconds, route follow-ups, and manage the full client lifecycle from lead through delivery.

---

## Screen Purpose

Agency-side view for managing all client organizations. Shows client list with status, engagement level, project progress, and wizard completion status. Links each client to their wizard session data and active projects. Serves as the operational hub for agency team to manage the client portfolio.

---

## Target User

- Agency owners overseeing the full client portfolio
- Agency consultants managing assigned client relationships
- Business development team tracking leads through the wizard funnel

---

## Core Features

1. Client list table with search, filter by status/industry/tier
2. Client detail slide-out panel with contact info, engagement timeline
3. Client status badges: Lead, Active, Onboarding, Delivered, Churned
4. Wizard completion indicator per client (which steps completed, 5 dots)
5. Quick-add client form (inline or modal)
6. Client health score derived from activity frequency + milestone completion rate
7. Bulk actions: export CSV, assign consultant, change status
8. Column sorting on all data columns
9. Pagination with configurable page size (10, 25, 50)

---

## Data Displayed

- Client name (from clients table)
- Primary contact name, email, phone (from crm_contacts)
- Industry vertical (from clients or organizations)
- Company size / employee count
- Client status badge (Lead, Active, Onboarding, Delivered, Churned)
- Wizard progress (5 dots showing completed steps from wizard_sessions + wizard_answers)
- Active project count (from projects where client_id matches)
- Last activity date (most recent from activities table)
- Assigned consultant name (from team_members)
- Total contract revenue (from projects or invoices)
- Client health score (computed: activity frequency + milestone completion)

---

## UI Components

- `ClientTable` — full-width data table with sortable columns, row selection checkboxes
- `ClientDetailPanel` — Sheet (slide-out right) with tabbed sections: Overview, Contacts, Projects, Activity
- `ClientStatusBadge` — color-coded badge (Lead=gray, Active=green, Onboarding=blue, Delivered=teal, Churned=red)
- `WizardProgressDots` — 5 small circles, filled for completed steps, outlined for incomplete
- `ClientHealthScore` — small gauge or colored number (green >80, yellow 50-80, red <50)
- `QuickAddClientForm` — modal form with name, email, industry, status fields
- `FilterBar` — search input + filter chip selects (status, industry, consultant)
- `BulkActionToolbar` — appears when rows selected, shows action buttons
- `EngagementTimeline` — vertical timeline of activities for a specific client

---

## Layout Structure

```
+-----------------------------------------------------+
| Sidebar (240px)  |  Main Content (flex-1)            |
|                  |                                    |
| * Dashboard      |  Client Management                |
| * Projects       |  [Search...] [Status v] [Ind. v]  |
| * CRM  <--       |  +-------------------------------+ |
| * AI Insights    |  | Name | Contact | Status | Wiz | |
| * Documents      |  |------|---------|--------|-----| |
| * Financial      |  | Acme | john@.. | Active | *** | |
| * Settings       |  | Tech | sara@.. | Lead   | **  | |
|                  |  | Green| mike@.. | Onbd   |*****| |
|                  |  +-------------------------------+ |
|                  |  [< 1 2 3 ... 5 >]  Showing 1-10  |
|                  |                                    |
|                  |  +------ Detail Panel (400px) ---+ |
|                  |  | Client: Acme Retail            | |
|                  |  | Status: Active                 | |
|                  |  | [Overview][Contacts][Projects]  | |
|                  |  | ...                            | |
|                  |  +-------------------------------+ |
+-----------------------------------------------------+
```

- Main content: full-width table with `max-w-[1200px]` constraint
- Detail panel: 400px Sheet sliding from right, overlays content
- Filter bar: sticky below page header
- Table rows: 56px height, hover state `#F1EEEA`
- Cards: `#FFFFFF` background, `#D4CFC8` border, 8px radius

---

## Interaction Patterns

- Row click -> slide-out detail panel from right (Sheet component)
- Double-click row -> navigate to full client page (`/app/clients/:id`)
- Filter chips stack horizontally, click to toggle, "x" to remove
- Sort by any column header (click toggles asc/desc, indicator arrow)
- Checkbox on each row for multi-select, "Select All" in header
- Bulk action toolbar appears when 1+ rows selected (fixed bottom bar)
- Search input debounces 300ms, filters client name and contact email
- Quick-add button opens modal form, submit creates client + optional crm_contact
- Detail panel tabs: Overview (profile + wizard progress), Contacts (all crm_contacts), Projects (linked projects), Activity (engagement timeline)

---

## Example User Workflows

**Workflow 1 — Identifying disengaged clients:** Agency owner opens client management, sorts by "Last Activity" ascending. Three clients at the bottom haven't had activity in 14+ days. She clicks "TechNova Solutions" — the detail panel shows wizard completed through Step 4 but no project was ever created (Step 5 abandoned). She selects the row plus two other inactive clients, clicks "Assign Consultant" from the bulk toolbar, and assigns her senior consultant for follow-up calls.

**Workflow 2 — Pre-call preparation:** Consultant filters by industry "healthcare", sees 3 clients. Clicks into GreenLeaf Healthcare's detail panel. The Overview tab shows: wizard fully completed, readiness score 78, 1 active project in Phase 2. The Activity tab shows last interaction was a milestone completion 3 days ago. The Contacts tab shows Dr. Mike Chen (CEO) and Lisa Park (Operations). The consultant has full context for the upcoming strategy call.

**Workflow 3 — New lead intake:** Business development receives an inquiry from a restaurant chain. She clicks "Add Client", fills in "Fresh Bites Group", industry "Food & Beverage", status "Lead", primary contact "alex@freshbites.com". The client appears in the table with status badge "Lead" and empty wizard progress dots. She sends the wizard link. Two days later, the wizard progress dots show Step 1 and Step 2 completed — the lead is engaging.

---

## AI Features

- Client health prediction: AI scores each client 0-100 based on activity frequency, wizard completion rate, milestone progress, and time since last interaction
- Churn risk alerts: highlight clients with declining engagement patterns (less frequent logins, stalled wizard, overdue milestones)
- "Clients most likely to upgrade" suggestions based on wizard data patterns (high readiness score + completed Phase 1 + high ROI projections)
- Auto-generated client summary for pre-call preparation: "GreenLeaf Healthcare is in Phase 2 of a 3-phase AI transformation. Key focus: patient scheduling automation. Readiness improved from 65 to 78."

---

## Data Sources (tables)

| Data | Table | Column/Query |
|------|-------|-------------|
| Client list | clients | select all, join organizations on org_id |
| Contact details | crm_contacts | where client_id = clients.id |
| Client status | clients | status column (Lead, Active, Onboarding, Delivered, Churned) |
| Industry | clients | industry column, or organizations.industry |
| Wizard progress | wizard_sessions | where org_id = clients.org_id, current_step and status |
| Wizard step completion | wizard_answers | count by step_number where session_id in client's sessions |
| Active projects | projects | count where org_id = clients.org_id and status = 'active' |
| Last activity | activities | max(created_at) where org_id = clients.org_id |
| Assigned consultant | team_members | where org_id = agency org and role = 'consultant' and assigned clients |
| Revenue | projects | sum of budget where org_id = clients.org_id |

---

## Automation Opportunities

- Auto-create client record when a new wizard session starts with an email address
- Auto-update client status from "Lead" to "Onboarding" when wizard completes
- Auto-update client status from "Onboarding" to "Active" when first project is created
- Alert agency when a client is inactive for > 14 days (no activities logged)
- Auto-assign consultant based on industry vertical or round-robin
- Weekly digest email to agency owner: new leads, status changes, at-risk clients
- Auto-generate follow-up task when wizard is abandoned (incomplete wizard_session)

---

## Visual Hierarchy

1. **Primary focus**: Client table (center, full width, data-dense)
2. **Secondary**: Filter/search bar (top, always visible, actionable)
3. **Tertiary**: Detail panel (right overlay, contextual, appears on interaction)
4. **Supporting**: Bulk action toolbar (bottom, appears conditionally)

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Agency owner | see all clients in one table with status and wizard progress | I can identify who needs attention |
| Agency consultant | filter clients by my assignments | I can focus on my portfolio |
| Agency owner | sort by last activity date | I can find disengaged clients quickly |
| Business dev | add a new lead to the system | I can track them through the wizard funnel |
| Agency consultant | see a client's full profile in a side panel | I can prepare for calls without leaving the list |
| Agency owner | bulk-assign consultants to clients | I can distribute workload efficiently |

---

## Goals & Acceptance Criteria

### Goals
1. **Primary:** Agency can view, filter, and manage all clients from a single table interface
2. **Quality:** Table renders 100+ clients without performance degradation, filters respond in < 200ms

### Acceptance Criteria
- [ ] Client table renders at `/app/clients` with columns: name, contact, industry, status, wizard progress, projects, last activity, consultant
- [ ] Search bar filters by client name and contact email with 300ms debounce
- [ ] Filter chips work for status (5 options), industry (dynamic from data), and consultant (team members)
- [ ] Column headers are clickable for ascending/descending sort
- [ ] Row click opens Sheet detail panel from right with Overview, Contacts, Projects, Activity tabs
- [ ] WizardProgressDots show 5 circles with filled/outlined state matching wizard_answers data
- [ ] ClientStatusBadge renders correct color per status value
- [ ] Quick-add client form creates record in clients table and optional crm_contacts row
- [ ] Bulk action toolbar appears when 1+ rows selected with export, assign, and status change options
- [ ] Pagination works with 10/25/50 page size options
- [ ] Empty state shows "No clients yet — clients are created when someone starts the wizard" message
- [ ] Loading state shows skeleton table rows (not blank)
- [ ] RLS enforces that only agency org members see client data

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Page | `src/components/dashboard/ClientManagement.tsx` | Create |
| Component | `src/components/dashboard/ClientTable.tsx` | Create |
| Component | `src/components/dashboard/ClientDetailPanel.tsx` | Create |
| Component | `src/components/dashboard/ClientStatusBadge.tsx` | Create |
| Component | `src/components/dashboard/WizardProgressDots.tsx` | Create |
| Component | `src/components/dashboard/ClientHealthScore.tsx` | Create |
| Component | `src/components/dashboard/QuickAddClientForm.tsx` | Create |
| Component | `src/components/dashboard/FilterBar.tsx` | Create |
| Component | `src/components/dashboard/BulkActionToolbar.tsx` | Create |
| Component | `src/components/dashboard/EngagementTimeline.tsx` | Create |
| Hook | `src/lib/hooks/useClients.ts` | Create |
| Hook | `src/lib/hooks/useClientDetail.ts` | Create |
| Types | `src/lib/types/client.ts` | Create |
| Route | `src/routes.tsx` | Modify — add `/app/clients` route |

---

## Frontend Wiring

### Component Tree

```
DashboardLayout
├── DashboardSidebar (shared)
├── DashboardHeader (shared)
└── ClientManagement (page)
    ├── PageHeader
    │   ├── h1 "Client Management"
    │   ├── ClientCountBadge
    │   └── Button "Add Client" → opens QuickAddClientForm
    ├── FilterBar
    │   ├── SearchInput (debounced, client name + email)
    │   ├── FilterChip (Status: Lead | Active | Onboarding | Delivered | Churned)
    │   ├── FilterChip (Industry: dynamic from data)
    │   └── FilterChip (Consultant: from team_members)
    ├── BulkActionToolbar (conditionally rendered when selectedRows.length > 0)
    │   ├── SelectedCount badge
    │   ├── Button "Export CSV"
    │   ├── Button "Assign Consultant"
    │   └── Button "Change Status"
    ├── ClientTable
    │   ├── TableHeader (sortable columns)
    │   │   ├── Checkbox (select all)
    │   │   ├── "Name" (sortable)
    │   │   ├── "Contact" (sortable)
    │   │   ├── "Industry"
    │   │   ├── "Status" (sortable)
    │   │   ├── "Wizard" (sortable by completion count)
    │   │   ├── "Projects" (sortable)
    │   │   ├── "Last Activity" (sortable)
    │   │   ├── "Health" (sortable)
    │   │   └── "Consultant"
    │   └── TableBody
    │       └── ClientRow[] (map over paginated data)
    │           ├── Checkbox
    │           ├── ClientName + avatar
    │           ├── ContactEmail
    │           ├── IndustryLabel
    │           ├── ClientStatusBadge
    │           ├── WizardProgressDots (5 circles)
    │           ├── ProjectCount
    │           ├── LastActivityDate (relative)
    │           ├── ClientHealthScore (colored number)
    │           └── ConsultantAvatar
    ├── Pagination
    │   ├── PageSizeSelect (10 | 25 | 50)
    │   ├── "Showing 1-10 of 18"
    │   └── PageButtons (prev, 1, 2, ..., next)
    ├── ClientDetailPanel (Sheet, slide-out right, 400px)
    │   ├── SheetHeader (client name + status badge + close)
    │   ├── Tabs
    │   │   ├── Tab "Overview"
    │   │   │   ├── CompanyInfo (name, industry, size, revenue)
    │   │   │   ├── WizardProgressDots (large, with step labels)
    │   │   │   ├── ReadinessScoreMini (if wizard step 4 done)
    │   │   │   └── KeyMetrics (projects, health, contract value)
    │   │   ├── Tab "Contacts"
    │   │   │   └── ContactCard[] (name, email, phone, role)
    │   │   ├── Tab "Projects"
    │   │   │   └── ProjectMiniCard[] (name, phase, progress)
    │   │   └── Tab "Activity"
    │   │       └── EngagementTimeline
    │   │           └── TimelineItem[] (icon + description + date)
    │   └── SheetFooter
    │       ├── Button "View Full Profile →"
    │       └── Button "Schedule Call"
    └── QuickAddClientForm (Dialog modal)
        ├── Input "Company Name"
        ├── Input "Primary Contact Email"
        ├── Select "Industry"
        ├── Select "Status" (default: Lead)
        ├── Input "Contact Name"
        ├── Input "Phone" (optional)
        └── Button "Create Client"
```

### TypeScript Interfaces

```typescript
// src/lib/types/client.ts

interface ClientListItem {
  id: string;
  name: string;
  industry: string;
  status: ClientStatus;
  orgId: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string | null;
    role: string | null;
  } | null;
  wizardProgress: WizardProgress;
  activeProjectCount: number;
  lastActivityAt: string | null;    // ISO timestamp
  healthScore: number;              // 0-100
  assignedConsultant: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
  totalRevenue: number;
}

type ClientStatus = 'lead' | 'active' | 'onboarding' | 'delivered' | 'churned';

interface WizardProgress {
  sessionId: string | null;
  sessionStatus: 'in_progress' | 'completed' | 'abandoned' | null;
  completedSteps: number[];         // e.g. [1, 2, 3]
  currentStep: number | null;
}

interface ClientDetail {
  id: string;
  name: string;
  industry: string;
  status: ClientStatus;
  orgId: string;
  companySize: number | null;
  contacts: CRMContact[];
  projects: ClientProject[];
  wizardProgress: WizardProgress;
  readinessScore: number | null;
  healthScore: number;
  totalRevenue: number;
  createdAt: string;
}

interface CRMContact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string | null;
  isPrimary: boolean;
}

interface ClientProject {
  id: string;
  name: string;
  status: string;
  currentPhase: string;
  progressPercent: number;
}

interface ClientFilters {
  search: string;
  status: ClientStatus | null;
  industry: string | null;
  consultantId: string | null;
}

interface ClientSort {
  column: 'name' | 'status' | 'lastActivity' | 'health' | 'projects' | 'wizard';
  direction: 'asc' | 'desc';
}

interface ClientPagination {
  page: number;
  pageSize: 10 | 25 | 50;
  total: number;
}

interface QuickAddClientInput {
  name: string;
  industry: string;
  status: ClientStatus;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
}
```

### Custom Hooks

```typescript
// src/lib/hooks/useClients.ts
function useClients(filters: ClientFilters, sort: ClientSort, pagination: ClientPagination): {
  clients: ClientListItem[];
  total: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

// src/lib/hooks/useClientDetail.ts
function useClientDetail(clientId: string | null): {
  client: ClientDetail | null;
  activities: ActivityItem[];
  loading: boolean;
  error: string | null;
}

// src/lib/hooks/useClientMutations.ts
function useClientMutations(): {
  createClient: (input: QuickAddClientInput) => Promise<{ data: ClientListItem | null; error: string | null }>;
  updateStatus: (clientIds: string[], status: ClientStatus) => Promise<{ error: string | null }>;
  assignConsultant: (clientIds: string[], consultantId: string) => Promise<{ error: string | null }>;
  exportCSV: (clientIds: string[]) => Promise<Blob>;
  isLoading: boolean;
}
```

### State Management

| State | Location | Reason |
|-------|----------|--------|
| `filters` (search, status, industry, consultant) | ClientManagement useState + URL search params | Filters persist in URL for shareable links |
| `sort` (column, direction) | ClientManagement useState + URL search params | Persisted in URL |
| `pagination` (page, pageSize) | ClientManagement useState + URL search params | Persisted in URL |
| `selectedRows` (Set of client IDs) | ClientManagement useState | Local only, resets on filter/page change |
| `selectedClientId` (for detail panel) | ClientManagement useState | Controls Sheet open/close |
| `isAddDialogOpen` | ClientManagement useState | Controls QuickAddClientForm dialog |
| `orgId` | AuthContext | From auth session |

### Data Fetching Pattern

```
useClients(filters, sort, pagination)
  └── api<ClientsListResponse>('/dashboard/clients', {
        method: 'POST',
        body: { filters, sort, page: pagination.page, pageSize: pagination.pageSize }
      })
      ↳ Edge function queries: clients JOIN organizations,
        crm_contacts (primary), wizard_sessions, wizard_answers (count),
        projects (count), activities (max date), team_members (consultant)

useClientDetail(clientId)
  └── api<ClientDetailResponse>('/dashboard/clients/:id', { method: 'POST', body: { clientId } })
      ↳ Edge function queries: clients, crm_contacts (all), projects (linked),
        wizard_sessions + wizard_answers, activities (recent 20)
```

- Refetch triggers: After `createClient`, `updateStatus`, `assignConsultant` mutations, call `refresh()` on `useClients`.
- Debounce: Search input debounces 300ms before updating `filters.search` and triggering refetch.
- URL sync: `useSearchParams()` from React Router syncs filters/sort/pagination to URL on every change.

### Component Communication

- **Props down**: `ClientManagement` passes `clients[]` to `ClientTable`, `selectedClientId` to `ClientDetailPanel`.
- **Callbacks up**: `ClientTable` calls `onRowClick(clientId)` → parent sets `selectedClientId` → opens Sheet. `onSort(column)` → parent updates sort state. `onSelectRow(id)` → parent toggles in `selectedRows` Set.
- **BulkActionToolbar**: Receives `selectedIds: string[]` and mutation callbacks (`onAssign`, `onStatusChange`, `onExport`).
- **FilterBar**: Receives current `filters` and `onFilterChange: (filters: ClientFilters) => void`.
- **QuickAddClientForm**: Receives `onSubmit: (input: QuickAddClientInput) => Promise<void>` and `onClose`.

---

## Backend Wiring

### New Edge Function Routes

| Method | Route | Handler | Request Body | Response Shape |
|--------|-------|---------|-------------|----------------|
| POST | `/dashboard/clients` | Paginated client list with filters/sort | `{ filters: ClientFilters, sort: ClientSort, page: number, pageSize: number }` | `{ clients: ClientListItem[], total: number }` |
| POST | `/dashboard/clients/:id` | Single client detail with contacts, projects, activities | `{ clientId: string }` | `ClientDetail & { activities: ActivityItem[] }` |
| POST | `/dashboard/clients/create` | Create new client + optional contact | `QuickAddClientInput` | `{ client: ClientListItem }` |
| PUT | `/dashboard/clients/status` | Bulk update client status | `{ clientIds: string[], status: ClientStatus }` | `{ updated: number }` |
| PUT | `/dashboard/clients/assign` | Bulk assign consultant | `{ clientIds: string[], consultantId: string }` | `{ updated: number }` |
| POST | `/dashboard/clients/export` | Export selected clients as CSV | `{ clientIds: string[] }` | CSV blob (Content-Type: text/csv) |
| POST | `/dashboard/clients/health` | Recompute health scores | `{ clientIds?: string[] }` | `{ scores: { clientId: string, score: number }[] }` |

### Supabase Client Queries

```typescript
// /dashboard/clients handler — paginated list

// 1. Base client query with joins
const query = adminClient()
  .from('clients')
  .select(`
    id, name, industry, status, org_id, created_at,
    organizations!inner(id, name),
    crm_contacts(id, name, email, phone, role, is_primary),
    projects(id, status),
    wizard_sessions(id, status, current_step)
  `, { count: 'exact' })
  .eq('org_id', agencyOrgId);   // agency sees their clients

// 2. Apply filters
if (filters.search) {
  query.or(`name.ilike.%${filters.search}%,crm_contacts.email.ilike.%${filters.search}%`);
}
if (filters.status) {
  query.eq('status', filters.status);
}
if (filters.industry) {
  query.eq('industry', filters.industry);
}

// 3. Apply sort
query.order(sortColumnMap[sort.column], { ascending: sort.direction === 'asc' });

// 4. Apply pagination
query.range((page - 1) * pageSize, page * pageSize - 1);

// 5. Wizard step completion count (separate query per client or batch)
const { data: wizardAnswers } = await adminClient()
  .from('wizard_answers')
  .select('session_id, step_number')
  .in('session_id', sessionIds);

// 6. Last activity per client
const { data: lastActivities } = await adminClient()
  .from('activities')
  .select('org_id, created_at')
  .in('org_id', clientOrgIds)
  .order('created_at', { ascending: false });
// Group by org_id, take first per group

// 7. Health score computation (in handler)
// healthScore = weightedAvg(
//   activityFrequency * 0.3,
//   wizardCompletionRate * 0.3,
//   milestoneCompletionRate * 0.2,
//   daysSinceLastActivity (inverse) * 0.2
// )

// --- Client detail handler ---

// 8. Single client with all contacts
const { data: client } = await adminClient()
  .from('clients')
  .select(`
    id, name, industry, status, org_id, created_at,
    crm_contacts(id, name, email, phone, role, is_primary)
  `)
  .eq('id', clientId)
  .single();

// 9. Client projects
const { data: projects } = await adminClient()
  .from('projects')
  .select('id, name, status, created_at')
  .eq('org_id', client.org_id);

// 10. Client activities (engagement timeline)
const { data: activities } = await adminClient()
  .from('activities')
  .select('id, type, description, created_at, actor_name')
  .eq('org_id', client.org_id)
  .order('created_at', { ascending: false })
  .limit(20);

// 11. Create client
const { data: newClient } = await adminClient()
  .from('clients')
  .insert({ name, industry, status, org_id: agencyOrgId })
  .select()
  .single();

// 12. Create contact for client
const { data: newContact } = await adminClient()
  .from('crm_contacts')
  .insert({
    client_id: newClient.id,
    name: contactName,
    email: contactEmail,
    phone: contactPhone,
    is_primary: true
  })
  .select()
  .single();
```

### RLS Policies Needed

| Table | Policy | Rule |
|-------|--------|------|
| clients | SELECT agency clients | `org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())` |
| clients | INSERT new client | `org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'consultant'))` |
| clients | UPDATE client status | `org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'consultant'))` |
| crm_contacts | SELECT client contacts | `client_id IN (SELECT id FROM clients WHERE org_id IN (...))` |
| crm_contacts | INSERT new contact | `client_id IN (SELECT id FROM clients WHERE org_id IN (...))` |
| organizations | SELECT own org | `id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())` |
| wizard_sessions | SELECT client sessions | `org_id IN (SELECT org_id FROM clients WHERE org_id IN (...))` |
| wizard_answers | SELECT via session | `session_id IN (SELECT id FROM wizard_sessions WHERE ...)` |
| projects | SELECT client projects | `org_id IN (SELECT org_id FROM clients WHERE org_id IN (...))` |
| activities | SELECT client activities | `org_id IN (SELECT org_id FROM clients WHERE org_id IN (...))` |
| team_members | SELECT org team | `org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())` |

### API Response TypeScript Interfaces

```typescript
interface ClientsListResponse {
  clients: {
    id: string;
    name: string;
    industry: string;
    status: ClientStatus;
    orgId: string;
    primaryContact: {
      name: string;
      email: string;
      phone: string | null;
      role: string | null;
    } | null;
    wizardProgress: {
      sessionId: string | null;
      sessionStatus: string | null;
      completedSteps: number[];
      currentStep: number | null;
    };
    activeProjectCount: number;
    lastActivityAt: string | null;
    healthScore: number;
    assignedConsultant: {
      id: string;
      name: string;
      avatarUrl: string | null;
    } | null;
    totalRevenue: number;
  }[];
  total: number;
  filters: {
    industries: string[];          // distinct industries for filter chips
    consultants: { id: string; name: string }[];
  };
}

interface ClientDetailResponse {
  id: string;
  name: string;
  industry: string;
  status: ClientStatus;
  orgId: string;
  companySize: number | null;
  contacts: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string | null;
    isPrimary: boolean;
  }[];
  projects: {
    id: string;
    name: string;
    status: string;
    currentPhase: string;
    progressPercent: number;
  }[];
  wizardProgress: {
    sessionId: string | null;
    sessionStatus: string | null;
    completedSteps: number[];
    currentStep: number | null;
  };
  readinessScore: number | null;
  healthScore: number;
  totalRevenue: number;
  createdAt: string;
  activities: {
    id: string;
    type: string;
    description: string;
    createdAt: string;
    actorName: string;
  }[];
}

interface ClientCreateResponse {
  client: {
    id: string;
    name: string;
    industry: string;
    status: ClientStatus;
    orgId: string;
  };
}

interface BulkUpdateResponse {
  updated: number;
}
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| No clients exist yet | Return `clients: [], total: 0`. Frontend shows empty state: "No clients yet -- clients are created when someone starts the wizard" |
| Client has no crm_contacts | `primaryContact: null`. Table shows "--" in Contact column |
| Client has no wizard_sessions | `wizardProgress: { sessionId: null, completedSteps: [], currentStep: null }`. WizardProgressDots render 5 empty circles |
| Client has multiple wizard sessions | Use most recent session (`ORDER BY created_at DESC LIMIT 1`) |
| Search returns no results | `clients: [], total: 0`. Show "No clients match your filters" with "Clear filters" button |
| Bulk action on 50+ clients | Edge function processes in batch. Frontend shows progress spinner. Timeout at 30s with partial success handling |
| Consultant not assigned | `assignedConsultant: null`. Table shows "--" in Consultant column |
| Health score data insufficient | Default to 50 (neutral). Requires at least 1 activity to compute meaningful score |
| CSV export large dataset | Stream response with `Content-Type: text/csv`. Frontend creates Blob and triggers download |
| Unauthorized user (not in agency org) | 401 response. Frontend redirects to `/login` |
| Client org_id mismatch | 404 response on detail. Frontend shows "Client not found" |

---

## Detailed ASCII Wireframes

### Desktop Layout (1200px)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ BROWSER VIEWPORT (1440px)                                                            │
│                                                                                      │
│ ┌─────────────┬──────────────────────────────────────────────────────────────────────┐│
│ │ SIDEBAR     │  MAIN CONTENT (max-w-[1200px] mx-auto px-6)                        ││
│ │ 240px       │                                                                      ││
│ │ #0A211F bg  │  ┌──────────────────────────────────────────────────────────────┐    ││
│ │             │  │ PAGE HEADER                                        h: 64px  │    ││
│ │ ● Dashboard │  │                                                              │    ││
│ │ ○ Projects  │  │  Client Management               18 clients   [+ Add Client]│    ││
│ │ ● CRM  ◄── │  │                                                              │    ││
│ │ ○ AI Insight│  └──────────────────────────────────────────────────────────────┘    ││
│ │ ○ Documents │                                                                      ││
│ │ ○ Financial │  ┌──────────────────────────────────────────────────────────────┐    ││
│ │ ○ Settings  │  │ FILTER BAR                                   h: 48px sticky │    ││
│ │             │  │                                                              │    ││
│ │             │  │  [🔍 Search clients...        ]                              │    ││
│ │             │  │  [Status ▾] [Industry ▾] [Consultant ▾]    [Clear filters]  │    ││
│ │             │  └──────────────────────────────────────────────────────────────┘    ││
│ │             │                                                                      ││
│ │             │  ┌──────────────────────────────────────────────────────────────┐    ││
│ │             │  │ CLIENT TABLE                                     #FFF bg    │    ││
│ │             │  │                                                              │    ││
│ │             │  │ ☐ │ Name ▾       │ Contact        │ Industry │ Status    │.. │    ││
│ │             │  │───┼──────────────┼────────────────┼──────────┼───────────┼───│    ││
│ │             │  │ ☐ │ Acme Retail  │ john@acme.com  │ E-comm   │ ● Active  │.. │    ││
│ │             │  │   │ Group        │                │          │           │   │    ││
│ │             │  │───┼──────────────┼────────────────┼──────────┼───────────┼───│    ││
│ │             │  │ ☐ │ TechNova     │ sara@tech.com  │ SaaS     │ ○ Lead    │.. │    ││
│ │             │  │   │ Solutions    │                │          │           │   │    ││
│ │             │  │───┼──────────────┼────────────────┼──────────┼───────────┼───│    ││
│ │             │  │ ☐ │ GreenLeaf    │ mike@green.com │ Health   │ ● Onboard │.. │    ││
│ │             │  │   │ Healthcare   │                │          │           │   │    ││
│ │             │  │───┼──────────────┼────────────────┼──────────┼───────────┼───│    ││
│ │             │  │ ☐ │ Fresh Bites  │ alex@fresh.com │ F&B      │ ○ Lead    │.. │    ││
│ │             │  │   │ Group        │                │          │           │   │    ││
│ │             │  │                                                              │    ││
│ │             │  │  ... (remaining rows)                                        │    ││
│ │             │  │                                                              │    ││
│ │             │  └──────────────────────────────────────────────────────────────┘    ││
│ │             │                                                                      ││
│ │             │  ┌──────────────────────────────────────────────────────────────┐    ││
│ │             │  │ PAGINATION                                                  │    ││
│ │             │  │ Showing 1-10 of 18    [10▾]    [◀] 1  [2]  [▶]             │    ││
│ │             │  └──────────────────────────────────────────────────────────────┘    ││
│ └─────────────┴──────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Full Table Row Detail (expanded columns)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ CLIENT TABLE — Full column layout (1200px - 240px sidebar = 960px content area)            │
│                                                                                            │
│ ☐ │ Name          │ Contact         │ Industry │ Status    │ Wizard │ Proj │ Last Act │ HP │ Consult │
│ 30│ 180px         │ 160px           │ 90px     │ 90px      │ 80px   │ 50px │ 90px     │ 40 │ 80px    │
│───┼───────────────┼─────────────────┼──────────┼───────────┼────────┼──────┼──────────┼────┼─────────│
│ ☐ │ Acme Retail   │ john@acme.com   │ E-comm   │ ● Active  │ ●●●●● │  2   │ 2h ago   │ 85 │ [av]    │
│ ☐ │ TechNova Sol  │ sara@tech.com   │ SaaS     │ ○ Lead    │ ●●●●○ │  0   │ 16d ago  │ 32 │  --     │
│ ☐ │ GreenLeaf HC  │ mike@green.com  │ Health   │ ● Onboard │ ●●●●● │  1   │ 3d ago   │ 78 │ [av]    │
│ ☐ │ Fresh Bites   │ alex@fresh.com  │ F&B      │ ○ Lead    │ ●●○○○ │  0   │ 5d ago   │ 45 │  --     │
│                                                                                            │
│ Legend:                                                                                    │
│   ● = wizard step completed    ○ = wizard step not completed                               │
│   HP = Health Points (0-100)   green >80, yellow 50-80, red <50                            │
│   Status colors: Lead=gray, Active=#84CC16, Onboarding=blue, Delivered=teal, Churned=red   │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Client Detail Panel (Sheet, 400px)

```
┌──────────────────────────────────────────┐
│ CLIENT DETAIL PANEL           [X close]  │
│ Sheet slide-in from right, 400px wide    │
│ #FFFFFF bg, shadow-xl                    │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │  Acme Retail Group        ● Active   │ │
│ │  E-commerce  │  50 employees         │ │
│ │  Health: 85  │  Revenue: $48K        │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ [Overview] [Contacts] [Projects] [Activity] │
│ ─────────────────────────────────────────│
│                                          │
│ ┌─── Overview Tab ─────────────────────┐ │
│ │                                      │ │
│ │  Wizard Progress                     │ │
│ │  ● Step 1: Business Profile    ✓     │ │
│ │  ● Step 2: Diagnostics        ✓     │ │
│ │  ● Step 3: System Selection   ✓     │ │
│ │  ● Step 4: Readiness Score    ✓     │ │
│ │  ● Step 5: Roadmap            ✓     │ │
│ │                                      │ │
│ │  AI Readiness Score                  │ │
│ │  ┌──────────────────────────┐        │ │
│ │  │  72/100    ████████░░░░  │        │ │
│ │  └──────────────────────────┘        │ │
│ │                                      │ │
│ │  Key Metrics                         │ │
│ │  ┌────────────┬─────────────┐        │ │
│ │  │ 2 Projects │ $48K Rev.   │        │ │
│ │  │ 3 Systems  │ Phase 1/3   │        │ │
│ │  └────────────┴─────────────┘        │ │
│ │                                      │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ [View Full Profile →] [Schedule Call]│ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

### Bulk Action Toolbar (fixed bottom, conditional)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ BULK ACTION TOOLBAR          fixed bottom, h: 56px, #0A211F bg, z-50   │
│                                                                          │
│  3 clients selected    [Export CSV]  [Assign Consultant ▾]  [Status ▾]  │
│  #F1EEEA text          #84CC16 btn   #FFFFFF outline btn    outline btn │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Tablet Layout (768px)

```
┌────────────────────────────────────────────────────┐
│ TABLET VIEWPORT (768px)                            │
│                                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ [☰]  Client Management     18    [+ Add]      │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ [🔍 Search...         ]                        │ │
│ │ [Status ▾] [Industry ▾] [Consultant ▾]        │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ Simplified table (hide: Consultant, Health)    │ │
│ │                                                │ │
│ │ ☐│Name         │Contact       │Status │Wizard │ │
│ │──┼─────────────┼──────────────┼───────┼───────│ │
│ │ ☐│Acme Retail  │john@acme.com │●Active│●●●●●  │ │
│ │ ☐│TechNova     │sara@tech.com │○Lead  │●●●●○  │ │
│ │ ☐│GreenLeaf    │mike@green.com│●Onbrd │●●●●●  │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ Detail panel → full-width Sheet from bottom        │
│                                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ Showing 1-10 of 18   [10▾]   [◀] 1 [2] [▶]   │ │
│ └────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

### Mobile Layout (375px)

```
┌───────────────────────────────────┐
│ MOBILE VIEWPORT (375px)           │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ [☰]  Clients       [+ Add]   │ │
│ └───────────────────────────────┘ │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ [🔍 Search clients...       ] │ │
│ │ [Status ▾] [Industry ▾]      │ │
│ └───────────────────────────────┘ │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ CLIENT CARD (replaces table)  │ │
│ │ Acme Retail Group             │ │
│ │ john@acme.com  │  E-commerce  │ │
│ │ ● Active    Wizard: ●●●●●    │ │
│ │ 2 projects  │  Last: 2h ago   │ │
│ └───────────────────────────────┘ │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ TechNova Solutions            │ │
│ │ sara@tech.com  │  SaaS        │ │
│ │ ○ Lead      Wizard: ●●●●○    │ │
│ │ 0 projects  │  Last: 16d ago  │ │
│ └───────────────────────────────┘ │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ GreenLeaf Healthcare          │ │
│ │ mike@green.com │  Healthcare  │ │
│ │ ● Onboarding Wizard: ●●●●●   │ │
│ │ 1 project   │  Last: 3d ago   │ │
│ └───────────────────────────────┘ │
│                                   │
│ ... (scrollable list)             │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ Showing 1-10    [Load more]   │ │
│ └───────────────────────────────┘ │
│                                   │
│ Detail → full-screen Sheet        │
└───────────────────────────────────┘
```

### Key Component Details

#### WizardProgressDots

```
┌──────────────────────────────────────────────────────┐
│ WizardProgressDots                                   │
│                                                      │
│ Compact (table row, 80px):                           │
│   ● ● ● ● ○       (5 circles, 12px each, 4px gap)   │
│   filled=#84CC16   outlined=#D4CFC8                  │
│                                                      │
│ Expanded (detail panel):                             │
│   ● Step 1: Business Profile      ✓ Completed       │
│   ● Step 2: Industry Diagnostics  ✓ Completed       │
│   ● Step 3: System Selection      ✓ Completed       │
│   ● Step 4: Readiness Assessment  ✓ Completed       │
│   ○ Step 5: Roadmap & Plan        ✗ Abandoned       │
│                                                      │
│   filled circle: 16px, #84CC16 bg                    │
│   empty circle:  16px, #D4CFC8 border, transparent   │
│   connecting line: 2px #D4CFC8 between circles       │
└──────────────────────────────────────────────────────┘
```

#### ClientStatusBadge

```
┌──────────────────────────────────────────────────────┐
│ ClientStatusBadge                                    │
│                                                      │
│ Variants (Badge component with custom colors):       │
│                                                      │
│  ┌─────────┐  Lead      — bg: #E5E2DE  text: #6B6560│
│  ┌─────────┐  Active    — bg: #84CC16/15 text: #4A7A0B│
│  ┌─────────┐  Onboarding— bg: #3B82F6/15 text: #1E40AF│
│  ┌─────────┐  Delivered — bg: #0A211F/15 text: #0A211F│
│  ┌─────────┐  Churned   — bg: #EF4444/15 text: #991B1B│
│                                                      │
│  All: rounded-full, px-3 py-1, text-xs, font-medium │
└──────────────────────────────────────────────────────┘
```

#### ClientHealthScore

```
┌──────────────────────────────────────────────────────┐
│ ClientHealthScore                                    │
│                                                      │
│  Renders as colored number in table cell:            │
│                                                      │
│  85  — text-green-600  (score > 80)                  │
│  65  — text-yellow-600 (score 50-80)                 │
│  32  — text-red-600    (score < 50)                  │
│                                                      │
│  Font: Lora 14px, font-semibold                      │
│  Tooltip on hover: "Based on activity frequency,     │
│  wizard completion, and milestone progress"          │
└──────────────────────────────────────────────────────┘
```

---

## Outcomes

| Before | After |
|--------|-------|
| No centralized client view — agency checks sessions and projects individually | Full client table with status, wizard progress, and engagement data in one screen |
| Wizard abandonment goes unnoticed | WizardProgressDots immediately show which step a client stopped at |
| No way to identify disengaged clients | Sort by last activity + health score surfaces at-risk clients instantly |
| Manual consultant assignment via spreadsheet or chat | Bulk-assign consultants directly from the client table |
| Client status tracked informally | Formal status lifecycle (Lead -> Active -> Onboarding -> Delivered -> Churned) with auto-transitions |
