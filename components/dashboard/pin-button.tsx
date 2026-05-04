"use client"

import { Pin, PinOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePinnedStartups } from "@/contexts/pinned-startups-context"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface PinButtonProps {
  startupId: string
  startupName: string
  size?: "sm" | "md" | "lg"
  variant?: "ghost" | "outline"
}

export function PinButton({
  startupId,
  startupName,
  size = "sm",
  variant = "ghost",
}: PinButtonProps) {
  const { addPin, removePin, isPinned } = usePinnedStartups()
  const pinned = isPinned(startupId)

  const handleTogglePin = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (pinned) {
      removePin(startupId)
    } else {
      addPin(startupId, startupName)
    }
  }

  const iconSize = size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6"
  const buttonSize = size === "sm" ? "h-8 w-8" : size === "md" ? "h-9 w-9" : "h-10 w-10"

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size="icon"
            onClick={handleTogglePin}
            className={`${buttonSize} ${
              pinned
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            } transition-colors`}
            aria-pressed={pinned}
            aria-label={pinned ? `Unpin ${startupName}` : `Pin ${startupName}`}
          >
            {pinned ? (
              <Pin className={`${iconSize} fill-current`} />
            ) : (
              <PinOff className={iconSize} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          {pinned ? `Unpin ${startupName}` : `Pin ${startupName} for comparison`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
