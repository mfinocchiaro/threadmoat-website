import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'ThreadMoat';
  const type = searchParams.get('type') || 'default';

  try {
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
            padding: '40px',
          }}
        >
          {/* Logo and branding */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#D97706',
              letterSpacing: '0.1em',
            }}
          >
            ThreadMoat
          </div>

          {/* Main title */}
          <div
            style={{
              fontSize: type === 'blog' ? '52px' : '56px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              lineHeight: '1.2',
              maxWidth: '90%',
              marginBottom: '40px',
            }}
          >
            {title}
          </div>

          {/* Type badge */}
          {type !== 'default' && (
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <div
                style={{
                  background: '#D97706',
                  color: '#1f2937',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {type === 'blog' ? 'Market Insights' : type === 'report' ? 'Report' : 'Guide'}
              </div>
            </div>
          )}

          {/* Tagline */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              color: '#9ca3af',
              fontSize: '16px',
              maxWidth: '90%',
              textAlign: 'center',
            }}
          >
            Industrial AI & Engineering Software Market Intelligence
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
