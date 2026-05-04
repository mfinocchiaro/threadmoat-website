import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates, buildOpenGraph, generateOGImageUrl } from '@/lib/metadata'
import { JsonLd, articleJsonLd, breadcrumbListJsonLd } from '@/lib/json-ld'
import { getPostBySlug, getAllSlugs } from '@/lib/blog'
import { AnswerBlock } from '@/components/answer-block'
import { MDXRemote } from 'next-mdx-remote/rsc'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  return getAllSlugs().map(({ slug, locale }) => ({ slug, locale }))
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const post = getPostBySlug(slug)
  if (!post || post.locale !== locale) return {}

  const ogImageUrl = generateOGImageUrl(post.title, 'blog')

  return {
    title: `${post.title} | ThreadMoat Insights`,
    description: post.description,
    alternates: buildAlternates(locale, `/insights/${slug}`),
    openGraph: {
      ...buildOpenGraph(post.title, post.description, locale, `/insights/${slug}`, ogImageUrl, 'article'),
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
    },
  }
}

export default async function InsightPost({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const tCommon = await getTranslations('Common')

  const post = getPostBySlug(slug)
  if (!post || post.locale !== locale) notFound()

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={[
          articleJsonLd({
            title: post.title,
            description: post.description,
            slug: post.slug,
            date: post.date,
            author: post.author,
            locale,
          }),
          breadcrumbListJsonLd([
            { name: 'Insights', url: '/insights' },
            { name: post.title, url: `/insights/${post.slug}` },
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

      {/* Article */}
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/insights" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Insights
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{post.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-border/40 pt-4">
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
                {post.tags.join(', ')}
              </span>
            )}
          </div>
        </header>

        {post.answerBlock && <AnswerBlock answer={post.answerBlock} />}

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote source={post.content} />
        </div>
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
