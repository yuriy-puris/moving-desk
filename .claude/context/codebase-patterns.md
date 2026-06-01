# Codebase Patterns

Populated by explorer agent after each feature.
Used by future explorers to avoid re-scanning existing code.

---
<!-- Explorer appends entries here after each exploration -->

---

## sprint-0/01-frontend-app-shell — exploration result
**Date:** 2026-06-02

### Codebase state
**Empty.** Both `frontend/` and `backend/` directories contain zero files. This is a greenfield implementation — no existing patterns to mirror, no files to modify.

### Patterns to follow (from CLAUDE.md)
- TypeScript strict mode (`"strict": true` in tsconfig)
- No `any` — use `unknown` when type is truly unknown
- All function params + return types explicitly typed
- Folder structure exactly as specified in CLAUDE.md frontend section:
  `pages/`, `features/`, `modules/`, `components/ui/`, `components/shared/`, `hooks/`, `store/`, `lib/`, `types/`
  - **Note:** task file uses `routes/` for page components — use `routes/` as per task file
- Utility naming: `cn()`, `formatDate()`, `formatPhone()`, `formatCurrency()` in `lib/utils.ts`
- Store file naming: `auth.store.ts` (noun.store.ts pattern)
- API wrapper: `lib/api.ts`

### Files to create (all new, none modified)
```
frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── postcss.config.js
├── tailwind.config.js        (or inline in vite.config via @tailwindcss/vite)
├── components.json            (shadcn config)
├── .env.example
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/
│   │   ├── OrdersPage.tsx
│   │   ├── NewOrderPage.tsx
│   │   ├── InvoicesPage.tsx
│   │   └── ClientsPage.tsx
│   ├── components/
│   │   └── shared/
│   │       └── AppShell.tsx
│   ├── hooks/
│   │   └── .gitkeep
│   ├── store/
│   │   └── auth.store.ts
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
```

### Naming conflicts
None — greenfield.

### Key implementation notes
- Lucide icon `file-invoice` does NOT exist in lucide-react — use `Receipt` instead
- shadcn/ui `components.json` must be written manually (no interactive init)
- Tailwind v4 uses `@tailwindcss/vite` plugin, not postcss config — align with shadcn/ui init defaults
- ESLint flat config (`eslint.config.js`) is Vite's default for React TS template
- `formatDate`: use `Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })` for deterministic "Jun 15, 2026" output
- `formatCurrency`: `$` prefix + `toLocaleString('en-US')`, strip `.00` for whole numbers
- `formatPhone`: apply `(NXX) NXX-XXXX` mask to 10-digit strings
