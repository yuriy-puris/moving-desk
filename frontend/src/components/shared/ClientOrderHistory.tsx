import type { JSX } from 'react'
import { useOrders } from '@/hooks/useOrders'
import { formatDate, formatCurrency } from '@/lib/utils'

const STATUS_LABEL: Record<string, string> = {
  new: 'New', confirmed: 'Confirmed', in_progress: 'In progress',
  completed: 'Completed', closed: 'Closed', cancelled: 'Cancelled',
}

interface ClientOrderHistoryProps {
  clientName: string
}

export default function ClientOrderHistory({ clientName }: ClientOrderHistoryProps): JSX.Element {
  const { data: orders = [] } = useOrders()
  const clientOrders = orders.filter((o) => o.clientName === clientName)

  if (clientOrders.length === 0) {
    return <p className="text-sm text-gray-400">No orders found.</p>
  }

  return (
    <div className="space-y-2">
      {clientOrders.map((order) => (
        <div key={order.id} className="rounded-md border p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">{formatDate(new Date(order.moveDate))}</span>
            <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">{STATUS_LABEL[order.status] ?? order.status}</span>
          </div>
          <p className="text-gray-500 mt-0.5 truncate">{order.fromAddress} → {order.toAddress}</p>
          <p className="text-gray-700 font-medium mt-1">{formatCurrency(order.totalPrice)}</p>
        </div>
      ))}
    </div>
  )
}
