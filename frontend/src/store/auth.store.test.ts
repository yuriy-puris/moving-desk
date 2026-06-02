import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './auth.store'
import type { User, Tenant } from '@/types'

const user: User = { id: 'u1', email: 'a@b.com', name: 'Alice', role: 'owner' }
const tenant: Tenant = { id: 't1', name: 'Movers Co', plan: 'trial' }

beforeEach(() => {
  useAuthStore.getState().clearAuth()
})

describe('auth store', () => {
  it('starts unauthenticated with no user or tenant', () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.tenant).toBeNull()
  })

  it('setAuth populates user, tenant and marks authenticated', () => {
    useAuthStore.getState().setAuth(user, tenant)
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(user)
    expect(state.tenant).toEqual(tenant)
  })

  it('clearAuth resets all state', () => {
    useAuthStore.getState().setAuth(user, tenant)
    useAuthStore.getState().clearAuth()
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.tenant).toBeNull()
  })

  it('setAuth called twice overwrites previous session', () => {
    const other: User = { id: 'u2', email: 'b@c.com', name: 'Bob', role: 'dispatcher' }
    const otherTenant: Tenant = { id: 't2', name: 'Other Co', plan: 'basic' }
    useAuthStore.getState().setAuth(user, tenant)
    useAuthStore.getState().setAuth(other, otherTenant)
    expect(useAuthStore.getState().user?.id).toBe('u2')
    expect(useAuthStore.getState().tenant?.id).toBe('t2')
  })
})
