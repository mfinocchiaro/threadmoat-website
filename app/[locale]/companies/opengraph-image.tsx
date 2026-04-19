import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image'

export const runtime = 'nodejs'
export const alt = 'ThreadMoat Company Directory - 500+ Industrial AI & Engineering Software Startups'
export const size = ogSize
export const contentType = ogContentType

export default async function Image() {
  return generateOgImage({
    title: 'Company Directory',
    description: 'Explore 500+ startups reshaping industrial AI and engineering software.',
    section: 'Directory',
    url: 'threadmoat.com/companies',
    accentColor: '#7c3aed',
  })
}
