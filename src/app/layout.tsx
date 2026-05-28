import type { Metadata } from 'next'
import { Newsreader, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import CookieConsent from '@/components/CookieConsent'
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

export const metadata: Metadata = {
  title: 'La Trastienda — Retail con propósito',
  description:
    'Formamos y acompañamos a personas de -25/+50 años para que desarrollen su carrera en Retail. Conectamos talento con empresas del sector.',
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
          {children}
          <CookieConsent />
        </body>
      </html>
    </ClerkProvider>
  )
}
