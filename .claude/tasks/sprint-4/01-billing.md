# Task: Stripe Billing
**Sprint:** 4
**Scope:** backend
**ID:** sprint-4/01-billing

## What to build

### On register (update auth.service.ts)
Create Stripe customer: stripe.customers.create({ email, name })
Save stripe_customer_id to subscriptions table.

### POST /billing/checkout
Auth: required, owner only.
Body: { plan: 'basic' | 'pro' }
Creates Stripe checkout session.
success_url: /billing/success
cancel_url: /billing

### POST /billing/portal
Auth: required, owner only.
Creates Stripe customer portal session.
Returns { url } for redirect.

### POST /billing/webhook (PUBLIC — no auth)
CRITICAL: verify Stripe signature first.
Handle events:
  customer.subscription.created → update subscription status
  customer.subscription.updated → update plan + status
  customer.subscription.deleted → set status=cancelled
  invoice.payment_failed → set status=past_due

### Plan enforcement middleware
```typescript
export const requireActiveSubscription = async (ctx, next) => {
  const plan = ctx.get('plan')
  const tenantId = ctx.get('tenantId')
  // check subscription status in DB
  // if cancelled/past_due → 402 { error: 'Subscription required' }
  await next()
}
```

## Trial expiry flow
Day 10: send email warning (cron or check on login)
Day 14: flag account as trial_expired
Day 21: set all orders read-only (checked in middleware)

## Acceptance criteria
- AC1: Checkout creates Stripe session, redirects correctly
- AC2: Webhook updates subscription status in DB
- AC3: Webhook rejects invalid Stripe signature → 400
- AC4: Cancelled subscription blocks API access → 402
- AC5: Customer portal opens for plan management
