"use client"

import Link from "next/link"
import { X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePinnedStartups } from "@/contexts/pinned-startups-context"
import { Badge } from "@/components/ui/badge"

export function PinnedBreadcrumb() {
  const { pinnedStartups, removePin, clearAllPins } = usePinnedStartups()

  if (pinnedStartups.length === 0) {
    return null
  }

  return (
    <div className="sticky top-0 z-10 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800 px-3 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
            Pinned
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
            {pinnedStartups.map((startup, idx) => (
              <div key={startup.id} className="flex items-center gap-1.5 flex-shrink-0">
                {idx > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                )}
                <Link
                  href={`/dashboard/company/${startup.id}`}
                  className="group"
                >
                  <Badge
                    variant="outline"
                    className="gap-1.5 bg-white dark:bg-slate-900 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer border-amber-200 dark:border-amber-700"
                  >
                    <span className="text-xs font-medium group-hover:underline">
                      {startup.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        removePin(startup.id)
                      }}
                      className="ml-0.5 rounded-full hover:bg-muted p-0.5 transition-colors flex-shrink-0"
                      aria-label={`Unpin ${startup.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllPins}
          className="h-7 text-xs gap-1 flex-shrink-0 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40"
        >
          Clear
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
