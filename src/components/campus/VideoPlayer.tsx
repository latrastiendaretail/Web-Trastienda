'use client'

import { useEffect, useRef, useState } from 'react'
import { markLessonComplete, markModuleComplete } from '@/app/actions/progress'
import { getConsent, setConsent, CONSENT_EVENT } from '@/lib/consent'
import { loadYTApi, type YTPlayer } from '@/lib/youtube'
import type { VideoPopup } from '@/components/campus/kpis/popups'

type Props = (
  | { videoId: string; lessonId: string; moduleId?: never; initialCompleted: boolean; title: string }
  | { videoId: string; moduleId: string; lessonId?: never; initialCompleted: boolean; title: string }
) & { popups?: VideoPopup[] }

export default function VideoPlayer({ videoId, lessonId, moduleId, initialCompleted, title, popups }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const [completed, setCompleted] = useState(initialCompleted)
  const [saving, setSaving] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const [activePopup, setActivePopup] = useState<VideoPopup | null>(null)
  const shownPopups = useRef<Set<number>>(new Set())

  // Popups temporizados: comprueba el tiempo cada 500 ms (la API de YouTube no emite eventos de tiempo)
  useEffect(() => {
    if (!consentGiven || !popups || popups.length === 0) return
    const id = setInterval(() => {
      const player = playerRef.current
      if (!player || typeof player.getCurrentTime !== 'function') return
      const t = player.getCurrentTime()
      for (const p of popups) {
        // Ventana de 10 s: si el usuario salta más allá no se dispara tarde
        if (t >= p.atSeconds && t < p.atSeconds + 10 && !shownPopups.current.has(p.atSeconds)) {
          shownPopups.current.add(p.atSeconds)
          setActivePopup(p)
        }
      }
    }, 500)
    return () => clearInterval(id)
  }, [consentGiven, popups])

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
              if (moduleId) {
                await markModuleComplete(moduleId)
              } else {
                await markLessonComplete(lessonId!)
              }
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
  }, [videoId, lessonId, moduleId, consentGiven]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!consentGiven) {
    return (
      <div className="relative aspect-video w-full bg-tinta flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-sans text-[15px] text-papel/80 leading-snug max-w-[34ch]">
          Para ver el contenido formativo necesitas aceptar las cookies de YouTube
        </p>
        <button
          onClick={() => {
            setConsent('all')
            setConsentGiven(true)
          }}
          className="font-sans text-[15px] font-medium text-tinta bg-acento hover:bg-acento-soft transition-colors duration-200 px-6 min-h-[44px] cursor-pointer"
        >
          Activar vídeo
        </button>
        <p className="font-sans text-[13px] text-papel/50">
          Al activar aceptas las cookies de terceros (YouTube / Google)
        </p>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full bg-tinta">
      <div ref={containerRef} className="w-full h-full" title={title} />
      {activePopup && (
        <div
          role="dialog"
          aria-label={activePopup.title}
          className="absolute bottom-14 right-3 left-3 sm:left-auto sm:w-72 bg-papel border border-lino shadow-lg px-4 py-4"
        >
          <button
            type="button"
            onClick={() => setActivePopup(null)}
            aria-label="Cerrar"
            className="absolute top-2 right-3 font-sans text-[20px] leading-none text-tinta/60 hover:text-tinta min-w-[32px] min-h-[32px] cursor-pointer"
          >
            ×
          </button>
          <div className="font-sans text-[15px] font-medium text-tinta mb-1 pr-5">{activePopup.title}</div>
          <p className="font-sans text-[14px] text-tinta/70 leading-relaxed mb-3">{activePopup.text}</p>
          {activePopup.href ? (
            <a
              href={activePopup.href}
              className="inline-block font-sans text-[14px] font-medium px-4 py-2.5 bg-tinta text-papel hover:bg-acento hover:text-tinta transition-colors duration-200"
            >
              {activePopup.ctaLabel}
            </a>
          ) : (
            <span className="inline-block font-sans text-[14px] px-4 py-2.5 border border-lino text-tinta/60">
              {activePopup.ctaLabel} · Próximamente
            </span>
          )}
        </div>
      )}
      {completed && (
        <div className="absolute top-3 right-3 bg-acento text-tinta font-sans text-[13px] font-medium px-2.5 py-1 pointer-events-none">
          Completado
        </div>
      )}
      {saving && (
        <div className="absolute top-3 right-3 bg-tinta/80 text-papel font-sans text-[13px] px-2.5 py-1 pointer-events-none">
          Guardando…
        </div>
      )}
    </div>
  )
}
