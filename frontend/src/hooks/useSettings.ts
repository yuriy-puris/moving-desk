import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Settings, TeamMember, Subscription } from '@/types'
import { ACTIVE_RATES } from '@/lib/pricing'

const MOCK_SETTINGS: Settings = {
  companyName: 'Best & Pro Moving Service',
  logoUrl: null,
  timezone: 'America/Los_Angeles',
  baseRates: { studio: 280, '1br': 380, '2br': 480, '3br': 620, house: 850 },
}

const MOCK_TEAM: TeamMember[] = [
  { id: 'user-1', name: 'John Smith', email: 'john@bestmovers.com', role: 'owner' },
  { id: 'user-2', name: 'Maria Garcia', email: 'maria@bestmovers.com', role: 'dispatcher' },
]

const MOCK_SUBSCRIPTION: Subscription = {
  plan: 'trial',
  status: 'trialing',
  trialEndsAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
}

export function useSettings() {
  return useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: async () => ({ ...MOCK_SETTINGS }),
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Settings>) => {
      await new Promise<void>((r) => setTimeout(r, 400))
      Object.assign(MOCK_SETTINGS, data)
      if (data.baseRates) Object.assign(ACTIVE_RATES, data.baseRates)
      return { ...MOCK_SETTINGS }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  })
}

export function useTeam() {
  return useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: async () => [...MOCK_TEAM],
  })
}

export function useInviteMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (email: string) => {
      await new Promise<void>((r) => setTimeout(r, 600))
      const member: TeamMember = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0] ?? email,
        email,
        role: 'dispatcher',
      }
      MOCK_TEAM.push(member)
      return member
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] }),
  })
}

export function useRemoveMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise<void>((r) => setTimeout(r, 300))
      const idx = MOCK_TEAM.findIndex((m) => m.id === id)
      if (idx !== -1) MOCK_TEAM.splice(idx, 1)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] }),
  })
}

export function useSubscription() {
  return useQuery<Subscription>({
    queryKey: ['subscription'],
    queryFn: async () => ({ ...MOCK_SUBSCRIPTION }),
  })
}
