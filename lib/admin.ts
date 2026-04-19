import { sql } from '@/lib/db'

/**
 * Check if a user has admin access.
 * Checks the profiles.is_admin DB flag first, then falls back to ADMIN_EMAILS env var.
 */
export async function isAdmin(userId: string, email: string): Promise<boolean> {
  const rows = await sql`SELECT is_admin FROM profiles WHERE id = ${userId}`
  if (rows[0]?.is_admin === true) return true

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean)
  return adminEmails.includes(email)
}

/**
 * Log an admin action to the analytics_events table for audit trail.
 */
export async function logAdminAction(
  userId: string,
  action: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await sql`
      INSERT INTO analytics_events (user_id, event_type, route, metadata)
      VALUES (${userId}, ${'admin_action'}, ${action}, ${JSON.stringify(metadata ?? {})})
    `
  } catch (err) {
    console.error('[logAdminAction] Failed to log:', err)
  }
}
