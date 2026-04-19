import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'

async function isAdmin(userId: string, email: string): Promise<boolean> {
  const rows = await sql`SELECT is_admin FROM profiles WHERE id = ${userId}`
  if (rows[0]?.is_admin === true) return true

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean)
  return adminEmails.includes(email)
}

// GET /api/admin/users — list all users with profile, subscription, and analytics
export async function GET() {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!(await isAdmin(session.user.id, session.user.email))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

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
      (SELECT MAX(ae.created_at) FROM analytics_events ae WHERE ae.user_id = u.id) AS last_active,
      (SELECT COUNT(*) FROM analytics_events ae WHERE ae.user_id = u.id) AS event_count
    FROM users u
    LEFT JOIN profiles p ON p.id = u.id
    LEFT JOIN subscriptions s ON s.user_id = u.id
    ORDER BY u.created_at DESC
  `

  return NextResponse.json({ users })
}
