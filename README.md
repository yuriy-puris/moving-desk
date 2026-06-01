# MovingDesk

Multi-tenant B2B SaaS CRM for small moving companies (2–15 trucks) in the USA market. Simple, fast, mobile-first.

## Structure

```
/
├── backend/    Node.js 20 + Hono + TypeScript
└── frontend/   React 18 + Vite + TypeScript
```

## Stack

**Backend**
- [Hono](https://hono.dev) — lightweight web framework
- [Drizzle ORM](https://orm.drizzle.team) + [Neon](https://neon.tech) — PostgreSQL (serverless)
- JWT in httpOnly cookie — auth
- [Resend](https://resend.com) — transactional email
- [pino](https://getpino.io) — structured JSON logging
- Vitest + supertest — testing

**Frontend**
- [React 18](https://react.dev) + [Vite](https://vitejs.dev)
- [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com)
- [TanStack Query v5](https://tanstack.com/query) — server state
- [Zustand](https://zustand-demo.pmnd.rs) — client state
- [React Router v6](https://reactrouter.com) — routing

## Getting started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) Postgres database
- A [Resend](https://resend.com) API key

### Backend

```bash
cd backend
cp .env.example .env   # fill in values
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env   # fill in values
npm install
npm run dev
```

## Environment variables

**backend/.env**

```
DATABASE_URL=        # Neon connection string
JWT_SECRET=          # min 32 chars
JWT_EXPIRES_IN=7d
RESEND_API_KEY=
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

**frontend/.env**

```
VITE_API_URL=http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript type check |
| `npm run lint` | ESLint |
| `npm run test` | Run tests (backend only) |

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Railway |

## Architecture notes

- **Multi-tenant** — every DB query is scoped by `tenant_id`. No cross-tenant data access.
- **Auth** — JWT stored in httpOnly cookie, never localStorage. Rate limited to 5 req / 15 min on `/auth/*`.
- **Formatting** — phone `(949) 555-0100`, date `Jun 15 2026`, currency `$480`. US formats only.
