import { ImageResponse } from 'next/og'

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = 'image/png'

type OgImageProps = {
  title: string
  description: string
  section?: string
  url: string
  accentColor?: string
}

/**
 * Shared OG image generator for all public pages.
 * Each page passes its own title, description, section label, and accent color.
 */
export function generateOgImage({ title, description, section, url, accentColor = '#7c3aed' }: OgImageProps) {
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
        borderBottom: `6px solid ${accentColor}`,
      }}>
        {/* Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            backgroundColor: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 700,
            color: '#ffffff',
          }}>T</div>
          <div style={{ fontSize: '28px', color: '#a78bfa', fontWeight: 600 }}>ThreadMoat</div>
          {section && (
            <div style={{
              fontSize: '16px',
              color: accentColor,
              backgroundColor: `${accentColor}20`,
              padding: '4px 12px',
              borderRadius: '4px',
              marginLeft: '8px',
              fontWeight: 600,
            }}>
              {section}
            </div>
          )}
        </div>
        {/* Title */}
        <div style={{
          fontSize: '48px',
          color: '#ffffff',
          fontWeight: 700,
          maxWidth: '900px',
          lineHeight: 1.2,
        }}>
          {title}
        </div>
        {/* Description */}
        <div style={{
          fontSize: '22px',
          color: '#a1a1aa',
          marginTop: '16px',
          maxWidth: '800px',
          lineHeight: 1.4,
        }}>
          {description}
        </div>
        {/* URL */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '32px',
          fontSize: '16px',
          color: accentColor,
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: accentColor }}></div>
          {url}
        </div>
      </div>
    ),
    { ...ogSize }
  )
}
