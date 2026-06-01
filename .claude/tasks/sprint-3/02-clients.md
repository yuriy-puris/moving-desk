# Task: Clients — list, detail, history
**Sprint:** 3
**Scope:** both
**ID:** sprint-3/02-clients

## Backend endpoints

### GET /clients
Auth: required. Filter by tenant_id.
Query: search? (name or phone)
Response: clients with order_count

### GET /clients/:id
Detail + full order history

### PATCH /clients/:id
Update: name, email, notes only.
Phone is immutable (it's the lookup key).

## Frontend

### Clients page
Search bar (by name or phone).
Table: Name | Phone | Last move | Orders count | Actions
"New order" button on each row → pre-fills form with client data.

### Client detail (slide-over)
Contact info + notes (editable).
Order history list.
"New order" button.

## Acceptance criteria
- AC1: Search by phone returns correct client
- AC2: New order from client page pre-fills all known fields
- AC3: Order history shows all past orders
- AC4: Notes saved on blur (auto-save)
