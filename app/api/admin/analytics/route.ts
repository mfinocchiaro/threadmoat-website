import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { isAdmin } from '@/lib/admin'

// GET /api/admin/analytics — cohort analytics for admin dashboard
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!(await isAdmin(session.user.id, session.user.email))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const range = req.nextUrl.searchParams.get('range') || '30'
  const days = Math.min(Math.max(parseInt(range, 10) || 30, 7), 365)

  // Signups by day
  const signupsByDay = await sql`
    SELECT DATE(created_at) AS day, COUNT(*) AS count
    FROM users
    WHERE created_at >= NOW() - (${days} || ' days')::INTERVAL
      AND email_verified = true
    GROUP BY DATE(created_at)
    ORDER BY day
  `

  // Signups by profile type
  const signupsByType = await sql`
    SELECT p.profile_type, COUNT(*) AS count
    FROM users u
    JOIN profiles p ON p.id = u.id
    WHERE u.created_at >= NOW() - (${days} || ' days')::INTERVAL
      AND u.email_verified = true
    GROUP BY p.profile_type
    ORDER BY count DESC
  `

  // Active users by day (distinct users with page_view events)
  const activeByDay = await sql`
    SELECT DATE(created_at) AS day, COUNT(DISTINCT user_id) AS count
    FROM analytics_events
    WHERE event_type = 'page_view'
      AND created_at >= NOW() - (${days} || ' days')::INTERVAL
    GROUP BY DATE(created_at)
    ORDER BY day
  `

  // Top pages
  const topPages = await sql`
    SELECT route, COUNT(*) AS views, COUNT(DISTINCT user_id) AS unique_users
    FROM analytics_events
    WHERE event_type = 'page_view'
      AND created_at >= NOW() - (${days} || ' days')::INTERVAL
    GROUP BY route
    ORDER BY views DESC
    LIMIT 20
  `

  // Onboarding completion rate
  const totalUsers = await sql`
    SELECT COUNT(*) AS count FROM users
    WHERE email_verified = true
      AND created_at >= NOW() - (${days} || ' days')::INTERVAL
  `
  const onboardedUsers = await sql`
    SELECT COUNT(*) AS count FROM profiles
    WHERE onboarding_completed = true
      AND id IN (
        SELECT id FROM users
        WHERE email_verified = true
          AND created_at >= NOW() - (${days} || ' days')::INTERVAL
      )
  `

  // Conversion: trial → paid
  const trialUsers = await sql`
    SELECT COUNT(DISTINCT user_id) AS count FROM subscriptions
    WHERE (product_id = 'explorer_trial' OR product_id = 'explorer')
      AND created_at >= NOW() - (${days} || ' days')::INTERVAL
  `
  const paidUsers = await sql`
    SELECT COUNT(DISTINCT user_id) AS count FROM subscriptions
    WHERE product_id NOT IN ('explorer_trial', 'explorer')
      AND status = 'active'
      AND user_id IN (
        SELECT user_id FROM subscriptions
        WHERE product_id IN ('explorer_trial', 'explorer')
      )
  `

  // Tier distribution
  const tierDistribution = await sql`
    SELECT
      COALESCE(s.product_id, 'no_subscription') AS tier,
      COUNT(DISTINCT u.id) AS count
    FROM users u
    LEFT JOIN subscriptions s ON s.user_id = u.id
    WHERE u.email_verified = true
    GROUP BY COALESCE(s.product_id, 'no_subscription')
    ORDER BY count DESC
  `

  return NextResponse.json({
    range: days,
    signupsByDay,
    signupsByType,
    activeByDay,
    topPages,
    onboardingRate: {
      total: Number(totalUsers[0]?.count ?? 0),
      completed: Number(onboardedUsers[0]?.count ?? 0),
    },
    conversion: {
      trials: Number(trialUsers[0]?.count ?? 0),
      paid: Number(paidUsers[0]?.count ?? 0),
    },
    tierDistribution,
  })
}
