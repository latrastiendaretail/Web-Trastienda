'use client'

import { useEffect, useState } from 'react'
import { useAcademia } from './AcademiaContext'
import { Icon } from './icons'

interface ClassifyCategory {
  value: string
  label: string
}

interface ClassifyItem {
  id: string
  label: string
  answer: string
}

interface ClassifyProps {
  blockId: string
  exerciseId: string
  categories: [ClassifyCategory, ClassifyCategory]
  items: ClassifyItem[]
}

type ResolvedMap = Record<string, string> // itemId -> chosen value

/** 4 · Clasificación — corrección visual por ítem, no permite recorregir el mismo ítem. */
export default function Classify({ blockId, exerciseId, categories, items }: ClassifyProps) {
  const { save, load, markDone } = useAcademia()
  const [resolved, setResolved] = useState<ResolvedMap>(() => load<ResolvedMap>(exerciseId, 'classify') ?? {})

  const total = items.length
  const done = Object.keys(resolved).length

  useEffect(() => {
    if (done === total && total > 0) markDone(blockId)
    // solo al montar — hidrata desde localStorage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function resolve(item: ClassifyItem, chosen: string) {
    if (resolved[item.id]) return
    const next = { ...resolved, [item.id]: chosen }
    setResolved(next)
    save(exerciseId, 'classify', next)
    if (Object.keys(next).length === total) markDone(blockId)
  }

  function labelFor(value: string) {
    return categories.find((c) => c.value === value)?.label ?? value
  }

  return (
    <div className="ltt-card">
      <div className="ltt-stack">
        {items.map((item) => {
          const chosen = resolved[item.id]
          const isOk = chosen === item.answer
          const status = !chosen ? '' : isOk ? 'is-ok' : 'is-bad'
          return (
            <div className={`ltt-item${status ? ` ${status}` : ''}`} key={item.id}>
              <div className="ltt-item__l">
                <span className="ltt-item__mark">{chosen && <Icon name={isOk ? 'acierto' : 'fallo'} />}</span>
                <span>{item.label}</span>
              </div>
              {chosen ? (
                <span className="ltt-item__verdict">{isOk ? labelFor(item.answer) : `Era: ${labelFor(item.answer)}`}</span>
              ) : (
                <div className="ltt-item__btns">
                  {categories.map((c) => (
                    <button key={c.value} type="button" onClick={() => resolve(item, c.value)}>
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="ltt-count">
        <span>
          {done} / {total} clasificados
        </span>
        <span className="ltt-count__track">
          <span className="ltt-count__fill" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
        </span>
      </div>
    </div>
  )
}
