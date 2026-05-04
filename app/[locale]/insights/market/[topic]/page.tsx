import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight, ArrowRight, BookOpen } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates, buildOpenGraph, generateOGImageUrl } from '@/lib/metadata'
import { JsonLd, faqJsonLd, organizationJsonLd, breadcrumbListJsonLd, articleJsonLd } from '@/lib/json-ld'
import { getMarketPage, getAllMarketSlugs, MARKET_PAGES } from '@/lib/market-pages'
import { STARTUPS_DISPLAY } from '@/lib/site-stats'

type Props = { params: Promise<{ locale: string; topic: string }> }

export async function generateStaticParams() {
  const locales = ['en', 'fr', 'es', 'it', 'de', 'pt']
  const slugs = getAllMarketSlugs()
  return locales.flatMap((locale) => slugs.map((topic) => ({ locale, topic })))
}

export async function generateMetadata({ params }: Props) {
  const { locale, topic } = await params
  const page = getMarketPage(topic)
  if (!page) return {}
  const ogImageUrl = generateOGImageUrl(page.title, 'blog')
  return {
    title: `${page.title} | ThreadMoat`,
    description: page.description,
    alternates: buildAlternates(locale, `/insights/market/${topic}`),
    openGraph: buildOpenGraph(page.title, page.description, locale, `/insights/market/${topic}`, ogImageUrl, 'article'),
    twitter: {
      card: 'summary_large_image' as const,
      title: page.title,
      description: page.description,
      images: [ogImageUrl],
    },
  }
}

export default async function MarketAnswerPage({ params }: Props) {
  const { locale, topic } = await params
  setRequestLocale(locale)
  const tCommon = await getTranslations('Common')
  const page = getMarketPage(topic)
  if (!page) notFound()

  const otherPages = MARKET_PAGES.filter((p) => p.slug !== topic).slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[
        faqJsonLd(page.faqs),
        organizationJsonLd(),
        breadcrumbListJsonLd([
          { name: 'Insights', url: '/insights' },
          { name: page.shortTitle, url: `/insights/market/${topic}` },
        ], locale),
        ...(page.datePublished ? [articleJsonLd({
          title: page.title,
          description: page.description,
          slug: `market/${topic}`,
          date: page.datePublished,
          author: 'ThreadMoat Research',
          locale,
        })] : []),
      ]} />

      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="ThreadMoat" width={160} height={42} className="h-10 w-auto" unoptimized />
          </Link>
          <nav className="flex items-center gap-8">
            <Link href="/insights" className="text-sm text-foreground font-medium transition-colors">
              {tCommon('nav.insights')}
            </Link>
            <Link href="/companies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Companies
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {tCommon('nav.about')}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <NextLink href="/auth/login">
              <Button variant="ghost" size="sm">{tCommon('nav.signIn')}</Button>
            </NextLink>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link href="/insights" className="hover:text-foreground">Insights</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{page.shortTitle}</span>
        </nav>

        {/* Article header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <BookOpen className="h-3 w-3" />
            {tCommon('insights.marketGuide')}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{page.title}</h1>
          <p className="text-muted-foreground leading-relaxed">{page.description}</p>
        </div>

        {/* Definition */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">{tCommon('insights.whatIs', { topic: page.shortTitle })}</h2>
          <p className="text-muted-foreground leading-relaxed">{page.definition}</p>
        </section>

        {/* Body content */}
        {page.body && (
          <section
            className="mb-10 prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        )}

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-5">{tCommon('insights.frequentlyAskedQuestions')}</h2>
          <div className="space-y-6">
            {page.faqs.map((faq) => (
              <div key={faq.question} className="border-b border-border/40 pb-6 last:border-0">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ThreadMoat CTA */}
        <Card className="border-primary/20 bg-primary/5 mb-10">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">Explore the {page.shortTitle} Startup Landscape</h2>
            <p className="text-sm text-muted-foreground mb-4">
              ThreadMoat tracks {STARTUPS_DISPLAY} industrial AI and engineering software startups (Q1 2026), including companies in{' '}
              {page.relatedDiscipline}. Access competitive scoring, funding data, investor networks, and 30+ interactive analytics dashboards.
            </p>
            <div className="flex items-center gap-3">
              <NextLink href="/auth/sign-up">
                <Button>
                  Start Free Trial <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </NextLink>
              <Link href="/companies">
                <Button variant="outline">Browse Companies</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Related blog articles */}
        {page.relatedBlogPosts && page.relatedBlogPosts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4">{tCommon('insights.relatedArticles')}</h2>
            <div className="space-y-3">
              {page.relatedBlogPosts.map((post) => (
                <a
                  key={post.slug}
                  href={post.url || `https://demystifyingplm.com/insights/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-3 py-3 px-3 rounded-md hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium group-hover:text-foreground">{post.title}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 mt-0.5" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Related market guides */}
        {otherPages.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">{tCommon('insights.relatedMarketGuides')}</h2>
            <div className="space-y-2">
              {otherPages.map((p) => (
                <Link
                  key={p.slug}
                  href={`/insights/market/${p.slug}`}
                  className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-muted/50 transition-colors group"
                >
                  <span className="text-sm font-medium">{p.shortTitle}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ThreadMoat. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
