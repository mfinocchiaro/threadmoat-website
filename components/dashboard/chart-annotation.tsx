"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Lightbulb, ChevronDown, ChevronUp, BookOpen } from "lucide-react"
import { useScenarioOptional } from "@/contexts/scenario-context"
import { getChartAnnotation, getFlatReadingOrder } from "@/lib/scenario-narratives"
import { useJourneyProgress } from "@/hooks/use-journey-progress"

export function ChartAnnotation() {
  const ctx = useScenarioOptional()
  const pathname = usePathname()
  const result = getChartAnnotation(ctx?.scenario, pathname)
  const { visited, markVisited, hydrated } = useJourneyProgress(ctx?.scenario)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (result && hydrated) {
      markVisited(pathname)
    }
  }, [pathname, result, hydrated, markVisited])

  if (!result) return null

  const {
    annotation,
    chapter,
    nextStep,
    currentIndex,
    totalSteps,
    chapterIndex,
    chapterStepIndex,
    chapterStepCount,
  } = result

  const flat = getFlatReadingOrder(ctx?.scenario)
  const visitedCount = hydrated ? flat.filter(s => visited.has(s.path)).length : 0
  const progressPct = totalSteps > 0 ? Math.round((visitedCount / totalSteps) * 100) : 0

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mb-4 space-y-2">
      {/* Header row — always visible */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="size-3.5 text-primary/70" />
          <span className="text-xs font-semibold text-primary/80">
            Chapter {chapterIndex + 1}: {chapter.title}
          </span>
          <span className="text-xs text-muted-foreground/60">
            ({chapterStepIndex + 1}/{chapterStepCount})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-primary/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/60 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground/60 tabular-nums">
              {visitedCount}/{totalSteps}
            </span>
          </div>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            {collapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Annotation body — collapsible */}
      {!collapsed && (
        <>
          <div className="flex items-start gap-3 pt-1">
            <Lightbulb className="size-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {annotation}
            </p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground/60">
              Step {currentIndex + 1} of {totalSteps}
            </span>
            {nextStep && (
              <Link
                href={nextStep.path}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Next: {nextStep.label}
                <ArrowRight className="size-3" />
              </Link>
            )}
            {!nextStep && visitedCount === totalSteps && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Journey complete
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
