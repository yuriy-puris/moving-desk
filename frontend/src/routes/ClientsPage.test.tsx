import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ClientsPage from './ClientsPage'

function renderClients() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/clients']}>
        <Routes>
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/new-order" element={<div>new order page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ClientsPage', () => {
  it('renders all mock clients', async () => {
    renderClients()
    await waitFor(() => {
      expect(screen.getByText('Rick Adams')).toBeInTheDocument()
      expect(screen.getByText('James Lee')).toBeInTheDocument()
      expect(screen.getByText('Anna Brooks')).toBeInTheDocument()
      expect(screen.getByText('Tom Wilson')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('AC1 — search filters clients by name', async () => {
    renderClients()
    await waitFor(() => screen.getByText('Rick Adams'))
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'rick' } })
    await waitFor(() => {
      expect(screen.getByText('Rick Adams')).toBeInTheDocument()
      expect(screen.queryByText('Tom Wilson')).not.toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('AC1 — search filters clients by phone', async () => {
    renderClients()
    await waitFor(() => screen.getByText('Rick Adams'))
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: '(714)' } })
    await waitFor(() => {
      expect(screen.getByText('James Lee')).toBeInTheDocument()
      expect(screen.queryByText('Rick Adams')).not.toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('AC2 — New order button navigates to /new-order', async () => {
    renderClients()
    await waitFor(() => screen.getAllByRole('button', { name: /new order/i }))
    fireEvent.click(screen.getAllByRole('button', { name: /new order/i })[0])
    await waitFor(() => {
      expect(screen.getByText('new order page')).toBeInTheDocument()
    })
  })

  it('shows table column headers', async () => {
    renderClients()
    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Phone')).toBeInTheDocument()
      expect(screen.getByText('Last move')).toBeInTheDocument()
      expect(screen.getByText('Orders')).toBeInTheDocument()
    }, { timeout: 1000 })
  })
})
