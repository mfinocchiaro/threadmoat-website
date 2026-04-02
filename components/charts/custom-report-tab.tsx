"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { Company } from "@/lib/company-data"
import { useShortlist } from "@/contexts/shortlist-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  X,
  Plus,
  RotateCcw,
  Trash2,
  FileText,
  BarChart3,
  Sparkles,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface CustomReportTabProps {
  data: Company[]
}

interface ReportSections {
  companyProfile: boolean
  scoreBreakdown: boolean
  aiAnalysis: boolean
  bubbleChart: boolean
  quadrantChart: boolean
  periodicTable: boolean
  treemap: boolean
}

const DEFAULT_SECTIONS: ReportSections = {
  companyProfile: true,
  scoreBreakdown: true,
  aiAnalysis: false,
  bubbleChart: false,
  quadrantChart: false,
  periodicTable: false,
  treemap: false,
}

type SectionKey = keyof ReportSections

interface SectionConfig {
  key: SectionKey
  label: string
  description?: string
  warning?: string
  icon: React.ReactNode
  group: "content" | "charts"
}

const SECTION_OPTIONS: SectionConfig[] = [
  {
    key: "companyProfile",
    label: "Company Profile",
    description: "Overview, financials, strengths & risks",
    icon: <FileText className="h-4 w-4" />,
    group: "content",
  },
  {
    key: "scoreBreakdown",
    label: "Score Breakdown",
    description: "All 7 scoring dimensions with justifications",
    icon: <BarChart3 className="h-4 w-4" />,
    group: "content",
  },
  {
    key: "aiAnalysis",
    label: "AI Analysis",
    description: "LLM-generated narrative deep dive",
    warning: "Uses 1 AI generation per company (10/hour limit)",
    icon: <Sparkles className="h-4 w-4" />,
    group: "content",
  },
  {
    key: "bubbleChart",
    label: "Bubble Chart",
    description: "Funding vs. revenue scatter with score sizing",
    icon: <BarChart3 className="h-4 w-4" />,
    group: "charts",
  },
  {
    key: "quadrantChart",
    label: "Quadrant Chart",
    description: "Market opportunity vs. competitive moat",
    icon: <BarChart3 className="h-4 w-4" />,
    group: "charts",
  },
  {
    key: "periodicTable",
    label: "Periodic Table",
    description: "Category-based company grid layout",
    icon: <BarChart3 className="h-4 w-4" />,
    group: "charts",
  },
  {
    key: "treemap",
    label: "Treemap",
    description: "Funding allocation by segment",
    icon: <BarChart3 className="h-4 w-4" />,
    group: "charts",
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function CustomReportTab({ data }: CustomReportTabProps) {
  const { shortlistedCompanies } = useShortlist()

  // Mode: 'configure' or 'preview'
  const [mode, setMode] = useState<"configure" | "preview">("configure")

  // Company selection — pre-populated from shortlist
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([])
  const [initialized, setInitialized] = useState(false)

  // Section toggles
  const [sections, setSections] = useState<ReportSections>({ ...DEFAULT_SECTIONS })

  // Typeahead state
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Pre-populate from shortlist on mount / when shortlist changes
  useEffect(() => {
    if (!initialized && shortlistedCompanies.length > 0) {
      setSelectedCompanies(shortlistedCompanies)
      setInitialized(true)
    }
  }, [shortlistedCompanies, initialized])

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Typeahead suggestions — filtered by search, excluding already-selected
  const selectedIds = useMemo(
    () => new Set(selectedCompanies.map((c) => c.id)),
    [selectedCompanies]
  )

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return data
      .filter((c) => !selectedIds.has(c.id) && c.name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [data, searchQuery, selectedIds])

  // ─── Actions ─────────────────────────────────────────────────────────────

  const addCompany = useCallback(
    (company: Company) => {
      if (selectedIds.has(company.id)) return
      setSelectedCompanies((prev) => [...prev, company])
      setSearchQuery("")
      setShowSuggestions(false)
    },
    [selectedIds]
  )

  const removeCompany = useCallback((id: string) => {
    setSelectedCompanies((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setSelectedCompanies([])
  }, [])

  const resetToShortlist = useCallback(() => {
    setSelectedCompanies(shortlistedCompanies)
  }, [shortlistedCompanies])

  const toggleSection = useCallback((key: SectionKey) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const handleGenerate = useCallback(() => {
    if (selectedCompanies.length === 0) return
    setMode("preview")
  }, [selectedCompanies.length])

  const handleBackToConfigure = useCallback(() => {
    setMode("configure")
  }, [])

  // Derived state
  const hasCompanies = selectedCompanies.length > 0
  const contentSections = SECTION_OPTIONS.filter((s) => s.group === "content")
  const chartSections = SECTION_OPTIONS.filter((s) => s.group === "charts")
  const activeSectionCount = Object.values(sections).filter(Boolean).length
  const aiCompanyCount = sections.aiAnalysis ? selectedCompanies.length : 0

  // ─── Preview mode ────────────────────────────────────────────────────────

  if (mode === "preview") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={handleBackToConfigure}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to configuration
          </Button>
          <span className="text-xs text-muted-foreground">
            {selectedCompanies.length} companies · {activeSectionCount} sections
          </span>
        </div>
        <div className="rounded-xl border border-dashed border-border/50 min-h-[400px] flex items-center justify-center text-muted-foreground text-sm">
          Report preview will appear here
        </div>
      </div>
    )
  }

  // ─── Configure mode ──────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Company Selection ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Companies{" "}
            {hasCompanies && (
              <span className="text-primary">({selectedCompanies.length} selected)</span>
            )}
          </label>
          <div className="flex gap-1.5">
            {shortlistedCompanies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={resetToShortlist}
              >
                <RotateCcw className="h-3 w-3" />
                Reset to shortlist
              </Button>
            )}
            {hasCompanies && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1 text-red-400 hover:text-red-300 hover:bg-red-950/40"
                onClick={clearAll}
              >
                <Trash2 className="h-3 w-3" />
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Selected company chips */}
        {hasCompanies && (
          <div className="flex flex-wrap gap-1.5">
            {selectedCompanies.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1 rounded-full bg-primary/15 border border-primary/30 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {c.name}
                <button
                  onClick={() => removeCompany(c.id)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Typeahead search */}
        <div className="relative max-w-sm" ref={searchContainerRef}>
          <Input
            placeholder="Search and add a company..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => {
              if (searchQuery) setShowSuggestions(true)
            }}
            className="h-9 pr-8"
          />
          <Plus className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-xl overflow-hidden">
              {suggestions.map((c) => (
                <button
                  key={c.id}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center justify-between gap-2"
                  onMouseDown={() => addCompany(c)}
                >
                  <span>{c.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {c.weightedScore?.toFixed(1)} · {c.country}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {!hasCompanies && (
          <p className="text-xs text-muted-foreground">
            {shortlistedCompanies.length > 0
              ? "Your shortlist will be loaded automatically. You can also search for additional companies."
              : "Search and add companies to include in your report."}
          </p>
        )}
      </div>

      {/* ── Report Sections ───────────────────────────────────────────────── */}
      <div className="space-y-4">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Report Sections
        </label>

        {/* Content sections */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Per-Company Content
          </div>
          <div className="space-y-2">
            {contentSections.map((section) => (
              <SectionCheckbox
                key={section.key}
                section={section}
                checked={sections[section.key]}
                onToggle={() => toggleSection(section.key)}
              />
            ))}
          </div>
        </div>

        {/* Chart sections */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Comparative Charts
          </div>
          <div className="space-y-2">
            {chartSections.map((section) => (
              <SectionCheckbox
                key={section.key}
                section={section}
                checked={sections[section.key]}
                onToggle={() => toggleSection(section.key)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Generate Button ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleGenerate}
          disabled={!hasCompanies}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          Generate Report
          {!hasCompanies && (
            <span className="text-xs opacity-60 ml-1">(select companies first)</span>
          )}
        </Button>
        {hasCompanies && (
          <span className="text-xs text-muted-foreground">
            {selectedCompanies.length} companies · {activeSectionCount} sections
            {aiCompanyCount > 0 && (
              <span className="text-amber-400 ml-1">
                · {aiCompanyCount} AI generation{aiCompanyCount !== 1 ? "s" : ""}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Section Checkbox Row ────────────────────────────────────────────────────

function SectionCheckbox({
  section,
  checked,
  onToggle,
}: {
  section: SectionConfig
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors cursor-pointer hover:bg-muted/40",
        checked && "bg-muted/30 border-border/50"
      )}
      onClick={onToggle}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={() => onToggle()}
        className="mt-0.5"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{section.icon}</span>
          <Label className="text-sm font-medium cursor-pointer">
            {section.label}
          </Label>
        </div>
        {section.description && (
          <p className="text-xs text-muted-foreground mt-0.5 ml-6">
            {section.description}
          </p>
        )}
        {section.warning && checked && (
          <div className="flex items-center gap-1.5 mt-1.5 ml-6">
            <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-400">{section.warning}</p>
          </div>
        )}
      </div>
    </div>
  )
}
