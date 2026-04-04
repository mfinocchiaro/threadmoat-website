"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react"
import { useCompanyData } from "@/contexts/company-data-context"
import type { Company } from "@/lib/company-data"
import { trackInteraction } from "@/lib/track-interaction"

const STORAGE_KEY = "threadmoat-shortlist"

interface ShortlistContextType {
  /** Add a company ID to the shortlist */
  add: (id: string) => void
  /** Remove a company ID from the shortlist */
  remove: (id: string) => void
  /** Toggle a company ID on/off the shortlist */
  toggle: (id: string) => void
  /** Check if a company ID is on the shortlist */
  has: (id: string) => boolean
  /** Remove all IDs from the shortlist */
  clear: () => void
  /** Number of shortlisted IDs */
  count: number
  /** Raw array of shortlisted company IDs */
  ids: string[]
  /** Stable Set of shortlisted IDs for reference-equality checks */
  idSet: Set<string>
  /** Resolved Company objects for current shortlisted IDs (stale IDs silently dropped) */
  shortlistedCompanies: Company[]
  /** Whether localStorage has been hydrated (false during SSR / first render) */
  hydrated: boolean
}

const ShortlistContext = createContext<ShortlistContextType | undefined>(undefined)

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const { companies } = useCompanyData()

  // K001 SSR-safe pattern: default to empty, hydrate from localStorage in useEffect
  const [ids, setIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage after mount (client-only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setIds(parsed.filter((v): v is string => typeof v === "string"))
        }
      }
    } catch {
      // localStorage unavailable or corrupted — start empty
    }
    setHydrated(true)
  }, [])

  // Persist to localStorage whenever ids change (skip pre-hydration to avoid overwriting)
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      // localStorage unavailable — shortlist is session-only
    }
  }, [ids, hydrated])

  // Stable Set for reference-equality downstream
  const idSet = useMemo(() => new Set(ids), [ids])

  const add = useCallback((id: string) => {
    setIds(prev => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const remove = useCallback((id: string) => {
    setIds(prev => prev.filter(i => i !== id))
  }, [])

  const toggle = useCallback((id: string) => {
    setIds(prev => {
      const removing = prev.includes(id)
      trackInteraction("shortlist_toggle", { companyId: id, action: removing ? "remove" : "add" })
      return removing ? prev.filter(i => i !== id) : [...prev, id]
    })
  }, [])

  const has = useCallback((id: string) => idSet.has(id), [idSet])

  const clear = useCallback(() => setIds([]), [])

  // Resolve IDs to Company objects, silently dropping stale/unknown IDs
  const shortlistedCompanies = useMemo(() => {
    if (ids.length === 0 || companies.length === 0) return []
    const companyMap = new Map(companies.map(c => [c.id, c]))
    return ids.reduce<Company[]>((acc, id) => {
      const company = companyMap.get(id)
      if (company) acc.push(company)
      return acc
    }, [])
  }, [ids, companies])

  const value = useMemo<ShortlistContextType>(
    () => ({
      add,
      remove,
      toggle,
      has,
      clear,
      count: ids.length,
      ids,
      idSet,
      shortlistedCompanies,
      hydrated,
    }),
    [add, remove, toggle, has, clear, ids, idSet, shortlistedCompanies, hydrated]
  )

  return (
    <ShortlistContext.Provider value={value}>
      {children}
    </ShortlistContext.Provider>
  )
}

export function useShortlist(): ShortlistContextType {
  const context = useContext(ShortlistContext)
  if (context === undefined) {
    throw new Error("useShortlist must be used within a ShortlistProvider")
  }
  return context
}
