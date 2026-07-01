'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getConsent, setConsent } from '@/lib/consent'

type Phase = 'bar' | 'modal' | 'hidden'
type ModalView = 'default' | 'config'

function Toggle({ on, onChange, disabled }: { on: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!on)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-acento ${
        on ? 'bg-acento' : 'bg-papel/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          on ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default function CookieConsent() {
  const [phase, setPhase] = useState<Phase>('hidden')
  const [mounted, setMounted] = useState(false)
  const [view, setView] = useState<ModalView>('default')
  const [analyticsOn, setAnalyticsOn] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (getConsent()) return
    if (pathname === '/cookies') return

    setPhase('bar')
    requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)))

    const timer = setTimeout(() => {
      setMounted(false)
      setTimeout(() => {
        setPhase('modal')
        requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)))
      }, 300)
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  function dismiss(level: 'all' | 'essential') {
    setConsent(level)
    setMounted(false)
    setTimeout(() => setPhase('hidden'), 300)
  }

  function saveConfig() {
    dismiss(analyticsOn ? 'all' : 'essential')
  }

  if (phase === 'hidden') return null
  if (pathname === '/cookies') return null

  if (phase === 'bar') {
    return (
      <div
        role="region"
        aria-label="Aviso de cookies"
        className={`fixed bottom-0 left-0 right-0 z-[199] bg-tinta border-t border-papel/10 transition-all duration-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
          <p className="font-sans text-[12px] text-papel/55 leading-relaxed flex-1">
            Usamos cookies propias y de terceros para mejorar tu experiencia.{' '}
            <Link href="/cookies" className="text-acento hover:underline">
              Más info
            </Link>
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => dismiss('essential')}
              className="font-sans text-[10px] text-papel/55 uppercase tracking-[0.08em] hover:text-papel transition-colors duration-200 px-4 py-2 border border-papel/20 hover:border-papel/50 min-h-[36px] cursor-pointer"
            >
              Solo esenciales
            </button>
            <button
              onClick={() => dismiss('all')}
              className="font-sans text-[10px] text-tinta uppercase tracking-[0.08em] bg-acento hover:bg-acento/90 transition-colors duration-200 px-4 py-2 min-h-[36px] cursor-pointer"
            >
              Aceptar todas
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[199] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Aviso de cookies"
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      >
        <div
          className={`bg-tinta border border-papel/10 w-full max-w-md shadow-2xl transition-all duration-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          {view === 'default' ? (
            <div className="p-8">
              <p className="font-sans text-[10px] text-acento uppercase tracking-[0.14em] mb-3">
                Privacidad
              </p>
              <h2 className="font-sans text-papel text-lg font-medium leading-snug mb-4">
                Cuidamos tu privacidad
              </h2>
              <p className="font-sans text-[13px] text-papel/55 leading-relaxed mb-2">
                Utilizamos cookies propias y de terceros para garantizar el funcionamiento de
                la web y, con tu permiso, para analizar visitas y mejorar el servicio.
              </p>
              <Link
                href="/cookies"
                className="font-sans text-[12px] text-acento hover:underline inline-block mb-7"
              >
                Política de Cookies →
              </Link>

              {/* Equal prominence — AEPD requirement */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                  onClick={() => dismiss('essential')}
                  className="flex-1 font-sans text-[10px] text-papel/55 uppercase tracking-[0.08em] hover:text-papel transition-colors duration-200 px-5 py-3 border border-papel/20 hover:border-papel/50 min-h-[44px] cursor-pointer"
                >
                  Rechazar cookies
                </button>
                <button
                  onClick={() => dismiss('all')}
                  className="flex-1 font-sans text-[10px] text-tinta uppercase tracking-[0.08em] bg-acento hover:bg-acento/90 transition-colors duration-200 px-5 py-3 min-h-[44px] cursor-pointer"
                >
                  Aceptar todas
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setView('config')}
                  className="font-sans text-[11px] text-papel/40 hover:text-papel/70 underline underline-offset-2 transition-colors duration-200 cursor-pointer"
                >
                  Personalizar preferencias
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <button
                onClick={() => setView('default')}
                className="font-sans text-[11px] text-papel/40 hover:text-papel/70 transition-colors duration-200 mb-5 flex items-center gap-1.5 cursor-pointer"
              >
                ← Volver
              </button>
              <h2 className="font-sans text-papel text-lg font-medium leading-snug mb-6">
                Personaliza tus cookies
              </h2>

              <div className="space-y-5 mb-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-sans text-[13px] text-papel/90 font-medium mb-1">
                      Cookies necesarias
                    </p>
                    <p className="font-sans text-[12px] text-papel/45 leading-snug">
                      Imprescindibles para el funcionamiento de la web y el Campus.
                    </p>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    <Toggle on={true} disabled />
                  </div>
                </div>

                <div className="border-t border-papel/10" />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-sans text-[13px] text-papel/90 font-medium mb-1">
                      Análisis y mejora
                    </p>
                    <p className="font-sans text-[12px] text-papel/45 leading-snug">
                      Nos ayudan a entender cómo se usa el campus para mejorar el servicio.
                    </p>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    <Toggle on={analyticsOn} onChange={setAnalyticsOn} />
                  </div>
                </div>
              </div>

              <button
                onClick={saveConfig}
                className="w-full font-sans text-[10px] text-tinta uppercase tracking-[0.08em] bg-acento hover:bg-acento/90 transition-colors duration-200 px-5 py-3 min-h-[44px] cursor-pointer"
              >
                Guardar preferencias
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
