'use client'

import { useState, useEffect } from 'react'

interface Props {
  videoId: string
  title: string
  thumbnail?: string
  className?: string
}

export default function YoutubeConsentGate({ videoId, title, thumbnail, className = '' }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const thumbSrc = thumbnail ?? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Reproducir ${title}`}
        className={`relative w-full h-full group cursor-pointer overflow-hidden ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-tinta/30 group-hover:bg-tinta/15 transition-colors duration-300">
          <div className="w-14 h-14 rounded-full bg-tinta/70 group-hover:bg-tinta/90 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <svg className="w-5 h-5 text-papel ml-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/95 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-9 right-0 font-mono text-[10px] text-papel/50 hover:text-papel uppercase tracking-[0.12em] transition-colors"
            >
              Cerrar ✕
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
                title={title}
                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                allow="autoplay; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
