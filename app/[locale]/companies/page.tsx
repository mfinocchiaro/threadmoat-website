import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Calendar, Building2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates, buildOpenGraph } from '@/lib/metadata'
import { loadCompaniesFromCSV } from '@/lib/load-companies-server'
import { JsonLd, directoryItemListJsonLd } from '@/lib/json-ld'
import { STARTUPS_DISPLAY } from '@/lib/site-stats'

const PAGE_SIZE = 20

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const mainDesc = `Explore ${STARTUPS_DISPLAY} startups in the industrial AI and engineering software landscape (Q1 2026). Browse companies by category, location, and sector focus.`
  const shortDesc = `Explore ${STARTUPS_DISPLAY} startups in the industrial AI and engineering software landscape (Q1 2026).`
  const twitterDesc = `Explore ${STARTUPS_DISPLAY} startups in industrial AI and engineering software (Q1 2026).`
  return {
    title: 'Company Directory | ThreadMoat',
    description: mainDesc,
    alternates: buildAlternates(locale, '/companies'),
    openGraph: buildOpenGraph(
      'Company Directory | ThreadMoat',
      shortDesc,
      locale,
      '/companies'
    ),
    twitter: {
      card: 'summary_large_image' as const,
      title: 'Company Directory | ThreadMoat',
      description: twitterDesc,
    },
    robots: {
      index: false,
      follow: false,
      noindex: true,
      nofollow: true,
    },
  }
}

export default async function CompaniesPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  setRequestLocale(locale)
  const tCommon = await getTranslations('Common')

  const allCompanies = await loadCompaniesFromCSV()
  const currentPage = Math.max(1, parseInt(sp.page ?? '1', 10) || 1)
  const totalPages = Math.ceil(allCompanies.length / PAGE_SIZE)
  const page = Math.min(currentPage, totalPages)

  // Sort alphabetically for the public directory
  const sorted = [...allCompanies].sort((a, b) => a.name.localeCompare(b.name))
  const pageCompanies = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={directoryItemListJsonLd(sorted, locale)} />
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
            <Link href="/insights" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Insights
            </Link>
            <Link href="/companies" className="text-sm text-foreground font-medium transition-colors">
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

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Company Directory</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore {allCompanies.length}+ startups reshaping industrial AI and engineering software (as of Q1 2026).
          Sign in for detailed analytics, competitive scoring, and investment intelligence.
        </p>
      </section>

      {/* Company Grid */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {pageCompanies.map((company) => (
            <Link key={company.id} href={`/companies/${company.id}`}>
              <Card className="hover:border-primary/40 transition-colors cursor-pointer h-full">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {company.id && (
                      <Image
                        src={`/logos/${company.id}.png`}
                        alt={company.name}
                        width={32}
                        height={32}
                        className="rounded border border-border/40 shrink-0"
                        unoptimized
                      />
                    )}
                    <h2 className="text-sm font-semibold leading-tight">{company.name}</h2>
                  </div>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {company.hqLocation && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{company.hqLocation}</span>
                      </div>
                    )}
                    {company.founded > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 shrink-0" />
                        Founded {company.founded}
                      </div>
                    )}
                    {company.discipline && (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3 w-3 shrink-0" />
                        <span className="truncate">{company.discipline}</span>
                      </div>
                    )}
                  </div>
                  {company.categoryTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {company.categoryTags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="container mx-auto px-4 pb-16 flex items-center justify-center gap-2">
          {page > 1 ? (
            <Link href={`/companies?page=${page - 1}`}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
          )}
          <span className="text-sm text-muted-foreground px-4">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={`/companies?page=${page + 1}`}>
              <Button variant="outline" size="sm">
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </nav>
      )}

      {/* CTA */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Get Full Intelligence</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Sign in to access competitive scoring, funding data, investor networks, and 30+ interactive analytics dashboards.
          </p>
          <div className="flex items-center justify-center gap-3">
            <NextLink href="/auth/sign-up">
              <Button size="lg">
                Start Free Trial <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </NextLink>
            <Link href="/pricing">
              <Button variant="outline" size="lg">View Plans</Button>
            </Link>
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
