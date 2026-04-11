"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "tm-journey-progress"

interface ProgressState {
  [scenario: string]: string[]
}

function loadProgress(): ProgressState {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
  } catch {
    return {}
  }
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export function useJourneyProgress(scenario: string | undefined) {
  const [visited, setVisited] = useState<Set<string>>(new Set())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const all = loadProgress()
    const paths = scenario ? all[scenario] ?? [] : []
    setVisited(new Set(paths))
    setHydrated(true)
  }, [scenario])

  const markVisited = useCallback(
    (path: string) => {
      if (!scenario) return
      setVisited(prev => {
        if (prev.has(path)) return prev
        const next = new Set(prev)
        next.add(path)
        const all = loadProgress()
        all[scenario] = Array.from(next)
        saveProgress(all)
        return next
      })
    },
    [scenario]
  )

  const reset = useCallback(() => {
    if (!scenario) return
    setVisited(new Set())
    const all = loadProgress()
    delete all[scenario]
    saveProgress(all)
  }, [scenario])

  return { visited, markVisited, reset, hydrated }
}
