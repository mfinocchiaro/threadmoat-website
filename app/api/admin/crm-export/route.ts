import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { isAdmin, logAdminAction } from '@/lib/admin'

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const escape = (v: unknown) => {
    const s = v == null ? '' : String(v)
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  const lines = [
    headers.join(','),
    ...rows.map(row => headers.map(h => escape(row[h])).join(',')),
  ]
  return lines.join('\r\n')
}

// GET /api/admin/crm-export
// Returns CSV of all users who gave marketing_consent=true, joined with subscription status.
export async function GET() {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!(await isAdmin(session.user.id, session.user.email))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Audit log: PII export triggered
  await logAdminAction(session.user.id, 'crm_export', { email: session.user.email })

  const rows = await sql`
    SELECT
      u.id,
      u.email,
      u.created_at                  AS signed_up_at,
      p.full_name,
      p.company,
      p.title,
      p.phone,
      p.linkedin_url,
      p.company_size,
      p.profile_type,
      p.marketing_consent,
      s.status                      AS subscription_status,
      s.product_id,
      s.current_period_end
    FROM users u
    JOIN profiles p ON p.id = u.id
    LEFT JOIN subscriptions s ON s.user_id = u.id
    WHERE p.marketing_consent = true
    ORDER BY u.created_at DESC
  `

  const csv = toCsv(rows as Record<string, unknown>[])
  const filename = `threadmoat-crm-${new Date().toISOString().slice(0, 10)}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
