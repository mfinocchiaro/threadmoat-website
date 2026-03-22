import { getTranslations } from 'next-intl/server'
import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image'

export const runtime = 'nodejs'
export const alt = 'ThreadMoat - Industrial AI & Engineering Software Intelligence'
export const size = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Home' })

  return generateOgImage({
    title: t('meta.title'),
    description: t('meta.description'),
    url: 'threadmoat.com',
    accentColor: '#7c3aed',
  })
}
