---
task_id: 083-INFRA
title: Error monitoring and alerting with Sentry
phase: LOW
priority: P3
status: Not Started
estimated_effort: 4 hours
area: infrastructure
skill: []
suggested_skills: [devops/error-monitoring]
subagents: []
depends_on: []
---

# 083 — Error Monitoring

## Summary Table

| Aspect | Details |
|--------|---------|
| **Frontend** | React error boundary + Sentry browser SDK |
| **Edge Functions** | Sentry Deno SDK or structured logging to Supabase logs |
| **Alerts** | Slack/email on error spike |
| **Status** | No error monitoring exists |

---

## Description

**The situation:** No error monitoring. Frontend errors are invisible (user's browser console). Edge function errors are only visible in Supabase function logs (which expire). No alerting.

**Why it matters:** Production errors go undetected until a user reports them. By then, the issue may have affected many users.

**The build:**
1. Add Sentry React SDK to frontend — captures unhandled errors, rejected promises
2. Add React Error Boundary wrapper around DashboardLayout
3. Add Sentry to edge functions (or structured error logging)
4. Configure Slack/email alerts for error rate thresholds

---

## Acceptance Criteria

- [ ] Frontend: unhandled errors captured and sent to monitoring service
- [ ] Edge Functions: errors logged in searchable, persistent format
- [ ] Alerts: notification on error spike (> 10 errors/minute)
- [ ] Error boundary: dashboard shows "Something went wrong" instead of white screen
- [ ] Source maps uploaded for readable stack traces

---

## Skill Gap

No `devops/error-monitoring` skill exists in `.agents/`. Options:
1. Create skill from Sentry docs (React + Deno)
2. Use `firecrawl` skill to fetch current Sentry setup docs
3. Follow standard Sentry React quickstart

---

## Outcomes

| Before | After |
|--------|-------|
| Errors invisible until user reports | Errors captured automatically with stack traces |
| No alerting | Slack/email on error spikes |
| White screen on crash | Error boundary with retry option |
