import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { isAdmin } from '@/lib/admin'

// GET /api/admin/funnel — conversion funnel data
export async function GET() {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!(await isAdmin(session.user.id, session.user.email))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Total signups (verified users)
  const [{ count: totalSignups }] = await sql`
    SELECT COUNT(*) AS count FROM users WHERE email_verified = true
  `

  // Completed onboarding
  const [{ count: onboardingCompleted }] = await sql`
    SELECT COUNT(*) AS count FROM profiles WHERE onboarding_completed = true
  `

  // Users who viewed at least one chart page (any analytics event with route starting with /dashboard/)
  const [{ count: firstChartView }] = await sql`
    SELECT COUNT(DISTINCT user_id) AS count FROM analytics_events
    WHERE event_type = 'page_view' AND route LIKE '/dashboard/%'
      AND route NOT IN ('/dashboard', '/dashboard/settings', '/dashboard/explore')
  `

  // Users who upgraded (active subscription that isn't explorer trial)
  const [{ count: upgraded }] = await sql`
    SELECT COUNT(*) AS count FROM subscriptions
    WHERE status = 'active' AND product_id NOT IN ('explorer_trial', 'coupon_trial')
  `

  return NextResponse.json({
    funnel: [
      { stage: 'Signups', count: Number(totalSignups) },
      { stage: 'Onboarded', count: Number(onboardingCompleted) },
      { stage: 'First Chart', count: Number(firstChartView) },
      { stage: 'Upgraded', count: Number(upgraded) },
    ],
  })
}
