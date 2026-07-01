'use client'

import { useState, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { createEmbeddedCheckoutSession, enrollFree } from '@/app/actions/checkout'

const CheckoutModal = dynamic(() => import('./CheckoutModal'), { ssr: false })

interface Props {
  courseId: string
  priceCents: number
}

export default function BuyButton({ courseId, priceCents }: Props) {
  const [pending, startTransition] = useTransition()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isFree = priceCents === 0

  const formatted = (priceCents / 100).toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  const handleClick = () => {
    setError(null)
    if (isFree) {
      startTransition(() => enrollFree(courseId))
      return
    }
    startTransition(async () => {
      try {
        const { clientSecret } = await createEmbeddedCheckoutSession(courseId)
        setClientSecret(clientSecret)
      } catch (err) {
        setError('Error al iniciar el pago. Inténtalo de nuevo.')
        console.error('[BuyButton]', err)
      }
    })
  }

  return (
    <>
      <div className="flex flex-col items-end gap-2">
        <button
          disabled={pending}
          onClick={handleClick}
          className="font-mono text-[11px] font-medium text-papel bg-tinta px-5 min-h-[40px] flex items-center uppercase tracking-[0.08em] hover:bg-acento hover:text-tinta transition-colors duration-200 disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {pending
            ? 'Cargando...'
            : isFree
              ? 'Acceder gratis →'
              : `Comprar — ${formatted} →`}
        </button>
        {error && (
          <p className="font-mono text-[10px] text-red-500">{error}</p>
        )}
      </div>

      {clientSecret && (
        <CheckoutModal
          clientSecret={clientSecret}
          onClose={() => setClientSecret(null)}
        />
      )}
    </>
  )
}
