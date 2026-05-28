'use client'

import { useState, useEffect } from 'react'
import { getConsent, setConsent, CONSENT_EVENT } from '@/lib/consent'

interface Props {
  videoId: string
  title: string
  className?: string
}

export default function YoutubeConsentGate({ videoId, title, className = '' }: Props) {
  const [consentGiven, setConsentGiven] = useState(false)
  const [activated, setActivated] = useState(false)

  useEffect(() => {
    function sync() {
      const c = getConsent()
      if (c === 'all') setConsentGiven(true)
    }
    sync()
    window.addEventListener(CONSENT_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  function handlePlay() {
    setConsent('all')
    setConsentGiven(true)
    setActivated(true)
  }

  // Banner global accepted OR user clicked play on this thumbnail
  if (consentGiven || activated) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}${activated ? '?autoplay=1' : ''}`}
        title={title}
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        allow="autoplay; picture-in-picture; web-share"
        allowFullScreen
        className={`w-full h-full ${className}`}
      />
    )
  }

  // Thumbnail — no cookies, shows immediately (SSR + client)
  return (
    <button
      onClick={handlePlay}
      aria-label={`Reproducir ${title}`}
      className={`relative w-full h-full group cursor-pointer overflow-hidden ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover"
      />

      {/* Dark overlay + play button */}
      <div className="absolute inset-0 flex items-center justify-center bg-tinta/40 group-hover:bg-tinta/25 transition-colors duration-300">
        <div className="w-14 h-14 rounded-full bg-tinta/75 group-hover:bg-tinta/95 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
          <svg className="w-5 h-5 text-papel ml-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Micro-notice — GDPR transparency */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-tinta/70 to-transparent px-3 py-2">
        <p className="font-sans text-[9px] text-papel/40 text-center leading-none">
          Al reproducir aceptas cookies de YouTube (Google)
        </p>
      </div>
    </button>
  )
}
