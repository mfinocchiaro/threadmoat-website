import React from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { getUserSubscription } from '@/lib/subscription'
import { getAccessTier } from '@/lib/tiers'
import { validateCoupon, redeemCoupon } from '@/lib/coupons'
import { DashboardLayoutClient } from '@/components/dashboard/layout-client'

type ProfileRow = {
  is_admin?: boolean
  full_name?: string
  company?: string
  title?: string
  profile_type?: string
  onboarding_completed?: boolean
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login?redirect=/dashboard')
  }

  const user = session.user
  const userId: string = user.id!

  let profile: ProfileRow | undefined
  try {
    const rows = await sql`
      SELECT is_admin, full_name, company, title, profile_type, onboarding_completed
      FROM profiles
      WHERE id = ${userId}
    `
    profile = rows[0] as ProfileRow | undefined
  } catch {
    // DB unavailable — fall through to ADMIN_EMAILS check below
  }

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean)

  // Match exact email or Gmail +alias (e.g. user+tag@gmail.com matches user@gmail.com)
  const userEmail = user.email || ''
  const baseEmail = userEmail.replace(/\+[^@]*@/, '@')
  const isAdmin = profile?.is_admin === true
    || adminEmails.includes(userEmail)
    || adminEmails.includes(baseEmail)

  let isExpiredTrial = false
  let daysRemaining: number | null = null
  let productId: string | null = null
  let hasSubscription = false

  if (!isAdmin) {
    try {
      const subscription = await getUserSubscription(userId)
      hasSubscription = subscription.hasActiveSubscription
      isExpiredTrial = subscription.isExpiredTrial
      daysRemaining = subscription.daysRemaining
      productId = subscription.productId
    } catch {
      // DB unavailable
    }

    // Login-time fallback: if user has an unredeemed invite_code and no active subscription,
    // auto-redeem it now. This catches cases where verifyEmail coupon redemption failed.
    if (!hasSubscription) {
      try {
        const userRows = await sql`SELECT invite_code FROM users WHERE id = ${userId}`
        const pendingCode = userRows[0]?.invite_code as string | null
        if (pendingCode) {
          const coupon = await validateCoupon(pendingCode)
          if (coupon) {
            await redeemCoupon(coupon.id, userId, coupon.duration_days, coupon.product_id, coupon.grant_status)
            await sql`UPDATE users SET invite_code = NULL WHERE id = ${userId}`
            console.log(`[dashboard] Login-time coupon redemption: ${pendingCode} for user ${userId}`)
            // Re-fetch subscription to pick up the new tier
            const refreshed = await getUserSubscription(userId)
            hasSubscription = refreshed.hasActiveSubscription
            isExpiredTrial = refreshed.isExpiredTrial
            daysRemaining = refreshed.daysRemaining
            productId = refreshed.productId
          }
        }
      } catch (err) {
        console.error('[dashboard] Login-time coupon fallback failed:', err)
      }
    }
  }

  const accessTier = getAccessTier(productId, isAdmin)
  const isFreeUser = accessTier === 'explorer'

  const showOnboarding = !isAdmin
    && profile?.profile_type != null
    && profile?.onboarding_completed !== true

  return (
    <DashboardLayoutClient
      user={user}
      profile={profile}
      initialScenario={profile?.profile_type}
      isAdmin={isAdmin}
      isFreeUser={isFreeUser}
      isExpiredTrial={isExpiredTrial}
      daysRemaining={daysRemaining}
      accessTier={accessTier}
      showOnboarding={showOnboarding}
    >
      {children}
    </DashboardLayoutClient>
  )
}
