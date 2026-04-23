import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { isAdmin } from '@/lib/admin'
import { getUserSubscription } from '@/lib/subscription'
import { getAccessTier, AccessTier } from '@/lib/tiers'

// Download entitlement rules by tier:
//   explorer   → none
//   analyst    → 1 download total across all reports
//   investor   → 1 download per report
//   strategist → 1 download per report
//   admin      → unlimited
type DownloadPolicy = 'none' | 'one_total' | 'one_per_report' | 'unlimited'

function getPolicy(tier: AccessTier): DownloadPolicy {
  switch (tier) {
    case 'explorer':   return 'none'
    case 'analyst':    return 'one_total'
    case 'investor':   return 'one_per_report'
    case 'strategist': return 'one_per_report'
    case 'admin':      return 'unlimited'
  }
}

// Ensure the table exists (idempotent — runs on cold start)
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS report_downloads (
      id            SERIAL PRIMARY KEY,
      user_id       TEXT        NOT NULL,
      report_slug   TEXT        NOT NULL,
      downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT report_downloads_user_report_uq UNIQUE (user_id, report_slug)
    )
  `
}

async function getSession() {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) return null
  return session
}

async function resolveTier(userId: string, email: string): Promise<AccessTier> {
  const admin = await isAdmin(userId, email)
  if (admin) return 'admin'
  const sub = await getUserSubscription(userId)
  return getAccessTier(sub.productId, false)
}

// GET /api/reports/download
// Returns the list of report slugs the user has already downloaded,
// plus their tier, so the client can compute per-report eligibility.
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user!.id!
  const email = session.user!.email!

  try {
    await ensureTable()

    const tier = await resolveTier(userId, email)
    const rows = await sql`
      SELECT report_slug FROM report_downloads WHERE user_id = ${userId}
    `
    const downloaded: string[] = (rows as Array<Record<string, unknown>>).map(r => r.report_slug as string)

    return NextResponse.json({ tier, downloaded })
  } catch (err) {
    console.error('[reports/download GET]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// POST /api/reports/download
// Body: { slug: string }
// Checks entitlement then records the download. Returns:
//   { ok: true }                     → allowed, download recorded
//   { ok: false, reason: string }    → not allowed
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user!.id!
  const email = session.user!.email!

  let slug: string
  try {
    const body = await req.json()
    if (typeof body?.slug !== 'string' || !body.slug.trim()) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
    }
    slug = body.slug.trim()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  try {
    await ensureTable()

    const tier = await resolveTier(userId, email)
    const policy = getPolicy(tier)

    if (policy === 'none') {
      return NextResponse.json({ ok: false, reason: 'subscription_required' })
    }

    if (policy === 'unlimited') {
      // Still record for audit, but don't gate
      await sql`
        INSERT INTO report_downloads (user_id, report_slug)
        VALUES (${userId}, ${slug})
        ON CONFLICT (user_id, report_slug) DO NOTHING
      `
      return NextResponse.json({ ok: true })
    }

    // Check existing downloads
    const rows = await sql`
      SELECT report_slug FROM report_downloads WHERE user_id = ${userId}
    `
    const existing: string[] = (rows as Array<Record<string, unknown>>).map(r => r.report_slug as string)

    if (policy === 'one_total') {
      if (existing.length > 0 && !existing.includes(slug)) {
        return NextResponse.json({ ok: false, reason: 'limit_reached' })
      }
    }

    // one_per_report — if already downloaded this slug, still allow (re-download same report)
    // but block downloading a different report if limit reached
    // For one_total, re-downloading the same slug is the only permitted action once the slot is used

    // Insert (or silently skip duplicate)
    await sql`
      INSERT INTO report_downloads (user_id, report_slug)
      VALUES (${userId}, ${slug})
      ON CONFLICT (user_id, report_slug) DO NOTHING
    `

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[reports/download POST]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
