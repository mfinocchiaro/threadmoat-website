"use client"

import { ReactNode } from "react"
import { FilterProvider } from "@/contexts/filter-context"
import { ThesisProvider } from "@/contexts/thesis-context"

export function VizPageShell({ children }: { children: ReactNode }) {
  return (
    <FilterProvider>
      <ThesisProvider>
        {children}
      </ThesisProvider>
    </FilterProvider>
  )
}
