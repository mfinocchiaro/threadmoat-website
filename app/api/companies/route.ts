import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { loadCompaniesFromCSV } from '@/lib/load-companies-server'
import { getUserSubscription } from '@/lib/subscription'
import { getAccessTier, TIER_COMPANY_LIMITS } from '@/lib/tiers'
import { rateLimit } from '@/lib/rate-limit'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const userEmail = session.user.email || ''

  const rl = await rateLimit(`api:companies:${userId}`, 30, 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    // Resolve access tier (mirrors dashboard/layout.tsx logic)
    let isAdmin = false
    try {
      const rows = await sql`SELECT is_admin FROM profiles WHERE id = ${userId}`
      isAdmin = rows[0]?.is_admin === true
    } catch {
      // DB unavailable — fall through to ADMIN_EMAILS check
    }

    if (!isAdmin) {
      const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)
      const baseEmail = userEmail.replace(/\+[^@]*@/, '@')
      isAdmin = adminEmails.includes(userEmail) || adminEmails.includes(baseEmail)
    }

    let productId: string | null = null
    if (!isAdmin) {
      try {
        const subscription = await getUserSubscription(userId)
        productId = subscription.productId
      } catch {
        // DB unavailable
      }
    }

    const accessTier = getAccessTier(productId, isAdmin)
    const limit = TIER_COMPANY_LIMITS[accessTier]

    let companies = await loadCompaniesFromCSV()
    const totalAvailable = companies.length

    if (limit !== null) {
      // Sort by weighted score descending and take top N
      companies = [...companies]
        .sort((a, b) => (b.weightedScore || 0) - (a.weightedScore || 0))
        .slice(0, limit)
    }

    return NextResponse.json({
      success: true,
      count: companies.length,
      totalAvailable,
      data: companies,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to load company data' },
      { status: 500 }
    )
  }
}
