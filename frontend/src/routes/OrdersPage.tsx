import type { JSX } from 'react'

export default function OrdersPage(): JSX.Element {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <p className="mt-2 text-gray-500">No orders yet.</p>
    </div>
  )
}
