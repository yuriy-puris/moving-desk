import type { JSX } from 'react'
import { useState } from 'react'
import type { Client } from '@/types'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useUpdateClient } from '@/hooks/useClients'
import ClientOrderHistory from './ClientOrderHistory'

interface ClientDetailSheetProps {
  client: Client
  onNewOrder: (client: Client) => void
  onClose: () => void
}

export default function ClientDetailSheet({ client, onNewOrder, onClose }: ClientDetailSheetProps): JSX.Element {
  const [notes, setNotes] = useState(client.notes)
  const { mutate: updateClient } = useUpdateClient()

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{client.name}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-1 text-sm text-gray-600">
          <p>{client.phone}</p>
          {client.email && <p>{client.email}</p>}
        </div>
        <div className="mt-5 space-y-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => { if (notes !== client.notes) updateClient({ id: client.id, notes }) }}
            placeholder="Add notes about this client..."
            rows={3}
          />
          <p className="text-xs text-gray-400">Auto-saves on blur</p>
        </div>
        <div className="mt-5">
          <Button className="w-full" variant="outline" onClick={() => { onClose(); onNewOrder(client) }}>
            New order
          </Button>
        </div>
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Order history</h3>
          <ClientOrderHistory clientName={client.name} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
