import { getTranslations } from 'next-intl/server'
import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image'

export const runtime = 'nodejs'
export const alt = 'About ThreadMoat & Michael Finocchiaro'
export const size = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'About' })

  return generateOgImage({
    title: t('meta.title'),
    description: t('meta.description'),
    section: 'About',
    url: 'threadmoat.com/about',
    accentColor: '#059669',
  })
}
