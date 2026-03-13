import { sql } from '@/lib/db'

export interface Coupon {
  id: string
  code: string
  type: 'trial' | 'full'
  duration_days: number
  max_uses: number
  used_count: number
  expires_at: string | null
  created_at: string
  /** Subscription product_id to grant (e.g. 'coupon_trial', 'friends_access', 'investor_annual') */
  product_id: string
  /** Subscription status to create ('trialing' for trials, 'active' for full grants) */
  grant_status: string
}

export async function validateCoupon(code: string): Promise<Coupon | null> {
  const rows = await sql`
    SELECT id, code, type, duration_days, max_uses, used_count, expires_at, created_at, product_id, grant_status
    FROM coupons
    WHERE code = ${code.trim().toUpperCase()}
  `
  const coupon = rows[0] as Coupon | undefined
  if (!coupon) return null

  // Check usage limit
  if (coupon.used_count >= coupon.max_uses) return null

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return null

  return coupon
}

export async function redeemCoupon(couponId: string, userId: string, durationDays: number, productId = 'coupon_trial', grantStatus = 'trialing') {
  const now = new Date()
  const periodEnd = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000)

  // Increment usage
  await sql`
    UPDATE coupons SET used_count = used_count + 1 WHERE id = ${couponId}
  `

  // Create subscription with the coupon's tier and status
  await sql`
    INSERT INTO subscriptions (user_id, product_id, status, current_period_start, current_period_end)
    VALUES (${userId}, ${productId}, ${grantStatus}, ${now.toISOString()}, ${periodEnd.toISOString()})
    ON CONFLICT (user_id) DO UPDATE SET
      product_id = EXCLUDED.product_id,
      status = EXCLUDED.status,
      current_period_start = EXCLUDED.current_period_start,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = NOW()
  `
}
