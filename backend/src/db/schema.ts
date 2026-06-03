import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  logo_url: text('logo_url'),
  settings: jsonb('settings').default({}),
  plan: varchar('plan', { length: 20 }).default('trial'),
  trial_ends_at: timestamp('trial_ends_at'),
  created_at: timestamp('created_at').defaultNow(),
})

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password_hash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
})

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
})

export const crews = pgTable('crews', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id),
  name: varchar('name', { length: 255 }).notNull(),
  truck_label: varchar('truck_label', { length: 100 }),
  active: boolean('active').default(true),
  created_at: timestamp('created_at').defaultNow(),
})

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id),
  client_id: uuid('client_id').references(() => clients.id),
  crew_id: uuid('crew_id').references(() => crews.id),
  created_by: uuid('created_by')
    .notNull()
    .references(() => users.id),
  status: varchar('status', { length: 20 }).notNull().default('new'),
  move_date: date('move_date').notNull(),
  from_address: text('from_address').notNull(),
  to_address: text('to_address').notNull(),
  from_floor: integer('from_floor').default(1),
  to_floor: integer('to_floor').default(1),
  from_elevator: boolean('from_elevator').default(false),
  to_elevator: boolean('to_elevator').default(false),
  home_size: varchar('home_size', { length: 20 }).notNull(),
  packing: boolean('packing').default(false),
  notes: text('notes'),
  base_price: integer('base_price').notNull().default(0),
  total_price: integer('total_price').notNull().default(0),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id),
  order_id: uuid('order_id')
    .notNull()
    .references(() => orders.id),
  number: varchar('number', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  pdf_url: text('pdf_url'),
  share_token: uuid('share_token').unique().defaultRandom(),
  sent_at: timestamp('sent_at'),
  paid_at: timestamp('paid_at'),
  expires_at: timestamp('expires_at'),
  created_at: timestamp('created_at').defaultNow(),
})

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id')
    .unique()
    .notNull()
    .references(() => tenants.id),
  stripe_customer_id: varchar('stripe_customer_id', { length: 255 }),
  stripe_sub_id: varchar('stripe_sub_id', { length: 255 }),
  plan: varchar('plan', { length: 20 }).notNull().default('trial'),
  status: varchar('status', { length: 20 }).notNull().default('trialing'),
  current_period_end: timestamp('current_period_end'),
})

export const invites = pgTable('invites', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id),
  email: varchar('email', { length: 255 }).notNull(),
  token: uuid('token').unique().notNull().defaultRandom(),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow(),
})
