import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { isAdmin } from '@/lib/admin'

// GET /api/admin/users?page=1&limit=50 — list users with pagination
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!(await isAdmin(session.user.id, session.user.email))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const page = Math.max(parseInt(req.nextUrl.searchParams.get('page') || '1', 10), 1)
  const limit = Math.min(Math.max(parseInt(req.nextUrl.searchParams.get('limit') || '50', 10), 1), 200)
  const offset = (page - 1) * limit

  // Get total count
  const countResult = await sql`SELECT COUNT(*) AS total FROM users`
  const total = Number(countResult[0]?.total ?? 0)

  // Get paginated users with analytics aggregates
  const users = await sql`
    SELECT
      u.id,
      u.email,
      u.email_verified,
      u.created_at AS signed_up_at,
      p.full_name,
      p.company,
      p.title,
      p.profile_type,
      p.company_size,
      p.is_admin,
      p.marketing_consent,
      p.onboarding_completed,
      s.product_id,
      s.status AS subscription_status,
      s.current_period_start,
      s.current_period_end,
      COALESCE(ae.last_active, NULL) AS last_active,
      COALESCE(ae.event_count, 0) AS event_count
    FROM users u
    LEFT JOIN profiles p ON p.id = u.id
    LEFT JOIN subscriptions s ON s.user_id = u.id
    LEFT JOIN (
      SELECT user_id, MAX(created_at) AS last_active, COUNT(*) AS event_count
      FROM analytics_events
      GROUP BY user_id
    ) ae ON ae.user_id = u.id
    ORDER BY u.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  return NextResponse.json({ users, total, page, limit })
}
