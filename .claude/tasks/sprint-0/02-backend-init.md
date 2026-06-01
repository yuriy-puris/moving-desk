# Task: Backend Init
**Sprint:** 0
**Scope:** backend
**ID:** sprint-0/02-backend-init

## User story
As a developer, I want a running backend with database schema
so I can start building API endpoints in Sprint 1.

## What to build

### 1. Init Node.js + TypeScript
```bash
cd backend
npm init -y
npm install hono @hono/node-server
npm install drizzle-orm @neondatabase/serverless
npm install pino dotenv zod
npm install -D typescript tsx drizzle-kit @types/node
npm install -D vitest supertest @types/supertest
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### 2. Folder structure to create
```
backend/src/
├── index.ts              ← Hono app + server start
├── routes/               ← empty, ready for Sprint 1
├── services/             ← empty, ready for Sprint 1
├── db/
│   ├── schema.ts         ← ALL table definitions (Drizzle)
│   └── index.ts          ← db client (Neon + Drizzle)
├── middleware/           ← empty, ready for Sprint 1
├── lib/
│   └── logger.ts         ← pino instance
└── types/
    └── index.ts          ← shared types
```

### 3. index.ts — Hono app
```typescript
// Must include:
// - GET /health → { status: 'ok', timestamp: ISO string }
// - CORS middleware: allow FRONTEND_URL, credentials: true
// - Pino request logging middleware
// - Global error handler → { error: message, status: code }
```

### 4. db/schema.ts — ALL 8 tables

#### tenants
```
id: uuid primary key default
name: varchar(255) not null
slug: varchar(100) unique not null
logo_url: text
settings: jsonb default '{}'
  // settings shape: { timezone: string, baseRates: Record<string, number> }
plan: varchar(20) default 'trial' -- trial | basic | pro
trial_ends_at: timestamp
created_at: timestamp default now()
```

#### users
```
id: uuid primary key default
tenant_id: uuid not null references tenants(id)
email: varchar(255) unique not null
password_hash: text not null
role: varchar(20) not null -- owner | dispatcher
name: varchar(255) not null
created_at: timestamp default now()
```

#### clients
```
id: uuid primary key default
tenant_id: uuid not null references tenants(id)
name: varchar(255) not null
phone: varchar(20)
email: varchar(255)
notes: text
created_at: timestamp default now()
```

#### crews
```
id: uuid primary key default
tenant_id: uuid not null references tenants(id)
name: varchar(255) not null
truck_label: varchar(100)
active: boolean default true
created_at: timestamp default now()
```

#### orders
```
id: uuid primary key default
tenant_id: uuid not null references tenants(id)
client_id: uuid references clients(id)
crew_id: uuid references crews(id)
created_by: uuid not null references users(id)
status: varchar(20) not null default 'new'
  -- new | confirmed | in_progress | completed | closed | cancelled
move_date: date not null
from_address: text not null
to_address: text not null
from_floor: integer default 1
to_floor: integer default 1
from_elevator: boolean default false
to_elevator: boolean default false
home_size: varchar(20) not null
  -- studio | 1br | 2br | 3br | house
packing: boolean default false
notes: text
base_price: integer not null default 0  -- cents
total_price: integer not null default 0 -- cents
created_at: timestamp default now()
updated_at: timestamp default now()
```

#### invoices
```
id: uuid primary key default
tenant_id: uuid not null references tenants(id)
order_id: uuid not null references orders(id)
number: varchar(20) not null  -- INV-1001, INV-1002...
status: varchar(20) not null default 'draft'
  -- draft | sent | paid
pdf_url: text
share_token: uuid unique default gen_random_uuid()
sent_at: timestamp
paid_at: timestamp
expires_at: timestamp  -- share token expiry, 7 days from sent_at
created_at: timestamp default now()
```

#### subscriptions
```
id: uuid primary key default
tenant_id: uuid unique not null references tenants(id)
stripe_customer_id: varchar(255)
stripe_sub_id: varchar(255)
plan: varchar(20) not null default 'trial'
status: varchar(20) not null default 'trialing'
  -- trialing | active | past_due | cancelled
current_period_end: timestamp
```

#### invites
```
id: uuid primary key default
tenant_id: uuid not null references tenants(id)
email: varchar(255) not null
token: uuid unique not null default gen_random_uuid()
expires_at: timestamp not null  -- 48 hours from created_at
created_at: timestamp default now()
```

### 5. db/index.ts — Neon client
```typescript
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

### 6. lib/logger.ts
```typescript
import pino from 'pino'
export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
})
```

### 7. Environment files
```
backend/.env.example:
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
RESEND_API_KEY=
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

### 8. tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### 9. drizzle.config.ts
```typescript
export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! }
}
```

### 10. Package.json scripts
```json
{
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "typecheck": "tsc --noEmit",
  "lint": "eslint src --ext ts",
  "test": "vitest run",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push"
}
```

## Acceptance criteria
- AC1: `npm run dev` starts, logs "Server running on port 3000"
- AC2: `GET /health` returns `{ status: 'ok', timestamp: '...' }`
- AC3: CORS allows requests from FRONTEND_URL with credentials
- AC4: All 8 tables defined in schema.ts with correct types
- AC5: `npm run typecheck` passes with zero errors
- AC6: `npm run lint` passes with zero errors
- AC7: `npm run db:push` runs without errors (requires DATABASE_URL)

## Out of scope
- Auth routes (Sprint 1)
- Any business logic (Sprint 1+)
- Stripe (Sprint 4)
- File upload (Sprint 4)
