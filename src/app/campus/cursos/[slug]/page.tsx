import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import VideoPlayer from '@/components/campus/VideoPlayer'

interface Props {
  params: Promise<{ slug: string }>
}

type CourseFeature = { label: string; description: string }

const MONTHS_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

function formatMonthYear(dateStr: string | null): string {
  if (!dateStr) return '—'
  const [year, month] = dateStr.split('-').map(Number)
  return `${MONTHS_ES[(month ?? 1) - 1]} ${year}`
}

function formatCourseDuration(minutes: number, sessionCount: number): string {
  const hours = Math.round(minutes / 60)
  if (sessionCount > 0) return `${sessionCount} sesiones · ${hours}h`
  return `${hours}h`
}

function extractVideoId(url: string | null): string | null {
  if (!url) return null
  const match = url.match(/(?:embed\/|v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return match ? match[1] : null
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  const { userId } = await auth()
  const supabase = await createServerClient()

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug, tagline, description, duration_minutes, status, format, start_date, max_students, features')
    .eq('slug', slug)
    .single()

  if (!course) notFound()

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, description, video_url, duration_minutes, order_index, is_preview')
    .eq('course_id', course.id)
    .order('order_index')

  const lessonIds = (lessons ?? []).map((l) => l.id)

  const { data: progressRows } = lessonIds.length > 0 && userId
    ? await supabase
        .from('lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', userId)
        .in('lesson_id', lessonIds)
    : { data: [] }

  const completedSet = new Set(
    (progressRows ?? []).filter((p) => p.completed).map((p) => p.lesson_id)
  )
  const completedCount = completedSet.size
  const totalCount = (lessons ?? []).length
  const isComingSoon = course.status === 'coming_soon'
  const features = (course.features as CourseFeature[] | null) ?? []

  const stats: { label: string; value: string; highlight?: boolean }[] = [
    {
      label: 'Inicio',
      value: formatMonthYear(course.start_date),
      highlight: true,
    },
    {
      label: 'Formato',
      value: course.format ?? 'Online',
    },
    {
      label: 'Duración',
      value: formatCourseDuration(course.duration_minutes, totalCount),
    },
    {
      label: 'Grupo reducido',
      value: course.max_students ? `Máx. ${course.max_students} personas` : '—',
      highlight: true,
    },
    {
      label: 'Enfoque',
      value: 'Casos reales, ejercicios y simulaciones',
    },
  ]

  return (
    <div className="max-w-4xl">
      {/* Back */}
      <a
        href="/campus/cursos"
        className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer"
      >
        ← Todos los cursos
      </a>

      {/* Header */}
      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.16em]">
            Formación intensiva
          </span>
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.1em] border px-2 py-0.5 ${
              isComingSoon
                ? 'text-cuero border-lino/60'
                : 'text-acento border-acento/40'
            }`}
          >
            {isComingSoon ? 'Próximamente' : 'Disponible'}
          </span>
        </div>

        <h1 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-4">
          {course.title}
        </h1>

        {course.tagline && (
          <p className="font-sans text-base text-cuero leading-relaxed max-w-[58ch]">
            {course.tagline}
          </p>
        )}
      </div>

      {/* Stats strip */}
      {(course.start_date || course.format || course.max_students) && (
        <div className="grid grid-cols-2 md:grid-cols-5 border border-lino/50 divide-y md:divide-y-0 md:divide-x divide-lino/30 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-5 bg-blanco">
              <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em] mb-1.5">
                {stat.label}
              </div>
              <div
                className={`font-sans text-[12px] font-medium leading-snug ${
                  stat.highlight ? 'text-acento' : 'text-tinta'
                }`}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {totalCount > 0 && completedCount > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.1em]">
              Tu progreso
            </span>
            <span className="font-mono text-[10px] text-acento uppercase tracking-[0.1em]">
              {completedCount} de {totalCount} sesiones
            </span>
          </div>
          <div className="w-full h-0.5 bg-lino/40">
            <div
              className="h-full bg-acento transition-all duration-500"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Modules */}
      {totalCount > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-lino/40" />
            <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.14em] shrink-0">
              {totalCount} bloques de contenido
            </span>
            <div className="h-px flex-1 bg-lino/40" />
          </div>

          <div className="space-y-3">
            {(lessons ?? []).map((lesson, i) => {
              const videoId = extractVideoId(lesson.video_url)
              const isCompleted = completedSet.has(lesson.id)

              return (
                <div key={lesson.id}>
                  {/* Module card */}
                  <div className="bg-blanco border border-lino/50 px-6 py-5">
                    <div className="flex items-start gap-4">
                      <div className="w-7 h-7 bg-tinta flex items-center justify-center shrink-0 mt-0.5">
                        <span className="font-mono text-[10px] font-medium text-papel">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="font-sans text-[13px] font-medium text-tinta leading-snug">
                              {lesson.title}
                            </h2>
                            {lesson.description && (
                              <p className="font-sans text-[12px] text-cuero mt-1 leading-relaxed">
                                {lesson.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {lesson.duration_minutes > 0 && (
                              <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.08em]">
                                {lesson.duration_minutes >= 60
                                  ? `${lesson.duration_minutes / 60}h`
                                  : `${lesson.duration_minutes}min`}
                              </span>
                            )}
                            {isCompleted && (
                              <span className="font-mono text-[9px] text-acento border border-acento/40 px-1.5 py-0.5">
                                ✓
                              </span>
                            )}
                          </div>
                        </div>
                        {/* No video: status label */}
                        {!videoId && (
                          <div className="flex items-center gap-2 mt-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-lino/60 shrink-0" />
                            <span className="font-mono text-[10px] text-cuero/50 uppercase tracking-[0.1em]">
                              {isComingSoon ? 'Sesión en directo · Junio 2026' : 'Grabación próximamente'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Video recording (when available) */}
                  {videoId && (
                    <VideoPlayer
                      videoId={videoId}
                      lessonId={lesson.id}
                      initialCompleted={isCompleted}
                      title={lesson.title}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {totalCount === 0 && (
        <div className="border border-lino/50 bg-blanco px-6 py-10 text-center mb-12">
          <p className="font-sans text-sm text-cuero/60">
            Las sesiones de este curso estarán disponibles próximamente.
          </p>
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-lino/40" />
            <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.14em] shrink-0">
              Incluido en el curso
            </span>
            <div className="h-px flex-1 bg-lino/40" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {features.map((feat) => (
              <div key={feat.label} className="bg-blanco border border-lino/50 px-4 py-5">
                <div className="font-sans text-[11px] font-medium text-tinta mb-1.5">
                  {feat.label}
                </div>
                <div className="font-sans text-[11px] text-cuero leading-relaxed">
                  {feat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact CTA */}
      {isComingSoon && (
        <div className="border border-lino/50 bg-blanco px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em] mb-1.5">
              Plazas limitadas · Junio 2026
            </div>
            <p className="font-sans text-sm font-medium text-tinta">
              ¿Te interesa este curso?
            </p>
          </div>
          <a
            href="mailto:latrastienda.retail@gmail.com?subject=Interés%20en%20Tus%20Primeros%20Pasos%20en%20Retail"
            className="font-mono text-[11px] font-medium text-papel bg-tinta px-5 min-h-[40px] flex items-center uppercase tracking-[0.08em] hover:bg-acento hover:text-tinta transition-colors duration-200 cursor-pointer shrink-0"
          >
            Más información →
          </a>
        </div>
      )}
    </div>
  )
}
