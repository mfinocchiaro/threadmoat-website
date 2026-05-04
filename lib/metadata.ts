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

export function generateOGImageUrl(
  title: string,
  type: 'default' | 'blog' | 'report' = 'default'
) {
  const encodedTitle = encodeURIComponent(title)
  return `${BASE_URL}/api/og?title=${encodedTitle}&type=${type}`
}

export function buildOpenGraph(
  title: string,
  description: string,
  locale: string,
  pagePath: string,
  ogImageUrl?: string,
  ogType: 'website' | 'article' = 'website'
): Metadata['openGraph'] {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  const path = pagePath === '/' ? '' : pagePath
  const canonicalUrl = `${BASE_URL}${prefix}${path}`

  return {
    title,
    description,
    url: canonicalUrl,
    siteName: 'ThreadMoat',
    locale,
    type: ogType,
    ...(ogImageUrl && {
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
    }),
  }
}
