# Task: Company Settings + Team Management
**Sprint:** 4
**Scope:** both
**ID:** sprint-4/02-settings

## Backend endpoints

### GET /settings — tenant settings (owner only)
### PATCH /settings — update name, timezone, baseRates, logo_url

### POST /settings/logo — upload logo to Cloudflare R2
Returns { url } for logo_url

### GET /users — list team members (owner only)
### DELETE /users/:id — remove user (owner only, cannot remove self)

## Frontend

### Settings page (owner only — extra nav tab)

#### Company tab
  Logo upload with preview
  Company name
  Timezone select (US timezones)
  Base rates per home size (number inputs):
    Studio: $___
    1 BR: $___
    2 BR: $___
    3 BR: $___
    House: $___

#### Team tab
  List of users with role badges
  Invite button → email input → POST /users/invite
  Remove button (owner only, grayed out on self)

#### Billing tab
  Current plan badge
  Trial countdown (if trial)
  Upgrade button → POST /billing/checkout
  Manage billing → POST /billing/portal

## Trial countdown banner
Shows on all pages when trial < 5 days remaining.
"X days left in your trial. Upgrade now →"

## Read-only mode
When trial_expired and no active subscription:
  All inputs disabled
  Banner: "Your trial has ended. Upgrade to continue."
  Only billing page is accessible.

## Acceptance criteria
- AC1: Logo uploads and shows in invoices
- AC2: Base rates save and reflect in new order price calculation
- AC3: Invite sends email, new user appears in team list
- AC4: Remove user revokes their access immediately
- AC5: Trial banner appears with correct days remaining
- AC6: Read-only mode disables all form inputs
