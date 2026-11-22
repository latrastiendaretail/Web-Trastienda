import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'
import VideoPlayer from '@/components/campus/VideoPlayer'
import SlideDeck, { type SlideItem } from '@/components/campus/SlideDeck'
import { getKpiTool } from '@/components/campus/kpis/tools'
import { getVideoPopups } from '@/components/campus/kpis/popups'
import { ProgressDial } from '@/components/campus/academia/icons'
import { extractVideoId } from '@/lib/youtube'

interface Props {
  slug: string
  modulo: string
  /** Usuario matriculado (ya verificado por el llamador) o null en vista previa */
  userId: string | null
  /** Token de enlace de vista previa: solo cambia la navegación; la autorización la hace el llamador */
  previewToken?: string
}

export default async function BloqueView({ slug, modulo, userId, previewToken }: Props) {
  const supabase = createServiceClient()
  const courseHref = previewToken ? `/campus/preview/${previewToken}` : `/campus/cursos/${slug}`
  const moduleHref = (_courseSlug: string, mod: { order_index: number; is_bonus: boolean }) =>
    previewToken
      ? `/campus/preview/${previewToken}/${mod.is_bonus ? 'bonus' : mod.order_index}`
      : `/campus/cursos/${slug}/bloque/${mod.is_bonus ? 'bonus' : mod.order_index}`

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug, status, format')
    .eq('slug', slug)
    .single()

  if (!course) notFound()

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

  // moduleData.slides: array jsonb. Cada elemento es un path de imagen (string,
  // formato legacy) o un objeto {type:"video", url:"<youtube url>"} para intercalar
  // vídeos entre diapositivas.
  type RawSlide = string | { type: 'video'; url: string }
  const rawSlides = (moduleData.slides ?? []) as RawSlide[]
  const imagePaths = rawSlides.filter((s): s is string => typeof s === 'string')
  const signedByPath = new Map<string, string>()
  if (imagePaths.length > 0) {
    const signedSlides = await Promise.all(
      imagePaths.map((path) => supabase.storage.from('campus-resources').createSignedUrl(path, 60 * 60)),
    )
    imagePaths.forEach((path, i) => {
      const url = signedSlides[i].data?.signedUrl
      if (url) signedByPath.set(path, url)
    })
  }
  const slideItems: SlideItem[] = rawSlides.reduce<SlideItem[]>((acc, s) => {
    if (typeof s === 'string') {
      const url = signedByPath.get(s)
      if (url) acc.push({ type: 'image', url })
    } else if (s.type === 'video') {
      const videoId = extractVideoId(s.url)
      if (videoId) acc.push({ type: 'video', videoId })
    }
    return acc
  }, [])

  // Module-level progress (cuando el módulo tiene vídeo o diapositivas propias)
  let moduleCompleted = false
  if ((moduleVideoId || slideItems.length > 0) && userId) {
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

  const linkCls = 'font-sans text-[15px] text-tinta/60 hover:text-tinta transition-colors duration-200'

  return (
    <div>
      <a href={courseHref} className={linkCls}>
        ← {course.title}
      </a>

      <header className="mt-8 mb-10 max-w-[760px]">
        <p className={`font-sans text-[15px] mb-3 ${moduleData.is_bonus ? 'text-acento-deep' : 'text-tinta/60'}`}>
          {moduleLabel}
        </p>
        <h1 className="font-display text-[clamp(1.85rem,4vw,3rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-4">
          {moduleData.title}
        </h1>
        {moduleData.description && (
          <p className="font-sans text-[17px] text-tinta/75 leading-relaxed">{moduleData.description}</p>
        )}
      </header>

      {/* ── Módulo con diapositivas propias (documento dividido en puntos, con vídeos intercalados) ── */}
      {slideItems.length > 0 && (
        <div className="mb-12">
          <SlideDeck
            items={slideItems}
            moduleId={moduleData.id}
            initialCompleted={moduleCompleted}
            title={moduleData.title}
          />
        </div>
      )}

      {/* ── Módulo con vídeo propio (curso con estructura plana) ── */}
      {moduleVideoId ? (
        <div className="mb-12">
          <VideoPlayer
            videoId={moduleVideoId}
            moduleId={moduleData.id}
            initialCompleted={moduleCompleted}
            title={moduleData.title}
            popups={getVideoPopups(slug, moduleData.order_index)}
          />
        </div>
      ) : slideItems.length > 0 ? null : lessons.length === 0 ? (
        <p className="font-sans text-[16px] text-tinta/70 border-y border-lino py-8 mb-12">
          {isComingSoon && !isSelfPaced ? 'La grabación estará disponible tras la sesión en directo.' : 'La grabación estará disponible pronto.'}
        </p>
      ) : (
        <>
          {completedCount > 0 && (
            <div className="flex items-center gap-4 mb-8">
              <ProgressDial total={lessons.length} completed={completedCount} className="w-40" />
              <span className="font-sans text-[15px] text-tinta/70">
                {completedCount} de {lessons.length} completadas
              </span>
            </div>
          )}

          <div className="space-y-12 mb-12 max-w-[900px]">
            {lessons.map((lesson, idx) => {
              const videoId = extractVideoId(lesson.video_url)
              const isCompleted = completedSet.has(lesson.id)
              const label = `${lessonPrefix}.${idx + 1}`

              return (
                <section key={lesson.id}>
                  <div className="mb-4">
                    <h2 className="font-display text-[22px] font-medium text-tinta leading-snug">
                      <span className="text-tinta/40 mr-3">{label}</span>
                      {lesson.title}
                    </h2>
                    <p className="font-sans text-[14px] text-tinta/60 mt-1">
                      {[
                        lesson.duration_minutes > 0
                          ? lesson.duration_minutes >= 60
                            ? `${lesson.duration_minutes / 60} h`
                            : `${lesson.duration_minutes} min`
                          : null,
                        isCompleted ? 'Completada' : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    {lesson.description && (
                      <p className="font-sans text-[16px] text-tinta/75 mt-2 leading-relaxed max-w-[62ch]">{lesson.description}</p>
                    )}
                  </div>
                  {videoId ? (
                    <VideoPlayer videoId={videoId} lessonId={lesson.id} initialCompleted={isCompleted} title={lesson.title} />
                  ) : (
                    <p className="font-sans text-[15px] text-tinta/60">
                      {isComingSoon && !isSelfPaced ? 'Sesión en directo en junio de 2026.' : 'La grabación estará disponible pronto.'}
                    </p>
                  )}
                </section>
              )
            })}
          </div>
        </>
      )}

      {/* Recursos del capítulo: PDF descargable + herramienta interactiva */}
      {(pdfSignedUrl || KpiTool) && (
        <section className="mb-12" aria-labelledby="recursos">
          <h2 id="recursos" className="font-display text-2xl font-medium text-tinta mb-5">
            Material del capítulo
          </h2>
          <div className="space-y-5">
            {pdfSignedUrl && (
              <a
                href={pdfSignedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 border border-lino bg-blanco px-6 py-5 hover:border-tinta/40 transition-colors duration-200"
              >
                <span>
                  <span className="block font-sans text-[16px] font-medium text-tinta">Manual del capítulo</span>
                  <span className="block font-sans text-[14px] text-tinta/60">PDF para descargar</span>
                </span>
                <span className="font-sans text-[15px] font-medium text-tinta shrink-0">Descargar</span>
              </a>
            )}
            {KpiTool && <KpiTool />}
          </div>
        </section>
      )}

      {/* Anterior / siguiente */}
      <nav className="flex items-center justify-between gap-4 border-t border-lino pt-6" aria-label="Navegación entre bloques">
        {prevModule ? (
          <a href={moduleHref(slug, prevModule)} className={linkCls}>
            ← {prevModule.is_bonus ? 'Bonus Track' : `Bloque ${prevModule.order_index}`}
          </a>
        ) : (
          <a href={courseHref} className={linkCls}>
            ← Volver al curso
          </a>
        )}
        {nextModule ? (
          <a href={moduleHref(slug, nextModule)} className="font-sans text-[15px] font-medium text-tinta hover:text-acento-deep transition-colors duration-200">
            {nextModule.is_bonus ? 'Bonus Track' : `Bloque ${nextModule.order_index}`} →
          </a>
        ) : (
          <span className="font-sans text-[15px] text-tinta/50">Fin del curso</span>
        )}
      </nav>
    </div>
  )
}
