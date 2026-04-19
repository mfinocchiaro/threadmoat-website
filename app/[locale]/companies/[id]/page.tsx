import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowLeft, ArrowRight, MapPin, Calendar, Building2,
  Globe, Users, Tag, Lock, ExternalLink,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates, buildOpenGraph } from '@/lib/metadata'
import { loadCompaniesFromCSV } from '@/lib/load-companies-server'

type Props = { params: Promise<{ locale: string; id: string }> }

export async function generateStaticParams() {
  const companies = await loadCompaniesFromCSV()
  // Generate for default locale only to avoid huge build
  return companies.map((c) => ({ id: c.id, locale: 'en' }))
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params
  const companies = await loadCompaniesFromCSV()
  const company = companies.find((c) => c.id === id)
  if (!company) return {}

  const title = `${company.name} | ThreadMoat Company Directory`
  const description = `${company.name} — ${company.discipline || 'Engineering Software'} startup based in ${company.hqLocation || 'N/A'}. Founded ${company.founded || 'N/A'}. Part of ThreadMoat's ${companies.length}+ company intelligence database.`

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/companies/${id}`),
    openGraph: buildOpenGraph(title, description, locale, `/companies/${id}`),
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
    },
  }
}

export default async function CompanyTeaserPage({ params }: Props) {
  const { locale, id } = await params
  setRequestLocale(locale)
  const tCommon = await getTranslations('Common')

  const companies = await loadCompaniesFromCSV()
  const company = companies.find((c) => c.id === id)
  if (!company) notFound()

  // Public-safe fields only
  const details = [
    { icon: MapPin, label: 'Location', value: company.hqLocation },
    { icon: Globe, label: 'Country', value: company.country },
    { icon: Calendar, label: 'Founded', value: company.founded > 0 ? String(company.founded) : '' },
    { icon: Users, label: 'Headcount', value: company.headcount > 0 ? `~${company.headcount}` : '' },
    { icon: Building2, label: 'Discipline', value: company.discipline },
    { icon: Tag, label: 'Sector Focus', value: company.sectorFocus },
  ].filter((d) => d.value)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="ThreadMoat" width={160} height={42} className="h-10 w-auto" unoptimized />
          </Link>
          <nav className="flex items-center gap-8">
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

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/companies" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Directory
        </Link>

        {/* Company Header */}
        <div className="flex items-start gap-4 mb-8">
          <Image
            src={`/logos/${company.id}.png`}
            alt={company.name}
            width={64}
            height={64}
            className="rounded-lg border border-border/40 shrink-0"
            unoptimized
          />
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{company.name}</h1>
            {company.url && (
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
              >
                {company.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* Public Details */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Company Overview</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm">
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">{label}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>

            {company.categoryTags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Categories</h3>
                <div className="flex flex-wrap gap-1.5">
                  {company.categoryTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {company.industriesServed.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Industries Served</h3>
                <div className="flex flex-wrap gap-1.5">
                  {company.industriesServed.map((ind) => (
                    <span
                      key={ind}
                      className="inline-flex items-center rounded-full bg-secondary/60 px-2.5 py-1 text-xs font-medium"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gated Content CTA */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-2">Full Company Profile</h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Sign in to access competitive scoring, funding data, investor networks, strengths & weaknesses analysis,
              and 30+ interactive analytics dashboards for {company.name}.
            </p>
            <div className="flex items-center justify-center gap-3">
              <NextLink href="/auth/sign-up">
                <Button>
                  Start Free Trial <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </NextLink>
              <NextLink href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </NextLink>
            </div>
          </CardContent>
        </Card>
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
