import type { JSX } from 'react'

export default function ClientsPage(): JSX.Element {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Clients</h1>
      <p className="mt-2 text-gray-500">No clients yet.</p>
    </div>
  )
}
