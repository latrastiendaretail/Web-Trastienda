'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { markModuleComplete } from '@/app/actions/progress'
import { ProgressDial } from '@/components/campus/academia/icons'
import { getConsent, setConsent, CONSENT_EVENT } from '@/lib/consent'
import { loadYTApi, type YTPlayer } from '@/lib/youtube'

export type SlideItem =
  | { type: 'image'; url: string }
  | { type: 'video'; videoId: string }

interface Props {
  items: SlideItem[]
  moduleId: string
  initialCompleted: boolean
  title: string
}

function VideoSlide({ videoId, title }: { videoId: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    function sync() { setConsentGiven(getConsent() === 'all') }
    sync()
    window.addEventListener(CONSENT_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    if (!consentGiven) return
    let cancelled = false
    let player: YTPlayer | null = null

    loadYTApi().then(() => {
      if (cancelled || !containerRef.current) return
      player = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1, color: 'white' },
      })
    })

    return () => {
      cancelled = true
      player?.destroy()
    }
  }, [videoId, consentGiven])

  if (!consentGiven) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-sans text-[12px] text-papel/50 leading-snug max-w-[28ch]">
          Para ver el contenido formativo necesitas aceptar las cookies de YouTube
        </p>
        <button
          onClick={() => {
            setConsent('all')
            setConsentGiven(true)
          }}
          className="font-sans text-[10px] text-tinta uppercase tracking-[0.08em] bg-acento hover:bg-acento/90 transition-colors duration-200 px-5 py-2.5 cursor-pointer"
        >
          Activar vídeo
        </button>
      </div>
    )
  }

  return <div ref={containerRef} className="absolute inset-0" title={title} />
}

export default function SlideDeck({ items, moduleId, initialCompleted, title }: Props) {
  const [index, setIndex] = useState(0)
  const [completed, setCompleted] = useState(initialCompleted)
  const [saving, setSaving] = useState(false)
  const total = items.length
  const isLast = index === total - 1
  const current = items[index]

  async function goTo(next: number) {
    const clamped = Math.max(0, Math.min(total - 1, next))
    setIndex(clamped)
    if (clamped === total - 1 && !completed && !saving) {
      setSaving(true)
      await markModuleComplete(moduleId)
      setCompleted(true)
      setSaving(false)
    }
  }

  if (total === 0) return null

  return (
    <div className="bg-tinta">
      <div className="relative aspect-video w-full">
        {current.type === 'image' ? (
          <Image
            src={current.url}
            alt={`${title} — diapositiva ${index + 1} de ${total}`}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-contain"
            priority={index === 0}
            unoptimized
          />
        ) : (
          <VideoSlide key={current.videoId} videoId={current.videoId} title={`${title} — vídeo ${index + 1} de ${total}`} />
        )}
        {completed && (
          <div className="absolute top-3 right-3 bg-acento text-tinta font-sans text-[9px] font-medium uppercase tracking-[0.1em] px-2 py-1 pointer-events-none">
            ✓ Completado
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 px-5 py-4 border-t border-papel/10">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="font-mono text-[10px] text-papel/60 hover:text-papel uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] flex items-center"
        >
          ← Anterior
        </button>

        <div className="flex items-center gap-3">
          <ProgressDial total={total} completed={index + 1} markClassName="w-2 h-2" />
          <span className="font-mono text-[9px] text-papel/40 uppercase tracking-[0.1em]">
            {index + 1} / {total}
          </span>
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={isLast}
          className="font-mono text-[10px] text-papel/60 hover:text-papel uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] flex items-center"
        >
          {saving ? 'Guardando...' : 'Siguiente →'}
        </button>
      </div>
    </div>
  )
}
