import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { cookies } from 'next/headers'
import { STARTUPS_DISPLAY, YEARS_EXPERIENCE_DISPLAY, FOUNDER_INTERVIEWS_DISPLAY } from '@/lib/site-stats'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://threadmoat.com'),
  title: 'ThreadMoat - Industrial AI & Engineering Software Intelligence',
  description: `Navigate the future of Industrial AI & Engineering Software. Access ${STARTUPS_DISPLAY} startup profiles, ${YEARS_EXPERIENCE_DISPLAY} years of PLM market expertise, and ${FOUNDER_INTERVIEWS_DISPLAY} founder interviews.`,
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
    <html lang={locale} suppressHydrationWarning>
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
