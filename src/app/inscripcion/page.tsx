import type { Metadata } from 'next'
import InscripcionPageClient from './InscripcionPageClient'

export const metadata: Metadata = {
  title: 'Apúntate al campus — Lista de espera',
  description:
    'Únete a la lista de espera del campus de La Trastienda y recibe un aviso en cuanto abran las próximas plazas de formación en retail.',
  alternates: { canonical: '/inscripcion' },
}

export default function Page() {
  return <InscripcionPageClient />
}
