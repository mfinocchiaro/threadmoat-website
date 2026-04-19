import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image'
import { getPostBySlug } from '@/lib/blog'

export const runtime = 'nodejs'
export const alt = 'ThreadMoat Insights'
export const size = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  return generateOgImage({
    title: post?.title ?? 'ThreadMoat Insights',
    description: post?.description ?? '',
    section: 'Insights',
    url: `threadmoat.com/insights/${slug}`,
    accentColor: '#7c3aed',
  })
}
