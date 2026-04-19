import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image'

export const runtime = 'nodejs'
export const alt = 'ThreadMoat Insights - Industrial AI & Engineering Software Analysis'
export const size = ogSize
export const contentType = ogContentType

export default async function Image() {
  return generateOgImage({
    title: 'Insights',
    description: 'Research, analysis, and perspectives on the industrial AI and engineering software landscape.',
    section: 'Blog',
    url: 'threadmoat.com/insights',
    accentColor: '#7c3aed',
  })
}
