# Task: POST /users/invite + POST /users/join
**Sprint:** 1
**Scope:** backend
**ID:** sprint-1/04-users-invite-join

## User story
As an owner, I want to invite a dispatcher by email
so they can access the company account with limited permissions.

---

## Part A: POST /users/invite

### Endpoint
```
POST /users/invite
Auth: required (owner only)
```

### Request body
```typescript
{ email: string }
```

### Response — 201
```typescript
{ message: 'Invite sent', email: string }
```

### Error responses
```
400 { error: 'Invalid email' }
403 { error: 'Forbidden' }          // not owner
409 { error: 'User already exists' } // email already registered
422 { error: 'User limit reached' }  // plan limit exceeded
```

### Business logic

#### 1. Check plan user limit
```typescript
const limits = { trial: 1, basic: 3, pro: 10 }
const currentUsers = await countUsersInTenant(tenantId)
if (currentUsers >= limits[plan]) → 422
```

#### 2. Check email not already a user
If email exists in users table → 409

#### 3. Create invite record
```sql
INSERT INTO invites (tenant_id, email, token, expires_at)
VALUES ($1, $2, gen_random_uuid(), NOW() + INTERVAL '48 hours')
```

#### 4. Send invite email via Resend
```
Subject: "You've been invited to MovingDesk"
Body: "Click to join: https://movingdesk.tbd/join?token=<token>"
```

---

## Part B: POST /users/join

### Endpoint
```
POST /users/join
Auth: NOT required (public endpoint)
```

### Request body
```typescript
{
  token: string   // UUID from invite email
  name: string    // min 2 chars
  password: string // min 8 chars
}
```

### Response — 201
```typescript
{
  user: { id, email, name, role: 'dispatcher' }
  tenant: { id, name, plan }
}
// + Set-Cookie: token=<jwt>; HttpOnly
```

### Error responses
```
400 { error: 'Validation failed' }
404 { error: 'Invalid or expired invite' }
```

### Business logic

#### 1. Find invite by token
```sql
SELECT * FROM invites
WHERE token = $1 AND expires_at > NOW()
LIMIT 1
```
If not found or expired → 404

#### 2. Create user
```sql
INSERT INTO users (tenant_id, email, password_hash, role, name)
VALUES ($1, $2, $3, 'dispatcher', $4)
```

#### 3. Delete invite (one-time use)
```sql
DELETE FROM invites WHERE id = $1
```

#### 4. Sign JWT + set cookie + return 201
Same pattern as register.

## Files to create/modify
```
backend/src/routes/users.ts          ← POST /users/invite, POST /users/join
backend/src/services/users.service.ts ← inviteUser(), joinUser(), countUsers()
```

## Acceptance criteria
- AC1: Owner invites → invite record created, email sent
- AC2: Dispatcher tries to invite → 403
- AC3: 4th user on Basic plan → 422
- AC4: Valid token → user created as dispatcher, logged in
- AC5: Expired token (>48h) → 404
- AC6: Token deleted after use (cannot reuse)
- AC7: Invited user role = 'dispatcher' always
