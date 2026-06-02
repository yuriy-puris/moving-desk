import type { JSX } from 'react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import BaseRatesFields from './BaseRatesFields'
import LogoField from './LogoField'
import { useSettings, useUpdateSettings, useSubscription } from '@/hooks/useSettings'

const TIMEZONES = [
  { value: 'America/New_York', label: 'America/New_York (ET)' },
  { value: 'America/Chicago', label: 'America/Chicago (CT)' },
  { value: 'America/Denver', label: 'America/Denver (MT)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PT)' },
  { value: 'America/Anchorage', label: 'America/Anchorage (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Pacific/Honolulu (HT)' },
]

export default function CompanyTab(): JSX.Element {
  const { data: settings } = useSettings()
  const { data: sub } = useSubscription()
  const { mutate: save, isPending } = useUpdateSettings()
  const [name, setName] = useState('')
  const [timezone, setTimezone] = useState('America/Los_Angeles')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [rates, setRates] = useState<Record<string, number>>({ studio: 280, '1br': 380, '2br': 480, '3br': 620, house: 850 })
  const initialized = useRef(false)
  const isReadOnly = sub?.status !== 'trialing' && sub?.status !== 'active'

  useEffect(() => {
    if (settings && !initialized.current) {
      initialized.current = true
      setName(settings.companyName)
      setTimezone(settings.timezone)
      setRates({ ...settings.baseRates })
    }
  }, [settings])

  return (
    <div className="mt-4 space-y-5">
      <LogoField initialPreview={logoUrl} onPreviewChange={setLogoUrl} disabled={isReadOnly} />
      <div className="space-y-1.5">
        <Label htmlFor="companyName">Company name</Label>
        <Input id="companyName" value={name} onChange={(e) => setName(e.target.value)} disabled={isReadOnly} />
      </div>
      <div className="space-y-1.5">
        <Label>Timezone</Label>
        <Select value={timezone} onValueChange={setTimezone} disabled={isReadOnly}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{TIMEZONES.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <BaseRatesFields rates={rates} onChange={(k, v) => setRates((p) => ({ ...p, [k]: v }))} disabled={isReadOnly} />
      <Button onClick={() => save({ companyName: name, timezone, logoUrl, baseRates: rates })} disabled={isPending || isReadOnly}>
        {isPending ? 'Saving...' : 'Save changes'}
      </Button>
    </div>
  )
}
