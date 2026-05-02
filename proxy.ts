import { auth } from '@/auth'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { NextResponse, type NextRequest } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing)

// Build locale prefix regex from routing config (ALL locales including default)
// The default locale (en) prefix must also be caught so intlMiddleware can
// redirect /en/about → /about (as-needed strips the default locale prefix)
const allLocalePattern = routing.locales.join('|')
const localePrefixRegex = new RegExp(`^/(${allLocalePattern})(/|$)`)

// Paths that should be handled by next-intl (public pages)
const PUBLIC_PAGES = ['/', '/pricing', '/about', '/report', '/insights']

function isPublicPage(pathname: string): boolean {
  // Strip locale prefix if present
  const strippedPath = pathname.replace(localePrefixRegex, '/$2') || '/'
  const normalizedPath = strippedPath === '' ? '/' : strippedPath
  // Match exact public pages AND their sub-paths (e.g., /opengraph-image, /pricing/opengraph-image)
  return PUBLIC_PAGES.some(
    (p) => normalizedPath === p || normalizedPath === p + '/' ||
      (p === '/' ? normalizedPath.startsWith('/opengraph-image')
        : normalizedPath.startsWith(p + '/'))
  )
}

function hasLocalePrefix(pathname: string): boolean {
  return localePrefixRegex.test(pathname)
}

// Routes that bypass all middleware processing
function isBypassRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/webhooks/')
  )
}

// Routes that need auth protection
function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith('/dashboard') || pathname.startsWith('/api/')
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. Bypass routes — no middleware processing needed
  if (isBypassRoute(pathname)) {
    return NextResponse.next()
  }

  // 1b. Next.js generated metadata routes — bypass all middleware
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
    return NextResponse.next()
  }

  // 2. Generated assets (OG images) without locale prefix
  //    Delete NEXT_LOCALE cookie so intlMiddleware rewrites to default locale
  //    instead of redirecting to the cookie's locale. Crawlers don't have cookies
  //    but browsers do — this ensures consistent default-locale images.
  //    Locale-prefixed requests (e.g., /fr/opengraph-image) pass through step 3 normally.
  if (!hasLocalePrefix(pathname) && /opengraph-image|twitter-image/.test(pathname)) {
    req.cookies.delete('NEXT_LOCALE')
    return intlMiddleware(req)
  }

  // 3. Public pages and locale-prefixed paths → run next-intl directly
  //    This avoids NextAuth's Response wrapper which can interfere with rewrites
  if (isPublicPage(pathname) || hasLocalePrefix(pathname)) {
    return intlMiddleware(req)
  }

  // 4. Landscape page (public, no i18n)
  if (pathname === '/landscape') {
    return NextResponse.next()
  }

  // 5. Protected routes — use auth() to check session
  if (isProtectedRoute(pathname)) {
    const session = await auth()
    if (!session?.user) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const loginUrl = new URL('/auth/login', req.nextUrl.origin)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)',
  ],
}
