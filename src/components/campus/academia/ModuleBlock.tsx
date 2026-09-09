'use client'

import { useEffect, type ReactNode } from 'react'
import { useAcademia } from './AcademiaContext'

interface ModuleBlockProps {
  id: string
  label: string
  children: ReactNode
}

/** Sección del módulo — registra el bloque para el progreso global e índice. */
export default function ModuleBlock({ id, label, children }: ModuleBlockProps) {
  const { registerBlock } = useAcademia()

  useEffect(() => {
    registerBlock(id)
    // registerBlock es idempotente por id — solo importa la primera vez que se monta el bloque
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <section className="ltt-block" id={id} aria-label={label}>
      {children}
    </section>
  )
}
