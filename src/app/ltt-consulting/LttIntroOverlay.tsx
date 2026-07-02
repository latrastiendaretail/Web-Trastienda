'use client'

import { useEffect, useRef, useState } from 'react'

const LETTERS = ['L', 'A', 'T', 'R', 'A', 'S', 'T', 'I', 'E', 'N', 'D', 'A']
// indices 0→L, 2→T, 6→T are kept (data-keep); the rest collapse
const KEEP = new Set([0, 2, 6])

interface Props { onComplete: () => void }

export default function LttIntroOverlay({ onComplete }: Props) {
  const [fadingOut, setFadingOut] = useState(false)
  const lockupRef = useRef<HTMLDivElement>(null)
  const letterRefs = useRef<(HTMLSpanElement | null)[]>(Array(12).fill(null))

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timers: ReturnType<typeof setTimeout>[] = []
    const lockup = lockupRef.current
    const letters = letterRefs.current
    if (!lockup || letters.some((l) => !l)) return

    function play() {
      letters.forEach((l) => { if (l) { l.style.width = ''; l.style.opacity = '' } })
      const widths = letters.map((l) => l!.getBoundingClientRect().width)
      letters.forEach((l, i) => { if (l) { l.style.width = widths[i] + 'px'; l.style.opacity = '1' } })

      lockup!.classList.remove('ltt-reveal', 'ltt-go-sweep', 'ltt-in')
      void lockup!.offsetWidth // flush reflow
      lockup!.classList.add('ltt-in')

      if (reduced) {
        letters.forEach((l, i) => { if (l && !KEEP.has(i)) { l.style.width = '0px'; l.style.opacity = '0' } })
        lockup!.classList.add('ltt-reveal')
        timers.push(setTimeout(() => { setFadingOut(true); timers.push(setTimeout(onComplete, 800)) }, 400))
        return
      }

      // 1 — LATRASTIENDA → LTT (colapso horizontal)
      timers.push(setTimeout(() => {
        letters.forEach((l, i) => { if (l && !KEEP.has(i)) { l.style.width = '0px'; l.style.opacity = '0' } })
      }, 780))

      // 2 — aparece la cola (barra + Consulting) + barrido de luz
      timers.push(setTimeout(() => {
        lockup!.classList.add('ltt-reveal', 'ltt-go-sweep')
      }, 1480))

      // 3 — pequeño zoom-in de cierre, luego fade out suave del overlay para mostrar la página
      timers.push(setTimeout(() => lockup!.classList.add('ltt-zoom'), 2300))
      timers.push(setTimeout(() => setFadingOut(true), 2900))
      timers.push(setTimeout(onComplete, 3700))
    }

    document.fonts.ready.then(play)

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <>
      <style>{`
        .ltt-intro-stage {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          font-family: var(--font-space-grotesk), system-ui, sans-serif;
          background:
            radial-gradient(120% 90% at 50% 46%, rgba(201,162,39,0.05), transparent 60%),
            radial-gradient(140% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.45)),
            #1A1714;
          opacity: ${fadingOut ? 0 : 1};
          transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: ${fadingOut ? 'none' : 'auto'};
        }

        .ltt-lockup {
          position: relative;
          display: inline-flex;
          align-items: center;
          font-size: clamp(46px, 9.5vw, 132px);
          line-height: 1;
          opacity: 0;
          transform: translateY(0.14em);
          transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ltt-lockup.ltt-in { opacity: 1; transform: none; }
        .ltt-lockup.ltt-zoom { transform: scale(1.055); transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1); }

        .ltt-letter {
          display: block;
          overflow: hidden;
          white-space: nowrap;
          min-width: 0;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #F4EFE6;
          transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
        }

        /* la cola (barra + Consulting) va absoluta → LTT nunca se desplaza */
        .ltt-tail {
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          padding-left: 0.42em;
          white-space: nowrap;
        }
        .ltt-bar {
          width: 0.05em;
          height: 0.72em;
          background: #C9A227;
          flex-shrink: 0;
          transform: scaleY(0);
          transform-origin: center;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ltt-subwrap { overflow: hidden; margin-left: 0.42em; }
        .ltt-sub {
          display: block;
          font-family: var(--font-mono), monospace;
          font-weight: 500;
          font-size: 0.165em;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #F4EFE6;
          opacity: 0;
          transform: translateY(0.24em);
          transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ltt-lockup.ltt-reveal .ltt-bar { transform: scaleY(1); }
        .ltt-lockup.ltt-reveal .ltt-sub { opacity: 0.62; transform: translateY(0); }

        .ltt-sweep {
          position: absolute;
          top: -20%; left: -30%;
          width: 26%; height: 140%;
          background: linear-gradient(100deg, transparent, rgba(244,239,230,0.10), transparent);
          transform: skewX(-12deg) translateX(-260%);
          pointer-events: none;
          opacity: 0;
        }
        .ltt-lockup.ltt-go-sweep .ltt-sweep { animation: ltt-sweep 0.9s linear forwards; }
        @keyframes ltt-sweep {
          0%   { opacity: 0; transform: skewX(-12deg) translateX(-260%); }
          15%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: skewX(-12deg) translateX(1100%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ltt-lockup, .ltt-letter, .ltt-bar, .ltt-sub { transition: none !important; }
          .ltt-sweep { display: none; }
        }
      `}</style>
      <div className="ltt-intro-stage" aria-hidden="true">
        <div className="ltt-lockup ltt-fade" ref={lockupRef}>
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => { letterRefs.current[i] = el }}
              className="ltt-letter"
            >
              {letter}
            </span>
          ))}
          <span className="ltt-tail">
            <span className="ltt-bar" />
            <span className="ltt-subwrap"><span className="ltt-sub">Consulting</span></span>
          </span>
          <span className="ltt-sweep" />
        </div>
      </div>
    </>
  )
}
