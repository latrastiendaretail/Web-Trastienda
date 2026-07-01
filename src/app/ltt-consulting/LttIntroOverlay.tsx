'use client'

import { useEffect, useRef, useState } from 'react'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const LETTERS = ['L','A','T','R','A','S','T','I','E','N','D','A']
// indices 0→L, 2→T, 6→T are kept; the rest collapse
const KEEP = new Set([0, 2, 6])

interface Props { onComplete: () => void }

export default function LttIntroOverlay({ onComplete }: Props) {
  const [fadingOut, setFadingOut] = useState(false)
  const lockupRef = useRef<HTMLDivElement>(null)
  const letterRefs = useRef<(HTMLSpanElement | null)[]>(Array(12).fill(null))
  const barRef = useRef<HTMLSpanElement>(null)
  const subRef = useRef<HTMLSpanElement>(null)
  const sweepRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timers: ReturnType<typeof setTimeout>[] = []

    if (reduced) {
      // Jump straight to final state
      letterRefs.current.forEach((el, i) => {
        if (!el) return
        if (!KEEP.has(i)) { el.style.width = '0px'; el.style.opacity = '0' }
      })
      const bar = barRef.current
      if (bar) { bar.style.width = '0.05em'; bar.style.margin = '0 0.42em'; bar.style.transform = 'scaleY(1)' }
      const sub = subRef.current
      if (sub) { sub.style.width = 'auto'; sub.style.opacity = '0.62' }
      timers.push(setTimeout(onComplete, 400))
      return () => timers.forEach(clearTimeout)
    }

    document.fonts.ready.then(() => {
      const lockup = lockupRef.current
      const letters = letterRefs.current
      const bar = barRef.current
      const sub = subRef.current
      const sweep = sweepRef.current
      if (!lockup || !bar || !sub || letters.some(l => !l)) return

      // ── 1. Measure natural widths ──────────────────────────────────────────
      // Letters are already block-displayed, read their natural width
      const lw = letters.map(el => el!.getBoundingClientRect().width)
      // Sub is width:0 in CSS — temporarily widen to read true content width
      sub.style.width = 'auto'
      const sw = sub.getBoundingClientRect().width
      sub.style.width = '0px'

      // ── 2. Pin widths in px so CSS transitions can animate them ────────────
      letters.forEach((el, i) => { if (el) el.style.width = lw[i] + 'px' })

      // ── 3. Set entrance start-state (no transitions yet) ──────────────────
      lockup.style.transition = 'none'
      lockup.style.opacity = '0'
      lockup.style.transform = 'translateY(0.16em)'
      void lockup.offsetWidth // flush reflow

      timers.push(setTimeout(() => {
        // ── 4. Fade + rise in ───────────────────────────────────────────────
        lockup.style.transition = `opacity 0.7s ${EASE}, transform 0.7s ${EASE}`
        lockup.style.opacity = '1'
        lockup.style.transform = 'translateY(0)'

        // ── 5. @ 1200 ms — horizontal collapse of A, R, A, S, I, E, N, D, A ─
        timers.push(setTimeout(() => {
          letters.forEach((el, i) => {
            if (KEEP.has(i) || !el) return
            el.style.transition = `width 0.8s ${EASE}, opacity 0.55s ease`
            el.style.width = '0px'
            el.style.opacity = '0'
          })
        }, 1200))

        // ── 6. @ 2000 ms — bar grows ────────────────────────────────────────
        timers.push(setTimeout(() => {
          bar.style.transition = `width 0.5s ${EASE}, margin 0.5s ${EASE}, transform 0.6s ${EASE}`
          bar.style.width = '0.05em'
          bar.style.margin = '0 0.42em'
          bar.style.transform = 'scaleY(1)'
        }, 2000))

        // ── 7. @ 2150 ms — Consulting unfolds + light sweep ─────────────────
        timers.push(setTimeout(() => {
          sub.style.transition = `width 0.7s ${EASE}, opacity 0.6s ease`
          sub.style.width = sw + 'px'
          sub.style.opacity = '0.62'
          if (sweep) {
            // restart animation
            sweep.style.animationName = 'none'
            void sweep.offsetWidth
            sweep.style.animationName = 'lttSweepLa'
          }
        }, 2150))

        // ── 8. Fade overlay out ──────────────────────────────────────────────
        timers.push(setTimeout(() => setFadingOut(true), 3500))
        timers.push(setTimeout(onComplete, 4100))
      }, 60))
    })

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <>
      <style>{`
        @keyframes lttSweepLa {
          from { transform: skewX(-12deg) translateX(-220%); }
          to   { transform: skewX(-12deg) translateX(1000%); }
        }
      `}</style>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          display: 'grid',
          placeItems: 'center',
          background:
            'radial-gradient(120% 90% at 50% 42%, rgba(201,162,39,0.05), transparent 60%), radial-gradient(140% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.45)), #1A1714',
          opacity: fadingOut ? 0 : 1,
          transition: 'opacity 0.6s ease',
          pointerEvents: fadingOut ? 'none' : 'auto',
        }}
      >
        <div
          ref={lockupRef}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 'clamp(48px, 10vw, 140px)',
            lineHeight: 1,
            userSelect: 'none',
            opacity: 0,
            transform: 'translateY(0.16em)',
          }}
        >
          {/* LATRASTIENDA — each letter is a collapsible flex item */}
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={el => { letterRefs.current[i] = el }}
              style={{
                display: 'block',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                minWidth: 0,
                fontFamily: 'var(--font-space-grotesk)',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: '#F4EFE6',
              }}
            >
              {letter}
            </span>
          ))}

          {/* Divider bar */}
          <span
            ref={barRef}
            style={{
              alignSelf: 'center',
              flexShrink: 0,
              display: 'block',
              width: 0,
              height: '0.72em',
              margin: 0,
              background: '#C9A227',
              transformOrigin: 'center',
              transform: 'scaleY(0)',
            }}
          />

          {/* CONSULTING descriptor */}
          <span
            ref={subRef}
            style={{
              alignSelf: 'center',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              minWidth: 0,
              width: 0,
              opacity: 0,
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              fontSize: '0.165em',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#F4EFE6',
            }}
          >
            Consulting
          </span>

          {/* Light sweep */}
          <span
            ref={sweepRef}
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-45%',
              width: '26%',
              height: '140%',
              background: 'linear-gradient(100deg, transparent, rgba(244,239,230,0.09), transparent)',
              transform: 'skewX(-12deg) translateX(-220%)',
              pointerEvents: 'none',
              animationDuration: '1.15s',
              animationTimingFunction: EASE,
              animationFillMode: 'forwards',
            }}
          />
        </div>
      </div>
    </>
  )
}
