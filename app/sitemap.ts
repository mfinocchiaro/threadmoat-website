import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

const BASE_URL = 'https://threadmoat.com'

// Only public marketing pages (no auth, dashboard, API routes)
const PUBLIC_PAGES = ['/', '/pricing', '/about', '/report']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const page of PUBLIC_PAGES) {
    const languages: Record<string, string> = {}

    for (const locale of routing.locales) {
      const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
      const path = page === '/' ? '' : page
      languages[locale] = `${BASE_URL}${prefix}${path}`
    }
    languages['x-default'] = `${BASE_URL}${page === '/' ? '' : page}`

    entries.push({
      url: `${BASE_URL}${page === '/' ? '' : page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: page === '/' ? 1.0 : 0.8,
      alternates: { languages },
    })
  }

  return entries
}
