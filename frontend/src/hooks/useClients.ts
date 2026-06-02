import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Client } from '@/types'

const MOCK_CLIENTS: Client[] = [
  {
    id: 'client-1', tenantId: 'mock-tenant-1',
    name: 'Rick Adams', phone: '(949) 632-9557',
    email: 'radams@example.com', notes: 'Prefers morning moves',
    orderCount: 1, lastMoveDate: '2026-06-15', createdAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'client-2', tenantId: 'mock-tenant-1',
    name: 'James Lee', phone: '(714) 555-0142',
    email: 'jlee@example.com', notes: '',
    orderCount: 3, lastMoveDate: '2026-06-10', createdAt: '2025-03-15T10:00:00Z',
  },
  {
    id: 'client-3', tenantId: 'mock-tenant-1',
    name: 'Anna Brooks', phone: '(949) 555-0188',
    email: '', notes: 'Has fragile antiques',
    orderCount: 2, lastMoveDate: '2026-06-08', createdAt: '2025-08-20T10:00:00Z',
  },
  {
    id: 'client-4', tenantId: 'mock-tenant-1',
    name: 'Tom Wilson', phone: '(310) 555-0177',
    email: 'twilson@example.com', notes: '',
    orderCount: 1, lastMoveDate: '2026-06-20', createdAt: '2026-05-30T10:00:00Z',
  },
]

export function useClients(search?: string) {
  return useQuery<Client[]>({
    queryKey: ['clients', search ?? ''],
    queryFn: async () => {
      await new Promise<void>((r) => setTimeout(r, 300))
      if (!search) return [...MOCK_CLIENTS]
      const q = search.toLowerCase()
      return MOCK_CLIENTS.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q),
      )
    },
  })
}

export function useClient(id: string) {
  return useQuery<Client | null>({
    queryKey: ['client', id],
    queryFn: async () => MOCK_CLIENTS.find((c) => c.id === id) ?? null,
    enabled: id.length > 0,
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      await new Promise<void>((r) => setTimeout(r, 300))
      const client = MOCK_CLIENTS.find((c) => c.id === id)
      if (client) client.notes = notes
      return client
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  })
}

export function useClientByPhone(phone: string) {
  return useQuery<Client | null>({
    queryKey: ['client-lookup', phone],
    queryFn: async () => {
      await new Promise<void>((r) => setTimeout(r, 200))
      return MOCK_CLIENTS.find((c) => c.phone === phone) ?? null
    },
    enabled: phone.length >= 10,
  })
}
