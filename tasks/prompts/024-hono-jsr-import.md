---
id: 024-hono-jsr-import
diagram_id: CORE-INFRA-01
prd_section: Backend Architecture
title: Switch Hono imports from npm to jsr specifier
skill: backend
phase: CORE
priority: P3
status: Todo
owner: Backend
dependencies:
  - 011-edge-function-shared-infra
estimated_effort: S
percent_complete: 0
---

## Objective

Switch all Hono imports in edge functions from `npm:hono` to `jsr:@hono/hono@4` to follow the Supabase edge function best practice: prefer `jsr:` imports over `npm:` in Deno-based edge functions.

## Context

All edge function route files currently use the npm specifier:

```typescript
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
```

The Supabase edge function writing guide recommends `jsr:` imports for better Deno compatibility, faster resolution, and alignment with the Deno-native package registry.

## Scope

### Files to update

| File | Current Import | New Import |
|---|---|---|
| `server/index.tsx` | `import { Hono } from "npm:hono"` | `import { Hono } from "jsr:@hono/hono@4"` |
| `server/index.tsx` | `import { cors } from "npm:hono/cors"` | `import { cors } from "jsr:@hono/hono@4/cors"` |
| `server/index.tsx` | `import { logger } from "npm:hono/logger"` | `import { logger } from "jsr:@hono/hono@4/logger"` |
| `server/wizard-routes.tsx` | `import { Hono } from "npm:hono"` | `import { Hono } from "jsr:@hono/hono@4"` |
| `server/ai-routes.tsx` | `import { Hono } from "npm:hono"` | `import { Hono } from "jsr:@hono/hono@4"` |

## Acceptance Criteria

- [ ] All `npm:hono` imports replaced with `jsr:@hono/hono@4` equivalents
- [ ] No `npm:hono` references remain in any edge function file
- [ ] Edge function deploys and serves all routes correctly
- [ ] Health check, wizard save/load, and AI endpoints still work

## File Change Summary

| File | Action | Description |
|---|---|---|
| `server/index.tsx` | **Edit** | Switch 3 Hono imports to jsr specifier |
| `server/wizard-routes.tsx` | **Edit** | Switch Hono import to jsr specifier |
| `server/ai-routes.tsx` | **Edit** | Switch Hono import to jsr specifier |
