"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

export interface PinnedStartup {
  id: string
  name: string
  addedAt: string
}

interface PinnedStartupsContextType {
  pinnedStartups: PinnedStartup[]
  addPin: (startupId: string, startupName: string) => void
  removePin: (startupId: string) => void
  clearAllPins: () => void
  isPinned: (startupId: string) => boolean
  maxPins: number
}

const PinnedStartupsContext = createContext<PinnedStartupsContextType | undefined>(undefined)

const MAX_PINS = 10
const STORAGE_KEY = "pinned-startups"

export function PinnedStartupsProvider({ children }: { children: React.ReactNode }) {
  const [pinnedStartups, setPinnedStartups] = useState<PinnedStartup[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setPinnedStartups(JSON.parse(stored))
      }
    } catch (err) {
      console.error('[pinned startups load]', err)
    }
    setMounted(true)
  }, [])

  // Persist to localStorage whenever the list changes
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedStartups))
    } catch (err) {
      console.error('[pinned startups save]', err)
    }
  }, [pinnedStartups, mounted])

  const addPin = useCallback((startupId: string, startupName: string) => {
    setPinnedStartups(prev => {
      // Don't add if already pinned
      if (prev.some(p => p.id === startupId)) {
        return prev
      }

      // Don't exceed max pins
      if (prev.length >= MAX_PINS) {
        return prev
      }

      return [
        ...prev,
        {
          id: startupId,
          name: startupName,
          addedAt: new Date().toISOString(),
        },
      ]
    })
  }, [])

  const removePin = useCallback((startupId: string) => {
    setPinnedStartups(prev => prev.filter(p => p.id !== startupId))
  }, [])

  const clearAllPins = useCallback(() => {
    setPinnedStartups([])
  }, [])

  const isPinned = useCallback((startupId: string): boolean => {
    return pinnedStartups.some(p => p.id === startupId)
  }, [pinnedStartups])

  if (!mounted) {
    // Return empty state during hydration to avoid mismatch
    return (
      <PinnedStartupsContext.Provider
        value={{
          pinnedStartups: [],
          addPin,
          removePin,
          clearAllPins,
          isPinned: () => false,
          maxPins: MAX_PINS,
        }}
      >
        {children}
      </PinnedStartupsContext.Provider>
    )
  }

  return (
    <PinnedStartupsContext.Provider
      value={{
        pinnedStartups,
        addPin,
        removePin,
        clearAllPins,
        isPinned,
        maxPins: MAX_PINS,
      }}
    >
      {children}
    </PinnedStartupsContext.Provider>
  )
}

export function usePinnedStartups() {
  const context = useContext(PinnedStartupsContext)
  if (!context) {
    throw new Error("usePinnedStartups must be used within PinnedStartupsProvider")
  }
  return context
}
