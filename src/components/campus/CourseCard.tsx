import { ProgressDial } from '@/components/campus/academia/icons'

export interface CourseCardProps {
  slug: string
  title: string
  tagline?: string | null
  category?: string | null
  status: 'published' | 'coming_soon' | 'draft'
  priceCents?: number | null
  moduleCount?: number
  durationMinutes?: number | null
  enrolled?: boolean
  progress?: { completed: number; total: number } | null
  /** Se mantiene por compatibilidad con los llamadores; la tarjeta ya no lleva icono decorativo. */
  icon?: string
}

function formatDuration(minutes?: number | null): string | null {
  if (!minutes) return null
  return minutes >= 60 ? `${Math.round(minutes / 60)} h` : `${minutes} min`
}

export default function CourseCard({
  slug,
  title,
  tagline,
  category,
  status,
  priceCents,
  moduleCount,
  durationMinutes,
  enrolled,
  progress,
}: CourseCardProps) {
  const duration = formatDuration(durationMinutes)
  const meta = [
    typeof moduleCount === 'number' && moduleCount > 0 ? `${moduleCount} bloques` : null,
    duration,
  ].filter(Boolean)

  const price =
    priceCents == null
      ? null
      : priceCents === 0
        ? 'Gratis'
        : (priceCents / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })

  const stateLabel = enrolled
    ? 'Inscrito'
    : status === 'published'
      ? price
      : status === 'coming_soon'
        ? 'Próximamente'
        : null

  return (
    <a
      href={`/campus/cursos/${slug}`}
      className="group flex flex-col bg-blanco border border-lino hover:border-tinta/40 transition-colors duration-200 cursor-pointer p-6"
    >
      {category && <span className="font-sans text-[14px] text-acento-deep mb-3">{category}</span>}
      <h3 className="font-display text-[22px] font-medium text-tinta leading-snug mb-2">{title}</h3>
      {tagline && (
        <p className="font-sans text-[15px] text-tinta/70 leading-relaxed line-clamp-3 mb-5">{tagline}</p>
      )}

      <div className="mt-auto pt-4 border-t border-lino flex items-center justify-between gap-3">
        <span className="font-sans text-[14px] text-tinta/60">{meta.join(' · ')}</span>
        {progress && progress.total > 0 ? (
          <ProgressDial total={progress.total} completed={progress.completed} />
        ) : (
          stateLabel && <span className="font-sans text-[14px] font-medium text-tinta">{stateLabel}</span>
        )}
      </div>
    </a>
  )
}
