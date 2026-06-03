export type UserRole = 'owner' | 'dispatcher'

export type Plan = 'trial' | 'basic' | 'pro'

export type OrderStatus = 'new' | 'confirmed' | 'in_progress' | 'completed' | 'closed' | 'cancelled'

export type InvoiceStatus = 'draft' | 'sent' | 'paid'

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled'

export type HomeSize = 'studio' | '1br' | '2br' | '3br' | 'house'

export interface TenantSettings {
  timezone: string
  baseRates: Record<string, number>
}

export interface JwtPayload {
  sub: string
  tenantId: string
  role: UserRole
  plan: Plan
  iat: number
  exp: number
}
