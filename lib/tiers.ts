/**
 * ThreadMoat Access Tier System
 *
 * Tier 1 (Recon):       Free 30-day trial — 3 graphs (network, landscape-intro, map)
 * Tier 2 (Analyst):     $4,999 one-time — 15 visual analytics graphs
 * Tier 3 (Investor):    $8,999/yr — Analyst + investor network, co-investment, funding trends
 * Tier 4 (Strategist):  €18,999/yr — all graphs except admin (~28 total)
 * Advisory:             Custom pricing, dedicated analyst (contact-driven, no self-service)
 * Admin:                Unrestricted (via ADMIN_EMAILS env var)
 *
 * Product IDs in Neon:
 *   explorer_trial / coupon_trial  → Recon
 *   analyst_annual / friends_access → Analyst
 *   investor_annual                → Investor
 *   strategist / strategist_annual / forge_annual  → Strategist
 */

export type AccessTier = 'explorer' | 'analyst' | 'investor' | 'strategist' | 'admin'

/** Utility pages — always accessible to any authenticated user */
export const UTILITY_PATHS = new Set([
  '/dashboard',
  '/dashboard/explore',
  '/dashboard/settings',
])

/** Tier 1: Recon — 3 graphs (free for everyone) */
export const EXPLORER_PATHS = new Set([
  '/dashboard/network',
  '/dashboard/landscape-intro',
  '/dashboard/map',
])

/** Tier 2: Analyst — 13 visual analytics graphs */
export const ANALYST_PATHS = new Set([
  '/dashboard/quadrant',          // Magic Quadrant positioning
  '/dashboard/bubbles',           // Bubble Chart (scatter plot)
  '/dashboard/landscape',         // Full Landscape (grouped tiles)
  '/dashboard/bar-chart',         // Top Rankings bar chart
  '/dashboard/treemap',           // Category Treemap
  '/dashboard/timeline',          // Founding Timeline
  '/dashboard/sunburst',          // Industry Sunburst
  '/dashboard/metros',            // Metro Area Analysis
  '/dashboard/radar',             // Radar Chart comparison
  '/dashboard/periodic-table',    // Periodic Table (company tiles)
  '/dashboard/slope',             // Slope Chart (moved from Strategist)
  '/dashboard/chord',             // Chord Diagram (moved from Strategist)
  '/dashboard/wordcloud',         // Word Cloud (moved from Strategist)
  '/dashboard/marimekko',         // Marimekko (moved from Strategist)
  '/dashboard/sankey',            // Sankey Flow (moved from Strategist)
])

/** Tier 3: Strategist — full platform access (unlocked on top of Analyst) */
export const STRATEGIST_ONLY_PATHS = new Set([
  '/dashboard/compare',           // Side-by-side company comparison
  '/dashboard/customers',         // Customer Network (2D/3D)
  '/dashboard/investor-network',  // Investor Network (2D/3D)
  '/dashboard/spiral',            // Spiral Timeline
  '/dashboard/patterns',          // Investment × funding stage heatmap
  '/dashboard/heatmap',           // Pattern Heatmap
  '/dashboard/parallel',          // Parallel Coordinates
  '/dashboard/box-plot',          // Box Plot distributions
  '/dashboard/distribution',      // Funding Distribution
  '/dashboard/splom',             // Scatter Plot Matrix
  '/dashboard/candlestick',       // Valuation Candlestick (moved from Admin)
])

/** Investor tier — investor-focused analytics and comparisons */
export const INVESTOR_PATHS = new Set([
  '/dashboard/investor-stats',
  '/dashboard/investor-views',
  '/dashboard/investor-compare',
  '/dashboard/co-investment',
  '/dashboard/funding-trends',
])

/** Admin-only analytics — never shown to non-admin users */
export const ADMIN_PATHS = new Set([
  '/dashboard/financial-heatmap',
  '/dashboard/correlation',
  '/dashboard/reports',
  '/dashboard/maturity-matrix',
  '/dashboard/swot',
])

/** Check whether a path is accessible at the given tier */
export function isPathAllowed(pathname: string, tier: AccessTier): boolean {
  if (UTILITY_PATHS.has(pathname) || EXPLORER_PATHS.has(pathname)) return true

  if (tier === 'admin') return true

  if (tier === 'strategist') {
    return ANALYST_PATHS.has(pathname) || STRATEGIST_ONLY_PATHS.has(pathname) || INVESTOR_PATHS.has(pathname)
  }

  if (tier === 'investor') {
    return ANALYST_PATHS.has(pathname) || INVESTOR_PATHS.has(pathname)
  }

  if (tier === 'analyst') {
    return ANALYST_PATHS.has(pathname)
  }

  // Recon tier — only utility + explorer paths
  return false
}

/** Map a subscription product_id to an access tier */
export function getAccessTier(productId: string | null | undefined, isAdmin: boolean): AccessTier {
  if (isAdmin) return 'admin'

  switch (productId) {
    case 'strategist':
    case 'strategist_annual':
    case 'forge_annual':
      return 'strategist'
    case 'investor_annual':
      return 'investor'
    case 'analyst_annual':
    case 'friends_access':
    case 'coupon_trial':
      return 'analyst'
    default:
      return 'explorer'
  }
}

/** Maximum companies returned by /api/companies per tier (null = unlimited) */
export const TIER_COMPANY_LIMITS: Record<AccessTier, number | null> = {
  explorer: 50,
  analyst: 100,
  investor: 200,
  strategist: null,
  admin: null,
}

/** Human-readable tier label for UI */
export function getTierLabel(tier: AccessTier): string {
  switch (tier) {
    case 'admin': return 'Admin'
    case 'strategist': return 'Strategist'
    case 'investor': return 'Investor'
    case 'analyst': return 'Analyst'
    case 'explorer': return 'Recon'
  }
}

/** The minimum tier required to access a path */
export function getRequiredTier(pathname: string): AccessTier | null {
  if (UTILITY_PATHS.has(pathname) || EXPLORER_PATHS.has(pathname)) return 'explorer'
  if (ANALYST_PATHS.has(pathname)) return 'analyst'
  if (INVESTOR_PATHS.has(pathname)) return 'investor'
  if (STRATEGIST_ONLY_PATHS.has(pathname)) return 'strategist'
  if (ADMIN_PATHS.has(pathname)) return 'admin'
  return null
}
