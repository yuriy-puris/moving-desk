# Task: Invoices — generate, send, share
**Sprint:** 3
**Scope:** both
**ID:** sprint-3/01-invoices

## Backend endpoints

### POST /invoices
Auth: required.
Body: { orderId }
Logic:
  1. Verify order belongs to tenant
  2. Auto-generate number: INV-1001, INV-1002...
  3. Set status='draft', expires_at=NOW()+7days
Response: 201 + invoice

### GET /invoices — list by tenant
### GET /invoices/:id — detail
### PATCH /invoices/:id/status — { status: 'sent'|'paid' }
### POST /invoices/:id/send — send PDF to client email via Resend
### GET /invoices/share/:token — PUBLIC, no auth
  Returns invoice data. 404 if expired.

## Frontend

### Invoices page
Left: list of invoices with status badges (Draft/Sent/Paid)
Right: invoice detail + actions

### Invoice detail
Rendered from order data:
  - Company logo + name
  - Invoice number + date
  - Client info
  - Move details (from/to/date/size)
  - Line items + total
  - Status badge

### Actions
  - Download PDF (@react-pdf/renderer)
  - Send to client (email)
  - Copy share link

### Public invoice page (/i/:token)
No auth. Client-facing.
Shows invoice details. "Mark as received" button.

## Acceptance criteria
- AC1: One click generates invoice from order
- AC2: PDF downloads with company logo and correct data
- AC3: Share link works without login, expires after 7 days
- AC4: Send button emails PDF to client
- AC5: Status updates: draft→sent→paid
