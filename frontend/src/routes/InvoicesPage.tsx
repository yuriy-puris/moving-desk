import type { JSX } from 'react'

export default function InvoicesPage(): JSX.Element {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Invoices</h1>
      <p className="mt-2 text-gray-500">No invoices yet.</p>
    </div>
  )
}
