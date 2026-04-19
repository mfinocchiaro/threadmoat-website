"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ArrowUpDown } from "lucide-react"

interface UserRow {
  id: string
  email: string
  email_verified: boolean
  signed_up_at: string
  full_name: string | null
  company: string | null
  title: string | null
  profile_type: string | null
  company_size: string | null
  is_admin: boolean
  marketing_consent: boolean
  onboarding_completed: boolean
  product_id: string | null
  subscription_status: string | null
  current_period_start: string | null
  current_period_end: string | null
  last_active: string | null
  event_count: number
}

function tierLabel(productId: string | null, isAdmin: boolean): string {
  if (isAdmin) return "Admin"
  if (!productId) return "None"
  if (productId === "coupon_trial" || productId === "explorer_trial") return "Explorer"
  if (productId === "analyst") return "Analyst"
  if (productId === "strategist_annual") return "Strategist"
  if (productId === "friends_access") return "Friends"
  return productId
}

function tierVariant(status: string | null): "default" | "secondary" | "destructive" | "outline" {
  if (!status) return "outline"
  if (status === "active") return "default"
  if (status === "trialing") return "secondary"
  return "destructive"
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatRelative(dateStr: string | null): string {
  if (!dateStr) return "Never"
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(dateStr)
}

function daysRemaining(periodEnd: string | null): string {
  if (!periodEnd) return "—"
  const diff = new Date(periodEnd).getTime() - Date.now()
  if (diff <= 0) return "Expired"
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return `${days}d left`
}

type SortKey = "signed_up_at" | "last_active" | "email" | "event_count"

export function UsersTable({ users }: { users: UserRow[] }) {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("signed_up_at")
  const [sortAsc, setSortAsc] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let result = users
    if (q) {
      result = users.filter(
        u =>
          u.email.toLowerCase().includes(q) ||
          (u.full_name || "").toLowerCase().includes(q) ||
          (u.company || "").toLowerCase().includes(q)
      )
    }
    return result.sort((a, b) => {
      let cmp = 0
      if (sortKey === "email") {
        cmp = a.email.localeCompare(b.email)
      } else if (sortKey === "event_count") {
        cmp = (a.event_count || 0) - (b.event_count || 0)
      } else {
        const aVal = a[sortKey] ? new Date(a[sortKey]!).getTime() : 0
        const bVal = b[sortKey] ? new Date(b[sortKey]!).getTime() : 0
        cmp = aVal - bVal
      }
      return sortAsc ? cmp : -cmp
    })
  }, [users, search, sortKey, sortAsc])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filtered.length} of {users.length} users
        </span>
      </div>

      <div className="rounded-lg border border-border overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-3 py-2 font-medium">
                <button onClick={() => toggleSort("email")} className="flex items-center gap-1 hover:text-foreground">
                  User <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left px-3 py-2 font-medium">Tier</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-left px-3 py-2 font-medium">Trial</th>
              <th className="text-left px-3 py-2 font-medium">
                <button onClick={() => toggleSort("last_active")} className="flex items-center gap-1 hover:text-foreground">
                  Last Active <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left px-3 py-2 font-medium">
                <button onClick={() => toggleSort("event_count")} className="flex items-center gap-1 hover:text-foreground">
                  Events <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left px-3 py-2 font-medium">
                <button onClick={() => toggleSort("signed_up_at")} className="flex items-center gap-1 hover:text-foreground">
                  Signed Up <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="px-3 py-2">
                  <div className="font-medium">{u.full_name || u.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {u.full_name ? u.email : ""}{u.company ? ` - ${u.company}` : ""}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <Badge variant={u.is_admin ? "default" : "outline"} className="text-xs">
                    {tierLabel(u.product_id, u.is_admin)}
                  </Badge>
                </td>
                <td className="px-3 py-2">
                  <Badge variant={tierVariant(u.subscription_status)} className="text-xs">
                    {u.subscription_status || "none"}
                  </Badge>
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {u.subscription_status === "trialing"
                    ? daysRemaining(u.current_period_end)
                    : "—"}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {formatRelative(u.last_active)}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {u.event_count || 0}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {formatDate(u.signed_up_at)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
