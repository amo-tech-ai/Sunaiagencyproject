---
id: 001-project-foundation
diagram_id: CORE-ARCH-01
prd_section: System Architecture
title: Project foundation and routing structure
skill: frontend
phase: CORE
priority: P0
status: Open
owner: Frontend
dependencies: []
estimated_effort: M
percent_complete: 0
---

## Objective
Set up the Vite 6 + React 18 + TypeScript project structure with React Router v7 and the core route tree that supports marketing, app, and admin route groups.

## Scope
- Vite 6 config with SWC plugin and path aliases (`@/` resolves to `src/`)
- React Router v7 `createBrowserRouter` with route tree:
  - Public marketing routes (`/`, `/solutions`, `/industries/*`, `/about`, etc.)
  - Protected app routes (`/app/*`) — wizard, dashboard
  - Admin routes (`/admin/*`) — agency dashboard
- Layout components:
  - `MarketingLayout` — header + outlet + footer (existing)
  - `AppLayout` — app shell with auth context
  - `AdminLayout` — admin shell with sidebar
- Entry flow: `index.html` -> `main.tsx` -> `App.tsx` (RouterProvider) -> `routes.tsx`
- Environment variable structure (`.env.local` template)

> **Current state:** Marketing routes + public wizard at `/wizard` are implemented. `/app/*` and `/admin/*` route groups do not exist yet — add with auth (003-006).
- Tailwind CSS v4 + shadcn/ui + CVA already configured

## Acceptance Criteria
- `npm run dev` starts dev server on localhost:3000
- All route groups render placeholder pages at correct paths
- Path alias `@/` resolves correctly in imports
- `npm run build` succeeds with no errors
- Route tree matches PRD section 6 (Screens & Routes)

## Failure Handling
- Invalid route shows 404 page
- Build errors logged with clear messages
