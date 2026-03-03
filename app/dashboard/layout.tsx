import React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard/nav"
import { Paywall } from "@/components/dashboard/paywall"
import { getUserSubscription } from "@/lib/subscription"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('[v0] Dashboard layout: checking user session...')
  const user = await getCurrentUser()
  console.log('[v0] Dashboard layout: user =', user ? user.email : 'null')

  if (!user) {
    console.log('[v0] Dashboard layout: no user, redirecting to login')
    redirect("/auth/login?redirect=/dashboard")
  }

  // Check if user is an admin (bypass paywall)
  const isAdmin = user.is_admin === true

  if (!isAdmin) {
    const subscription = await getUserSubscription(user.id)

    // Show paywall if no active subscription
    if (!subscription.hasActiveSubscription) {
      return <Paywall user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={user} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
