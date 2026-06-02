import type { JSX } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CompanyTab from '@/components/shared/CompanyTab'
import TeamTab from '@/components/shared/TeamTab'
import BillingTab from '@/components/shared/BillingTab'

export default function SettingsPage(): JSX.Element {
  return (
    <div className="p-4 max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Settings</h1>
      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="company"><CompanyTab /></TabsContent>
        <TabsContent value="team"><TeamTab /></TabsContent>
        <TabsContent value="billing"><BillingTab /></TabsContent>
      </Tabs>
    </div>
  )
}
