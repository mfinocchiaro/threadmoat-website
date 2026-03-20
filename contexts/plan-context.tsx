"use client"

import { createContext, useContext, ReactNode } from "react"
import { AccessTier } from "@/lib/tiers"

interface PlanContextValue {
  isFreeUser: boolean
  accessTier: AccessTier
}

const PlanContext = createContext<PlanContextValue>({ isFreeUser: false, accessTier: 'explorer' })

export function PlanProvider({ isFreeUser, accessTier, children }: { isFreeUser: boolean; accessTier: AccessTier; children: ReactNode }) {
  return <PlanContext.Provider value={{ isFreeUser, accessTier }}>{children}</PlanContext.Provider>
}

export function usePlan() {
  return useContext(PlanContext)
}
