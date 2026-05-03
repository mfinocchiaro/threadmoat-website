import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Calendar, Tag, User, BookOpen, ChevronRight } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates, buildOpenGraph } from '@/lib/metadata'
import { getAllPosts } from '@/lib/blog'
import { NewsletterSignup } from '@/components/homepage/newsletter-signup'
import { MARKET_PAGES } from '@/lib/market-pages'
import { JsonLd, breadcrumbListJsonLd } from '@/lib/json-ld'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: 'Insights | ThreadMoat',
    description:
      'Analysis and research on the industrial AI and engineering software startup landscape. Market trends, funding analysis, and strategic intelligence.',
    alternates: buildAlternates('en', '/insights'),
    openGraph: buildOpenGraph(
      'Insights | ThreadMoat',
      'Analysis and research on the industrial AI and engineering software startup landscape.',
      locale,
      '/insights'
    ),
    twitter: {
      card: 'summary_large_image' as const,
      title: 'Insights | ThreadMoat',
      description: 'Analysis and research on the industrial AI and engineering software startup landscape.',
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
      <JsonLd data={breadcrumbListJsonLd([{ name: 'Insights', url: '/insights' }], locale)} />

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
              Insights
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

      {/* Coming Soon */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Insights Coming Soon</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          We're building our insights library. In the meantime, check out our latest analysis on <a href="https://demystifyingplm.com/insights" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Demystifying PLM</a>.
        </p>
        <Link href="/insights/market" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
          Explore Market Guides <ChevronRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Market Guides */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Market Guides</h2>
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
