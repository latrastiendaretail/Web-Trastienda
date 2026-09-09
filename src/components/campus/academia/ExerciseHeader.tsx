import { Icon, type IconName } from './icons'

interface ExerciseHeaderProps {
  kicker: string
  title: string
  icon: IconName
}

/** Cabecera compartida por los 6 tipos de ejercicio (tile hueco + kicker + h3). */
export default function ExerciseHeader({ kicker, title, icon }: ExerciseHeaderProps) {
  return (
    <div className="ltt-block__head ltt-block__head--sub">
      <span className="ltt-tile ltt-tile--hueco">
        <Icon name={icon} />
      </span>
      <div>
        <span className="ltt-kicker">{kicker}</span>
        <h3 className="ltt-h3">{title}</h3>
      </div>
    </div>
  )
}
