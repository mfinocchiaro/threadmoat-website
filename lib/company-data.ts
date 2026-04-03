// Company data types and utilities

export interface Company {
  id: string
  name: string
  url: string
  hqLocation: string
  country: string
  latitude?: number
  longitude?: number
  founded: number
  headcount: number
  knownCustomers: string
  strengths: string
  weaknesses: string
  discipline: string
  lifecyclePhase: string
  workflowSegment: string
  subsegment: string
  sectorFocus: string
  tags: string[]
  categoryTags: string[]
  differentiationTags: string[]
  deploymentModel: string[]
  operatingModelTags: string[]
  manufacturingType: string
  industriesServed: string[]
  investmentList: string
  investmentTheses: string[]
  subcategories: string
  companyGroup: string
  startupLifecyclePhase: string
  latestFundingRound: string
  fundingYear: number
  lastFundingAmount: number
  totalFunding: number
  estimatedRevenue: number
  estimatedMarketValue: number
  financialNotes: string
  investors: string[]
  // Funding & valuation metadata
  valuationConfidence: string
  financialConfidence: string
  reportedValuation: number
  reportedValuationYear: number
  // Scores
  marketOpportunity: number
  marketOpportunityJustification: string
  teamExecution: number
  teamExecutionJustification: string
  techDifferentiation: number
  techDifferentiationJustification: string
  fundingEfficiency: number
  fundingEfficiencyJustification: string
  growthMetrics: number
  growthMetricsJustification: string
  industryImpact: number
  industryImpactJustification: string
  competitiveMoat: number
  competitiveMoatJustification: string
  weightedScore: number
  // Financial health (pre-computed in Airtable)
  scoreFinancial: number
  customerSignalScore: number
  momentumMultiplier: number
  momentumCap: number
  startupSizeCategory: string
  // City-level geo
  city: string
  // Binary domain flags — CAD ecosystem
  flagSolidWorks: boolean
  flagCATIA: boolean
  flagSiemens: boolean
  flagParasolid: boolean
  flagSTEP: boolean
  flagNURBS: boolean
  flagECAD: boolean
  flagTextToCAD: boolean
  flagProprietary: boolean
  // Binary domain flags — Simulation
  flagFEA: boolean
  flagCFD: boolean
  // Binary domain flags — Modeling
  flagGenerative: boolean
  flagImplicit: boolean
  flagHTE: boolean
  flagQC: boolean
  // Binary domain flags — Industry verticals
  flagAeroDefense: boolean
  flagAutomotive: boolean
  flagPharma: boolean
  flagMedDev: boolean
  flagDiscrete: boolean
  flagNonDiscrete: boolean
  flagProcess: boolean
  // Binary domain flags — VC / Investor signals
  flagYCombinator: boolean
  flagA16Z: boolean
  flagTechstars: boolean
  flagSequoia: boolean
  flagInsightPartners: boolean
  flagEclipseVentures: boolean
  flagBain: boolean
  flagFidelity: boolean
  flagBrowserBased: boolean
  // Heatmap enrichment columns
  techIndependenceScore: number
  ecosystemDependencies: string[]
  growthMomentumTier: string
  buyerPersona: string
}

export interface Investor {
  id: string
  name: string
  startupNames: string[]
  startupCount: number
  investmentLists: string[]
  linkedInProfile: string
  email: string
  notes: string
  contacts: string
  investorType: string
}

export async function loadInvestorData(): Promise<Investor[]> {
  try {
    const response = await fetch('/api/investors')
    const result = await response.json()
    if (result.success) return result.data
    console.error('Failed to load investors:', result.error)
    return []
  } catch (error) {
    console.error('Error loading investor data:', error)
    return []
  }
}

export async function loadCompanyData(): Promise<Company[]> {
  try {
    const response = await fetch('/api/companies')
    const result = await response.json()
    if (result.success) return result.data
    console.error('Failed to load companies:', result.error)
    return []
  } catch (error) {
    console.error('Error loading company data:', error)
    return []
  }
}

export function formatCurrency(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`
  return `$${amount.toFixed(0)}`
}

export function getTopCompanies(companies: Company[], field: keyof Company, limit = 10): Company[] {
  return [...companies]
    .filter(c => typeof c[field] === 'number' && (c[field] as number) > 0)
    .sort((a, b) => (b[field] as number) - (a[field] as number))
    .slice(0, limit)
}

export function getDataSummary(companies: Company[]) {
  const totalCompanies = companies.length
  const avgWeightedScore = totalCompanies > 0
    ? companies.reduce((sum, c) => sum + (c.weightedScore || 0), 0) / totalCompanies
    : 0
  const totalFunding = companies.reduce((sum, c) => sum + (c.totalFunding || 0), 0)

  const byInvestmentList = companies.reduce((acc, c) => {
    const list = c.investmentList || 'Unknown'
    acc[list] = (acc[list] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalCompanies,
    avgWeightedScore: avgWeightedScore.toFixed(2),
    totalFunding: formatCurrency(totalFunding),
    byInvestmentList,
  }
}
