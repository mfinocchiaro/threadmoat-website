"use client"

import { ReactNode } from "react"
import { ThesisProvider } from "@/contexts/thesis-context"
import { useScenarioOptional } from "@/contexts/scenario-context"
import { ChartAnnotation } from "./chart-annotation"

function VizShellInner({ children }: { children: ReactNode }) {
  const ctx = useScenarioOptional()
  return (
    <ThesisProvider profileType={ctx?.scenario}>
      <ChartAnnotation />
      {children}
    </ThesisProvider>
  )
}

export function VizPageShell({ children }: { children: ReactNode }) {
  return <VizShellInner>{children}</VizShellInner>
}
