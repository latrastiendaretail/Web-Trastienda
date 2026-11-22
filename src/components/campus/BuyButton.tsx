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
  const [newsletter, setNewsletter] = useState(false)
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
        const { clientSecret } = await createEmbeddedCheckoutSession(courseId, newsletter)
        setClientSecret(clientSecret)
      } catch (err) {
        setError('Error al iniciar el pago. Inténtalo de nuevo.')
        console.error('[BuyButton]', err)
      }
    })
  }

  return (
    <>
      <div className="flex flex-col items-stretch gap-3 md:max-w-xs">
        {!isFree && (
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-tinta cursor-pointer"
            />
            <span className="font-sans text-[14px] text-tinta/70 leading-snug">
              Quiero recibir la newsletter de La Trastienda con formación, recursos y novedades
              sobre comercio y retail. Puedo darme de baja cuando quiera.{' '}
              <a
                href="/privacidad"
                target="_blank"
                className="underline hover:text-tinta"
              >
                Privacidad
              </a>
              .
            </span>
          </label>
        )}

        <div className="flex flex-col items-end gap-2">
          <button
            disabled={pending}
            onClick={handleClick}
            className="font-sans text-[15px] font-medium text-papel bg-tinta px-6 min-h-[48px] flex items-center hover:bg-acento hover:text-tinta transition-colors duration-200 disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {pending
              ? 'Cargando…'
              : isFree
                ? 'Acceder gratis'
                : `Comprar por ${formatted}`}
          </button>
          {error && (
            <p className="font-sans text-[14px] text-red-700">{error}</p>
          )}
        </div>
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
