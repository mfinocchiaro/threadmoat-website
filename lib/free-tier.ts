/** Paths accessible to free-tier (unauthenticated-to-subscription) users */
export const FREE_TIER_PATHS = new Set([
  '/dashboard',
  '/dashboard/network',
  '/dashboard/landscape-intro',
  '/dashboard/explore',
  '/dashboard/settings',
])

export function isFreeTierPath(pathname: string): boolean {
  return FREE_TIER_PATHS.has(pathname)
}
