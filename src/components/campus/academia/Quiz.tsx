'use client'

import { useEffect, useState } from 'react'
import { useAcademia } from './AcademiaContext'
import { Icon } from './icons'

interface QuizOption {
  value: string
  label: string
}

interface QuizQuestion {
  id: string
  text: string
  answer: string
  options: QuizOption[]
}

interface QuizProps {
  blockId: string
  exerciseId: string
  title: string
  lede: string
  questions: QuizQuestion[]
  pass?: number
}

type Answers = Record<string, string>

/** 7 · Repaso / examen — opción múltiple, barra de progreso, gate del `pass` (80% por defecto). */
export default function Quiz({ blockId, exerciseId, title, lede, questions, pass = 0.8 }: QuizProps) {
  const { save, load, markDone, complete } = useAcademia()
  const [answers, setAnswers] = useState<Answers>(() => load<Answers>(exerciseId, 'quiz') ?? {})
  const [warn, setWarn] = useState(false)
  const [result, setResult] = useState<{ correct: number; total: number; score: number; passed: boolean } | null>(null)

  const total = questions.length
  const minOk = Math.ceil(total * pass)
  const answeredCount = questions.filter((q) => answers[q.id]).length
  const progressPct = total ? (answeredCount / total) * 100 : 0

  useEffect(() => {
    if (load<boolean>(exerciseId, 'graded')) grade(answers, true)
    // solo al montar — hidrata desde localStorage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onChange(qid: string, value: string) {
    const next = { ...answers, [qid]: value }
    setAnswers(next)
    save(exerciseId, 'quiz', next)
    setWarn(false)
  }

  function grade(current: Answers, silent: boolean) {
    if (questions.some((q) => !current[q.id])) {
      if (!silent) setWarn(true)
      return
    }
    setWarn(false)
    const correct = questions.filter((q) => current[q.id] === q.answer).length
    const score = correct / total
    const passed = score >= pass
    setResult({ correct, total, score, passed })
    save(exerciseId, 'graded', true)
    if (passed) markDone(blockId)
  }

  const ctaUnlocked = result?.passed ?? false

  return (
    <>
      <div className="ltt-dark">
        <img className="ltt-dark__wm" src="/images/Logos/la-trastienda-isotipo-blanco.svg" alt="" />
        <div className="ltt-block__head">
          <span className="ltt-tile">
            <Icon name="repaso" />
          </span>
          <div>
            <span className="ltt-kicker">Repaso final</span>
            <h2 className="ltt-h2">{title}</h2>
          </div>
        </div>
        <p className="ltt-lede">{lede}</p>
        <div className="ltt-qprog">
          <span className="ltt-qprog__track">
            <span className="ltt-qprog__fill" style={{ width: `${progressPct}%` }} />
          </span>
          <span className="ltt-qprog__n">
            {answeredCount} / {total} respondidas
          </span>
        </div>

        <div className="ltt-quiz">
          {questions.map((q, qi) => (
            <div className="ltt-q" key={q.id}>
              <span className="ltt-q__n">Pregunta {String(qi + 1).padStart(2, '0')}</span>
              <p className="ltt-q__t">{q.text}</p>
              <div className="ltt-q__opts">
                {q.options.map((opt) => (
                  <label className="ltt-choice" key={opt.value}>
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.value}
                      checked={answers[q.id] === opt.value}
                      onChange={() => onChange(q.id, opt.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <hr />
        <button className="ltt-btn" type="button" onClick={() => grade(answers, false)}>
          Corregir tipo test <Icon name="flecha" />
        </button>
        {warn && (
          <div className="ltt-warn is-shown">
            <Icon name="aviso" /> Responde a las {total} preguntas antes de corregir.
          </div>
        )}
        {result && (
          <div className={`ltt-res is-shown ${result.passed ? 'is-pass' : 'is-fail'}`}>
            <div className="ltt-res__score">
              {Math.round(result.score * 100)}%<small>{result.correct} / {result.total} correctas</small>
            </div>
            <div>
              <div className="ltt-res__t">
                <Icon name={result.passed ? 'acierto' : 'fallo'} />
                {result.passed ? 'Aprobado · módulo superado' : 'No alcanzado'}
              </div>
              <p className="ltt-res__b">
                {result.passed
                  ? 'Has superado el repaso. Ya puedes cerrar el módulo y pasar al siguiente contenido.'
                  : `Necesitas al menos ${Math.round(pass * 100)}% (${minOk}/${total}) para completar el módulo. Repasa las lecciones y vuelve a intentarlo — puedes corregir tantas veces como quieras.`}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className={`ltt-gate${ctaUnlocked ? ' is-open' : ''}`}>
        <button
          className={`ltt-cta${ctaUnlocked ? ' is-unlocked' : ''}`}
          type="button"
          disabled={!ctaUnlocked}
          onClick={() => ctaUnlocked && complete()}
        >
          Finalizar módulo <Icon name="flecha" />
        </button>
        <span className="ltt-lock">
          <Icon name={ctaUnlocked ? 'abierto' : 'bloqueado'} />
          {ctaUnlocked
            ? 'Desbloqueado — puedes cerrar el módulo cuando quieras'
            : `Bloqueado — supera el ${Math.round(pass * 100)}% del tipo test para completar el módulo`}
        </span>
      </div>
    </>
  )
}
