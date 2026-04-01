"use client"

import * as React from "react"
import { Info, X } from "lucide-react"
import { useFilter } from "@/contexts/filter-context"

const STORAGE_KEY = "filter-onboarding-dismissed"

/**
 * Inline callout that teaches new users about the filter→chart workflow.
 * Dismisses permanently on click of the X button, or auto-dismisses
 * when the user applies their first filter (activeFilterCount 0 → >0).
 * Persists dismissal in localStorage so it never shows again.
 */
export function FilterOnboardingGuide() {
  // Start hidden to avoid hydration mismatch — we read localStorage in useEffect
  const [dismissed, setDismissed] = React.useState(true)
  const [hydrated, setHydrated] = React.useState(false)
  const { activeFilterCount } = useFilter()
  const prevFilterCount = React.useRef<number>(0)

  // Read localStorage after mount (client-only)
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== "true") {
        setDismissed(false)
      }
    } catch {
      // localStorage unavailable — stay hidden
    }
    setHydrated(true)
  }, [])

  // Auto-dismiss when user applies their first filter (0 → >0)
  React.useEffect(() => {
    if (!hydrated || dismissed) return

    if (prevFilterCount.current === 0 && activeFilterCount > 0) {
      dismiss()
    }
    prevFilterCount.current = activeFilterCount
  }, [activeFilterCount, hydrated, dismissed])

  function dismiss() {
    setDismissed(true)
    try {
      localStorage.setItem(STORAGE_KEY, "true")
    } catch {
      // localStorage unavailable — dismiss for this session only
    }
  }

  // Don't render anything if dismissed or not yet hydrated
  if (dismissed || !hydrated) return null

  return (
    <div
      role="status"
      className="flex items-center gap-2 px-6 py-1.5 bg-muted/40 border-b border-border/30 text-xs text-muted-foreground"
    >
      <Info className="h-3.5 w-3.5 shrink-0 text-blue-500" />
      <span>
        Filters apply to <strong className="font-medium text-foreground/80">all charts</strong> simultaneously — select any combination below to refine the view.
      </span>
      <button
        onClick={dismiss}
        aria-label="Dismiss filter guide"
        className="ml-auto shrink-0 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}
