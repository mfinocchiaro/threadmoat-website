import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'

const BASE_URL = 'https://threadmoat.com'

export function buildAlternates(locale: string, pagePath: string) {
  const languages: Record<string, string> = {}
  for (const loc of routing.locales) {
    const prefix = loc === routing.defaultLocale ? '' : `/${loc}`
    const path = pagePath === '/' ? '' : pagePath
    languages[loc] = `${BASE_URL}${prefix}${path}`
  }
  languages['x-default'] = `${BASE_URL}${pagePath === '/' ? '' : pagePath}`

  const canonical = locale === routing.defaultLocale
    ? `${BASE_URL}${pagePath === '/' ? '' : pagePath}`
    : `${BASE_URL}/${locale}${pagePath === '/' ? '' : pagePath}`

  return {
    canonical: canonical || '/',
    languages,
  }
}

export function buildOpenGraph(
  title: string,
  description: string,
  locale: string,
  pagePath: string
): Metadata['openGraph'] {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  const path = pagePath === '/' ? '' : pagePath
  return {
    title,
    description,
    url: `${BASE_URL}${prefix}${path}`,
    siteName: 'ThreadMoat',
    locale,
    type: 'website',
  }
}
