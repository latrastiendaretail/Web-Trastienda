import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/service'
import VideoPlayer from '@/components/campus/VideoPlayer'
import SlideDeck from '@/components/campus/SlideDeck'
import { getKpiTool } from '@/components/campus/kpis/tools'
import { ProgressDial, Watermark, Icon } from '@/components/campus/academia/icons'

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
  const supabase = createServiceClient()

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug, status, format')
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
    .select('id, title, description, video_url, order_index, is_bonus, pdf_url, tool_key, slides')
    .eq('course_id', course.id)

  const { data: moduleData } = isBonus
    ? await moduleQuery.eq('is_bonus', true).single()
    : await moduleQuery.eq('order_index', orderIndex!).eq('is_bonus', false).single()

  if (!moduleData) notFound()

  const moduleVideoId = extractVideoId(moduleData.video_url)
  const isComingSoon = course.status === 'coming_soon'
  // Cursos autoformación (sin cohorte) no tienen sesión en directo — solo grabación pendiente.
  const isSelfPaced = (course.format ?? '').toLowerCase().includes('autoformación')
  const KpiTool = getKpiTool(moduleData.tool_key)

  let pdfSignedUrl: string | null = null
  if (moduleData.pdf_url) {
    const { data: signed } = await supabase.storage
      .from('campus-resources')
      .createSignedUrl(moduleData.pdf_url, 60 * 10)
    pdfSignedUrl = signed?.signedUrl ?? null
  }

  const slidePaths = moduleData.slides ?? []
  let slideSignedUrls: string[] = []
  if (slidePaths.length > 0) {
    const signedSlides = await Promise.all(
      slidePaths.map((path) => supabase.storage.from('campus-resources').createSignedUrl(path, 60 * 60)),
    )
    slideSignedUrls = signedSlides.map((s) => s.data?.signedUrl).filter((u): u is string => !!u)
  }

  // Module-level progress (cuando el módulo tiene vídeo o diapositivas propias)
  let moduleCompleted = false
  if ((moduleVideoId || slidePaths.length > 0) && userId) {
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

  // Contenido del capítulo por separado (píldoras + vídeo). Solo se muestra en
  // capítulos con contenido propio (pdf/herramienta) — no se inventa en cursos
  // sin esta estructura. Píldoras son placeholders; el vídeo refleja el estado real.
  const hasSeparateContent = !moduleData.is_bonus && (!!moduleData.pdf_url || !!moduleData.tool_key)
  const chapterSteps = hasSeparateContent
    ? [
        { label: 'Píldora 1', desc: 'Resumen exprés del concepto', icon: 'pildora' as const, available: false },
        { label: 'Píldora 2', desc: 'Caso práctico aplicado', icon: 'pildora' as const, available: false },
        { label: 'Vídeo completo', desc: 'Sesión grabada del capítulo', icon: 'reproducir' as const, available: !!moduleVideoId },
      ]
    : []

  return (
    <div className="max-w-5xl">
      {/* Back to course */}
      <a
        href={`/campus/cursos/${slug}`}
        className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200"
      >
        ← {course.title}
      </a>

      {/* Module header */}
      <div className="relative mt-6 mb-10 pb-8 border-b border-lino/50 overflow-hidden">
        <Watermark
          text={moduleData.is_bonus ? '★' : String(moduleData.order_index).padStart(2, '0')}
          className="text-[14rem] -right-4 -top-14 md:text-[18rem]"
        />
        <span
          className={`relative block font-mono text-[9px] uppercase tracking-[0.16em] mb-3 ${
            moduleData.is_bonus ? 'text-acento' : 'text-cuero'
          }`}
        >
          {moduleLabel}
        </span>
        <h1 className="relative font-display text-[clamp(1.85rem,4vw,3.25rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-4 max-w-[24ch]">
          {moduleData.title}
        </h1>
        {moduleData.description && (
          <p className="relative font-sans text-base text-cuero leading-relaxed max-w-[58ch]">
            {moduleData.description}
          </p>
        )}
      </div>

      {/* Contenido del capítulo — píldoras + vídeo por separado */}
      {chapterSteps.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.1em]">Contenido del capítulo</span>
            <div className="flex-1 h-px bg-lino/40" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 border border-lino/50 divide-y sm:divide-y-0 sm:divide-x divide-lino/30">
            {chapterSteps.map((s, i) => (
              <div key={s.label} className={`bg-blanco px-5 py-5 ${!s.available ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] text-cuero/60 uppercase tracking-[0.12em]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Icon name={s.icon} className={`w-4 h-4 ${s.available ? 'text-acento' : 'text-cuero/30'}`} />
                </div>
                <div className="font-sans text-[13px] font-medium text-tinta leading-snug mb-1">
                  {s.label}
                </div>
                <div className="font-sans text-[11px] text-cuero leading-relaxed mb-3">
                  {s.desc}
                </div>
                <span className={`font-mono text-[9px] uppercase tracking-[0.1em] ${s.available ? 'text-acento' : 'text-cuero/45'}`}>
                  {s.available ? 'Disponible ↓' : 'Próximamente'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Módulo con diapositivas propias (documento dividido en puntos) ── */}
      {slideSignedUrls.length > 0 && (
        <div className="border border-lino/50 mb-12">
          <SlideDeck
            slideUrls={slideSignedUrls}
            moduleId={moduleData.id}
            initialCompleted={moduleCompleted}
            title={moduleData.title}
          />
        </div>
      )}

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
      ) : slideSignedUrls.length > 0 ? null : lessons.length === 0 ? (
        /* Sin vídeo y sin lecciones → próximamente */
        <div className="border border-lino/50 bg-blanco px-6 py-10 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-lino/60 shrink-0" />
            <span className="font-mono text-[10px] text-cuero/50 uppercase tracking-[0.1em]">
              {isComingSoon && !isSelfPaced ? 'Grabación disponible tras la sesión en directo' : 'Grabación próximamente'}
            </span>
          </div>
        </div>
      ) : (
        /* ── Módulo con lecciones (cursos con arquitectura de lecciones) ── */
        <>
          {lessons.length > 0 && completedCount > 0 && (
            <div className="flex items-center justify-between mb-8 border border-lino/50 bg-blanco px-5 py-4">
              <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.1em]">Tu progreso</span>
              <div className="flex items-center gap-3">
                <ProgressDial total={lessons.length} completed={completedCount} markClassName="w-3 h-3" />
                <span className="font-mono text-[10px] text-acento uppercase tracking-[0.1em]">
                  {completedCount} de {lessons.length}
                </span>
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
                              {isComingSoon && !isSelfPaced ? 'Sesión en directo · Junio 2026' : 'Grabación próximamente'}
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

      {/* Recursos del capítulo: PDF descargable + herramienta interactiva */}
      {(pdfSignedUrl || KpiTool) && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.1em]">Recursos</span>
            <div className="flex-1 h-px bg-lino/40" />
          </div>

          <div className="space-y-4">
            {pdfSignedUrl && (
              <a
                href={pdfSignedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border border-lino/50 bg-blanco px-6 py-4 hover:border-acento/50 transition-colors duration-200"
              >
                <div>
                  <span className="font-mono text-[9px] text-acento uppercase tracking-[0.12em] block mb-1">
                    Manual del capítulo
                  </span>
                  <span className="font-sans text-[13px] text-tinta">Descargar PDF</span>
                </div>
                <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.1em]">↓</span>
              </a>
            )}

            {KpiTool && <KpiTool />}
          </div>
        </div>
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
