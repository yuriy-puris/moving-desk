import type { JSX } from 'react'
import type { Client } from '@/types'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

interface ClientTableRowProps {
  client: Client
  onViewDetails: (client: Client) => void
  onNewOrder: (client: Client) => void
}

export default function ClientTableRow({ client, onViewDetails, onNewOrder }: ClientTableRowProps): JSX.Element {
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <button type="button" onClick={() => onViewDetails(client)} className="text-sm font-medium text-gray-900 hover:underline text-left">
          {client.name}
        </button>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{client.phone}</td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {client.lastMoveDate ? formatDate(new Date(client.lastMoveDate)) : '—'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 text-center">{client.orderCount}</td>
      <td className="px-4 py-3">
        <Button size="sm" variant="outline" onClick={() => onNewOrder(client)}>
          New order
        </Button>
      </td>
    </tr>
  )
}
