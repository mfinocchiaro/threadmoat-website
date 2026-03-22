import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'

export const runtime = 'nodejs'
export const alt = 'ThreadMoat - Industrial AI & Engineering Software Intelligence'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Pricing' })

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0a0a',
        padding: '60px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            backgroundColor: '#7c3aed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 700,
            color: '#ffffff',
          }}>T</div>
          <div style={{ fontSize: '28px', color: '#a78bfa', fontWeight: 600 }}>ThreadMoat</div>
        </div>
        <div style={{
          fontSize: '48px',
          color: '#ffffff',
          fontWeight: 700,
          maxWidth: '900px',
          lineHeight: 1.2,
        }}>
          {t('meta.title')}
        </div>
        <div style={{
          fontSize: '22px',
          color: '#a1a1aa',
          marginTop: '16px',
          maxWidth: '800px',
          lineHeight: 1.4,
        }}>
          {t('meta.description')}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '32px',
          fontSize: '16px',
          color: '#7c3aed',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7c3aed' }}></div>
          threadmoat.com/pricing
        </div>
      </div>
    ),
    { ...size }
  )
}
