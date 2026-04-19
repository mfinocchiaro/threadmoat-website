import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'insights')

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  locale: string
  tags: string[]
  content: string
}

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  date: string
  author: string
  locale: string
  tags: string[]
}

function parseMdxFile(filePath: string): BlogPost | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)
    const slug = path.basename(filePath, '.mdx')
    return {
      slug,
      title: data.title ?? '',
      description: data.description ?? '',
      date: data.date ?? '',
      author: data.author ?? 'ThreadMoat Research',
      locale: data.locale ?? 'en',
      tags: Array.isArray(data.tags) ? data.tags : [],
      content,
    }
  } catch {
    return null
  }
}

/** Get all posts for a given locale, sorted by date descending */
export function getAllPosts(locale: string): BlogPostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))
  const posts: BlogPostMeta[] = []

  for (const file of files) {
    const post = parseMdxFile(path.join(CONTENT_DIR, file))
    if (post && post.locale === locale) {
      const { content: _, ...meta } = post
      posts.push(meta)
    }
  }

  return posts.sort((a, b) => (b.date > a.date ? 1 : -1))
}

/** Get all unique slugs across all locales (for generateStaticParams) */
export function getAllSlugs(): { slug: string; locale: string }[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))
  const slugs: { slug: string; locale: string }[] = []

  for (const file of files) {
    const post = parseMdxFile(path.join(CONTENT_DIR, file))
    if (post) {
      slugs.push({ slug: post.slug, locale: post.locale })
    }
  }

  return slugs
}

/** Get a single post by slug */
export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  return parseMdxFile(filePath)
}
