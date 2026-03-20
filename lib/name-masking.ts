import { AccessTier } from '@/lib/tiers'

/**
 * At Forge tier, mask individual company names with their investment list.
 * Red Keep and Admin see full names.
 * Explorer shouldn't reach name-bearing charts (gated by tier), but mask anyway.
 */
export function maskCompanyName(
  name: string,
  investmentList: string,
  tier: AccessTier
): string {
  if (tier === 'admin' || tier === 'red_keep') return name
  // Forge and Explorer: show investment list rollup
  return investmentList || 'Startup'
}

/**
 * Whether to show full company names at this tier.
 */
export function canSeeCompanyNames(tier: AccessTier): boolean {
  return tier === 'admin' || tier === 'red_keep'
}
