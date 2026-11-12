import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ClerkProvider } from '@clerk/nextjs'
import CookieConsent from '@/components/CookieConsent'
import LinkedInInsightTag from '@/components/LinkedInInsightTag'
import PostHogProvider from '@/components/PostHogProvider'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

// Fuentes en local (src/app/fonts, subset latin de Fontsource): evita que el build
// dependa de descargar Google Fonts, que ya hizo fallar un deploy de producción.
const newsreader = localFont({
  src: [
    { path: './fonts/newsreader-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/newsreader-latin-400-italic.woff2', weight: '400', style: 'italic' },
    { path: './fonts/newsreader-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/newsreader-latin-500-italic.woff2', weight: '500', style: 'italic' },
    { path: './fonts/newsreader-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/newsreader-latin-600-italic.woff2', weight: '600', style: 'italic' },
  ],
  variable: '--font-newsreader',
  display: 'swap',
})

const spaceGrotesk = localFont({
  src: [
    { path: './fonts/space-grotesk-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: './fonts/space-grotesk-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/space-grotesk-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/space-grotesk-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const ibmPlexMono = localFont({
  src: [
    { path: './fonts/ibm-plex-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/ibm-plex-mono-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
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

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'La Trastienda Retail',
  alternateName: 'La Trastienda',
  url: 'https://latrastiendaretail.es',
  logo: 'https://latrastiendaretail.es/images/Logos/logo.png',
  description: SITE_DESCRIPTION,
  sameAs: [
    'https://www.linkedin.com/company/la-trastienda',
    'https://www.youtube.com/@LaTrastiendaRetail',
    'https://www.instagram.com/latrastienda.retail/',
  ],
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd)
                .replace(/</g, '\\u003c')
                .replace(/>/g, '\\u003e')
                .replace(/\//g, '\\u002f'),
            }}
          />
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
