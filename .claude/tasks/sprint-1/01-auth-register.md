# Task: POST /auth/register
**Sprint:** 1
**Scope:** backend
**ID:** sprint-1/01-auth-register

## User story
As a moving company owner, I want to register my company
so I can start using MovingDesk with a 14-day free trial.

## Endpoint
```
POST /auth/register
Content-Type: application/json
```

## Request body
```typescript
{
  companyName: string  // min 2, max 100 chars
  email: string        // valid email format
  password: string     // min 8 chars
  name: string         // owner's full name, min 2 chars
}
```

## Success response — 201
```typescript
{
  user: {
    id: string
    email: string
    name: string
    role: 'owner'
  }
  tenant: {
    id: string
    name: string
    slug: string
    plan: 'trial'
    trialEndsAt: string // ISO date, now + 14 days
  }
}
// + Set-Cookie: token=<jwt>; HttpOnly; SameSite=Lax; Path=/
```

## Error responses
```
400 { error: 'Validation failed', details: [...] }  // invalid input
409 { error: 'Email already registered' }            // duplicate email
500 { error: 'Internal server error' }               // unexpected
```

## Business logic — step by step

### 1. Validate input with Zod
All fields required. Email format. Password min 8. Names min 2.
Return 400 with details array if invalid.

### 2. Check email uniqueness
```sql
SELECT id FROM users WHERE email = $1 LIMIT 1
```
If found → 409.

### 3. Generate slug from company name
```typescript
// "Best & Pro Moving Service" → "best-pro-moving-service"
slug = companyName.toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
```
If slug taken → append random 4-char suffix.

### 4. Create tenant (in transaction)
```sql
INSERT INTO tenants (name, slug, plan, trial_ends_at)
VALUES ($1, $2, 'trial', NOW() + INTERVAL '14 days')
```

### 5. Hash password + create user (in same transaction)
```typescript
const hash = await bcrypt.hash(password, 12)
```
```sql
INSERT INTO users (tenant_id, email, password_hash, role, name)
VALUES ($1, $2, $3, 'owner', $4)
```

### 6. Create subscription record
```sql
INSERT INTO subscriptions (tenant_id, plan, status)
VALUES ($1, 'trial', 'trialing')
```

### 7. Sign JWT
```typescript
payload = {
  sub: user.id,
  tenantId: tenant.id,
  role: 'owner',
  plan: 'trial',
}
// expires: JWT_EXPIRES_IN from env (default 7d)
```

### 8. Send welcome email via Resend
```
To: user email
Subject: "Welcome to MovingDesk — your 14-day trial starts now"
Body: simple text, link to app
```
Fire and forget — do not await, do not fail registration if email fails.

### 9. Set httpOnly cookie + return 201
```typescript
setCookie(ctx, 'token', jwt, {
  httpOnly: true,
  sameSite: 'Lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
})
```

## Files to create
```
backend/src/routes/auth.ts          ← POST /auth/register handler
backend/src/services/auth.service.ts ← createTenant, createUser, generateSlug
backend/src/lib/jwt.ts              ← signToken(payload), verifyToken(token)
backend/src/lib/email.ts            ← sendWelcomeEmail(email, name)
backend/src/db/schema.ts            ← already exists from Sprint 0
```

## Files to modify
```
backend/src/index.ts  ← register auth routes
```

## Acceptance criteria
- AC1: Valid input → 201 + JWT cookie set + tenant + user created in DB
- AC2: Duplicate email → 409
- AC3: Missing fields → 400 with details
- AC4: Password stored as bcrypt hash (never plain)
- AC5: tenant.plan = 'trial', trial_ends_at = now + 14 days
- AC6: user.role = 'owner'
- AC7: JWT cookie is httpOnly
- AC8: JWT payload contains sub, tenantId, role, plan
- AC9: subscription record created with status 'trialing'
- AC10: Welcome email fired (non-blocking)

## Security checklist
- [ ] bcrypt rounds = 12
- [ ] httpOnly cookie
- [ ] No password in response
- [ ] Transaction wraps tenant + user + subscription inserts
- [ ] Zod validation before any DB calls
