'use client'

import { useEffect, useRef, useState } from 'react'
import { markLessonComplete } from '@/app/actions/progress'
import { getConsent, setConsent, CONSENT_EVENT } from '@/lib/consent'

// Minimal YT types
interface YTPlayer {
  destroy(): void
  getCurrentTime(): number
  getDuration(): number
}
interface YTPlayerOptions {
  videoId: string
  playerVars?: Record<string, number | string>
  events?: {
    onReady?: () => void
    onStateChange?: (e: { data: number }) => void
  }
}
declare global {
  interface Window {
    YT: {
      Player: new (el: HTMLElement, opts: YTPlayerOptions) => YTPlayer
      PlayerState: { ENDED: 0; PLAYING: 1; PAUSED: 2 }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

// Load YT API once across all instances
let apiReady: Promise<void> | null = null
function loadYTApi(): Promise<void> {
  if (apiReady) return apiReady
  apiReady = new Promise((resolve) => {
    if (typeof window === 'undefined') return
    if (window.YT?.Player) { resolve(); return }
    window.onYouTubeIframeAPIReady = resolve
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(s)
  })
  return apiReady
}

interface Props {
  videoId: string
  lessonId: string
  initialCompleted: boolean
  title: string
}

export default function VideoPlayer({ videoId, lessonId, initialCompleted, title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const [completed, setCompleted] = useState(initialCompleted)
  const [saving, setSaving] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)

  // Track consent — sync with banner changes
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

  // Load YT player only when consent is given
  useEffect(() => {
    if (!consentGiven) return
    let cancelled = false

    loadYTApi().then(() => {
      if (cancelled || !containerRef.current) return
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1, color: 'white' },
        events: {
          onStateChange: async (e) => {
            const isEnded = e.data === 0
            const isNearEnd =
              e.data === 1 &&
              playerRef.current &&
              playerRef.current.getDuration() > 0 &&
              playerRef.current.getCurrentTime() / playerRef.current.getDuration() >= 0.9

            if ((isEnded || isNearEnd) && !completed && !saving) {
              setSaving(true)
              await markLessonComplete(lessonId)
              if (!cancelled) {
                setCompleted(true)
                setSaving(false)
              }
            }
          },
        },
      })
    })

    return () => {
      cancelled = true
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [videoId, lessonId, consentGiven]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!consentGiven) {
    return (
      <div className="relative aspect-video w-full bg-tinta flex flex-col items-center justify-center gap-4 px-6 text-center">
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
        <p className="font-sans text-[9px] text-papel/20">
          Al activar aceptas las cookies de terceros (YouTube / Google)
        </p>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full bg-tinta">
      <div ref={containerRef} className="w-full h-full" title={title} />
      {completed && (
        <div className="absolute top-3 right-3 bg-acento text-tinta font-sans text-[9px] font-medium uppercase tracking-[0.1em] px-2 py-1 pointer-events-none">
          ✓ Completado
        </div>
      )}
      {saving && (
        <div className="absolute top-3 right-3 bg-tinta/80 text-papel font-sans text-[9px] uppercase tracking-[0.1em] px-2 py-1 pointer-events-none">
          Guardando...
        </div>
      )}
    </div>
  )
}
