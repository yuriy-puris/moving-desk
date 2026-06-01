# Task Log

## Format
Each completed feature appended here by orchestrator.

---
<!-- entries added by orchestrator during development -->

---

## sprint-0/01-frontend-app-shell
**Date:** 2026-06-02
**Pipeline step:** analyze → in progress

### What is being built
A React 18 + Vite + TypeScript frontend application shell — the structural skeleton that every subsequent sprint will build on. No real data, no auth, no API calls. Pure UI scaffolding: routing, nav, providers, and utility functions.

Specifically:
- Vite project wired with TypeScript strict mode
- App shell component: fixed topbar (44px), logo left, 4 nav tabs center, avatar right
- Client-side routing via React Router v6: /, /orders, /new-order, /invoices, /clients
- TanStack Query v5 provider in main.tsx (staleTime 5min, retry 1)
- Zustand auth store (empty shell, ready for Sprint 1)
- Utility functions: cn(), formatDate(), formatPhone(), formatCurrency()
- shadcn/ui + Tailwind CSS installed and configured
- .env.example with VITE_API_URL

### Who uses it
All users (owner + dispatcher). No auth gate yet — Sprint 1 adds that.

### DB tables touched
None. Pure frontend, no API calls.

### Tenant isolation requirements
Not applicable for this task. No DB queries, no API calls.

### Acceptance criteria
- AC1: `npm run dev` starts without errors
- AC2: App loads in browser, topbar visible with 4 tabs
- AC3: Each tab navigates to correct route (/orders, /new-order, /invoices, /clients)
- AC4: Active tab is visually highlighted
- AC5: `npm run typecheck` passes with zero errors
- AC6: `npm run lint` passes with zero errors
- AC7: formatDate(new Date('2026-06-15')) returns "Jun 15, 2026"
- AC8: formatCurrency(480) returns "$480"
- AC9: Mobile layout works on 390px width

### Risks / assumptions
- shadcn/ui init requires interactive prompts — use components.json directly
- `file-invoice` Lucide icon may not exist — use `receipt` as fallback
- ESLint config from Vite template uses flat config (eslint.config.js)
- formatDate uses Intl.DateTimeFormat with en-US locale for determinism
- No test framework needed — this task is pure UI shell

### Files to create
```
frontend/
├── .env.example
├── package.json
├── vite.config.ts
├── tsconfig.json + tsconfig.app.json + tsconfig.node.json
├── index.html
├── components.json
├── eslint.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/ (4 placeholder pages)
│   ├── components/shared/AppShell.tsx
│   ├── hooks/.gitkeep
│   ├── store/auth.store.ts
│   ├── lib/api.ts + utils.ts
│   └── types/index.ts
```
