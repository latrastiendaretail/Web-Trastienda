'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const INTERVAL_MS = 3000
const MAX_TRIES = 20 // ~1 minuto

/** Recarga la página hasta que el webhook de pago haya matriculado al alumno. */
export default function ActivatingAccess() {
  const router = useRouter()
  const [tries, setTries] = useState(0)

  useEffect(() => {
    if (tries >= MAX_TRIES) return
    const id = setTimeout(() => {
      setTries((n) => n + 1)
      router.refresh()
    }, INTERVAL_MS)
    return () => clearTimeout(id)
  }, [tries, router])

  if (tries >= MAX_TRIES) {
    return (
      <p className="font-sans text-[15px] text-tinta/75 leading-relaxed" role="status">
        Está tardando más de lo normal. No tienes que pagar de nuevo: tu pago está registrado.
        Escríbenos a{' '}
        <a className="underline underline-offset-4" href="mailto:latrastienda.retail@gmail.com">
          latrastienda.retail@gmail.com
        </a>{' '}
        y te activamos el acceso.
      </p>
    )
  }

  return (
    <p className="font-sans text-[15px] text-tinta/75 leading-relaxed" role="status" aria-live="polite">
      Estamos activando tu acceso. Suele tardar unos segundos; esta página se actualiza sola.
    </p>
  )
}
