/**
 * ThreadMoat Access Tier System
 *
 * Tier 1 (Recon):      Free 30-day trial — 3 graphs (network, landscape-intro, map)
 * Tier 2 (The Forge):  $14,999/yr — 10 visual analytics graphs
 * Tier 3 (Red Keep):   Custom contract — all graphs except admin (~25 total)
 * Admin:               Unrestricted (via ADMIN_EMAILS env var)
 *
 * Product IDs in Neon:
 *   explorer_trial / coupon_trial  → Recon
 *   forge_annual / friends_access / investor_annual  → The Forge
 *   red_keep / red_keep_annual  → The Red Keep
 */

export type AccessTier = 'explorer' | 'forge' | 'red_keep' | 'admin'

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

/** Tier 2: The Forge — 10 visual analytics graphs */
export const FORGE_PATHS = new Set([
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
])

/** Tier 3: The Red Keep — full platform access (unlocked on top of The Forge) */
export const RED_KEEP_ONLY_PATHS = new Set([
  '/dashboard/compare',           // Side-by-side company comparison
  '/dashboard/customers',         // Customer Network (2D/3D)
  '/dashboard/investor-network',  // Investor Network (2D/3D)
  '/dashboard/marimekko',         // Market concentration
  '/dashboard/spiral',            // Spiral Timeline
  '/dashboard/patterns',          // Investment × funding stage heatmap
  '/dashboard/sankey',            // Flow Diagram
  '/dashboard/chord',             // Chord Diagram
  '/dashboard/heatmap',           // Pattern Heatmap
  '/dashboard/parallel',          // Parallel Coordinates
  '/dashboard/box-plot',          // Box Plot distributions
  '/dashboard/distribution',      // Funding Distribution
  '/dashboard/wordcloud',         // Word Cloud
  '/dashboard/slope',             // Slope Chart
  '/dashboard/splom',             // Scatter Plot Matrix
])

/** Admin-only analytics — never shown to non-admin users */
export const ADMIN_PATHS = new Set([
  '/dashboard/investor-stats',
  '/dashboard/financial-heatmap',
  '/dashboard/correlation',
  '/dashboard/reports',
  '/dashboard/investor-views',
  '/dashboard/maturity-matrix',
  '/dashboard/swot',
  '/dashboard/candlestick',
])

/** Check whether a path is accessible at the given tier */
export function isPathAllowed(pathname: string, tier: AccessTier): boolean {
  if (UTILITY_PATHS.has(pathname) || EXPLORER_PATHS.has(pathname)) return true

  if (tier === 'admin') return true

  if (tier === 'red_keep') {
    return FORGE_PATHS.has(pathname) || RED_KEEP_ONLY_PATHS.has(pathname)
  }

  if (tier === 'forge') {
    return FORGE_PATHS.has(pathname)
  }

  // Recon tier — only utility + explorer paths
  return false
}

/** Map a subscription product_id to an access tier */
export function getAccessTier(productId: string | null | undefined, isAdmin: boolean): AccessTier {
  if (isAdmin) return 'admin'

  switch (productId) {
    case 'red_keep':
    case 'red_keep_annual':
      return 'red_keep'
    case 'forge_annual':
    case 'investor_annual':
    case 'friends_access':
      return 'forge'
    default:
      return 'explorer'
  }
}

/** Human-readable tier label for UI */
export function getTierLabel(tier: AccessTier): string {
  switch (tier) {
    case 'admin': return 'Admin'
    case 'red_keep': return 'The Red Keep'
    case 'forge': return 'The Forge'
    case 'explorer': return 'Recon'
  }
}

/** The minimum tier required to access a path */
export function getRequiredTier(pathname: string): AccessTier | null {
  if (UTILITY_PATHS.has(pathname) || EXPLORER_PATHS.has(pathname)) return 'explorer'
  if (FORGE_PATHS.has(pathname)) return 'forge'
  if (RED_KEEP_ONLY_PATHS.has(pathname)) return 'red_keep'
  if (ADMIN_PATHS.has(pathname)) return 'admin'
  return null
}
