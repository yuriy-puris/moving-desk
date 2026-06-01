# Task: POST /auth/login
**Sprint:** 1
**Scope:** backend
**ID:** sprint-1/02-auth-login

## User story
As a registered user, I want to log in with email and password
so I can access my company's MovingDesk account.

## Endpoint
```
POST /auth/login
Content-Type: application/json
```

## Request body
```typescript
{
  email: string
  password: string
}
```

## Success response — 200
```typescript
{
  user: {
    id: string
    email: string
    name: string
    role: 'owner' | 'dispatcher'
  }
  tenant: {
    id: string
    name: string
    plan: string
  }
}
// + Set-Cookie: token=<jwt>; HttpOnly; SameSite=Lax; Path=/
```

## Error responses
```
400 { error: 'Validation failed' }      // missing fields
401 { error: 'Invalid credentials' }    // wrong email or password
403 { error: 'Account suspended' }      // trial expired + no subscription
429 { error: 'Too many attempts' }      // rate limit hit
```

## Business logic — step by step

### 1. Rate limiting (BEFORE any DB call)
5 attempts per IP per 15 minutes.
Use in-memory store (Map) keyed by IP.
On 6th attempt → 429, do not process.

### 2. Validate input with Zod
Email and password required.
Return 400 if missing.

### 3. Find user by email
```sql
SELECT u.*, t.id as tenant_id, t.name as tenant_name,
       t.plan, t.trial_ends_at, s.status as sub_status
FROM users u
JOIN tenants t ON t.id = u.tenant_id
LEFT JOIN subscriptions s ON s.tenant_id = t.id
WHERE u.email = $1
LIMIT 1
```
If not found → 401 (same message as wrong password — no enumeration).

### 4. Verify password
```typescript
const valid = await bcrypt.compare(password, user.password_hash)
if (!valid) → 401
```

### 5. Check subscription status
```typescript
const isTrialActive = tenant.plan === 'trial' 
  && new Date(tenant.trial_ends_at) > new Date()
const isSubscribed = sub.status === 'active'

if (!isTrialActive && !isSubscribed) → 403
```

### 6. Sign JWT
```typescript
payload = {
  sub: user.id,
  tenantId: user.tenant_id,
  role: user.role,
  plan: tenant.plan,
}
```

### 7. Set cookie + return 200
Same cookie config as register endpoint.

## Files to modify
```
backend/src/routes/auth.ts       ← add POST /auth/login
backend/src/services/auth.service.ts ← add loginUser()
```

## Acceptance criteria
- AC1: Valid credentials → 200 + JWT cookie
- AC2: Wrong password → 401
- AC3: Unknown email → 401 (same message, no enumeration)
- AC4: Expired trial, no subscription → 403
- AC5: 6th attempt from same IP in 15 min → 429
- AC6: JWT contains sub, tenantId, role, plan
- AC7: Cookie is httpOnly

## Security checklist
- [ ] Rate limiting applied BEFORE DB query
- [ ] Same error message for wrong email and wrong password
- [ ] No user data leaked in error responses
- [ ] bcrypt.compare used (not ==)
