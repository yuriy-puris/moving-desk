# Task: POST /auth/logout + Auth Middleware
**Sprint:** 1
**Scope:** backend
**ID:** sprint-1/03-auth-logout-middleware

## Part A: POST /auth/logout

### Endpoint
```
POST /auth/logout
```
No body required. Must be authenticated.

### Response — 200
```typescript
{ message: 'Logged out' }
// + Set-Cookie: token=; HttpOnly; MaxAge=0 (clear cookie)
```

### Logic
Clear the JWT cookie by setting MaxAge=0.
No DB changes needed — stateless JWT.

---

## Part B: Auth Middleware

### Purpose
Verify JWT on every protected route.
Inject user context into Hono ctx.

### Implementation
```typescript
// middleware/auth.ts
export const authMiddleware = async (ctx, next) => {
  const token = getCookie(ctx, 'token')
  if (!token) return ctx.json({ error: 'Unauthorized' }, 401)

  const payload = verifyToken(token)
  if (!payload) return ctx.json({ error: 'Unauthorized' }, 401)

  // Inject into context
  ctx.set('userId', payload.sub)
  ctx.set('tenantId', payload.tenantId)
  ctx.set('role', payload.role)
  ctx.set('plan', payload.plan)

  await next()
}
```

### Role middleware
```typescript
export const requireOwner = async (ctx, next) => {
  if (ctx.get('role') !== 'owner') {
    return ctx.json({ error: 'Forbidden' }, 403)
  }
  await next()
}
```

### Usage pattern
```typescript
// Protected route — any authenticated user
app.get('/orders', authMiddleware, ordersHandler)

// Owner only route
app.post('/users/invite', authMiddleware, requireOwner, inviteHandler)
```

## Acceptance criteria
- AC1: POST /auth/logout clears the cookie
- AC2: Request without cookie → 401
- AC3: Request with invalid/expired JWT → 401
- AC4: Valid JWT → userId, tenantId, role, plan available in ctx
- AC5: requireOwner blocks dispatcher → 403
- AC6: requireOwner allows owner → passes through
