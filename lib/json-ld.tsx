const BASE_URL = 'https://threadmoat.com'

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ThreadMoat',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      'Industrial AI & Engineering Software Intelligence platform covering 500+ startups across PLM, CAD, simulation, IoT, and manufacturing.',
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

export function articleJsonLd(opts: {
  title: string
  description: string
  slug: string
  date: string
  author?: string
  locale?: string
}) {
  const prefix = opts.locale && opts.locale !== 'en' ? `/${opts.locale}` : ''
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: `${BASE_URL}${prefix}/insights/${opts.slug}`,
    datePublished: opts.date,
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

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
