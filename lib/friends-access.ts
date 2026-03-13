import { sql } from '@/lib/db'

/** Duration of Friends access in days (1 year) */
export const FRIENDS_ACCESS_DAYS = 365

/** Product ID for Friends tier — maps to Investor-level access */
export const FRIENDS_PRODUCT = 'friends_access'

/**
 * Grant Friends access (Tier 3 / Investor dashboards) for 1 year.
 * Intended for personal contacts — no payment required.
 * Uses upsert so it's safe to call multiple times.
 */
export async function createFriendsAccess(userId: string) {
  const now = new Date()
  const periodEnd = new Date(now.getTime() + FRIENDS_ACCESS_DAYS * 24 * 60 * 60 * 1000)

  await sql`
    INSERT INTO subscriptions (user_id, product_id, status, current_period_start, current_period_end)
    VALUES (
      ${userId},
      ${FRIENDS_PRODUCT},
      ${'active'},
      ${now.toISOString()},
      ${periodEnd.toISOString()}
    )
    ON CONFLICT (user_id) DO UPDATE SET
      product_id = EXCLUDED.product_id,
      status = EXCLUDED.status,
      current_period_start = EXCLUDED.current_period_start,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = NOW()
  `
}
