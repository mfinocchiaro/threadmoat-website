import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { isAdmin } from '@/lib/admin'
import { getAccessTier } from '@/lib/tiers'
import { PremiumGate } from '@/components/dashboard/premium-gate'
import { ReportsContent } from './content'

async function checkPaidTier(userId: string, email: string): Promise<boolean> {
  const admin = await isAdmin(userId, email)
  if (admin) return true

  try {
    const rows = await sql`SELECT product_id FROM subscriptions WHERE user_id = ${userId} AND status = 'active'`
    const productId = (rows[0]?.product_id as string) ?? null
    const tier = getAccessTier(productId, false)
    // Any paid tier (analyst, investor, strategist) gets access
    return tier !== 'explorer'
  } catch {
    return false
  }
}

export default async function ReportsPage() {
  const session = await auth()
  const isPremium = await checkPaidTier(session?.user?.id ?? '', session?.user?.email ?? '')

  return (
    <PremiumGate
      isPremium={isPremium}
      featureName="Report Generator"
      description="Search companies and generate detailed IC-memo style investment reports with score breakdowns, strengths, and weaknesses."
    >
      <ReportsContent />
    </PremiumGate>
  )
}
