'use client'

import { useEffect, useState } from 'react'
import { useAcademia } from './AcademiaContext'
import { Icon } from './icons'

interface SelfCheckItem {
  term: string
  description: string
}

interface SelfCheckProps {
  blockId: string
  exerciseId: string
  items: SelfCheckItem[]
  note?: string
}

const DEFAULT_MESSAGES = {
  cero: 'Marca al menos una para ver el resultado — no hay respuesta incorrecta, es para que pares a pensarlo.',
  bajo: 'Usas {n} de {t} de forma consciente. Es normal al principio — el resto se entrenan con la práctica, no son un don.',
  medio: 'Usas {n} de {t} de forma consciente. Vas bien encaminado — fíjate en las que no has marcado durante tu próximo turno.',
  alto: 'Usas {n} de {t} de forma consciente. Eso ya es más de lo que la mayoría reconoce tener el primer día.',
}

function fill(template: string, vars: Record<string, number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k]))
}

/** 2 · Autoevaluación — checklist que no puntúa, solo refleja. */
export default function SelfCheck({ blockId, exerciseId, items, note }: SelfCheckProps) {
  const { save, load, markDone } = useAcademia()
  const [checked, setChecked] = useState<boolean[]>(() => {
    const prev = load<boolean[]>(exerciseId, 'selfcheck')
    return prev ?? items.map(() => false)
  })
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (checked.some(Boolean)) {
      compute(true)
    }
    // solo al montar — hidrata desde localStorage si había respuestas previas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggle(i: number) {
    setChecked((prev) => {
      const next = [...prev]
      next[i] = !next[i]
      save(exerciseId, 'selfcheck', next)
      return next
    })
  }

  function compute(silent: boolean) {
    const n = checked.filter(Boolean).length
    const t = items.length
    const tier = n === 0 ? 'cero' : n <= Math.ceil(t / 3) ? 'bajo' : n <= Math.ceil((t * 2) / 3) ? 'medio' : 'alto'
    setMessage(fill(DEFAULT_MESSAGES[tier], { n, t }))
    if (!silent) save(exerciseId, 'selfcheck', checked)
    if (n > 0) markDone(blockId)
  }

  return (
    <div className="ltt-card">
      <div className="ltt-check">
        {items.map((item, i) => (
          <label className="ltt-check__item" key={item.term}>
            <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} />
            <span>
              <b>{item.term}</b> — {item.description}
            </span>
          </label>
        ))}
      </div>
      <div className="ltt-card__foot">
        <button className="ltt-btn" type="button" onClick={() => compute(false)}>
          Ver resultado <Icon name="flecha" />
        </button>
        {note && <span className="ltt-note">{note}</span>}
      </div>
      {message && <div className="ltt-out is-shown">{message}</div>}
    </div>
  )
}
