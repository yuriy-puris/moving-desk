# Task: Orders API — full CRUD
**Sprint:** 2
**Scope:** backend
**ID:** sprint-2/01-orders-api

## Endpoints

### GET /orders
Auth: required. Returns orders for tenant.
Query params: status?, date?, crew_id?
Response: { orders: Order[], total: number }
CRITICAL: always filter by tenant_id.

### POST /orders
Auth: required.
Body: { clientPhone, clientName, fromAddress, toAddress, moveDate,
        fromFloor, toFloor, fromElevator, toElevator,
        homeSize, packing, crewId?, notes? }
Logic:
  1. Validate with Zod
  2. Find or create client by phone (same tenant only)
  3. Calculate base_price from tenant settings.baseRates[homeSize]
  4. Add packing fee if packing=true (+$120 default)
  5. INSERT order with status='new'
Response: 201 + created order

### GET /orders/:id
Auth: required. Filter by tenant_id. 404 if not found.

### PATCH /orders/:id
Auth: required. Filter by tenant_id.
Allowed fields: status, crewId, notes, moveDate, fromAddress, toAddress
Status transitions:
  new → confirmed
  confirmed → in_progress
  in_progress → completed
  completed → closed
  any → cancelled
Invalid transition → 422

### DELETE /orders/:id
Soft delete: set status='cancelled'. Never hard delete.

## Crews endpoints
### GET /crews — list tenant crews
### POST /crews — create crew { name, truckLabel }
### PATCH /crews/:id — update
### DELETE /crews/:id — set active=false

## Acceptance criteria
- AC1: GET /orders only returns current tenant's orders
- AC2: POST /orders creates client if phone not found
- AC3: Invalid status transition → 422
- AC4: Deleted order sets status=cancelled, stays in DB
- AC5: Price calculated from tenant base rates
