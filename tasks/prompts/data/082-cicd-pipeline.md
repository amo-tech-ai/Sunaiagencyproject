---
task_id: 082-INFRA
title: CI/CD pipeline for automatic edge function and frontend deploys
phase: LOW
priority: P3
status: Not Started
estimated_effort: 1 day
area: infrastructure
skill: [devops/cicd-pipeline]
subagents: []
depends_on: [073-migrations-path-vs-cli, 074-cors-origin-restrict-production]
---

# 082 — CI/CD Pipeline

## Summary Table

| Aspect | Details |
|--------|---------|
| **Frontend** | Vercel auto-deploy on push (may already be connected) |
| **Edge Functions** | Manual: `cp + supabase functions deploy` — needs automation |
| **Migrations** | Manual: SQL Editor paste — needs automation |
| **CI** | No checks: no lint, no typecheck, no tests on PR |

---

## Description

**The situation:** Deployments are manual. Edge functions require a 2-step copy + deploy command. Migrations are pasted into the SQL Editor. No CI runs on pull requests.

**Why it matters:** Manual deploys are error-prone (forget to copy files, deploy wrong version). No CI means broken builds merge to main.

**The build:** GitHub Actions workflow with:
1. **CI** (on PR): `npm run build` + typecheck
2. **Deploy frontend** (on merge to main): Vercel deploy
3. **Deploy edge functions** (on merge to main, if `src/supabase/functions/` changed): copy + `supabase functions deploy`
4. **Run migrations** (manual trigger): `supabase db push` or equivalent

---

## Proposed Workflow

```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build

# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npx vercel --prod --yes --token=${{ secrets.VERCEL_TOKEN }}

  edge-functions:
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.modified, 'src/supabase/functions/')
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: |
          cp src/supabase/functions/server/*.tsx supabase/functions/make-server-283466b6/
          supabase functions deploy make-server-283466b6 --project-ref ${{ secrets.SUPABASE_PROJECT_REF }} --no-verify-jwt
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

---

## Acceptance Criteria

- [ ] PRs run `npm run build` check (fail = block merge)
- [ ] Merge to main triggers frontend deploy
- [ ] Edge function changes auto-deploy on merge
- [ ] Secrets stored in GitHub: `VERCEL_TOKEN`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`
- [ ] Deploy status visible in PR checks

---

## Outcomes

| Before | After |
|--------|-------|
| Manual copy + deploy commands | Automatic on merge to main |
| No CI — broken builds can merge | Build check blocks broken PRs |
| Deployment errors from forgotten steps | Reproducible pipeline |
