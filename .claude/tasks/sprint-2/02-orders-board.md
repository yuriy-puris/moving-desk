# Task: Orders Board UI
**Sprint:** 2
**Scope:** frontend
**ID:** sprint-2/02-orders-board

## What to build

### Kanban board (OrdersPage)
4 columns: New | Confirmed | In progress | Done
Each column shows order cards.
Column header shows count badge.

### Order card
- Client name (bold)
- From → To (short, truncated)
- Move date
- Home size badge
- Crew name (if assigned)
- Color left border by status:
  New=blue, Confirmed=amber, In progress=green, Done=gray

### New order form (NewOrderPage)
Single screen — no wizard.
Fields:
  Phone (lookup on blur → auto-fill name/address)
  Client name
  From address
  To address
  Move date (date picker)
  Home size (pill buttons: Studio/1BR/2BR/3BR/House)
  From floor / To floor (number inputs)
  From elevator / To elevator (toggles)
  Packing (toggle)
  Assign crew (select from tenant crews)
  Notes (textarea)
  Live price calculation shown below form
Save button → POST /orders → redirect to board

### Status update
Click card → slide-over panel with order details
Status dropdown to change status
Save button → PATCH /orders/:id

## Acceptance criteria
- AC1: Board shows orders in correct columns
- AC2: Phone blur → auto-fills client data if found
- AC3: Size pills update live price
- AC4: Save creates order, card appears on board
- AC5: Status change moves card to correct column
