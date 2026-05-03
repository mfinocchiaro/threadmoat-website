"use client"

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef, ReactNode } from "react"
import { Company } from "@/lib/company-data"
import { trackInteraction } from "@/lib/track-interaction"

interface FilterState {
  search: string
  investmentLists: string[]
  industries: string[]
  countries: string[]
  subsegments: string[]
  subcategories: string[]
  lifecycle: string[]
  fundingRound: string[]
  deploymentModel: string[]
  operatingModel: string[]
  categoryTags: string[]
  differentiationTags: string[]
  investmentTheses: string[]
  metrics: string
  oceanStrategy: "all" | "red" | "blue"
  sizeCategory: string[]
  ecosystemFlags: string[]
  fundingRange: [number, number] // [min, max] in dollars, [0,0] = no filter
}

interface FilterContextType {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  sidebarFilters: FilterState
  setSidebarFilters: React.Dispatch<React.SetStateAction<FilterState>>
  topFilters: FilterState
  setTopFilters: React.Dispatch<React.SetStateAction<FilterState>>
  isSidebarOpen: boolean
  filterCompany: (company: Company) => boolean
  getComposedFilters: () => FilterState
  activeFilterCount: number
  clearAllFilters: () => void
  removeFilter: (type: string, value: string) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export const DEFAULT_FILTERS: FilterState = {
  search: "",
  investmentLists: [],
  industries: [],
  countries: [],
  subsegments: [],
  subcategories: [],
  lifecycle: [],
  fundingRound: [],
  deploymentModel: [],
  operatingModel: [],
  categoryTags: [],
  differentiationTags: [],
  investmentTheses: [],
  metrics: "totalFunding",
  oceanStrategy: "all",
  sizeCategory: [],
  ecosystemFlags: [],
  fundingRange: [0, 0],
}

/** Binary flag definitions for ecosystem compatibility filtering */
export const ECOSYSTEM_FLAGS: Record<string, { label: string; field: keyof Company; group: string }> = {
  "SolidWorks": { label: "SolidWorks", field: "flagSolidWorks", group: "CAD Ecosystem" },
  "CATIA": { label: "CATIA", field: "flagCATIA", group: "CAD Ecosystem" },
  "Siemens": { label: "Siemens", field: "flagSiemens", group: "CAD Ecosystem" },
  "Parasolid": { label: "Parasolid", field: "flagParasolid", group: "CAD Ecosystem" },
  "STEP": { label: "STEP", field: "flagSTEP", group: "CAD Ecosystem" },
  "NURBS": { label: "NURBS", field: "flagNURBS", group: "CAD Ecosystem" },
  "ECAD/EDA": { label: "ECAD/EDA", field: "flagECAD", group: "CAD Ecosystem" },
  "Text-to-CAD": { label: "Text-to-CAD", field: "flagTextToCAD", group: "CAD Ecosystem" },
  "Proprietary": { label: "Proprietary", field: "flagProprietary", group: "CAD Ecosystem" },
  "FEA/FEM": { label: "FEA/FEM", field: "flagFEA", group: "Simulation" },
  "CFD": { label: "CFD", field: "flagCFD", group: "Simulation" },
  "Generative": { label: "Generative", field: "flagGenerative", group: "Modeling" },
  "Implicit": { label: "Implicit", field: "flagImplicit", group: "Modeling" },
  "HTE": { label: "HTE", field: "flagHTE", group: "Modeling" },
  "QC": { label: "QC", field: "flagQC", group: "Modeling" },
  "A&D": { label: "A&D", field: "flagAeroDefense", group: "Industry" },
  "Automotive": { label: "Automotive", field: "flagAutomotive", group: "Industry" },
  "Pharma": { label: "Pharma", field: "flagPharma", group: "Industry" },
  "MedDev": { label: "MedDev", field: "flagMedDev", group: "Industry" },
  "Process": { label: "Process", field: "flagProcess", group: "Industry" },
  "Y-Combinator": { label: "YC", field: "flagYCombinator", group: "Top VCs" },
  "a16z": { label: "a16z", field: "flagA16Z", group: "Top VCs" },
  "Techstars": { label: "Techstars", field: "flagTechstars", group: "Top VCs" },
  "Sequoia": { label: "Sequoia", field: "flagSequoia", group: "Top VCs" },
  "Insight Partners": { label: "Insight", field: "flagInsightPartners", group: "Top VCs" },
  "Eclipse Ventures": { label: "Eclipse", field: "flagEclipseVentures", group: "Top VCs" },
  "Browser-based": { label: "Browser", field: "flagBrowserBased", group: "Platform" },
}

/**
 * Red/Blue Ocean classification using the same scoring as the Maturity Matrix.
 *
 * Disruption Score = techDifferentiation * 0.6 + competitiveMoat * 0.4
 *
 * Red Ocean  — disruption < 3.0 — established, contested markets.
 *   M&A motivation: acquire customers, revenue, expertise, consulting org.
 *   Pattern: Siemens buys Mentor, Autodesk buys Moldflow.
 *
 * Blue Ocean — disruption >= 3.0 — uncontested new frontiers.
 *   M&A motivation: leverage existing tech into new domains.
 *   Pattern: Duro into Datacenters, Google Vertex as framework.
 */
export function getOceanType(company: Company): "red" | "blue" {
  const disruption = (company.techDifferentiation || 0) * 0.6 + (company.competitiveMoat || 0) * 0.4
  return disruption < 3.0 ? "red" : "blue"
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sidebarFilters, setSidebarFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [topFilters, setTopFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const getComposedFilters = useCallback((): FilterState => {
    // Sidebar = hypothesis (primary selection)
    // Top = refinement (narrows down sidebar results)
    // For arrays: intersection (AND logic)
    // For scalars: top takes precedence (refinement)

    const mergeArrays = (sidebar: string[], top: string[]): string[] => {
      if (sidebar.length === 0) return top
      if (top.length === 0) return sidebar
      return sidebar.filter(item => top.includes(item))
    }

    return {
      search: topFilters.search || sidebarFilters.search,
      investmentLists: mergeArrays(sidebarFilters.investmentLists, topFilters.investmentLists),
      industries: mergeArrays(sidebarFilters.industries, topFilters.industries),
      countries: mergeArrays(sidebarFilters.countries, topFilters.countries),
      subsegments: mergeArrays(sidebarFilters.subsegments, topFilters.subsegments),
      subcategories: mergeArrays(sidebarFilters.subcategories, topFilters.subcategories),
      lifecycle: mergeArrays(sidebarFilters.lifecycle, topFilters.lifecycle),
      fundingRound: mergeArrays(sidebarFilters.fundingRound, topFilters.fundingRound),
      deploymentModel: mergeArrays(sidebarFilters.deploymentModel, topFilters.deploymentModel),
      operatingModel: mergeArrays(sidebarFilters.operatingModel, topFilters.operatingModel),
      categoryTags: mergeArrays(sidebarFilters.categoryTags, topFilters.categoryTags),
      differentiationTags: mergeArrays(sidebarFilters.differentiationTags, topFilters.differentiationTags),
      investmentTheses: mergeArrays(sidebarFilters.investmentTheses, topFilters.investmentTheses),
      metrics: topFilters.metrics || sidebarFilters.metrics,
      oceanStrategy: topFilters.oceanStrategy !== "all" ? topFilters.oceanStrategy : sidebarFilters.oceanStrategy,
      sizeCategory: mergeArrays(sidebarFilters.sizeCategory, topFilters.sizeCategory),
      ecosystemFlags: mergeArrays(sidebarFilters.ecosystemFlags, topFilters.ecosystemFlags),
      fundingRange: ([sidebarFilters.fundingRange[0] || 0, sidebarFilters.fundingRange[1] || 0] as [number, number]).every(x => x === 0)
        ? topFilters.fundingRange
        : ([topFilters.fundingRange[0] || 0, topFilters.fundingRange[1] || 0] as [number, number]).every(x => x === 0)
        ? sidebarFilters.fundingRange
        : [
            Math.max(sidebarFilters.fundingRange[0], topFilters.fundingRange[0]),
            Math.min(sidebarFilters.fundingRange[1], topFilters.fundingRange[1]),
          ] as [number, number],
    }
  }, [sidebarFilters, topFilters])

  const filterCompany = useCallback((company: Company) => {
    const activeFilters = getComposedFilters()

    if (activeFilters.search) {
      const search = activeFilters.search.toLowerCase()
      const matchesSearch =
        company.name.toLowerCase().includes(search) ||
        company.tags?.some(t => t.toLowerCase().includes(search))
      if (!matchesSearch) return false
    }

    if (activeFilters.investmentLists.length > 0) {
      if (!activeFilters.investmentLists.includes(company.investmentList)) return false
    }

    if (activeFilters.industries.length > 0) {
      const hasIndustry = company.industriesServed?.some(ind => activeFilters.industries.includes(ind))
      if (!hasIndustry) return false
    }

    if (activeFilters.countries.length > 0) {
      if (!activeFilters.countries.includes(company.country)) return false
    }

    if (activeFilters.subsegments.length > 0) {
      if (!company.subsegment || !activeFilters.subsegments.includes(company.subsegment)) return false
    }

    if (activeFilters.subcategories.length > 0) {
      if (!company.subcategories || !activeFilters.subcategories.includes(company.subcategories)) return false
    }

    if (activeFilters.lifecycle.length > 0) {
      const phase = company.lifecyclePhase || company.startupLifecyclePhase
      if (!phase || !activeFilters.lifecycle.includes(phase)) return false
    }

    if (activeFilters.fundingRound.length > 0) {
      const round = company.latestFundingRound
      if (!round || !activeFilters.fundingRound.includes(round)) return false
    }

    if (activeFilters.deploymentModel.length > 0) {
      const hasModel = company.deploymentModel?.some(t => activeFilters.deploymentModel.includes(t))
      if (!hasModel) return false
    }

    if (activeFilters.operatingModel.length > 0) {
      const hasTag = company.operatingModelTags?.some(t => activeFilters.operatingModel.includes(t))
      if (!hasTag) return false
    }

    if (activeFilters.categoryTags.length > 0) {
      const hasTag = company.categoryTags?.some(t => activeFilters.categoryTags.includes(t))
      if (!hasTag) return false
    }

    if (activeFilters.differentiationTags.length > 0) {
      const hasTag = company.differentiationTags?.some(t => activeFilters.differentiationTags.includes(t))
      if (!hasTag) return false
    }

    if (activeFilters.investmentTheses.length > 0) {
      const hasThesis = company.investmentTheses?.some(t => activeFilters.investmentTheses.includes(t))
      if (!hasThesis) return false
    }

    if (activeFilters.oceanStrategy !== "all") {
      if (getOceanType(company) !== activeFilters.oceanStrategy) return false
    }

    if (activeFilters.sizeCategory.length > 0) {
      if (!company.startupSizeCategory || !activeFilters.sizeCategory.includes(company.startupSizeCategory)) return false
    }

    if (activeFilters.ecosystemFlags.length > 0) {
      const hasFlag = activeFilters.ecosystemFlags.some(flag => {
        const def = ECOSYSTEM_FLAGS[flag]
        return def && company[def.field] === true
      })
      if (!hasFlag) return false
    }

    if (activeFilters.fundingRange[0] !== 0 || activeFilters.fundingRange[1] !== 0) {
      const funding = company.totalFunding || 0
      if (funding < activeFilters.fundingRange[0] || funding > activeFilters.fundingRange[1]) return false
    }

    return true
  }, [getComposedFilters])

  const activeFilterCount = useMemo(() =>
    filters.investmentLists.length +
    filters.subsegments.length +
    filters.subcategories.length +
    filters.industries.length +
    filters.countries.length +
    filters.lifecycle.length +
    filters.fundingRound.length +
    filters.deploymentModel.length +
    filters.operatingModel.length +
    filters.categoryTags.length +
    filters.differentiationTags.length +
    filters.investmentTheses.length +
    (filters.fundingRange[0] !== 0 || filters.fundingRange[1] !== 0 ? 1 : 0) +
    filters.sizeCategory.length +
    filters.ecosystemFlags.length +
    (filters.oceanStrategy !== "all" ? 1 : 0),
  [filters])

  // Track filter changes — debounced to avoid spamming on rapid multi-select
  const prevFilterCountRef = useRef(0)
  useEffect(() => {
    // Skip initial mount (0 → 0) and no-change transitions
    if (activeFilterCount === prevFilterCountRef.current) return
    const prev = prevFilterCountRef.current
    prevFilterCountRef.current = activeFilterCount
    // Skip the initial 0 state
    if (prev === 0 && activeFilterCount === 0) return
    const timer = setTimeout(() => {
      trackInteraction("filter_change", { activeFilterCount, previousCount: prev })
    }, 500)
    return () => clearTimeout(timer)
  }, [activeFilterCount])

  const clearAllFilters = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      investmentLists: [],
      subsegments: [],
      subcategories: [],
      industries: [],
      countries: [],
      lifecycle: [],
      fundingRound: [],
      deploymentModel: [],
      operatingModel: [],
      categoryTags: [],
      differentiationTags: [],
      investmentTheses: [],
      fundingRange: [0, 0] as [number, number],
      search: "",
      oceanStrategy: "all",
      sizeCategory: [],
      ecosystemFlags: [],
    }))
  }, [setFilters])

  const removeFilter = useCallback((type: string, value: string) => {
    setFilters(prev => {
      const current = prev[type as keyof FilterState]
      if (Array.isArray(current)) {
        return { ...prev, [type]: (current as string[]).filter(v => v !== value) }
      }
      return prev
    })
  }, [setFilters])

  return (
    <FilterContext.Provider value={{ filters, setFilters, filterCompany, isSidebarOpen: true, activeFilterCount, clearAllFilters, removeFilter, sidebarFilters, setSidebarFilters, topFilters, setTopFilters, getComposedFilters }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider")
  }
  return context
}
