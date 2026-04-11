"use client"

import Link from "next/link"
import { ArrowRight, Route, CheckCircle2, Circle } from "lucide-react"
import { getScenarioNarrative, getFlatReadingOrder } from "@/lib/scenario-narratives"
import { useJourneyProgress } from "@/hooks/use-journey-progress"

interface ScenarioNarrativeProps {
  scenario: string | undefined
}

export function ScenarioNarrative({ scenario }: ScenarioNarrativeProps) {
  const narrative = getScenarioNarrative(scenario)
  const flat = getFlatReadingOrder(scenario)
  const { visited, reset, hydrated } = useJourneyProgress(scenario)

  if (!narrative) return null

  const visitedCount = hydrated ? flat.filter(s => visited.has(s.path)).length : 0
  const totalSteps = flat.length
  const progressPct = totalSteps > 0 ? Math.round((visitedCount / totalSteps) * 100) : 0
  const isComplete = visitedCount === totalSteps && totalSteps > 0

  // Find first unvisited step for "Continue" link
  const nextUnvisited = hydrated ? flat.find(s => !visited.has(s.path)) : flat[0]
  const hasStarted = visitedCount > 0

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-5">
      {/* Intro */}
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2 shrink-0 mt-0.5">
          <Route className="size-4 text-primary" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold">Your Analytical Journey</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {narrative.intro}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {hydrated && hasStarted && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {isComplete ? "Journey complete" : `${visitedCount} of ${totalSteps} charts visited`}
            </span>
            <span className="text-xs font-medium tabular-nums">{progressPct}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-primary/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary/60 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Chapter overview */}
      <div className="grid gap-3 sm:grid-cols-2">
        {narrative.chapters.map((chapter, ci) => {
          const chapterVisited = hydrated
            ? chapter.steps.filter(s => visited.has(s.path)).length
            : 0
          const chapterDone = chapterVisited === chapter.steps.length
          const firstUnvisitedInChapter = chapter.steps.find(s => !visited.has(s.path))
          const chapterLink = firstUnvisitedInChapter?.path ?? chapter.steps[0].path

          return (
            <Link
              key={ci}
              href={chapterLink}
              className="group flex items-start gap-3 rounded-lg border border-border/40 bg-background/50 p-3 hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              <div className="mt-0.5">
                {chapterDone ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <Circle className="size-4 text-muted-foreground/40" />
                )}
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-semibold group-hover:text-primary transition-colors">
                  {ci + 1}. {chapter.title}
                </div>
                <div className="text-[11px] text-muted-foreground line-clamp-2">
                  {chapter.intro}
                </div>
                {hydrated && (
                  <div className="text-[10px] text-muted-foreground/60 tabular-nums">
                    {chapterVisited}/{chapter.steps.length} charts
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between pt-1">
        {nextUnvisited ? (
          <Link
            href={nextUnvisited.path}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {hasStarted ? "Continue" : "Start"}: {nextUnvisited.label}
            <ArrowRight className="size-3.5" />
          </Link>
        ) : (
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            All {totalSteps} charts explored
          </span>
        )}
        {hasStarted && hydrated && (
          <button
            onClick={(e) => {
              e.preventDefault()
              reset()
            }}
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            Reset progress
          </button>
        )}
      </div>
    </div>
  )
}
