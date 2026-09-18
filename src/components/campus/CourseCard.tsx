import { Icon, ProgressDial, type IconName } from '@/components/campus/academia/icons'

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
  icon?: IconName
}

function formatDuration(minutes?: number | null): string | null {
  if (!minutes) return null
  return minutes >= 60 ? `${Math.round(minutes / 60)}h` : `${minutes}min`
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
  icon = 'modulo',
}: CourseCardProps) {
  const isPublished = status === 'published'
  const isComingSoon = status === 'coming_soon'
  const duration = formatDuration(durationMinutes)

  return (
    <a
      href={`/campus/cursos/${slug}`}
      className="group flex flex-col bg-blanco border border-lino/50 hover:border-tinta/40 transition-colors duration-200 cursor-pointer"
    >
      {/* Texture band — sello geométrico, no foto stock */}
      <div className="relative h-20 bg-lino/25 overflow-hidden shrink-0">
        <Icon
          name={icon}
          className="absolute -right-3 -bottom-3 w-24 h-24 text-tinta/[0.07] group-hover:text-acento/[0.12] transition-colors duration-200"
        />
        {category && (
          <span className="absolute top-3 left-3 font-mono text-[9px] text-cuero uppercase tracking-[0.12em] bg-blanco/80 px-2 py-1">
            {category}
          </span>
        )}
        {enrolled && (
          <span className="absolute top-3 right-3 font-mono text-[9px] text-acento uppercase tracking-[0.1em] border border-acento/40 bg-blanco/90 px-2 py-1">
            Inscrito
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 px-5 pt-4 pb-3">
        <h3 className="font-display text-lg font-medium text-tinta leading-snug mb-1.5">
          {title}
        </h3>
        {tagline && (
          <p className="font-sans text-[12px] text-cuero leading-relaxed line-clamp-2">
            {tagline}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-lino/30">
        <div className="flex items-center gap-3 min-w-0">
          {typeof moduleCount === 'number' && moduleCount > 0 && (
            <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.1em] shrink-0">
              {moduleCount} bloques
            </span>
          )}
          {duration && (
            <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.1em] shrink-0">
              {duration}
            </span>
          )}
        </div>

        {progress && progress.total > 0 ? (
          <div className="flex items-center gap-2 shrink-0">
            <ProgressDial total={progress.total} completed={progress.completed} markClassName="w-2 h-2" />
            <span className="font-mono text-[10px] text-acento group-hover:text-tinta transition-colors">→</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            {priceCents != null && (
              <span className="font-mono text-[10px] font-medium text-tinta">
                {priceCents === 0
                  ? 'Gratis'
                  : (priceCents / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
              </span>
            )}
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.1em] border px-2 py-1 ${
                isPublished ? 'text-acento border-acento/40' : 'text-cuero border-lino/60'
              }`}
            >
              {isPublished ? 'Disponible' : isComingSoon ? 'Ver programa' : 'Próximamente'}
            </span>
            <span className="font-mono text-[10px] text-cuero/40 group-hover:text-tinta transition-colors">→</span>
          </div>
        )}
      </div>
    </a>
  )
}
