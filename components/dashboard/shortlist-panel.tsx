"use client"

import * as React from "react"
import { Star, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { useShortlist } from "@/contexts/shortlist-context"

/**
 * Toolbar trigger button + popover panel showing all shortlisted companies.
 * Renders a star icon with a badge count; clicking opens a scrollable list
 * with per-company remove buttons and a Clear All footer.
 */
export function ShortlistPanel() {
  const { shortlistedCompanies, remove, clear, count, hydrated } = useShortlist()
  const [open, setOpen] = React.useState(false)

  // Don't render the trigger until localStorage is hydrated to avoid count flash
  if (!hydrated) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-xs relative"
          aria-label={`Shortlist: ${count} companies`}
        >
          <Star
            className="h-3.5 w-3.5"
            fill={count > 0 ? "currentColor" : "none"}
          />
          Shortlist
          {count > 0 && (
            <Badge
              variant="secondary"
              className="h-4 min-w-4 px-1 text-[10px] font-semibold leading-none"
            >
              {count}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-72 p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="text-xs font-semibold">
            Shortlist ({count})
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] gap-1 text-muted-foreground hover:text-destructive"
            disabled={count === 0}
            onClick={() => {
              clear()
              setOpen(false)
            }}
          >
            <Trash2 className="h-3 w-3" />
            Clear All
          </Button>
        </div>

        {/* Company list */}
        {count === 0 ? (
          <div className="px-3 py-6 text-center">
            <Star className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Click the ★ on any company card to start building your shortlist
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-64">
            <div className="py-1">
              {shortlistedCompanies.map(company => (
                <div
                  key={company.id}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/50 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {company.name}
                    </p>
                    {company.subsegment && (
                      <Badge
                        variant="outline"
                        className="text-[9px] h-4 mt-0.5 max-w-[180px] truncate"
                      >
                        {company.subsegment}
                      </Badge>
                    )}
                  </div>
                  <button
                    onClick={() => remove(company.id)}
                    className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                    aria-label={`Remove ${company.name} from shortlist`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}
