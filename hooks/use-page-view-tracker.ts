"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * Tracks page views on dashboard route changes.
 * Fire-and-forget — failures are silently swallowed.
 * Uses keepalive so the request completes even on navigation away.
 */
export function usePageViewTracker() {
  const pathname = usePathname()
  const prevPathRef = useRef<string | null>(null)

  useEffect(() => {
    // Skip if pathname hasn't changed (initial mount dedupe)
    if (!pathname?.startsWith("/dashboard")) return
    if (pathname === prevPathRef.current) return
    prevPathRef.current = pathname

    // Non-blocking fire-and-forget
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "page_view",
        route: pathname,
      }),
      keepalive: true,
    }).catch(() => {
      // Silently swallow — analytics is best-effort
    })
  }, [pathname])
}
