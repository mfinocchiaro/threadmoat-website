import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates, buildOpenGraph } from '@/lib/metadata'
import { JsonLd, faqJsonLd, breadcrumbListJsonLd } from '@/lib/json-ld'
import { getMarketPage, getAllMarketSlugs } from '@/lib/market-pages'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  return getAllMarketSlugs().map((slug) => ({ slug, locale: 'en' }))
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const page = getMarketPage(slug)
  if (!page) return {}

  return {
    title: `${page.title} | ThreadMoat Insights`,
    description: page.description,
    alternates: buildAlternates(locale, `/insights/market/${slug}`),
    openGraph: buildOpenGraph(page.title, page.description, locale, `/insights/market/${slug}`),
    twitter: {
      card: 'summary_large_image' as const,
      title: page.title,
      description: page.description,
    },
  }
}

export default async function MarketGuidePage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const tCommon = await getTranslations('Common')

  const page = getMarketPage(slug)
  if (!page) notFound()

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={[
          faqJsonLd(page.faqs),
          breadcrumbListJsonLd([
            { name: 'Insights', url: '/insights' },
            { name: page.shortTitle, url: `/insights/market/${slug}` },
          ], locale),
        ]}
      />

      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="ThreadMoat" width={160} height={42} className="h-10 w-auto" unoptimized />
          </Link>
          <nav className="flex items-center gap-8">
            <Link href="/report" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {tCommon('nav.marketReport')}
            </Link>
            <Link href="/insights" className="text-sm text-foreground font-medium transition-colors">
              Insights
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

      {/* Content */}
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/insights" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Insights
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{page.title}</h1>
          <p className="text-lg text-muted-foreground">{page.description}</p>
        </header>

        {/* Definition Section */}
        <section className="mb-12 pb-12 border-b border-border/40">
          <h2 className="text-2xl font-bold mb-4">What is {page.shortTitle}?</h2>
          <p className="text-base leading-relaxed text-muted-foreground">{page.definition}</p>
        </section>

        {/* FAQs Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {page.faqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-border/40 rounded-lg p-4 hover:border-border/60 transition-colors cursor-pointer"
              >
                <summary className="flex items-center justify-between font-medium text-foreground hover:text-primary transition-colors">
                  {faq.question}
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Blog Posts */}
        {page.relatedBlogPosts && page.relatedBlogPosts.length > 0 && (
          <section className="pt-12 border-t border-border/40">
            <h2 className="text-2xl font-bold mb-6">Related Insights</h2>
            <div className="space-y-3">
              {page.relatedBlogPosts.map((post) => (
                <Link key={post.slug} href={`/insights/${post.slug}`}>
                  <div className="p-4 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-muted/30 transition-colors">
                    <p className="font-medium text-foreground hover:text-primary transition-colors">{post.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-16 pt-12 border-t border-border/40">
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-3">Explore Startups in {page.shortTitle}</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              ThreadMoat tracks 600+ startups in industrial AI and engineering software. Sign in to explore companies in {page.relatedDiscipline}.
            </p>
            <div className="flex items-center justify-center gap-3">
              <NextLink href="/auth/sign-up">
                <Button size="lg">Start Free Trial</Button>
              </NextLink>
              <Link href="/companies">
                <Button variant="outline" size="lg">Browse Directory</Button>
              </Link>
            </div>
          </div>
        </section>
      </article>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ThreadMoat. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
