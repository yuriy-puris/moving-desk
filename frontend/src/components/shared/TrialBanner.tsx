import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import { useSubscription } from '@/hooks/useSettings'

export default function TrialBanner(): JSX.Element | null {
  const { data: sub } = useSubscription()

  if (!sub || sub.plan !== 'trial' || !sub.trialEndsAt) return null

  const daysLeft = Math.ceil(
    (new Date(sub.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  )

  if (daysLeft > 5) return null

  if (daysLeft <= 0) {
    return (
      <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-800 flex items-center justify-between">
        <span>Your trial has ended. Upgrade to continue.</span>
        <Link to="/settings" className="font-medium underline ml-2">Upgrade →</Link>
      </div>
    )
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800 flex items-center justify-between">
      <span>{daysLeft} day{daysLeft !== 1 ? 's' : ''} left in your trial.</span>
      <Link to="/settings" className="font-medium underline ml-2">Upgrade now →</Link>
    </div>
  )
}
