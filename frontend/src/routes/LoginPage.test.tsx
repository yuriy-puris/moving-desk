import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './LoginPage'
import { useAuthStore } from '@/store/auth.store'

function renderLogin(initialPath = '/login') {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/orders" element={<div>orders page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  useAuthStore.getState().clearAuth()
  vi.clearAllMocks()
})

describe('LoginPage', () => {
  it('renders email and password fields with submit button', () => {
    renderLogin()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('AC2 — correct credentials redirects to /orders', async () => {
    renderLogin()
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'owner@bestmovers.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret' },
    })
    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(screen.getByText('orders page')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('AC3 — wrong email shows inline error without redirect', async () => {
    renderLogin()
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret' },
    })
    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    }, { timeout: 2000 })

    // Should remain on login page
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('shows password toggle button', () => {
    renderLogin()
    const toggle = screen.getByRole('button', { name: '' })
    expect(toggle).toBeInTheDocument()
  })

  it('has link to register page', () => {
    renderLogin()
    expect(screen.getByRole('link', { name: /start free trial/i })).toHaveAttribute('href', '/register')
  })
})
