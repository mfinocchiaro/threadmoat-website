"use client"

import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, Copy, Check } from "lucide-react"

interface Coupon {
  id: string
  code: string
  type: string
  duration_days: number
  max_uses: number
  used_count: number
  expires_at: string | null
  created_by: string | null
  created_at: string
}

function formatDate(d: string | null): string {
  if (!d) return "Never"
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function CouponsSection() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Form state
  const [code, setCode] = useState("")
  const [type, setType] = useState<"trial" | "full">("trial")
  const [durationDays, setDurationDays] = useState("30")
  const [maxUses, setMaxUses] = useState("10")
  const [expiresAt, setExpiresAt] = useState("")

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/coupons")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setCoupons(data.coupons || [])
    } catch {
      setError("Failed to load coupons")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCoupons()
  }, [fetchCoupons])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError("")
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          type,
          duration_days: parseInt(durationDays),
          max_uses: parseInt(maxUses),
          expires_at: expiresAt || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to create coupon")
        return
      }
      setCode("")
      setDurationDays("30")
      setMaxUses("10")
      setExpiresAt("")
      setShowForm(false)
      fetchCoupons()
    } catch {
      setError("Failed to create coupon")
    } finally {
      setCreating(false)
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading coupons...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Coupons ({coupons.length})
        </h3>
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-3.5 w-3.5 mr-1" />
          New Coupon
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-lg border border-border p-4 space-y-3 bg-muted/30">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Code</Label>
              <Input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="MYCODE2026"
                required
                pattern="[A-Z0-9_-]{3,50}"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Type</Label>
              <select
                value={type}
                onChange={e => setType(e.target.value as "trial" | "full")}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="trial">Trial</option>
                <option value="full">Full Access</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Duration (days)</Label>
              <Input
                type="number"
                value={durationDays}
                onChange={e => setDurationDays(e.target.value)}
                min={1}
                max={365}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Max Uses</Label>
              <Input
                type="number"
                value={maxUses}
                onChange={e => setMaxUses(e.target.value)}
                min={1}
                max={10000}
                className="mt-1"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Expires At (optional)</Label>
              <Input
                type="date"
                value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={creating}>
              {creating && <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />}
              Create
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="rounded-lg border border-border overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-3 py-2 font-medium">Code</th>
              <th className="text-left px-3 py-2 font-medium">Type</th>
              <th className="text-left px-3 py-2 font-medium">Duration</th>
              <th className="text-left px-3 py-2 font-medium">Usage</th>
              <th className="text-left px-3 py-2 font-medium">Expires</th>
              <th className="text-left px-3 py-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{c.code}</code>
                    <button
                      onClick={() => copyCode(c.code)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {copiedCode === c.code ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <Badge variant={c.type === "full" ? "default" : "secondary"} className="text-xs">
                    {c.type}
                  </Badge>
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{c.duration_days}d</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {c.used_count}/{c.max_uses}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{formatDate(c.expires_at)}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{formatDate(c.created_at)}</td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                  No coupons created yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
