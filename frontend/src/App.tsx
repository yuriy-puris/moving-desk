import type { JSX } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from '@/components/shared/AppShell'
import OrdersPage from '@/routes/OrdersPage'
import NewOrderPage from '@/routes/NewOrderPage'
import InvoicesPage from '@/routes/InvoicesPage'
import ClientsPage from '@/routes/ClientsPage'

export default function App(): JSX.Element {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/orders" replace />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/new-order" element={<NewOrderPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/clients" element={<ClientsPage />} />
      </Routes>
    </AppShell>
  )
}
