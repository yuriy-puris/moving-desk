# Task: Auth Pages — Register, Login, Quick Setup
**Sprint:** 1
**Scope:** frontend
**ID:** sprint-1/05-auth-pages

## User story
As a new user, I want to register and get to the app
in under 2 minutes without reading any instructions.

---

## Pages to build

### 1. RegisterPage (/register)

#### Layout
Centered card, max-width 400px.
Logo at top. Form below.

#### Fields
```
Company name     text input, required
Your name        text input, required
Email            email input, required
Password         password input, required, show/hide toggle
```

#### Submit button
"Start free trial — 14 days free"

#### Below button
"Already have an account? Log in" → /login

#### On submit
POST /auth/register
On success → redirect to /setup
On error 409 → "This email is already registered"
On error 400 → show field-level errors

---

### 2. LoginPage (/login)

#### Layout
Same as register — centered card.

#### Fields
```
Email      email input
Password   password input, show/hide toggle
```

#### Submit button
"Log in"

#### Below button
"No account yet? Start free trial" → /register

#### On submit
POST /auth/login
On success → redirect to /orders
On error 401 → "Invalid email or password"
On error 403 → redirect to /billing (trial expired)
On error 429 → "Too many attempts. Try again in 15 minutes."

---

### 3. QuickSetupPage (/setup)

Shown ONCE after register. Owner only.
Goal: get to wow-moment as fast as possible.

#### Layout
Centered, max-width 480px.
Progress indicator: "Step 1 of 1" (intentionally minimal)
Title: "One quick thing before you start"

#### Fields
```
Company logo    file upload, optional, accept: image/*
                shows preview after upload
                "Skip for now" text link below

Timezone        select dropdown
                Default: America/New_York
                Options: all US timezones
                  America/New_York (ET)
                  America/Chicago (CT)
                  America/Denver (MT)
                  America/Los_Angeles (PT)
                  America/Anchorage (AKT)
                  Pacific/Honolulu (HT)
```

#### Submit button
"Let's go →"

#### On submit
PATCH /settings (logo + timezone)
On success → redirect to /orders

#### Skip entirely
Small "Skip setup" link below button → redirect to /orders

---

### 4. JoinPage (/join)

Shown when dispatcher clicks invite link.
URL: /join?token=<uuid>

#### Layout
Centered card. Shows company name at top ("You're joining Smith Movers").

#### Fields
```
Your name    text input
Password     password input
```

#### Submit button
"Join team"

#### On submit
POST /users/join with token from URL query param
On success → redirect to /orders
On error 404 → "This invite link is invalid or expired"

---

## Auth store (Zustand)

```typescript
// store/auth.store.ts
interface AuthState {
  user: { id: string; email: string; name: string; role: string } | null
  tenant: { id: string; name: string; plan: string } | null
  isAuthenticated: boolean
  setAuth: (user, tenant) => void
  clearAuth: () => void
}
```

## Protected route wrapper

```typescript
// components/shared/ProtectedRoute.tsx
// If not authenticated → redirect to /login
// If authenticated → render children
// Check auth by calling GET /auth/me (see below)
```

## New API endpoint needed (backend)
```
GET /auth/me  (authenticated)
Response: { user: {...}, tenant: {...} }
```
Used by frontend on app load to restore auth state from cookie.

## API hooks

```typescript
// hooks/useAuth.ts
useRegister()   // mutation → POST /auth/register
useLogin()      // mutation → POST /auth/login
useLogout()     // mutation → POST /auth/logout
useMe()         // query   → GET /auth/me
```

## Files to create
```
frontend/src/routes/RegisterPage.tsx
frontend/src/routes/LoginPage.tsx
frontend/src/routes/QuickSetupPage.tsx
frontend/src/routes/JoinPage.tsx
frontend/src/components/shared/ProtectedRoute.tsx
frontend/src/hooks/useAuth.ts
frontend/src/store/auth.store.ts   ← implement (was empty)
```

## Files to modify
```
frontend/src/App.tsx  ← add /register, /login, /setup, /join routes
                         wrap protected routes with ProtectedRoute
```

## Acceptance criteria
- AC1: Register form submits, redirects to /setup on success
- AC2: Login form submits, redirects to /orders on success
- AC3: Wrong credentials shows inline error (no page reload)
- AC4: /orders redirects to /login if not authenticated
- AC5: Quick setup has working file preview for logo
- AC6: "Skip setup" goes directly to /orders
- AC7: Join page reads token from URL, creates account
- AC8: Auth state persists on page refresh (via GET /auth/me)

## Out of scope
- Forgot password flow (not in v1)
- Social login (not in v1)
- Email verification (not in v1)
