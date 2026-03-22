import { getTranslations } from 'next-intl/server'
import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image'

export const runtime = 'nodejs'
export const alt = 'ThreadMoat Market State Report - Engineering Software & Industrial AI'
export const size = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Report' })

  return generateOgImage({
    title: t('meta.title'),
    description: t('meta.description'),
    section: 'Report',
    url: 'threadmoat.com/report',
    accentColor: '#dc2626',
  })
}
