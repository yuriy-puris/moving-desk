import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import ClientDetailSheet from './ClientDetailSheet'
import type { Client } from '@/types'

const MOCK_CLIENT: Client = {
  id: 'client-1', tenantId: 'mock-tenant-1',
  name: 'Rick Adams', phone: '(949) 632-9557',
  email: 'radams@example.com', notes: 'Prefers morning moves',
  orderCount: 1, lastMoveDate: '2026-06-15', createdAt: '2026-06-01T10:00:00Z',
}

function renderSheet(onClose = () => {}, onNewOrder = () => {}) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <ClientDetailSheet client={MOCK_CLIENT} onClose={onClose} onNewOrder={onNewOrder} />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ClientDetailSheet', () => {
  it('AC3 — shows client contact info', () => {
    renderSheet()
    expect(screen.getByText('Rick Adams')).toBeInTheDocument()
    expect(screen.getByText('(949) 632-9557')).toBeInTheDocument()
    expect(screen.getByText('radams@example.com')).toBeInTheDocument()
  })

  it('AC4 — notes textarea pre-filled with client notes', () => {
    renderSheet()
    const textarea = screen.getByLabelText(/notes/i) as HTMLTextAreaElement
    expect(textarea.value).toBe('Prefers morning moves')
  })

  it('AC4 — notes can be edited', () => {
    renderSheet()
    const textarea = screen.getByLabelText(/notes/i) as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: 'Updated note' } })
    expect(textarea.value).toBe('Updated note')
  })

  it('AC4 — auto-saves on blur when notes changed', async () => {
    renderSheet()
    const textarea = screen.getByLabelText(/notes/i)
    fireEvent.change(textarea, { target: { value: 'New note content' } })
    fireEvent.blur(textarea)
    await waitFor(() => {
      expect(screen.getByText('Auto-saves on blur')).toBeInTheDocument()
    })
  })

  it('shows "New order" button', () => {
    renderSheet()
    expect(screen.getByRole('button', { name: /new order/i })).toBeInTheDocument()
  })

  it('AC3 — shows order history section', async () => {
    renderSheet()
    await waitFor(() => {
      expect(screen.getByText('Order history')).toBeInTheDocument()
    }, { timeout: 1000 })
  })
})
