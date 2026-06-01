# Task: Frontend App Shell
**Sprint:** 0
**Scope:** frontend
**ID:** sprint-0/01-frontend-app-shell

## User story
As a dispatcher, I want to open MovingDesk in a browser and see
a clean app shell with navigation so I can move between sections.

## What to build

### 1. Init Vite + React 18 + TypeScript
```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
```

### 2. Install dependencies
```bash
# UI
npx shadcn@latest init
npm install tailwindcss @tailwindcss/vite

# State + data fetching
npm install @tanstack/react-query zustand

# Routing
npm install react-router-dom

# Types
npm install -D @types/react @types/react-dom
```

### 3. Folder structure to create
```
frontend/src/
├── main.tsx
├── App.tsx
├── routes/
│   ├── OrdersPage.tsx        ← placeholder
│   ├── NewOrderPage.tsx      ← placeholder
│   ├── InvoicesPage.tsx      ← placeholder
│   └── ClientsPage.tsx       ← placeholder
├── components/
│   └── shared/
│       └── AppShell.tsx      ← topbar + nav
├── hooks/                    ← empty, ready for Sprint 1
├── store/
│   └── auth.store.ts         ← empty Zustand store
├── lib/
│   ├── api.ts                ← fetch wrapper, base URL from env
│   └── utils.ts              ← cn(), formatDate(), formatPhone(), formatCurrency()
└── types/
    └── index.ts              ← empty, ready for Sprint 1
```

### 4. App shell component (AppShell.tsx)
Topbar with:
- Left: "Moving**Desk**" logo (Moving = normal weight, Desk = green #1D9E75)
- Center: 4 nav tabs with icons
  - Orders (icon: layout-kanban)
  - New order (icon: plus)
  - Invoices (icon: file-invoice)
  - Clients (icon: users)
- Right: user avatar circle with initials

Active tab: highlighted background, full weight text.
Height: 44px. Border bottom: 0.5px.

### 5. Routing (App.tsx)
```
/ → redirect to /orders
/orders → OrdersPage
/new-order → NewOrderPage
/invoices → InvoicesPage
/clients → ClientsPage
```

### 6. Placeholder pages
Each page shows:
- Page title (h1)
- Empty state message
Nothing else — content comes in Sprint 2+.

### 7. Utils (lib/utils.ts)
```typescript
// These must exist and be correctly implemented:
cn(...classes) // tailwind class merge
formatDate(date: Date): string // → "Jun 15, 2026"
formatPhone(phone: string): string // → "(949) 555-0100"
formatCurrency(amount: number): string // → "$480"
```

### 8. TanStack Query setup (main.tsx)
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})
```

### 9. Environment file
```
frontend/.env.example:
VITE_API_URL=http://localhost:3000
```

### 10. Package.json scripts
```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit",
  "lint": "eslint src --ext ts,tsx"
}
```

## Acceptance criteria
- AC1: `npm run dev` starts without errors
- AC2: App loads in browser, topbar visible with 4 tabs
- AC3: Each tab navigates to correct route
- AC4: Active tab is visually highlighted
- AC5: `npm run typecheck` passes with zero errors
- AC6: `npm run lint` passes with zero errors
- AC7: formatDate(new Date('2026-06-15')) returns "Jun 15, 2026"
- AC8: formatCurrency(480) returns "$480"
- AC9: Mobile layout works on 390px width

## Out of scope
- Auth, login, protected routes (Sprint 1)
- Real data, API calls (Sprint 2+)
- PDF generation (Sprint 3)
- Actual order form logic (Sprint 2)
