import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'

export const metadata: Metadata = {
  title: 'La Trastienda Retail — Retail con propósito',
  description:
    'Formamos personas para carreras en retail y las conectamos con empresas. Consultoría de ejecución en tienda, formación de equipos y campus para profesionales, empresas e instituciones.',
  alternates: { canonical: '/' },
}

export default function Page() {
  return <HomePageClient />
}
