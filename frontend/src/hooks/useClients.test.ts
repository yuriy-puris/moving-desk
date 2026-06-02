import { describe, it, expect } from 'vitest'

// Pure search logic — mirrors useClients queryFn filter
function searchClients(clients: { name: string; phone: string }[], query: string) {
  const q = query.toLowerCase()
  return clients.filter(
    (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q),
  )
}

const CLIENTS = [
  { name: 'Rick Adams', phone: '(949) 632-9557' },
  { name: 'James Lee', phone: '(714) 555-0142' },
  { name: 'Anna Brooks', phone: '(949) 555-0188' },
  { name: 'Tom Wilson', phone: '(310) 555-0177' },
]

describe('client search logic (AC1)', () => {
  it('AC1 — search by full phone returns correct client', () => {
    const result = searchClients(CLIENTS, '(949) 632-9557')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Rick Adams')
  })

  it('AC1 — search by partial phone matches multiple', () => {
    const result = searchClients(CLIENTS, '(949)')
    expect(result).toHaveLength(2)
  })

  it('AC1 — search by name (case-insensitive)', () => {
    const result = searchClients(CLIENTS, 'james')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('James Lee')
  })

  it('AC1 — empty search returns all clients', () => {
    const result = searchClients(CLIENTS, '')
    expect(result).toHaveLength(4)
  })

  it('AC1 — no match returns empty array', () => {
    expect(searchClients(CLIENTS, 'zzz')).toHaveLength(0)
  })
})
