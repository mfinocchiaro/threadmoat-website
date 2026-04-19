import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Calendar, Tag, User } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates, buildOpenGraph } from '@/lib/metadata'
import { getAllPosts } from '@/lib/blog'
import { NewsletterSignup } from '@/components/homepage/newsletter-signup'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: 'Insights | ThreadMoat',
    description:
      'Analysis and research on the industrial AI and engineering software startup landscape. Market trends, funding analysis, and strategic intelligence.',
    alternates: buildAlternates(locale, '/insights'),
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

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Insights</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Research, analysis, and perspectives on the industrial AI and engineering software landscape.
        </p>
      </section>

      {/* Posts */}
      <section className="container mx-auto px-4 pb-24">
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No posts yet. Check back soon.</p>
        ) : (
          <div className="grid gap-8 max-w-3xl mx-auto">
            {posts.map((post) => (
              <Link key={post.slug} href={`/insights/${post.slug}`}>
                <Card className="hover:border-primary/40 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary">{post.title}</h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{post.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.date).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {post.author}
                      </span>
                      {post.tags.length > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5" />
                          {post.tags.slice(0, 3).join(', ')}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm text-primary font-medium">
                      Read more <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-10 text-center">
          <h3 className="text-lg font-semibold mb-2">Stay Informed</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get market insights delivered to your inbox.
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
