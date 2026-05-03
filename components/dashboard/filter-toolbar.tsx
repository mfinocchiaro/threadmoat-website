"use client"

import * as React from "react"
import Link from "next/link"
import { SlidersHorizontal, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useFilter, ECOSYSTEM_FLAGS } from "@/contexts/filter-context"
import { useCompanyData } from "@/contexts/company-data-context"
import {
  FilterDropdown,
  FundingRangeDropdown,
  OceanStrategyDropdown,
} from "./filter-toolbar-popover"
import { FilterOnboardingGuide } from "./filter-onboarding-guide"
import { ShortlistPanel } from "./shortlist-panel"

/* ---- Filter chip label mapping ---- */

const FILTER_LABELS: Record<string, string> = {
  investmentLists: "List",
  investmentTheses: "Thesis",
  deploymentModel: "Deploy",
  categoryTags: "Category",
  subsegments: "Segment",
  subcategories: "Subcategory",
  industries: "Industry",
  countries: "Country",
  lifecycle: "Lifecycle",
  fundingRound: "Round",
  sizeCategory: "Size",
  operatingModel: "OpModel",
  differentiationTags: "Diff",
  ecosystemFlags: "Eco",
}

/* ---- Options computation ---- */

function useFilterOptions() {
  const { companies, isLoading } = useCompanyData()

  const options = React.useMemo(() => {
    if (companies.length === 0) {
      return {
        investmentLists: [],
        subsegments: [],
        industries: [],
        countries: [],
        lifecycles: [],
        fundingRounds: [],
        categoryTags: [],
        sizeCategories: [],
        investmentTheses: [],
        fundingMin: 0,
        fundingMax: 0,
        deploymentModels: [],
      }
    }

    const investmentLists = Array.from(
      new Set(companies.map(c => c.investmentList).filter(Boolean))
    ).sort()
    const subsegments = Array.from(
      new Set(companies.map(c => c.subsegment).filter(Boolean))
    ).sort()
    // Subcategories — not computed here, will be contextual (see useSubcategoryOptions)
    const industries = Array.from(
      new Set(companies.flatMap(c => c.industriesServed || []).filter(Boolean))
    ).sort()
    const countries = Array.from(
      new Set(companies.map(c => c.country).filter(Boolean))
    ).sort()
    const lifecycles = Array.from(
      new Set(
        companies
          .map(c => c.lifecyclePhase || c.startupLifecyclePhase)
          .filter(Boolean)
      )
    ).sort()
    const fundingRounds = Array.from(
      new Set(companies.map(c => c.latestFundingRound).filter(Boolean))
    ).sort()

    // Category Tags sorted by frequency
    const catCount = new Map<string, number>()
    companies.forEach(c =>
      (c.categoryTags || []).forEach(t => {
        if (t) catCount.set(t, (catCount.get(t) || 0) + 1)
      })
    )
    const categoryTags = Array.from(catCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t)

    const sizeCategories = Array.from(
      new Set(companies.map(c => c.startupSizeCategory).filter(Boolean))
    ).sort()

    // Investment Theses sorted by frequency
    const thesisCount = new Map<string, number>()
    companies.forEach(c =>
      (c.investmentTheses || []).forEach(t => {
        if (t) thesisCount.set(t, (thesisCount.get(t) || 0) + 1)
      })
    )
    const investmentTheses = Array.from(thesisCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t)

    // Funding range
    const fundings = companies.map(c => c.totalFunding || 0).filter(f => f > 0)
    const fundingMin = fundings.length > 0 ? Math.min(...fundings) : 0
    const fundingMax = fundings.length > 0 ? Math.max(...fundings) : 0

    // Deployment models sorted by frequency
    const deployCount = new Map<string, number>()
    companies.forEach(c =>
      (c.deploymentModel || []).forEach(t => {
        if (t) deployCount.set(t, (deployCount.get(t) || 0) + 1)
      })
    )
    const deploymentModels = Array.from(deployCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t)

    return {
      investmentLists,
      subsegments,
      industries,
      countries,
      lifecycles,
      fundingRounds,
      categoryTags,
      sizeCategories,
      investmentTheses,
      fundingMin,
      fundingMax,
      deploymentModels,
    }
  }, [companies])

  return { options, isLoading }
}

/** Subcategory options — contextually filtered by selected Investment Lists */
function useSubcategoryOptions() {
  const { companies } = useCompanyData()
  const { filters } = useFilter()

  return React.useMemo(() => {
    // If investment lists are selected, only show subcategories from those lists
    const pool = filters.investmentLists.length > 0
      ? companies.filter(c => filters.investmentLists.includes(c.investmentList))
      : companies

    const catCount = new Map<string, number>()
    pool.forEach(c => {
      const cat = c.subcategories
      if (cat) catCount.set(cat, (catCount.get(cat) || 0) + 1)
    })
    return Array.from(catCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t)
  }, [companies, filters.investmentLists])
}

/* ---- Active filter chips ---- */

function ActiveFilterChips() {
  const { filters, removeFilter, clearAllFilters, activeFilterCount } = useFilter()

  if (activeFilterCount === 0) return null

  // Collect all active array filters into chips
  const chips: { type: string; label: string; value: string }[] = []

  const arrayKeys = [
    "investmentLists",
    "investmentTheses",
    "deploymentModel",
    "categoryTags",
    "subsegments",
    "subcategories",
    "industries",
    "countries",
    "lifecycle",
    "fundingRound",
    "sizeCategory",
    "operatingModel",
    "differentiationTags",
    "ecosystemFlags",
  ] as const

  for (const key of arrayKeys) {
    const values = filters[key] as string[]
    const label = FILTER_LABELS[key] || key
    for (const value of values) {
      const displayValue =
        key === "ecosystemFlags"
          ? ECOSYSTEM_FLAGS[value]?.label || value
          : value
      chips.push({ type: key, label, value: displayValue })
    }
  }

  // Ocean strategy chip
  if (filters.oceanStrategy !== "all") {
    chips.push({
      type: "oceanStrategy",
      label: "Ocean",
      value: filters.oceanStrategy === "red" ? "Red Ocean" : "Blue Ocean",
    })
  }

  // Funding range chip
  if (filters.fundingRange[0] !== 0 || filters.fundingRange[1] !== 0) {
    const lo = filters.fundingRange[0]
    const hi = filters.fundingRange[1]
    const fmt = (v: number) => {
      if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`
      if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`
      if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`
      return `$${v}`
    }
    chips.push({
      type: "fundingRange",
      label: "Funding",
      value: `${fmt(lo)} - ${fmt(hi)}`,
    })
  }

  return (
    <div className="flex items-center gap-2 px-3 sm:px-6 py-2">
      <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 flex flex-wrap gap-1.5 min-h-[28px]">
        {chips.map((chip, i) => (
          <Badge
            key={`${chip.type}-${chip.value}-${i}`}
            variant="secondary"
            className="gap-1 pr-1 text-xs font-normal"
          >
            <span className="text-muted-foreground text-[10px] font-medium uppercase">
              {chip.label}:
            </span>{" "}
            {chip.value}
            {chip.type !== "oceanStrategy" && chip.type !== "fundingRange" && (
              <button
                onClick={() => {
                  // For ecosystem flags, we need the original key not the display label
                  if (chip.type === "ecosystemFlags") {
                    const originalKey = Object.entries(ECOSYSTEM_FLAGS).find(
                      ([, def]) => def.label === chip.value
                    )?.[0]
                    if (originalKey) removeFilter(chip.type, originalKey)
                  } else {
                    removeFilter(chip.type, chip.value)
                  }
                }}
                className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={clearAllFilters}
        className="shrink-0 h-7 text-xs gap-1"
      >
        Clear all
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}

/* ---- Main toolbar ---- */

export function FilterToolbar() {
  const { topFilters, setTopFilters, activeFilterCount } = useFilter()
  const { options, isLoading } = useFilterOptions()
  const subcategoryOptions = useSubcategoryOptions()
  const { companies } = useCompanyData()

  const searchResults = React.useMemo(() => {
    if (!topFilters.search) return []
    const q = topFilters.search.toLowerCase()
    return companies
      .filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.subcategories?.toLowerCase().includes(q) ||
        c.categoryTags?.some(t => t.toLowerCase().includes(q))
      )
      .slice(0, 10)
  }, [companies, topFilters.search])

  if (isLoading) {
    return (
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-2 px-3 sm:px-6 py-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <div className="h-4 w-32 bg-muted/50 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 transition-all duration-200">
      {/* Onboarding callout for first-time users */}
      <FilterOnboardingGuide />

      {/* Active filter chips row */}
      {activeFilterCount > 0 ? (
        <ActiveFilterChips />
      ) : (
        <div className="flex items-center gap-2 px-3 sm:px-6 py-1.5">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">No filters active</span>
        </div>
      )}

      {/* Filter category buttons row */}
      <div className="flex items-center gap-1.5 px-3 sm:px-6 pb-2 flex-wrap">
        <FilterDropdown
          label="Investment List"
          filterKey="investmentLists"
          options={options.investmentLists}
          showColorDot
        />
        <FilterDropdown
          label="Subcategory"
          filterKey="subcategories"
          options={subcategoryOptions}
        />
        <FilterDropdown
          label="Thesis"
          filterKey="investmentTheses"
          options={options.investmentTheses}
        />
        <OceanStrategyDropdown />
        <FilterDropdown
          label="Deployment"
          filterKey="deploymentModel"
          options={options.deploymentModels}
        />
        <FilterDropdown
          label="Category"
          filterKey="categoryTags"
          options={options.categoryTags}
        />
        <FilterDropdown
          label="Industry"
          filterKey="industries"
          options={options.industries}
        />
        <FilterDropdown
          label="Country"
          filterKey="countries"
          options={options.countries}
        />
        <FilterDropdown
          label="Lifecycle"
          filterKey="lifecycle"
          options={options.lifecycles}
        />
        <FilterDropdown
          label="Funding Round"
          filterKey="fundingRound"
          options={options.fundingRounds}
        />
        <FilterDropdown
          label="Size"
          filterKey="sizeCategory"
          options={options.sizeCategories}
        />
        <FundingRangeDropdown
          min={options.fundingMin}
          max={options.fundingMax}
        />

        {/* Shortlist panel trigger */}
        <ShortlistPanel />

        {/* Inline search */}
        <div className="relative ml-auto w-64">
          <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search companies, investors..."
            value={topFilters.search}
            onChange={e =>
              setTopFilters(prev => ({ ...prev, search: e.target.value }))
            }
            className="h-7 pl-7 text-xs"
          />
          {topFilters.search && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-background border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto p-1">
              {searchResults.map(c => (
                <Link
                  key={c.id}
                  href={`/dashboard/company/${c.id}`}
                  onClick={() => setTopFilters(prev => ({ ...prev, search: "" }))}
                  className="flex items-center gap-2 px-2 py-1.5 text-xs rounded-sm hover:bg-muted transition-colors cursor-pointer"
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground text-[10px] truncate">{c.subcategories}</span>
                </Link>
              ))}
              {searchResults.length === 0 && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground italic">No companies found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
