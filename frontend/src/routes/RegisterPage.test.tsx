import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './RegisterPage'
import { useAuthStore } from '@/store/auth.store'

function renderRegister() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/setup" element={<div>setup page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  useAuthStore.getState().clearAuth()
})

describe('RegisterPage', () => {
  it('renders all required fields', () => {
    renderRegister()
    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('AC1 — successful register redirects to /setup', async () => {
    renderRegister()
    fireEvent.change(screen.getByLabelText(/company name/i), { target: { value: 'Best Movers' } })
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@best.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: /start free trial/i }))

    await waitFor(() => {
      expect(screen.getByText('setup page')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('AC1 — setAuth is called on success', async () => {
    renderRegister()
    fireEvent.change(screen.getByLabelText(/company name/i), { target: { value: 'Best Movers' } })
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@best.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: /start free trial/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    }, { timeout: 2000 })
  })

  it('has link to login page', () => {
    renderRegister()
    expect(screen.getByRole('link', { name: /log in/i })).toHaveAttribute('href', '/login')
  })
})
