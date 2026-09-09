import type { ReactNode } from 'react'
import { Icon, type IconName } from './icons'

interface LessonBlockProps {
  kicker: string
  title: string
  icon?: IconName
  paragraphs: ReactNode[]
  quote?: string
}

/** 1 · Bloque de lección — etiqueta + resumen + cita destacada. Solo lectura. */
export default function LessonBlock({ kicker, title, icon = 'leccion', paragraphs, quote }: LessonBlockProps) {
  return (
    <>
      <div className="ltt-block__head">
        <span className="ltt-tile">
          <Icon name={icon} />
        </span>
        <div>
          <span className="ltt-kicker">{kicker}</span>
          <h2 className="ltt-h2">{title}</h2>
        </div>
      </div>
      <div className="ltt-prose">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {quote && <blockquote className="ltt-quote">{quote}</blockquote>}
      </div>
    </>
  )
}
