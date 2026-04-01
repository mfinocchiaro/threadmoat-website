"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { Company, formatCurrency } from "@/lib/company-data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Sparkles, ChevronRight, X, Plus, Copy, Square, AlertCircle, Loader2 } from "lucide-react"
import { useCompletion } from "@ai-sdk/react"
import { getCustomerLogoUrl, parseKnownCustomers } from "@/lib/customer-logos"

interface ReportGeneratorProps {
  data: Company[]
  className?: string
}

interface ScoreRow {
  label: string
  value: number
  justification?: string
}

function ScoreBar({ value, max = 5 }: { value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100)
  const color =
    pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-blue-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold w-8 text-right">{value.toFixed(1)}</span>
    </div>
  )
}

function ICReport({ company }: { company: Company }) {
  const scoreRows: ScoreRow[] = [
    { label: "Market Opportunity", value: company.marketOpportunity, justification: company.marketOpportunityJustification },
    { label: "Team & Execution", value: company.teamExecution, justification: company.teamExecutionJustification },
    { label: "Tech Differentiation", value: company.techDifferentiation, justification: company.techDifferentiationJustification },
    { label: "Funding Efficiency", value: company.fundingEfficiency, justification: company.fundingEfficiencyJustification },
    { label: "Growth Metrics", value: company.growthMetrics, justification: company.growthMetricsJustification },
    { label: "Industry Impact", value: company.industryImpact, justification: company.industryImpactJustification },
    { label: "Competitive Moat", value: company.competitiveMoat, justification: company.competitiveMoatJustification },
  ]

  return (
    <div className="space-y-5 text-sm">
      {/* Header */}
      <div className="border-b pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-lg font-bold">{company.name}</div>
            <div className="text-muted-foreground text-xs mt-0.5">
              {company.hqLocation || company.country} &middot; Founded {company.founded || "N/A"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{company.weightedScore?.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Weighted Score</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {company.investmentList && (
            <Badge variant="secondary">{company.investmentList.replace(/^\d+-/, "")}</Badge>
          )}
          {company.country && <Badge variant="outline">{company.country}</Badge>}
          {company.startupLifecyclePhase && <Badge variant="outline">{company.startupLifecyclePhase}</Badge>}
          {company.latestFundingRound && <Badge variant="outline">{company.latestFundingRound}</Badge>}
        </div>
      </div>

      {/* Financials */}
      <div>
        <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Financials</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Total Funding", formatCurrency(company.totalFunding)],
            ["Est. Revenue", formatCurrency(company.estimatedRevenue)],
            ["Est. Market Value", formatCurrency(company.estimatedMarketValue)],
            ["Headcount", company.headcount?.toLocaleString() ?? "N/A"],
          ].map(([label, val]) => (
            <div key={label} className="bg-muted/40 rounded-lg p-2.5">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="font-semibold text-primary mt-0.5">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Score breakdown */}
      <div>
        <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Score Breakdown</div>
        <div className="space-y-2.5">
          {scoreRows.map((row) => (
            <div key={row.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{row.label}</span>
              </div>
              <ScoreBar value={row.value} />
              {row.justification && (
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{row.justification}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      {(company.strengths || company.weaknesses) && (
        <div className="grid grid-cols-1 gap-3">
          {company.strengths && (
            <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-lg p-3">
              <div className="text-xs font-semibold uppercase text-emerald-400 mb-1.5">Strengths</div>
              <p className="text-xs leading-relaxed">{company.strengths}</p>
            </div>
          )}
          {company.weaknesses && (
            <div className="bg-red-950/40 border border-red-800/40 rounded-lg p-3">
              <div className="text-xs font-semibold uppercase text-red-400 mb-1.5">Risks / Weaknesses</div>
              <p className="text-xs leading-relaxed">{company.weaknesses}</p>
            </div>
          )}
        </div>
      )}

      {/* Industries */}
      {company.industriesServed && company.industriesServed.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Industries Served</div>
          <div className="flex flex-wrap gap-1.5">
            {company.industriesServed.map((ind) => (
              <Badge key={ind} variant="secondary" className="text-xs">{ind}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Known Customers */}
      {(() => {
        const customers = parseKnownCustomers(company.knownCustomers)
        if (customers.length === 0) return null
        return (
          <div>
            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Known Customers</div>
            <div className="flex flex-wrap gap-1.5">
              {customers.map(name => {
                const logoUrl = getCustomerLogoUrl(name, 32)
                return (
                  <div
                    key={name}
                    className="flex items-center gap-1 rounded border border-border bg-muted/40 px-1.5 py-0.5"
                  >
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        alt=""
                        style={{ width: 13, height: 13, objectFit: "contain", flexShrink: 0, display: "block" }}
                        onError={e => { e.currentTarget.style.display = "none" }}
                      />
                    )}
                    <span className="text-xs text-foreground/80">{name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* Website */}
      {company.url && (
        <a
          href={company.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary underline-offset-2 hover:underline"
        >
          {company.url}
        </a>
      )}
    </div>
  )
}

// ─── Intelligence Report Generator ───────────────────────────────────────────

const REPORT_TYPES = [
  { value: "deep-dive",     label: "Startup Deep Dive Case Study" },
  { value: "executive",     label: "Executive Briefing" },
  { value: "moat",          label: "Competitive Moat Analysis" },
  { value: "financial",     label: "Investment & Financial Profile" },
  { value: "tech",          label: "Technology & Innovation Audit" },
  { value: "market",        label: "Market Opportunity Index" },
  { value: "pmf",           label: "Product-Market Fit Analysis" },
]

function score5(val: number) {
  const bars = Math.round(val)
  return "█".repeat(bars) + "░".repeat(Math.max(0, 5 - bars)) + `  ${val.toFixed(1)}/5`
}

function generateReport(company: Company, type: string): string {
  const sep = "─".repeat(60)
  const header = [
    `${company.name.toUpperCase()}`,
    `${company.hqLocation || company.country}  ·  Founded ${company.founded || "N/A"}  ·  ${company.investmentList?.replace(/\(.*\)/, "").trim() ?? ""}`,
    `Overall Score: ${company.weightedScore?.toFixed(2) ?? "N/A"} / 5.00`,
    sep,
  ].join("\n")

  if (type === "deep-dive") {
    return [
      header,
      `\n## OVERVIEW`,
      company.strengths ? `Strengths: ${company.strengths}` : "",
      company.weaknesses ? `Risks: ${company.weaknesses}` : "",
      `\n## FINANCIALS`,
      `Total Funding:       ${formatCurrency(company.totalFunding)}`,
      `Est. Revenue:        ${formatCurrency(company.estimatedRevenue)}`,
      `Est. Market Value:   ${formatCurrency(company.estimatedMarketValue)}`,
      `Headcount:           ${company.headcount?.toLocaleString() ?? "N/A"}`,
      `Funding Round:       ${company.latestFundingRound || "N/A"}`,
      `\n## SCORE BREAKDOWN`,
      `Market Opportunity   ${score5(company.marketOpportunity)}`,
      company.marketOpportunityJustification ? `  → ${company.marketOpportunityJustification}` : "",
      `Team & Execution     ${score5(company.teamExecution)}`,
      company.teamExecutionJustification ? `  → ${company.teamExecutionJustification}` : "",
      `Tech Differentiation ${score5(company.techDifferentiation)}`,
      company.techDifferentiationJustification ? `  → ${company.techDifferentiationJustification}` : "",
      `Funding Efficiency   ${score5(company.fundingEfficiency)}`,
      company.fundingEfficiencyJustification ? `  → ${company.fundingEfficiencyJustification}` : "",
      `Growth Metrics       ${score5(company.growthMetrics)}`,
      company.growthMetricsJustification ? `  → ${company.growthMetricsJustification}` : "",
      `Industry Impact      ${score5(company.industryImpact)}`,
      company.industryImpactJustification ? `  → ${company.industryImpactJustification}` : "",
      `Competitive Moat     ${score5(company.competitiveMoat)}`,
      company.competitiveMoatJustification ? `  → ${company.competitiveMoatJustification}` : "",
      company.industriesServed?.length ? `\n## INDUSTRIES SERVED\n${company.industriesServed.join(", ")}` : "",
      company.url ? `\n${company.url}` : "",
    ].filter(Boolean).join("\n")
  }

  if (type === "executive") {
    return [
      header,
      `\n## INVESTMENT THESIS`,
      company.strengths || "No summary available.",
      `\n## KEY METRICS`,
      `Total Funding:  ${formatCurrency(company.totalFunding)}   |   Est. Revenue: ${formatCurrency(company.estimatedRevenue)}`,
      `Headcount:      ${company.headcount?.toLocaleString() ?? "N/A"}   |   Round: ${company.latestFundingRound || "N/A"}`,
      `Score:          ${company.weightedScore?.toFixed(2) ?? "N/A"}/5   |   Lifecycle: ${company.startupLifecyclePhase || "N/A"}`,
      `\n## KEY RISK`,
      company.weaknesses || "Not identified.",
    ].filter(Boolean).join("\n")
  }

  if (type === "moat") {
    return [
      header,
      `\n## COMPETITIVE MOAT SCORE`,
      `${score5(company.competitiveMoat)}`,
      company.competitiveMoatJustification ? `\n${company.competitiveMoatJustification}` : "",
      `\n## DIFFERENTIATION TAGS`,
      company.differentiationTags?.join(", ") || "None recorded.",
      `\n## OPERATING MODEL`,
      company.operatingModelTags?.join(", ") || "None recorded.",
      `\n## COMPETITIVE CONTEXT`,
      `Segment: ${company.subsegment || company.workflowSegment || "N/A"}`,
      `Investment List: ${company.investmentList || "N/A"}`,
    ].filter(Boolean).join("\n")
  }

  if (type === "financial") {
    return [
      header,
      `\n## FUNDING PROFILE`,
      `Latest Round:        ${company.latestFundingRound || "N/A"} (${company.fundingYear || "N/A"})`,
      `Last Event Amount:   ${formatCurrency(company.lastFundingAmount)}`,
      `Total Funding:       ${formatCurrency(company.totalFunding)}`,
      `\n## REVENUE & VALUATION`,
      `Est. Annual Revenue: ${formatCurrency(company.estimatedRevenue)}`,
      `Est. Market Value:   ${formatCurrency(company.estimatedMarketValue)}`,
      company.financialNotes ? `\nNotes: ${company.financialNotes}` : "",
      `\n## FUNDING EFFICIENCY SCORE`,
      `${score5(company.fundingEfficiency)}`,
      company.fundingEfficiencyJustification ? `\n${company.fundingEfficiencyJustification}` : "",
      company.investors?.length ? `\n## INVESTORS\n${company.investors.slice(0, 10).join(", ")}` : "",
    ].filter(Boolean).join("\n")
  }

  if (type === "tech") {
    return [
      header,
      `\n## TECHNOLOGY DIFFERENTIATION SCORE`,
      `${score5(company.techDifferentiation)}`,
      company.techDifferentiationJustification ? `\n${company.techDifferentiationJustification}` : "",
      `\n## DIFFERENTIATION TAGS`,
      company.differentiationTags?.join(", ") || "None recorded.",
      `\n## CATEGORY TAGS`,
      company.categoryTags?.join(", ") || "None recorded.",
      `\n## OPERATING MODEL`,
      company.operatingModelTags?.join(", ") || "None recorded.",
      `\n## TECH STRENGTHS`,
      company.strengths || "Not assessed.",
    ].filter(Boolean).join("\n")
  }

  if (type === "market") {
    return [
      header,
      `\n## MARKET OPPORTUNITY SCORE`,
      `${score5(company.marketOpportunity)}`,
      company.marketOpportunityJustification ? `\n${company.marketOpportunityJustification}` : "",
      `\n## INDUSTRY IMPACT SCORE`,
      `${score5(company.industryImpact)}`,
      company.industryImpactJustification ? `\n${company.industryImpactJustification}` : "",
      company.industriesServed?.length ? `\n## TARGET INDUSTRIES\n${company.industriesServed.join(", ")}` : "",
      `\n## MARKET CONTEXT`,
      `Sector Focus: ${company.sectorFocus || "N/A"}`,
      `Subsegment: ${company.subsegment || "N/A"}`,
      `Manufacturing Type: ${company.manufacturingType || "N/A"}`,
    ].filter(Boolean).join("\n")
  }

  if (type === "pmf") {
    return [
      header,
      `\n## GROWTH METRICS SCORE`,
      `${score5(company.growthMetrics)}`,
      company.growthMetricsJustification ? `\n${company.growthMetricsJustification}` : "",
      `\n## TEAM & EXECUTION SCORE`,
      `${score5(company.teamExecution)}`,
      company.teamExecutionJustification ? `\n${company.teamExecutionJustification}` : "",
      `\n## CUSTOMER SIGNALS`,
      company.knownCustomers ? `Known Customers: ${company.knownCustomers}` : "No customers recorded.",
      `\n## LIFECYCLE STAGE`,
      `Phase: ${company.startupLifecyclePhase || "N/A"}`,
      `Funding Round: ${company.latestFundingRound || "N/A"}`,
      `Headcount: ${company.headcount?.toLocaleString() ?? "N/A"}`,
    ].filter(Boolean).join("\n")
  }

  return `${header}\n\nReport type not recognized.`
}

// ─── AI Narrative Section Renderer ──────────────────────────────────────────

function AINarrativeSection({ text }: { text: string }) {
  // Split streamed markdown into sections on "## " headings
  const sections = useMemo(() => {
    if (!text.trim()) return []
    const parts: { heading: string; body: string }[] = []
    const lines = text.split("\n")
    let currentHeading = ""
    let currentBody: string[] = []

    for (const line of lines) {
      if (line.startsWith("## ")) {
        if (currentHeading || currentBody.length > 0) {
          parts.push({ heading: currentHeading, body: currentBody.join("\n").trim() })
        }
        currentHeading = line.replace(/^## /, "")
        currentBody = []
      } else {
        currentBody.push(line)
      }
    }
    if (currentHeading || currentBody.length > 0) {
      parts.push({ heading: currentHeading, body: currentBody.join("\n").trim() })
    }
    return parts
  }, [text])

  if (sections.length === 0) return null

  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <div key={i}>
          {section.heading && (
            <h3 className="text-sm font-bold text-violet-300 mb-1.5">{section.heading}</h3>
          )}
          {section.body && (
            <div className="text-xs leading-relaxed text-foreground/85 whitespace-pre-wrap">
              {section.body}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function IntelligenceReportTab({ data }: { data: Company[] }) {
  const [reportType, setReportType] = useState("deep-dive")
  const [companySearch, setCompanySearch] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [reportOutput, setReportOutput] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiCopied, setAiCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // AI Narrative streaming via useCompletion
  const {
    completion,
    complete,
    stop,
    isLoading: aiLoading,
    setCompletion,
  } = useCompletion({
    api: "/api/ai/narrative",
    streamProtocol: "text",
    onError: useCallback((error: Error) => {
      // The error message from useCompletion wraps the response body
      const msg = error.message || "AI generation failed"
      if (msg.includes("429") || msg.toLowerCase().includes("rate limit")) {
        setAiError("Rate limit exceeded — try again later")
      } else if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
        setAiError("Please sign in to use AI Analysis")
      } else if (msg.includes("404")) {
        setAiError("Company not found")
      } else {
        setAiError(msg.length > 200 ? "AI generation failed" : msg)
      }
    }, []),
  })

  const aiStreaming = aiLoading

  const suggestions = useMemo(() => {
    if (!companySearch.trim()) return []
    const q = companySearch.toLowerCase()
    return data.filter(c => c.name.toLowerCase().includes(q)).slice(0, 8)
  }, [data, companySearch])

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const selectCompany = (c: Company) => {
    setSelectedCompany(c)
    setCompanySearch(c.name)
    setShowSuggestions(false)
    setReportOutput(null)
    setAiError(null)
    setCompletion("")
  }

  const generate = () => {
    if (!selectedCompany) return
    setReportOutput(generateReport(selectedCompany, reportType))
  }

  const generateAI = () => {
    if (!selectedCompany || aiStreaming) return
    setAiError(null)
    setCompletion("")
    setAiCopied(false)
    // useCompletion sends { prompt, ...body } to the endpoint
    // Our server ignores prompt and reads companyId from body
    complete("", { body: { companyId: selectedCompany.id } })
  }

  const copyAI = () => {
    if (!completion) return
    navigator.clipboard.writeText(completion)
    setAiCopied(true)
    setTimeout(() => setAiCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        {/* Report type */}
        <div className="flex flex-col gap-1 min-w-[260px]">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Report Type</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REPORT_TYPES.map(r => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Company search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[240px]" ref={containerRef}>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Startup</label>
          <div className="relative">
            <Input
              ref={inputRef}
              placeholder="Type company name..."
              value={companySearch}
              onChange={e => {
                setCompanySearch(e.target.value)
                setSelectedCompany(null)
                setShowSuggestions(true)
                setReportOutput(null)
              }}
              onFocus={() => { if (companySearch) setShowSuggestions(true) }}
              className="h-9"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-xl overflow-hidden">
                {suggestions.map(c => (
                  <button
                    key={c.id}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center justify-between gap-2"
                    onMouseDown={() => selectCompany(c)}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{c.investmentList?.replace(/\(.*\)/, "").trim()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 shrink-0 sm:self-end">
          <Button
            onClick={generate}
            disabled={!selectedCompany}
            className="h-9 gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Generate Intelligence
          </Button>
          <Button
            onClick={generateAI}
            disabled={!selectedCompany || aiStreaming}
            className="h-9 gap-2 bg-violet-600 hover:bg-violet-500 text-white"
          >
            {aiStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            AI Analysis
          </Button>
        </div>
      </div>

      {/* Template report output */}
      {reportOutput && (
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ChevronRight className="h-4 w-4 text-primary" />
              {REPORT_TYPES.find(r => r.value === reportType)?.label}
              {selectedCompany && <span className="text-muted-foreground font-normal">— {selectedCompany.name}</span>}
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigator.clipboard.writeText(reportOutput)}>
              Copy
            </Button>
          </div>
          <pre className="text-xs leading-relaxed font-mono whitespace-pre-wrap text-foreground/90 overflow-x-auto">
            {reportOutput}
          </pre>
        </div>
      )}

      {/* AI Narrative output */}
      {(completion || aiStreaming || aiError) && (
        <div className="rounded-xl border border-violet-700/50 bg-violet-950/30 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-violet-300">AI Analysis</span>
              {selectedCompany && <span className="text-muted-foreground font-normal">— {selectedCompany.name}</span>}
              {aiStreaming && (
                <span className="inline-flex items-center gap-1.5 text-xs font-normal text-violet-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
                  </span>
                  Generating…
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {aiStreaming && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1 text-red-400 hover:text-red-300 hover:bg-red-950/40"
                  onClick={() => stop()}
                >
                  <Square className="h-3 w-3" />
                  Stop
                </Button>
              )}
              {completion && !aiStreaming && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={copyAI}
                >
                  <Copy className="h-3 w-3" />
                  {aiCopied ? "Copied!" : "Copy"}
                </Button>
              )}
            </div>
          </div>

          {/* Error display */}
          {aiError && (
            <div className="flex items-start gap-2 rounded-lg bg-red-950/40 border border-red-800/40 p-3 mb-3">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{aiError}</p>
            </div>
          )}

          {/* Streamed content */}
          {completion ? (
            <div className="max-h-[600px] overflow-y-auto pr-1">
              <AINarrativeSection text={completion} />
            </div>
          ) : !aiError && !aiStreaming ? (
            <p className="text-xs text-muted-foreground">No analysis generated</p>
          ) : null}
        </div>
      )}

      {/* Empty state — only when nothing is showing */}
      {!reportOutput && !completion && !aiStreaming && !aiError && (
        <div className="rounded-xl border border-dashed border-border/50 h-48 flex items-center justify-center text-muted-foreground text-sm">
          Select a report type and startup, then click Generate Intelligence
        </div>
      )}
    </div>
  )
}

// ─── Scenario Report Generator ────────────────────────────────────────────────

const SCENARIOS = [
  {
    value: "strongest-moat",
    label: "Which startup has the strongest competitive moat?",
    scoreKey: "competitiveMoat" as keyof Company,
    justKey: "competitiveMoatJustification" as keyof Company,
    narrative: (companies: Company[]) => {
      const ranked = [...companies].sort((a, b) => b.competitiveMoat - a.competitiveMoat)
      const winner = ranked[0]
      return [
        `## COMPETITIVE MOAT ANALYSIS`,
        `Comparing ${companies.map(c => c.name).join(", ")} on defensive positioning, differentiation, and market lock-in.`,
        ``,
        `## VERDICT`,
        `**${winner.name}** leads with a Competitive Moat score of ${winner.competitiveMoat.toFixed(1)}/5.`,
        winner.competitiveMoatJustification ? winner.competitiveMoatJustification : "",
        ``,
        `## RANKING`,
        ...ranked.map((c, i) => [
          `${i + 1}. **${c.name}** — ${score5(c.competitiveMoat)}`,
          c.competitiveMoatJustification ? `   ${c.competitiveMoatJustification}` : "",
          c.differentiationTags?.length ? `   Tags: ${c.differentiationTags.join(", ")}` : "",
        ].filter(Boolean).join("\n")),
      ].filter(Boolean).join("\n")
    },
  },
  {
    value: "best-acquisition",
    label: "Which would make the best acquisition target?",
    scoreKey: "weightedScore" as keyof Company,
    justKey: "strengths" as keyof Company,
    narrative: (companies: Company[]) => {
      // Acquisition value = weighted score + funding efficiency + market opportunity
      const ranked = [...companies].sort((a, b) =>
        (b.weightedScore * 0.4 + b.fundingEfficiency * 0.3 + b.marketOpportunity * 0.3) -
        (a.weightedScore * 0.4 + a.fundingEfficiency * 0.3 + a.marketOpportunity * 0.3)
      )
      const winner = ranked[0]
      return [
        `## ACQUISITION TARGET ANALYSIS`,
        `Evaluating ${companies.map(c => c.name).join(", ")} on overall score, funding efficiency, and market opportunity.`,
        ``,
        `## VERDICT`,
        `**${winner.name}** scores highest on acquisition attractiveness (weighted score ${winner.weightedScore?.toFixed(2)}, funding efficiency ${winner.fundingEfficiency.toFixed(1)}/5, market opportunity ${winner.marketOpportunity.toFixed(1)}/5).`,
        winner.strengths ? `Key value driver: ${winner.strengths}` : "",
        ``,
        `## RANKING`,
        ...ranked.map((c, i) => {
          const acqScore = (c.weightedScore * 0.4 + c.fundingEfficiency * 0.3 + c.marketOpportunity * 0.3).toFixed(2)
          return [
            `${i + 1}. **${c.name}** — Acq. Score ${acqScore}  |  Funding: ${formatCurrency(c.totalFunding)}  |  Revenue: ${formatCurrency(c.estimatedRevenue)}`,
            c.weaknesses ? `   Risk: ${c.weaknesses}` : "",
          ].filter(Boolean).join("\n")
        }),
      ].filter(Boolean).join("\n")
    },
  },
  {
    value: "enterprise-adoption",
    label: "Which is best positioned for enterprise adoption?",
    scoreKey: "industryImpact" as keyof Company,
    justKey: "industryImpactJustification" as keyof Company,
    narrative: (companies: Company[]) => {
      const ranked = [...companies].sort((a, b) =>
        (b.industryImpact * 0.4 + b.teamExecution * 0.35 + b.growthMetrics * 0.25) -
        (a.industryImpact * 0.4 + a.teamExecution * 0.35 + a.growthMetrics * 0.25)
      )
      const winner = ranked[0]
      return [
        `## ENTERPRISE ADOPTION READINESS`,
        `Evaluating ${companies.map(c => c.name).join(", ")} on industry impact, team execution, and growth signals.`,
        ``,
        `## VERDICT`,
        `**${winner.name}** is best positioned for enterprise adoption (Industry Impact ${winner.industryImpact.toFixed(1)}/5, Team & Execution ${winner.teamExecution.toFixed(1)}/5).`,
        winner.industryImpactJustification ? winner.industryImpactJustification : "",
        winner.industriesServed?.length ? `Enterprise markets: ${winner.industriesServed.join(", ")}` : "",
        ``,
        `## RANKING`,
        ...ranked.map((c, i) => [
          `${i + 1}. **${c.name}** — Industry Impact ${score5(c.industryImpact)}`,
          c.knownCustomers ? `   Customers: ${c.knownCustomers}` : "",
          c.industryImpactJustification ? `   ${c.industryImpactJustification}` : "",
        ].filter(Boolean).join("\n")),
      ].filter(Boolean).join("\n")
    },
  },
  {
    value: "series-b",
    label: "Which is likeliest to reach Series B in 12 months?",
    scoreKey: "growthMetrics" as keyof Company,
    justKey: "growthMetricsJustification" as keyof Company,
    narrative: (companies: Company[]) => {
      const GROWTH_ROUNDS = ["Pre-Seed", "Seed", "Series A"]
      const ranked = [...companies].sort((a, b) =>
        (b.growthMetrics * 0.4 + b.fundingEfficiency * 0.3 + b.teamExecution * 0.3) -
        (a.growthMetrics * 0.4 + a.fundingEfficiency * 0.3 + a.teamExecution * 0.3)
      )
      const winner = ranked[0]
      return [
        `## SERIES B READINESS ANALYSIS`,
        `Evaluating ${companies.map(c => c.name).join(", ")} on growth metrics, funding efficiency, and team execution.`,
        ``,
        `## VERDICT`,
        `**${winner.name}** has the strongest trajectory toward Series B (Growth ${winner.growthMetrics.toFixed(1)}/5, Funding Efficiency ${winner.fundingEfficiency.toFixed(1)}/5).`,
        winner.growthMetricsJustification ? winner.growthMetricsJustification : "",
        ``,
        `## RANKING`,
        ...ranked.map((c, i) => {
          const stageNote = GROWTH_ROUNDS.includes(c.latestFundingRound) ? "✓ Pre-Series B stage" : `Current: ${c.latestFundingRound || "N/A"}`
          return [
            `${i + 1}. **${c.name}** — ${stageNote}`,
            `   Growth ${score5(c.growthMetrics)}  |  Efficiency ${score5(c.fundingEfficiency)}  |  Team ${score5(c.teamExecution)}`,
            c.growthMetricsJustification ? `   ${c.growthMetricsJustification}` : "",
          ].filter(Boolean).join("\n")
        }),
      ].filter(Boolean).join("\n")
    },
  },
  {
    value: "incumbent-threat",
    label: "Which poses the greatest threat to PLM incumbents?",
    scoreKey: "techDifferentiation" as keyof Company,
    justKey: "techDifferentiationJustification" as keyof Company,
    narrative: (companies: Company[]) => {
      const ranked = [...companies].sort((a, b) =>
        (b.techDifferentiation * 0.4 + b.competitiveMoat * 0.35 + b.marketOpportunity * 0.25) -
        (a.techDifferentiation * 0.4 + a.competitiveMoat * 0.35 + a.marketOpportunity * 0.25)
      )
      const winner = ranked[0]
      return [
        `## INCUMBENT DISRUPTION THREAT ANALYSIS`,
        `Evaluating ${companies.map(c => c.name).join(", ")} on tech differentiation, competitive moat, and market opportunity.`,
        ``,
        `## VERDICT`,
        `**${winner.name}** poses the greatest threat to PLM incumbents (Tech Diff. ${winner.techDifferentiation.toFixed(1)}/5, Competitive Moat ${winner.competitiveMoat.toFixed(1)}/5).`,
        winner.techDifferentiationJustification ? winner.techDifferentiationJustification : "",
        winner.differentiationTags?.length ? `Disruption vectors: ${winner.differentiationTags.join(", ")}` : "",
        ``,
        `## RANKING`,
        ...ranked.map((c, i) => [
          `${i + 1}. **${c.name}** — Tech Diff. ${score5(c.techDifferentiation)}  |  Moat ${score5(c.competitiveMoat)}`,
          c.techDifferentiationJustification ? `   ${c.techDifferentiationJustification}` : "",
          c.operatingModelTags?.length ? `   Model: ${c.operatingModelTags.join(", ")}` : "",
        ].filter(Boolean).join("\n")),
      ].filter(Boolean).join("\n")
    },
  },
  {
    value: "best-team",
    label: "Which has the strongest team and execution?",
    scoreKey: "teamExecution" as keyof Company,
    justKey: "teamExecutionJustification" as keyof Company,
    narrative: (companies: Company[]) => {
      const ranked = [...companies].sort((a, b) => b.teamExecution - a.teamExecution)
      const winner = ranked[0]
      return [
        `## TEAM & EXECUTION ANALYSIS`,
        `Comparing ${companies.map(c => c.name).join(", ")} on leadership quality, hiring velocity, and operational execution.`,
        ``,
        `## VERDICT`,
        `**${winner.name}** leads on team strength with a score of ${winner.teamExecution.toFixed(1)}/5.`,
        winner.teamExecutionJustification ? winner.teamExecutionJustification : "",
        ``,
        `## RANKING`,
        ...ranked.map((c, i) => [
          `${i + 1}. **${c.name}** — ${score5(c.teamExecution)}`,
          `   Headcount: ${c.headcount?.toLocaleString() ?? "N/A"}  |  Stage: ${c.startupLifecyclePhase || "N/A"}`,
          c.teamExecutionJustification ? `   ${c.teamExecutionJustification}` : "",
        ].filter(Boolean).join("\n")),
      ].filter(Boolean).join("\n")
    },
  },
]

function generateScenarioReport(companies: Company[], scenarioValue: string): string {
  const scenario = SCENARIOS.find(s => s.value === scenarioValue)
  if (!scenario || companies.length < 2) return ""

  const sep = "─".repeat(60)
  const names = companies.map(c => c.name).join("  ·  ")

  // Comparison table
  const tableHeader = ["METRIC", ...companies.map(c => c.name.slice(0, 14).padEnd(14))].join("  ")
  const tableRows = [
    ["Weighted Score", ...companies.map(c => String(c.weightedScore?.toFixed(2) ?? "N/A").padEnd(14))].join("  "),
    ["Market Opp.", ...companies.map(c => String(c.marketOpportunity?.toFixed(1) ?? "N/A").padEnd(14))].join("  "),
    ["Team & Exec.", ...companies.map(c => String(c.teamExecution?.toFixed(1) ?? "N/A").padEnd(14))].join("  "),
    ["Tech Diff.", ...companies.map(c => String(c.techDifferentiation?.toFixed(1) ?? "N/A").padEnd(14))].join("  "),
    ["Funding Eff.", ...companies.map(c => String(c.fundingEfficiency?.toFixed(1) ?? "N/A").padEnd(14))].join("  "),
    ["Growth", ...companies.map(c => String(c.growthMetrics?.toFixed(1) ?? "N/A").padEnd(14))].join("  "),
    ["Industry Impact", ...companies.map(c => String(c.industryImpact?.toFixed(1) ?? "N/A").padEnd(14))].join("  "),
    ["Comp. Moat", ...companies.map(c => String(c.competitiveMoat?.toFixed(1) ?? "N/A").padEnd(14))].join("  "),
    [sep],
    ["Total Funding", ...companies.map(c => formatCurrency(c.totalFunding).slice(0, 14).padEnd(14))].join("  "),
    ["Est. Revenue", ...companies.map(c => formatCurrency(c.estimatedRevenue).slice(0, 14).padEnd(14))].join("  "),
    ["Headcount", ...companies.map(c => String(c.headcount?.toLocaleString() ?? "N/A").padEnd(14))].join("  "),
    ["Round", ...companies.map(c => (c.latestFundingRound || "N/A").slice(0, 14).padEnd(14))].join("  "),
  ]

  return [
    `COMPARATIVE SCENARIO REPORT`,
    sep,
    `QUESTION: ${scenario.label}`,
    `COMPANIES: ${names}`,
    sep,
    ``,
    `## COMPARISON TABLE`,
    tableHeader,
    "─".repeat(tableHeader.length),
    ...tableRows,
    ``,
    scenario.narrative(companies),
  ].join("\n")
}

function ScenarioReportTab({ data }: { data: Company[] }) {
  const [selected, setSelected] = useState<Company[]>([])
  const [scenario, setScenario] = useState(SCENARIOS[0].value)
  const [companySearch, setCompanySearch] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [reportOutput, setReportOutput] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const suggestions = useMemo(() => {
    if (!companySearch.trim()) return []
    const q = companySearch.toLowerCase()
    return data
      .filter(c => c.name.toLowerCase().includes(q) && !selected.find(s => s.id === c.id))
      .slice(0, 8)
  }, [data, companySearch, selected])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const addCompany = (c: Company) => {
    if (selected.length >= 5) return
    setSelected(prev => [...prev, c])
    setCompanySearch("")
    setShowSuggestions(false)
    setReportOutput(null)
  }

  const removeCompany = (id: string) => {
    setSelected(prev => prev.filter(c => c.id !== id))
    setReportOutput(null)
  }

  const generate = () => {
    if (selected.length < 2) return
    setReportOutput(generateScenarioReport(selected, scenario))
  }

  return (
    <div className="space-y-5">
      {/* Scenario picker */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scenario Question</label>
        <Select value={scenario} onValueChange={v => { setScenario(v); setReportOutput(null) }}>
          <SelectTrigger className="h-9 max-w-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SCENARIOS.map(s => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Company multi-select */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Select 2–5 Startups {selected.length > 0 && <span className="text-primary">({selected.length} selected)</span>}
        </label>

        {/* Chips */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {selected.map(c => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1 rounded-full bg-primary/15 border border-primary/30 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {c.name}
                <button onClick={() => removeCompany(c.id)} className="hover:text-red-400 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Search input */}
        {selected.length < 5 && (
          <div className="relative max-w-sm" ref={containerRef}>
            <Input
              placeholder="Search and add a startup..."
              value={companySearch}
              onChange={e => {
                setCompanySearch(e.target.value)
                setShowSuggestions(true)
                setReportOutput(null)
              }}
              onFocus={() => { if (companySearch) setShowSuggestions(true) }}
              className="h-9 pr-8"
            />
            <Plus className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-xl overflow-hidden">
                {suggestions.map(c => (
                  <button
                    key={c.id}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center justify-between gap-2"
                    onMouseDown={() => addCompany(c)}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{c.investmentList?.replace(/\(.*\)/, "").trim()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generate button */}
      <Button
        onClick={generate}
        disabled={selected.length < 2}
        className="gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Generate Scenario Report
        {selected.length < 2 && <span className="text-xs opacity-60 ml-1">(select at least 2)</span>}
      </Button>

      {/* Output */}
      {reportOutput && (
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ChevronRight className="h-4 w-4 text-primary" />
              Scenario Report
              <span className="text-muted-foreground font-normal">— {SCENARIOS.find(s => s.value === scenario)?.label}</span>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigator.clipboard.writeText(reportOutput)}>
              Copy
            </Button>
          </div>
          <pre className="text-xs leading-relaxed font-mono whitespace-pre-wrap text-foreground/90 overflow-x-auto">
            {reportOutput}
          </pre>
        </div>
      )}

      {!reportOutput && (
        <div className="rounded-xl border border-dashed border-border/50 h-48 flex items-center justify-center text-muted-foreground text-sm">
          {selected.length < 2 ? "Add at least 2 startups to compare" : "Click Generate Scenario Report to continue"}
        </div>
      )}
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function ReportGenerator({ data, className }: ReportGeneratorProps) {
  const [search, setSearch] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [sortField, setSortField] = useState<"weightedScore" | "totalFunding" | "name">("weightedScore")

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return data
      .filter((c) => !q || c.name.toLowerCase().includes(q) || (c.country ?? "").toLowerCase().includes(q) || (c.investmentList ?? "").toLowerCase().includes(q))
      .sort((a, b) => {
        if (sortField === "name") return a.name.localeCompare(b.name)
        return ((b[sortField] as number) || 0) - ((a[sortField] as number) || 0)
      })
  }, [data, search, sortField])

  return (
    <div className={cn("space-y-4", className)}>
      <Tabs defaultValue="ic-memos">
        <TabsList className="mb-4">
          <TabsTrigger value="ic-memos">IC Memos</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence Reports</TabsTrigger>
          <TabsTrigger value="scenario">Scenario Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="intelligence">
          <IntelligenceReportTab data={data} />
        </TabsContent>

        <TabsContent value="scenario">
          <ScenarioReportTab data={data} />
        </TabsContent>

        <TabsContent value="ic-memos">
      {/* Search + sort bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Search companies, countries, categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm h-8 text-sm"
        />
        <div className="flex gap-2 ml-auto">
          {(["weightedScore", "totalFunding", "name"] as const).map((f) => (
            <Button
              key={f}
              variant={sortField === f ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setSortField(f)}
            >
              {f === "weightedScore" ? "Score" : f === "totalFunding" ? "Funding" : "Name"}
            </Button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{filtered.length} companies</span>
      </div>

      {/* Company list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.slice(0, 60).map((company) => (
          <div
            key={company.id}
            className="border border-border/60 rounded-xl p-3.5 bg-card/40 flex flex-col gap-2 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-sm leading-tight">{company.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {company.country} &middot; {company.investmentList?.replace(/^\d+-/, "") ?? "N/A"}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-base font-bold text-primary">{company.weightedScore?.toFixed(1)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatCurrency(company.totalFunding)}</span>
              {company.startupLifecyclePhase && (
                <>
                  <span>&middot;</span>
                  <span>{company.startupLifecyclePhase}</span>
                </>
              )}
            </div>
            <Button
              size="sm"
              className="mt-auto h-7 text-xs"
              onClick={() => setSelectedCompany(company)}
            >
              Generate IC Report
            </Button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12 text-sm">
            No companies match your search.
          </div>
        )}
      </div>

      {/* IC Report Dialog */}
      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCompany && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Investment Committee Memo</DialogTitle>
              </DialogHeader>
              <ICReport company={selectedCompany} />
            </>
          )}
        </DialogContent>
      </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
}
