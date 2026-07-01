import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import VideoPlayer from '@/components/campus/VideoPlayer'

interface Props {
  params: Promise<{ slug: string; modulo: string }>
}

function extractVideoId(url: string | null): string | null {
  if (!url) return null
  const match = url.match(/(?:embed\/|v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return match ? match[1] : null
}

function moduleHref(courseSlug: string, mod: { order_index: number; is_bonus: boolean }) {
  return `/campus/cursos/${courseSlug}/bloque/${mod.is_bonus ? 'bonus' : mod.order_index}`
}

export default async function BloquePage({ params }: Props) {
  const { slug, modulo } = await params
  const { userId } = await auth()
  const supabase = await createServerClient()

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug, status')
    .eq('slug', slug)
    .single()

  if (!course) notFound()

  if (!userId) notFound()

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', course.id)
    .maybeSingle()

  if (!enrollment) notFound()

  const isBonus = modulo === 'bonus'
  const orderIndex = isBonus ? null : parseInt(modulo, 10)

  const moduleQuery = supabase
    .from('modules')
    .select('id, title, description, video_url, order_index, is_bonus')
    .eq('course_id', course.id)

  const { data: moduleData } = isBonus
    ? await moduleQuery.eq('is_bonus', true).single()
    : await moduleQuery.eq('order_index', orderIndex!).eq('is_bonus', false).single()

  if (!moduleData) notFound()

  const moduleVideoId = extractVideoId(moduleData.video_url)
  const isComingSoon = course.status === 'coming_soon'

  // Module-level progress (when module has its own video)
  let moduleCompleted = false
  if (moduleVideoId && userId) {
    const { data: modProgress } = await supabase
      .from('module_progress')
      .select('completed')
      .eq('user_id', userId)
      .eq('module_id', moduleData.id)
      .maybeSingle()
    moduleCompleted = modProgress?.completed ?? false
  }

  // Lesson-level data (for courses that use the lessons architecture)
  const { data: rawLessons } = await supabase
    .from('lessons')
    .select('id, title, description, video_url, duration_minutes, order_index, is_preview')
    .eq('module_id', moduleData.id)
    .order('order_index')

  const lessons = rawLessons ?? []
  const lessonIds = lessons.map((l) => l.id)

  const { data: progressRows } = lessonIds.length > 0 && userId
    ? await supabase
        .from('lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', userId)
        .in('lesson_id', lessonIds)
    : { data: [] }

  const completedSet = new Set(
    (progressRows ?? []).filter((p) => p.completed).map((p) => p.lesson_id),
  )

  const { data: allModules } = await supabase
    .from('modules')
    .select('id, title, order_index, is_bonus')
    .eq('course_id', course.id)
    .order('order_index')

  const currentIdx = (allModules ?? []).findIndex((m) => m.id === moduleData.id)
  const prevModule = currentIdx > 0 ? (allModules ?? [])[currentIdx - 1] : null
  const nextModule = currentIdx < (allModules ?? []).length - 1 ? (allModules ?? [])[currentIdx + 1] : null

  const moduleLabel = moduleData.is_bonus ? 'Bonus Track' : `Bloque ${moduleData.order_index}`
  const lessonPrefix = moduleData.is_bonus ? 'B' : String(moduleData.order_index)
  const completedCount = completedSet.size

  return (
    <div className="max-w-4xl">
      {/* Back to course */}
      <a
        href={`/campus/cursos/${slug}`}
        className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200"
      >
        ← {course.title}
      </a>

      {/* Module header */}
      <div className="mt-6 mb-8">
        <span
          className={`block font-mono text-[9px] uppercase tracking-[0.16em] mb-3 ${
            moduleData.is_bonus ? 'text-acento' : 'text-cuero'
          }`}
        >
          {moduleLabel}
        </span>
        <h1 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-3">
          {moduleData.title}
        </h1>
        {moduleData.description && (
          <p className="font-sans text-base text-cuero leading-relaxed max-w-[58ch]">
            {moduleData.description}
          </p>
        )}
      </div>

      {/* ── Módulo con vídeo propio (curso con estructura plana) ── */}
      {moduleVideoId ? (
        <div className="border border-lino/50 mb-12">
          <VideoPlayer
            videoId={moduleVideoId}
            moduleId={moduleData.id}
            initialCompleted={moduleCompleted}
            title={moduleData.title}
          />
        </div>
      ) : lessons.length === 0 ? (
        /* Sin vídeo y sin lecciones → próximamente */
        <div className="border border-lino/50 bg-blanco px-6 py-10 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-lino/60 shrink-0" />
            <span className="font-mono text-[10px] text-cuero/50 uppercase tracking-[0.1em]">
              {isComingSoon ? 'Grabación disponible tras la sesión en directo' : 'Grabación próximamente'}
            </span>
          </div>
        </div>
      ) : (
        /* ── Módulo con lecciones (cursos con arquitectura de lecciones) ── */
        <>
          {lessons.length > 0 && completedCount > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.1em]">Tu progreso</span>
                <span className="font-mono text-[10px] text-acento uppercase tracking-[0.1em]">
                  {completedCount} de {lessons.length} lecciones
                </span>
              </div>
              <div className="w-full h-0.5 bg-lino/40">
                <div
                  className="h-full bg-acento transition-all duration-500"
                  style={{ width: `${(completedCount / lessons.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-4 mb-12">
            {lessons.map((lesson, idx) => {
              const videoId = extractVideoId(lesson.video_url)
              const isCompleted = completedSet.has(lesson.id)
              const label = `${lessonPrefix}.${idx + 1}`

              return (
                <div key={lesson.id} className="border border-lino/50">
                  <div className="bg-blanco px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-[10px] text-cuero/60 mt-0.5 w-8 shrink-0">{label}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-sans text-[13px] font-medium text-tinta leading-snug">
                            {lesson.title}
                          </h3>
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
                        {lesson.description && (
                          <p className="font-sans text-[11px] text-cuero mt-1 leading-relaxed max-w-[60ch]">
                            {lesson.description}
                          </p>
                        )}
                        {!videoId && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-lino/60 shrink-0" />
                            <span className="font-mono text-[9px] text-cuero/50 uppercase tracking-[0.1em]">
                              {isComingSoon ? 'Sesión en directo · Junio 2026' : 'Grabación próximamente'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

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
        </>
      )}

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between border-t border-lino/40 pt-6">
        {prevModule ? (
          <a
            href={moduleHref(slug, prevModule)}
            className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200"
          >
            ← {prevModule.is_bonus ? 'Bonus Track' : `Bloque ${prevModule.order_index}`}
          </a>
        ) : (
          <a
            href={`/campus/cursos/${slug}`}
            className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200"
          >
            ← Volver al curso
          </a>
        )}
        {nextModule ? (
          <a
            href={moduleHref(slug, nextModule)}
            className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200"
          >
            {nextModule.is_bonus ? 'Bonus Track' : `Bloque ${nextModule.order_index}`} →
          </a>
        ) : (
          <span className="font-mono text-[10px] text-cuero/30 uppercase tracking-[0.1em]">
            Fin del curso
          </span>
        )}
      </div>
    </div>
  )
}
