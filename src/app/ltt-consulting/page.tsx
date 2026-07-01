import type { Metadata } from 'next'
import LttConsultingPage from './LttConsultingPage'

export const metadata: Metadata = {
  title: 'LTT Consulting · Consultoría retail con criterio de tienda',
  description:
    'LTT Consulting — el brazo de consultoría retail de La Trastienda. Optimización comercial, formación de equipos y mando intermedio basados en experiencia real de tienda, no en teoría.',
}

export default function Page() {
  return <LttConsultingPage />
}
