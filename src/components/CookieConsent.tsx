'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getConsent, setConsent } from '@/lib/consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!getConsent()) setVisible(true)
  }, [])

  function handleAccept() {
    setConsent('all')
    setVisible(false)
  }

  function handleEssential() {
    setConsent('essential')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-[200] bg-tinta border-t border-papel/10 shadow-2xl"
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
        <p className="font-sans text-[13px] text-papel/60 leading-relaxed max-w-[62ch]">
          Usamos cookies técnicas necesarias y cookies de terceros de{' '}
          <strong className="text-papel/80">YouTube (Google)</strong> para la reproducción de vídeo.{' '}
          <Link href="/cookies" className="text-acento hover:underline">
            Política de Cookies
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          {/* Equal prominence — AEPD requirement */}
          <button
            onClick={handleEssential}
            className="font-sans text-[10px] text-papel/60 uppercase tracking-[0.08em] hover:text-papel transition-colors duration-200 px-5 py-2.5 border border-papel/20 hover:border-papel/50 min-h-[40px] cursor-pointer"
          >
            Solo esenciales
          </button>
          <button
            onClick={handleAccept}
            className="font-sans text-[10px] text-tinta uppercase tracking-[0.08em] bg-acento hover:bg-acento/90 transition-colors duration-200 px-5 py-2.5 min-h-[40px] cursor-pointer"
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  )
}
