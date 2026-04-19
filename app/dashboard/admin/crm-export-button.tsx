"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2, Check } from "lucide-react"

export function CrmExportButton() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  async function handleExport() {
    setLoading(true)
    setError("")
    setDone(false)
    try {
      const res = await fetch("/api/admin/crm-export")
      if (!res.ok) throw new Error("Export failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = res.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/"/g, "") || "crm-export.csv"
      a.click()
      URL.revokeObjectURL(url)
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } catch {
      setError("Export failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
        ) : done ? (
          <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
        ) : (
          <Download className="h-3.5 w-3.5 mr-1" />
        )}
        {done ? "Downloaded" : "Export CRM CSV"}
      </Button>
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  )
}
