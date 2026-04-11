"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useCompanyData } from "@/contexts/company-data-context"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/company-data"

/**
 * Narrative priorities based on User Profile.
 * Defines which justifications to highlight and how to label them.
 */
const PROFILE_NARRATIVE_MAP: Record<string, { label: string; priority: string[] }> = {
  vc_investor: {
    label: "Investor's Lens",
    priority: ["competitiveMoatJustification", "teamExecutionJustification", "marketOpportunityJustification", "techDifferentiationJustification"],
  },
  oem_enterprise: {
    label: "Strategic Partner Lens",
    priority: ["techDifferentiationJustification", "competitiveMoatJustification", "teamExecutionJustification", "marketOpportunityJustification"],
  },
  startup_founder: {
    label: "Founder's Benchmark",
    priority: ["marketOpportunityJustification", "techDifferentiationJustification", "competitiveMoatJustification", "teamExecutionJustification"],
  },
  isv_platform: {
    label: "Platform Integration Lens",
    priority: ["techDifferentiationJustification", "marketOpportunityJustification", "competitiveMoatJustification", "teamExecutionJustification"],
  },
  default: {
    label: "General Analysis",
    priority: ["marketOpportunityJustification", "teamExecutionJustification", "techDifferentiationJustification", "competitiveMoatJustification"],
  },
}

export default function CompanyProfilePage() {
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : params.id?.[0]
  const { companies, isLoading } = useCompanyData()

  // Retrieve the user profile type from localStorage (where ProfileForm persists it)
  const [userProfileType, setUserProfileType] = React.useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dashboard-profile-type")
    }
    return null
  })

  const company = React.useMemo(() =>
    companies.find(c => c.id === id || c.name?.toLowerCase() === id?.toLowerCase()),
    [companies, id]
  )

  const narrativeConfig = React.useMemo(() =>
    PROFILE_NARRATIVE_MAP[userProfileType || "default"] || PROFILE_NARRATIVE_MAP.default,
    [userProfileType]
  )

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-semibold">Company Not Found</h2>
        <p className="text-muted-foreground">We couldn't find a company matching that identifier.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-0 sm:p-6">
      {/* Hero Card */}
      <Card className="overflow-hidden border-none shadow-none bg-muted/30 rounded-xl">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
              <Badge variant="outline" className="font-medium">{company.startupSizeCategory}</Badge>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {company.strengths || "No description available."}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary">{company.subcategories}</Badge>
              <Badge variant="secondary">{company.country}</Badge>
              {company.categoryTags?.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Est. Valuation</span>
              <div className="text-2xl font-mono font-bold">
                {formatCurrency(company.reportedValuation || company.totalFunding || 0)}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 border border-border/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="investors">Investors</TabsTrigger>
          <TabsTrigger value="narrative">AI Narrative</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Weighted Score</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{company.weightedScore}</div>
                <p className="text-xs text-muted-foreground">Combined momentum & potential</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Lifecycle</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{company.lifecyclePhase || company.startupLifecyclePhase}</div>
                <p className="text-xs text-muted-foreground">Current development stage</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Funding Round</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{company.latestFundingRound}</div>
                <p className="text-xs text-muted-foreground">Most recent capital raise</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Key Strengths</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{company.strengths}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Key Weaknesses</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{company.weaknesses}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Valuation Metrics</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reported Valuation</span>
                  <span className="font-mono font-bold">{formatCurrency(company.reportedValuation)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Funding</span>
                  <span className="font-mono font-bold">{formatCurrency(company.totalFunding)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Valuation Confidence</span>
                  <Badge variant="outline">{company.valuationConfidence}</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Financial Notes</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">{company.financialNotes || "No additional notes."}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="investors" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Investor Network</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {company.investors?.map(investor => (
                  <Badge key={investor} variant="secondary">{investor}</Badge>
                ))}
                {(!company.investors || company.investors.length === 0) && (
                  <p className="text-sm text-muted-foreground">No investor data available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="narrative" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Strategic Narrative</CardTitle></CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg text-amber-800 dark:text-amber-400 text-xs mb-4">
                View optimized for <span className="font-bold">{narrativeConfig.label}</span> based on your professional profile.
              </div>
              <div className="space-y-4">
                {narrativeConfig.priority.map(key => (
                  <div key={key} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h4 className="text-sm font-semibold mb-2 capitalize">
                      {key.replace("Justification", "").replace(/([A-Z])/g, " $1").trim()}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {(company as any)[key]}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
