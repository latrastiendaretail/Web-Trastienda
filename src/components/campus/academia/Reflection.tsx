'use client'

import { useEffect, useState } from 'react'
import { useAcademia } from './AcademiaContext'
import { Icon } from './icons'

interface ReflectionField {
  id: string
  label: string
  placeholder?: string
}

interface ReflectionProps {
  blockId: string
  exerciseId: string
  fields: ReflectionField[]
  savedMessage?: string
}

/** 6 · Reflexión abierta — textarea sin corrección, no puntúa. */
export default function Reflection({
  blockId,
  exerciseId,
  fields,
  savedMessage = 'Guardado — no hay respuesta correcta ni incorrecta, esto no cuenta para el repaso.',
}: ReflectionProps) {
  const { save, load, markDone } = useAcademia()
  const [values, setValues] = useState<string[]>(() => load<string[]>(exerciseId, 'reflection') ?? fields.map(() => ''))
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (values.some((v) => v.trim())) {
      setShown(true)
      markDone(blockId)
    }
    // solo al montar — hidrata desde localStorage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onChange(i: number, value: string) {
    const next = [...values]
    next[i] = value
    setValues(next)
    save(exerciseId, 'reflection', next)
  }

  function onSave() {
    save(exerciseId, 'reflection', values)
    setShown(true)
    if (values.some((v) => v.trim())) markDone(blockId)
  }

  return (
    <div className="ltt-card">
      <div className="ltt-reflect">
        {fields.map((f, i) => (
          <div className="ltt-field" key={f.id}>
            <label htmlFor={f.id}>{f.label}</label>
            <textarea
              id={f.id}
              placeholder={f.placeholder}
              value={values[i]}
              onChange={(e) => onChange(i, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="ltt-card__foot">
        <button className="ltt-btn" type="button" onClick={onSave}>
          Guardar reflexión <Icon name="flecha" />
        </button>
      </div>
      {shown && <div className="ltt-out is-shown">{savedMessage}</div>}
    </div>
  )
}
