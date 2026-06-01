# Architectural Decisions

## Stack
- Backend: Node.js 20 + Hono + TypeScript strict
- Frontend: React 18 + Vite + TypeScript strict
- Database: PostgreSQL on Neon (serverless)
- ORM: Drizzle ORM
- Auth: JWT in httpOnly cookie (never localStorage)
- Email: Resend
- Payments: Stripe (Sprint 4)
- Storage: Cloudflare R2 (Sprint 4)
- Hosting: Railway (BE) + Vercel (FE)

## Multi-tenancy
Row-level isolation via tenant_id on every table.
Every query must filter by tenant_id. Enforced in code review.

## Auth
JWT payload: { sub: userId, tenantId, role, plan, iat, exp }
Roles: owner (full access) | dispatcher (no billing/settings)
Crew members: no system access in v1

## Pricing
USA market only in v1.
Basic: $49/mo up to 3 users
Pro: $99/mo up to 10 users
Trial: 14 days, no card required

## Formatting (USA)
Phone: (949) 555-0100
Date: Jun 15, 2026
Currency: $480
Timezone: stored UTC, displayed in tenant.settings.timezone

## Out of scope for v1
GPS tracking, payroll, multi-branch, AI features, mobile app
