import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getAllPosts } from '@/lib/blog'
import { getAllMarketSlugs } from '@/lib/market-pages'

const BASE_URL = 'https://threadmoat.com'

// Static public marketing pages
const PUBLIC_PAGES = ['/', '/pricing', '/about', '/report', '/insights', '/companies']

function buildAlternateLanguages(pagePath: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
    const path = pagePath === '/' ? '' : pagePath
    languages[locale] = `${BASE_URL}${prefix}${path}`
  }
  languages['x-default'] = `${BASE_URL}${pagePath === '/' ? '' : pagePath}`
  return languages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  for (const page of PUBLIC_PAGES) {
    entries.push({
      url: `${BASE_URL}${page === '/' ? '' : page}`,
      lastModified: new Date(),
      changeFrequency: page === '/' ? 'weekly' : 'monthly',
      priority: page === '/' ? 1.0 : page === '/insights' || page === '/companies' ? 0.9 : 0.8,
      alternates: { languages: buildAlternateLanguages(page) },
    })
  }

  // Market answer pages
  for (const slug of getAllMarketSlugs()) {
    const marketPath = `/insights/market/${slug}`
    entries.push({
      url: `${BASE_URL}${marketPath}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: buildAlternateLanguages(marketPath) },
    })
  }

  // Blog posts (English locale — primary content)
  const posts = getAllPosts('en')
  for (const post of posts) {
    const postPath = `/insights/${post.slug}`
    entries.push({
      url: `${BASE_URL}${postPath}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: buildAlternateLanguages(postPath) },
    })
  }

  return entries
}
