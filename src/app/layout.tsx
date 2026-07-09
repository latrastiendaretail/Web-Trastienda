import type { Metadata } from 'next'
import { Newsreader, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import CookieConsent from '@/components/CookieConsent'
import LinkedInInsightTag from '@/components/LinkedInInsightTag'
import PostHogProvider from '@/components/PostHogProvider'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const SITE_DESCRIPTION =
  'Consultoría de ejecución y formación para retail: ayudamos a empresas a convertir sus decisiones estratégicas en resultados reales en el punto de venta.'

export const metadata: Metadata = {
  metadataBase: new URL('https://latrastiendaretail.es'),
  title: {
    default: 'La Trastienda — Retail con propósito',
    template: '%s — La Trastienda',
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'La Trastienda — Retail con propósito',
    description: SITE_DESCRIPTION,
    url: '/',
    siteName: 'La Trastienda',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: '/images/Logos/imagotipov2.png',
        width: 1200,
        height: 630,
        alt: 'La Trastienda',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Trastienda — Retail con propósito',
    description: SITE_DESCRIPTION,
    images: ['/images/Logos/imagotipov2.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="es" className={`${newsreader.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
        <body className="antialiased">
          <PostHogProvider>
            {children}
          </PostHogProvider>
          <CookieConsent />
          <LinkedInInsightTag />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
