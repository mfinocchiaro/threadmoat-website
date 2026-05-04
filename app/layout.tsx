import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { cookies } from 'next/headers'
import { STARTUPS_DISPLAY, YEARS_EXPERIENCE_DISPLAY, FOUNDER_INTERVIEWS_DISPLAY } from '@/lib/site-stats'
import { generateOGImageUrl } from '@/lib/metadata'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://threadmoat.com'),
  title: 'ThreadMoat - Industrial AI & Engineering Software Intelligence',
  description: `Navigate the future of Industrial AI & Engineering Software. Access ${STARTUPS_DISPLAY} startup profiles, ${YEARS_EXPERIENCE_DISPLAY} years of PLM market expertise, and ${FOUNDER_INTERVIEWS_DISPLAY} founder interviews.`,
  openGraph: {
    title: 'ThreadMoat - Industrial AI & Engineering Software Intelligence',
    description: `Navigate the future of Industrial AI & Engineering Software. Access ${STARTUPS_DISPLAY} startup profiles, ${YEARS_EXPERIENCE_DISPLAY} years of PLM market expertise.`,
    url: 'https://threadmoat.com',
    siteName: 'ThreadMoat',
    images: [
      {
        url: generateOGImageUrl('ThreadMoat - Industrial AI & Engineering Software Intelligence'),
        width: 1200,
        height: 630,
        alt: 'ThreadMoat',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThreadMoat - Industrial AI & Engineering Software Intelligence',
    description: `Navigate the future of Industrial AI & Engineering Software. Access ${STARTUPS_DISPLAY} startup profiles.`,
    images: [generateOGImageUrl('ThreadMoat - Industrial AI & Engineering Software Intelligence')],
  },
  icons: {
    icon: [
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180' },
  },
    generator: 'v0.app'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'

  return (
    <html lang={locale} suppressHydrationWarning className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
