import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { sql } from "@/lib/db"
import { UsersTable } from "./users-table"
import { CouponsSection } from "./coupons-section"
import { CrmExportButton } from "./crm-export-button"
import { Users, Ticket, Download } from "lucide-react"

async function isAdmin(userId: string, email: string): Promise<boolean> {
  const rows = await sql`SELECT is_admin FROM profiles WHERE id = ${userId}`
  if (rows[0]?.is_admin === true) return true
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean)
  return adminEmails.includes(email)
}

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    redirect("/auth/login")
  }
  if (!(await isAdmin(session.user.id, session.user.email))) {
    redirect("/dashboard")
  }

  // Fetch users server-side for initial render
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

  // Summary stats
  const totalUsers = users.length
  const activeTrials = users.filter((u: Record<string, unknown>) => u.subscription_status === "trialing").length
  const paidUsers = users.filter((u: Record<string, unknown>) =>
    u.subscription_status === "active" && u.product_id !== "coupon_trial" && u.product_id !== "explorer_trial"
  ).length

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          User management, coupons, and CRM tools
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border p-4 bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Total Users</span>
          </div>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="rounded-lg border border-border p-4 bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Ticket className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Active Trials</span>
          </div>
          <p className="text-2xl font-bold">{activeTrials}</p>
        </div>
        <div className="rounded-lg border border-border p-4 bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Download className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Paid Users</span>
          </div>
          <p className="text-2xl font-bold">{paidUsers}</p>
        </div>
      </div>

      {/* CRM Export */}
      <div className="rounded-lg border border-border p-4 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">CRM Export</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Download CSV of users with marketing consent
            </p>
          </div>
          <CrmExportButton />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border border-border p-4 bg-card space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          All Users
        </h3>
        <UsersTable users={users as never[]} />
      </div>

      {/* Coupons */}
      <div className="rounded-lg border border-border p-4 bg-card">
        <CouponsSection />
      </div>
    </div>
  )
}
