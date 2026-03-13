import { sql } from '@/lib/db'
import { EXPLORER_TRIAL_PRODUCT } from '@/lib/explorer-trial'

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'expired'
  | 'none'

export interface UserSubscription {
  hasActiveSubscription: boolean
  status: SubscriptionStatus
  currentPeriodEnd: Date | null
  /** True when an Explorer trial has passed its end date */
  isExpiredTrial: boolean
  /** Days remaining on the current period (null if no subscription) */
  daysRemaining: number | null
  /** Raw product_id from subscriptions table — used for tier mapping */
  productId: string | null
}

export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  const rows = await sql`
    SELECT status, current_period_end, product_id
    FROM subscriptions
    WHERE user_id = ${userId}
  `
  const subscription = rows[0]

  const empty: UserSubscription = {
    hasActiveSubscription: false,
    status: 'none',
    currentPeriodEnd: null,
    isExpiredTrial: false,
    daysRemaining: null,
    productId: null,
  }

  if (!subscription) return empty

  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end as string)
    : null

  const productId = (subscription.product_id as string) || null
  const now = new Date()
  const isTrialing = subscription.status === 'trialing'
  const isPastEnd = periodEnd ? periodEnd < now : false
  const isExplorerProduct = productId === EXPLORER_TRIAL_PRODUCT || productId === 'coupon_trial'

  // If trial period has elapsed, treat as expired
  if (isTrialing && isPastEnd) {
    return {
      hasActiveSubscription: false,
      status: 'expired',
      currentPeriodEnd: periodEnd,
      isExpiredTrial: isExplorerProduct,
      daysRemaining: 0,
      productId,
    }
  }

  // If active subscription has passed its end date, treat as expired
  if (subscription.status === 'active' && isPastEnd) {
    return {
      hasActiveSubscription: false,
      status: 'expired',
      currentPeriodEnd: periodEnd,
      isExpiredTrial: false,
      daysRemaining: 0,
      productId,
    }
  }

  const daysRemaining = periodEnd
    ? Math.max(0, Math.ceil((periodEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)))
    : null

  const activeStatuses: SubscriptionStatus[] = ['active', 'trialing']

  return {
    hasActiveSubscription: activeStatuses.includes(subscription.status as SubscriptionStatus),
    status: subscription.status as SubscriptionStatus,
    currentPeriodEnd: periodEnd,
    isExpiredTrial: false,
    daysRemaining,
    productId,
  }
}
