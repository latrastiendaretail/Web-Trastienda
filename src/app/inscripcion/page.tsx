'use client'

import { useActionState } from 'react'
import { submitLead } from '@/app/actions/leads'

const initialState = undefined as Awaited<ReturnType<typeof submitLead>> | undefined

export default function InscripcionPage() {
  const [result, action, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => submitLead(formData),
    initialState,
  )

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ backgroundColor: 'var(--color-papel)' }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <p
          className="font-mono text-xs tracking-widest uppercase mb-3"
          style={{ color: 'var(--color-acento)' }}
        >
          Lista de espera
        </p>
        <h1
          className="font-display text-4xl font-medium leading-tight mb-4"
          style={{ color: 'var(--color-tinta)' }}
        >
          Apúntate al campus
        </h1>
        <p
          className="font-sans text-base leading-relaxed mb-10"
          style={{ color: 'var(--color-cuero)' }}
        >
          Te avisamos en cuanto abra la inscripción al próximo curso.
        </p>

        {result?.success ? (
          <div
            className="border px-6 py-8"
            style={{ borderColor: 'var(--color-lino)', backgroundColor: 'var(--color-blanco)' }}
          >
            <p
              className="font-mono text-xs tracking-widest uppercase mb-2"
              style={{ color: 'var(--color-acento)' }}
            >
              Listo
            </p>
            <p className="font-sans text-base" style={{ color: 'var(--color-tinta)' }}>
              Te avisaremos cuando las plazas estén disponibles.
            </p>
          </div>
        ) : (
          <form action={action} className="flex flex-col gap-5">
            {/* Honeypot — oculto para humanos, visible para bots */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ display: 'none' }}
            />

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-sans text-sm font-medium"
                style={{ color: 'var(--color-tinta)' }}
              >
                Email <span style={{ color: 'var(--color-acento)' }}>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                maxLength={254}
                placeholder="tu@email.com"
                className="w-full rounded-none border px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-blanco)',
                  borderColor: 'var(--color-lino)',
                  color: 'var(--color-tinta)',
                  '--tw-ring-color': 'var(--color-acento)',
                } as React.CSSProperties}
              />
            </div>

            {/* Error */}
            {result && !result.success && (
              <p
                className="font-sans text-sm"
                role="alert"
                style={{ color: '#c0392b' }}
              >
                {result.error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 font-sans text-sm font-medium transition-opacity disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-tinta)', color: 'var(--color-papel)' }}
            >
              {isPending ? 'Enviando…' : 'Apuntarme a la lista'}
            </button>

            <p
              className="font-sans text-xs text-center"
              style={{ color: 'var(--color-cuero)' }}
            >
              Sin spam. Solo te escribimos cuando haya plazas.
            </p>
          </form>
        )}
      </div>
    </main>
  )
}
