'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useAcademia } from './AcademiaContext'
import { Icon } from './icons'

export interface ModuleSection {
  id: string
  label: string
}

interface ModuleShellProps {
  courseLabel: string
  moduleTitle: string
  kicker: string
  meta: string
  title: ReactNode
  lede: string
  facts: { value: string; label: string }[]
  sections: ModuleSection[]
  children: ReactNode
}

export default function ModuleShell({
  courseLabel,
  moduleTitle,
  kicker,
  meta,
  title,
  lede,
  facts,
  sections,
  children,
}: ModuleShellProps) {
  const { pct, isDone } = useAcademia()
  const [active, setActive] = useState(sections[0]?.id)
  const [idxOpen, setIdxOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-25% 0px -55% 0px' },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  return (
    <div className="ltt">
      <div className="ltt-amb" />

      <div className="ltt-bar">
        <div className="ltt-bar__in">
          <img className="ltt-bar__iso" src="/images/Logos/la-trastienda-isotipo.svg" alt="La Trastienda" />
          <div className="ltt-bar__txt">
            <div className="ltt-bar__curso">{courseLabel}</div>
            <div className="ltt-bar__mod">{moduleTitle}</div>
          </div>
          <div className="ltt-bar__pct">{pct}%</div>
        </div>
        <div className="ltt-bar__track">
          <div className="ltt-bar__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <header className="ltt-shell">
        <div className="ltt-col ltt-hero">
          <div className="ltt-hero__crumb">
            <span className="ltt-kicker">{kicker}</span>
            <span className="ltt-meta">· {meta}</span>
          </div>
          <h1 className="ltt-h1">{title}</h1>
          <p className="ltt-lede ltt-hero__sub">{lede}</p>
          <div className="ltt-hero__facts">
            {facts.map((f) => (
              <div className="ltt-fact" key={f.label}>
                <b>{f.value}</b>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="ltt-shell ltt-shell--idx">
        <nav className={`ltt-idx${idxOpen ? ' is-open' : ''}`}>
          <button className="ltt-idx__toggle" type="button" onClick={() => setIdxOpen((v) => !v)}>
            Índice del módulo <Icon name="chevron" />
          </button>
          <div className="ltt-idx__t">Índice del módulo</div>
          <ul className="ltt-idx__list">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  className={`ltt-idx__a${active === s.id ? ' is-active' : ''}${isDone(s.id) ? ' is-done' : ''}`}
                  href={`#${s.id}`}
                  onClick={() => setIdxOpen(false)}
                >
                  <span className="ltt-idx__dot" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="ltt-col">{children}</main>
      </div>

      <footer className="ltt-foot">
        <span className="ltt-meta">La Trastienda · Academia</span>
        <span className="ltt-meta">El comercio, desde dentro</span>
      </footer>
    </div>
  )
}
