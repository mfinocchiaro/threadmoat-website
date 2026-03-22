import { getTranslations } from 'next-intl/server'
import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image'

export const runtime = 'nodejs'
export const alt = 'ThreadMoat Pricing - Market Intelligence Plans'
export const size = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Pricing' })

  return generateOgImage({
    title: t('meta.title'),
    description: t('meta.description'),
    section: 'Pricing',
    url: 'threadmoat.com/pricing',
    accentColor: '#2563eb',
  })
}
