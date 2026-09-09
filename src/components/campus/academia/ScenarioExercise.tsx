'use client'

import { useEffect, useState } from 'react'
import { useAcademia } from './AcademiaContext'
import { Icon } from './icons'

interface ScenarioOption {
  text: string
  correct: boolean
  feedback: string
}

interface ScenarioExerciseProps {
  blockId: string
  exerciseId: string
  question: string
  options: ScenarioOption[]
}

/** 3 · Escenario — pregunta con opciones y feedback inmediato por opción, sin bloquear reintentos. */
export default function ScenarioExercise({ blockId, exerciseId, question, options }: ScenarioExerciseProps) {
  const { save, load, markDone } = useAcademia()
  const [picked, setPicked] = useState<number | null>(() => load<number>(exerciseId, 'scenario') ?? null)

  useEffect(() => {
    if (picked !== null) markDone(blockId)
    // solo al montar — hidrata desde localStorage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pick(i: number) {
    setPicked(i)
    save(exerciseId, 'scenario', i)
    markDone(blockId)
  }

  const active = picked !== null ? options[picked] : null

  return (
    <div className="ltt-card">
      <p className="ltt-card__q">{question}</p>
      <div className="ltt-stack">
        {options.map((opt, i) => {
          const isPicked = picked === i
          const status = isPicked ? (opt.correct ? 'is-correct' : 'is-incorrect') : picked !== null ? 'is-muted' : ''
          return (
            <button
              key={opt.text}
              type="button"
              className={`ltt-option${status ? ` ${status}` : ''}`}
              onClick={() => pick(i)}
            >
              <span className="ltt-option__mark">{isPicked && <Icon name={opt.correct ? 'acierto' : 'fallo'} />}</span>
              <span>{opt.text}</span>
            </button>
          )
        })}
      </div>
      {active && (
        <div className={`ltt-fb is-shown ${active.correct ? 'ltt-fb--pos' : 'ltt-fb--neg'}`}>
          <Icon name={active.correct ? 'acierto' : 'fallo'} />
          <span>
            <span className="ltt-fb__t">{active.correct ? 'Correcto' : 'Revísalo'}</span>
            {active.feedback}
          </span>
        </div>
      )}
    </div>
  )
}
