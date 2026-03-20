import { AccessTier } from '@/lib/tiers'
import { Company } from '@/lib/company-data'

/**
 * Whether to show full company names at this tier.
 * Red Keep and Admin see names. Forge sees investment list rollups.
 */
export function canSeeCompanyNames(tier: AccessTier): boolean {
  return tier === 'admin' || tier === 'red_keep'
}

/**
 * Mask a company name based on tier.
 * Forge: shows investment list (e.g., "Factory Futures (MES, IIOT)")
 * Red Keep / Admin: shows real name
 */
export function maskCompanyName(
  name: string,
  investmentList: string,
  tier: AccessTier
): string {
  if (canSeeCompanyNames(tier)) return name
  return investmentList || 'Startup'
}

/**
 * Create a masked copy of Company[] for Forge-tier users.
 * Replaces name with investmentList + index so charts still
 * show distinct entries without revealing real names.
 * All other data (scores, funding, tags) is preserved.
 */
export function maskCompanies(companies: Company[], tier: AccessTier): Company[] {
  if (canSeeCompanyNames(tier)) return companies

  // Group by investmentList to generate per-list indices
  const listCounts: Record<string, number> = {}

  return companies.map(c => {
    const list = c.investmentList || 'Startup'
    listCounts[list] = (listCounts[list] || 0) + 1
    return {
      ...c,
      name: `${list} #${listCounts[list]}`,
    }
  })
}
