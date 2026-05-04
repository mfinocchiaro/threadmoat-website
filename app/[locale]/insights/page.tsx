import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Calendar, Tag, User, BookOpen, ChevronRight } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates, buildOpenGraph, generateOGImageUrl } from '@/lib/metadata'
import { getAllPosts } from '@/lib/blog'
import { NewsletterSignup } from '@/components/homepage/newsletter-signup'
import { MARKET_PAGES } from '@/lib/market-pages'
import { JsonLd, breadcrumbListJsonLd, collectionPageJsonLd } from '@/lib/json-ld'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const ogImageUrl = generateOGImageUrl('Insights | ThreadMoat', 'blog')
  return {
    title: 'Insights | ThreadMoat',
    description:
      'Analysis and research on the industrial AI and engineering software startup landscape. Market trends, funding analysis, and strategic intelligence.',
    alternates: buildAlternates('en', '/insights'),
    openGraph: buildOpenGraph(
      'Insights | ThreadMoat',
      'Analysis and research on the industrial AI and engineering software startup landscape.',
      locale,
      '/insights',
      ogImageUrl
    ),
    twitter: {
      card: 'summary_large_image' as const,
      title: 'Insights | ThreadMoat',
      description: 'Analysis and research on the industrial AI and engineering software startup landscape.',
      images: [ogImageUrl],
    },
  }
}

export default async function InsightsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const tCommon = await getTranslations('Common')
  const posts = getAllPosts(locale)

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[
        breadcrumbListJsonLd([{ name: 'Insights', url: '/insights' }], locale),
        collectionPageJsonLd(posts, locale),
      ]} />

      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="ThreadMoat" width={160} height={42} className="h-10 w-auto" unoptimized />
          </div>
          <nav className="flex items-center gap-8">
            <a href="/#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{tCommon('nav.services')}</a>
            <a href="/#expertise" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{tCommon('nav.expertise')}</a>
            <Link href="/insights" className="text-sm text-foreground font-medium transition-colors">
              {tCommon('nav.insights')}
            </Link>
            <Link href="/report" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{tCommon('nav.marketReport')}</Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{tCommon('nav.about')}</Link>
            <Link href="/about#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{tCommon('nav.contactUs')}</Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <NextLink href="/auth/login">
              <Button variant="ghost" size="sm">{tCommon('nav.signIn')}</Button>
            </NextLink>
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <a href="https://calendly.com/mfinocchiaro/15min" target="_blank" rel="noopener noreferrer">{tCommon('nav.scheduleCall')}</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Articles */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{tCommon('insights.latestInsights')}</h1>
          <p className="text-muted-foreground leading-relaxed">
            Deep-dive research on AI trends, market dynamics, and engineering software innovation. Published on <a href="https://demystifyingplm.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Demystifying PLM</a>.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 mb-12">
          {[
            {
              title: 'The $1.57 Billion Shadow Ecosystem',
              description: 'Validation of direct contact with founders and analysis of where they are taking the market',
              date: '20 April 2026',
              url: 'https://demystifyingplm.com/insights/157-billion-shadow-ecosystem',
              image: 'https://media.licdn.com/dms/image/v2/D4E12AQE94k7MRFTMKw/article-cover_image-shrink_720_1280/B4EZ2qYCOYHMAI-/0/1776679921021?e=1779321600&v=beta&t=dEYdDIYgEkzjOKPDErLlbJkcO36ErCG2g7P-hQVCK8A',
            },
            {
              title: 'Top 5 AI Trends Transforming Manufacturing in 2026',
              description: 'Authority about trends and major players in the Manufacturing space of Industrial AI startups',
              date: '5 Feb 2026',
              url: 'https://demystifyingplm.com/insights/top-5-ai-trends-manufacturing',
              image: 'https://media.licdn.com/dms/image/v2/D4E12AQGZ1mnle8ammg/article-cover_image-shrink_720_1280/B4EZxKDVo9JAAI-/0/1770768919173?e=1779321600&v=beta&t=CvDAYYn5BkSqrbH_JsA0L5U7_ENsnRZH6vPw2b611-k',
            },
            {
              title: 'Top 5 AI Trends Transforming PLM and the Digital Thread in 2026',
              description: 'Authority about trends and major players in the PLM/MBSE/Digital thread space of Engineering startups',
              date: '9 Feb 2026',
              url: 'https://demystifyingplm.com/insights/top-5-ai-trends-plm-digital-thread',
              image: 'https://media.licdn.com/dms/image/v2/D4E12AQF06ySjIfKJjQ/article-cover_image-shrink_720_1280/B4EZw.iIcNJoAM-/0/1770575664274?e=1779321600&v=beta&t=oJXQgLbmRTYUkfz0sRFZp13N7-1a1Ek3YFgzyGcBF8U',
            },
            {
              title: 'Top 5 AI Trends Transforming Engineering Simulation in 2026',
              description: 'Authority about trends and major players in the CAE/CFD/FEA/QC space of Simulation startups',
              date: '11 Feb 2026',
              url: 'https://demystifyingplm.com/insights/top-5-ai-trends-engineering-simulation',
              image: 'https://media.licdn.com/dms/image/v2/D4E12AQETTytBv8XjiQ/article-cover_image-shrink_720_1280/B4EZxKAYp3GkAI-/0/1770768143872?e=1779321600&v=beta&t=6CWBZ3nnXAozb3wQRjfALDjDrEZ8sxJrRpmxSPcyQOs',
            },
            {
              title: '5 Signals That Matter for Design Intelligence Right Now',
              description: 'Authority about trends and major players in the CAD space of engineering startups',
              date: '3 Feb 2026',
              url: 'https://demystifyingplm.com/insights/5-signals-design-intelligence',
              image: 'https://media.licdn.com/dms/image/v2/D4E12AQER-FNdPHN4Bw/article-cover_image-shrink_720_1280/B4EZxKC7uwHQAI-/0/1770768813494?e=1779321600&v=beta&t=_vJZVvlqpSzOm4bAEKcGCJ8H6iynp6z2cqfPWa2UE',
            },
          ].map((article) => (
            <a
              key={article.title}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg border border-border/40 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-6">
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary pt-4">
                    Read Article <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="hidden sm:block w-48 h-48 flex-shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center pt-6 border-t border-border/40">
          <Link href="/insights/market" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
            {tCommon('insights.exploreMarketGuides')} <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Market Guides */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">{tCommon('insights.marketGuides')}</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Deep-dive answers to common questions about industrial AI and engineering software markets.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {MARKET_PAGES.map((p) => (
              <Link
                key={p.slug}
                href={`/insights/market/${p.slug}`}
                className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-background border border-transparent hover:border-border/40 transition-colors group"
              >
                <span className="text-sm font-medium">{p.shortTitle}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-10 text-center">
          <h3 className="text-lg font-semibold mb-2">{tCommon('newsletter.stayInformed')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {tCommon('newsletter.subtitle')}
          </p>
          <div className="flex justify-center">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ThreadMoat. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
