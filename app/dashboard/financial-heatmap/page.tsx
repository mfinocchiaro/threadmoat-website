"use client"

import { useEffect, useState, useMemo } from "react"
import { Company, loadCompanyData } from "@/lib/company-data"
import { FilterProvider, useFilter } from "@/contexts/filter-context"
import { VizFilterBar } from "@/components/viz-filter-bar"
import { FinancialHeatmapChart } from "@/components/charts/financial-heatmap-chart"
import { Skeleton } from "@/components/ui/skeleton"

function FinancialHeatmapInner() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { filterCompany } = useFilter()

  useEffect(() => {
    loadCompanyData().then((data) => {
      setCompanies(data)
      setIsLoading(false)
    })
  }, [])

  const filteredNames = useMemo(() => {
    return new Set(companies.filter(filterCompany).map((c) => c.name))
  }, [companies, filterCompany])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Financial Heatmap</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Startups ranked by financial health. Qualitative ratings (green = strong, red = weak) plus key numeric metrics across 500+ companies.
        </p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : (
        <>
          <VizFilterBar companies={companies} />
          <FinancialHeatmapChart className="min-h-[500px]" filteredCompanyNames={filteredNames} />
        </>
      )}
    </div>
  )
}

export default function FinancialHeatmapPage() {
  return (
    <FilterProvider>
      <FinancialHeatmapInner />
    </FilterProvider>
  )
}
