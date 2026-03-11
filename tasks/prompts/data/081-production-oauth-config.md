---
task_id: 081-AUTH
title: Configure Google OAuth and LinkedIn OIDC for production
phase: MEDIUM
priority: P2
status: Not Started
estimated_effort: 1 hour
area: auth
skill: [skills/supabase-auth]
subagents: []
depends_on: []
---

# 081 — Production OAuth Configuration

## Summary Table

| Aspect | Details |
|--------|---------|
| **Providers** | Google OAuth 2.0, LinkedIn OIDC |
| **Frontend** | AuthPage.tsx — buttons already wired |
| **Backend** | Supabase Auth handles OAuth redirect flow |
| **Status** | Buttons exist in UI but OAuth not configured in production |

---

## Description

**The situation:** AuthPage.tsx has Google and LinkedIn OAuth buttons that call Supabase Auth's `signInWithOAuth()`. But the OAuth providers are not configured in the production Supabase project — clicking the buttons either errors or does nothing.

**Why it matters:** OAuth is the primary signup method for enterprise clients. Without it, users must use email/password, which has higher friction.

**The build:**

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Set authorized redirect URI: `https://necxcwhuzylsumlkkmlk.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret
5. In Supabase Dashboard → Authentication → Providers → Google: enable, paste credentials

### LinkedIn OIDC
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/) → Create App
2. Add "Sign In with LinkedIn using OpenID Connect" product
3. Set authorized redirect URI: `https://necxcwhuzylsumlkkmlk.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret
5. In Supabase Dashboard → Authentication → Providers → LinkedIn OIDC: enable, paste credentials

---

## Acceptance Criteria

- [ ] Google OAuth: click button → Google consent screen → redirect back → session created
- [ ] LinkedIn OIDC: click button → LinkedIn consent screen → redirect back → session created
- [ ] Auth callback page handles redirect correctly at `/auth/callback`
- [ ] User profile created in `profiles` table after OAuth signup
- [ ] Existing email users can link OAuth accounts (no duplicate accounts)

---

## Outcomes

| Before | After |
|--------|-------|
| OAuth buttons do nothing or error | Google + LinkedIn login works end-to-end |
| Only email/password signup | 3 signup methods: email, Google, LinkedIn |
