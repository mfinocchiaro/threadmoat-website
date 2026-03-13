import { UTILITY_PATHS, EXPLORER_PATHS, isPathAllowed, type AccessTier } from './tiers'

/**
 * @deprecated Use isPathAllowed(pathname, tier) from lib/tiers.ts instead.
 * Kept for backward compatibility with sidebar lock-icon logic.
 */
export const FREE_TIER_PATHS = new Set([...UTILITY_PATHS, ...EXPLORER_PATHS])

export function isFreeTierPath(pathname: string): boolean {
  return FREE_TIER_PATHS.has(pathname)
}

export { isPathAllowed, type AccessTier }
