import { STARTUPS_DISPLAY } from '@/lib/site-stats'

const BASE_URL = 'https://threadmoat.com'

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ThreadMoat',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      `Industrial AI & Engineering Software Intelligence platform covering ${STARTUPS_DISPLAY} startups across PLM, CAD, simulation, IoT, and manufacturing.`,
    sameAs: [
      'https://www.linkedin.com/company/threadmoat',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      url: 'https://calendly.com/mfinocchiaro/15min',
    },
  }
}

export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ThreadMoat',
    url: BASE_URL,
    description:
      'Market intelligence platform for industrial AI and engineering software startups.',
  }
}

export function productJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'ThreadMoat Intelligence Platform',
    description:
      'Competitive intelligence dashboards, company profiles, and market analysis for the industrial AI and engineering software landscape.',
    brand: { '@type': 'Brand', name: 'ThreadMoat' },
    url: `${BASE_URL}/pricing`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0',
      highPrice: '249',
      offerCount: 4,
      offers: [
        {
          '@type': 'Offer',
          name: 'Explorer (Recon)',
          price: '0',
          priceCurrency: 'USD',
          description: '30-day free trial with 3 analytics views and 50 companies',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'Analyst',
          price: '49',
          priceCurrency: 'USD',
          description: 'Annual plan with 13 analytics views and 100 companies',
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            billingDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'ANN' },
          },
        },
        {
          '@type': 'Offer',
          name: 'Strategist',
          price: '249',
          priceCurrency: 'USD',
          description: 'Full access with advanced analytics, AI narratives, and custom reports',
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            billingDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'ANN' },
          },
        },
        {
          '@type': 'Offer',
          name: 'Advisory',
          description: 'Custom engagement with strategic consulting and bespoke analysis',
          availability: 'https://schema.org/InStock',
        },
      ],
    },
  }
}

export function companyJsonLd(opts: {
  id: string
  name: string
  url?: string
  hqLocation?: string
  country?: string
  founded?: number
  discipline?: string
  categoryTags?: string[]
  locale?: string
}) {
  const prefix = opts.locale && opts.locale !== 'en' ? `/${opts.locale}` : ''
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: opts.name,
    url: opts.url || `${BASE_URL}${prefix}/companies/${opts.id}`,
    sameAs: opts.url ? [opts.url] : undefined,
    description: [
      opts.discipline,
      opts.categoryTags?.slice(0, 3).join(', '),
      opts.hqLocation ? `Based in ${opts.hqLocation}` : undefined,
      opts.founded ? `Founded ${opts.founded}` : undefined,
    ].filter(Boolean).join('. '),
    foundingDate: opts.founded ? String(opts.founded) : undefined,
    location: opts.hqLocation ? {
      '@type': 'Place',
      name: opts.hqLocation,
      address: { '@type': 'PostalAddress', addressCountry: opts.country },
    } : undefined,
    knowsAbout: opts.categoryTags,
  }
  // Strip undefined fields
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))
}

export function directoryItemListJsonLd(companies: Array<{
  id: string
  name: string
  hqLocation?: string
  discipline?: string
  locale?: string
}>, locale = 'en') {
  const prefix = locale !== 'en' ? `/${locale}` : ''
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ThreadMoat Industrial AI & Engineering Software Company Directory',
    description: `Curated directory of ${STARTUPS_DISPLAY} startups in industrial AI, PLM, CAD, simulation, IoT, and manufacturing software.`,
    url: `${BASE_URL}${prefix}/companies`,
    numberOfItems: companies.length,
    itemListElement: companies.slice(0, 50).map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `${BASE_URL}${prefix}/companies/${c.id}`,
      description: [c.discipline, c.hqLocation].filter(Boolean).join(', '),
    })),
  }
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function articleJsonLd(opts: {
  title: string
  description: string
  slug: string
  date: string
  author?: string
  locale?: string
  image?: string
}) {
  const prefix = opts.locale && opts.locale !== 'en' ? `/${opts.locale}` : ''
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: opts.title,
    description: opts.description,
    url: `${BASE_URL}${prefix}/insights/${opts.slug}`,
    datePublished: opts.date,
    dateModified: opts.date,
    image: opts.image ? { '@type': 'ImageObject', url: opts.image } : undefined,
    author: {
      '@type': 'Person',
      name: opts.author ?? 'ThreadMoat Research',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ThreadMoat',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
  }
}

export function breadcrumbListJsonLd(items: Array<{ name: string; url: string }>, locale = 'en') {
  const prefix = locale !== 'en' ? `/${locale}` : ''
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${BASE_URL}${prefix}/`,
      },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${BASE_URL}${prefix}${item.url}`,
      })),
    ],
  }
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
