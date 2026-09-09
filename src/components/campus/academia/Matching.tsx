'use client'

import { useEffect, useState } from 'react'
import { useAcademia } from './AcademiaContext'
import { Icon } from './icons'

interface MatchingOption {
  value: string
  label: string
}

interface MatchingRow {
  label: string
  answer: string
}

interface MatchingProps {
  blockId: string
  exerciseId: string
  rows: MatchingRow[]
  options: MatchingOption[]
}

/** 5 · Emparejamiento — selector por fila, valida solo al pulsar "comprobar", ignora selects vacíos. */
export default function Matching({ blockId, exerciseId, rows, options }: MatchingProps) {
  const { save, load, markDone } = useAcademia()
  const [values, setValues] = useState<string[]>(() => load<string[]>(exerciseId, 'matching') ?? rows.map(() => ''))
  const [checked, setChecked] = useState<boolean[] | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (values.some(Boolean)) run(values, true)
    // solo al montar — hidrata desde localStorage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onChange(i: number, value: string) {
    const next = [...values]
    next[i] = value
    setValues(next)
    setChecked(null)
    save(exerciseId, 'matching', next)
  }

  function run(vals: string[], silent: boolean) {
    let correct = 0
    const status = rows.map((row, i) => {
      if (!vals[i]) return null
      const ok = vals[i] === row.answer
      if (ok) correct++
      return ok
    })
    setChecked(status.map((s) => !!s))
    const total = rows.length
    setMessage(
      correct < total
        ? `${correct} / ${total} correctas. Revisa las que han quedado en rojo.`
        : `${correct} / ${total} correctas. Perfecto — así funciona la pirámide.`,
    )
    if (!silent) save(exerciseId, 'matching', vals)
    markDone(blockId)
  }

  return (
    <div className="ltt-card">
      <div className="ltt-stack">
        {rows.map((row, i) => {
          const status = checked === null || !values[i] ? '' : checked[i] ? 'is-ok' : 'is-bad'
          return (
            <div className={`ltt-match${status ? ` ${status}` : ''}`} key={row.label}>
              <span className="ltt-match__l">
                <Icon name="emparejamiento" />
                {row.label}
              </span>
              <select aria-label={row.label} value={values[i]} onChange={(e) => onChange(i, e.target.value)}>
                <option value="">Elige...</option>
                {options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
      <div className="ltt-card__foot">
        <button className="ltt-btn" type="button" onClick={() => run(values, false)}>
          Comprobar <Icon name="flecha" />
        </button>
      </div>
      {message && <div className="ltt-out is-shown">{message}</div>}
    </div>
  )
}
