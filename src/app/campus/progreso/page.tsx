import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'
import { auth } from '@clerk/nextjs/server'
import { ProgressDial, Watermark } from '@/components/campus/academia/icons'

export default async function ProgresoPage() {
  const { userId } = await auth()
  if (!userId) redirect('/campus/login')
  const supabase = createServiceClient()

  const [
    { count: enrolledCount },
    { count: completedLessons },
    { data: enrollments },
    { data: certificates },
  ] = await Promise.all([
    supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId ?? 'NONE'),
    supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId ?? 'NONE')
      .eq('completed', true),
    supabase
      .from('enrollments')
      .select('course_id, enrolled_at, courses(title, duration_minutes, status, slug)')
      .eq('user_id', userId ?? 'NONE')
      .order('enrolled_at', { ascending: false }),
    supabase
      .from('certificates')
      .select('id, code, issued_at, courses(title, slug)')
      .eq('user_id', userId ?? 'NONE')
      .order('issued_at', { ascending: false }),
  ])

  // Per-course progress dial: modules with video use module_progress, otherwise lesson_progress
  // (same split as the course landing page).
  const enrolledCourseIds = (enrollments ?? []).map((e) => e.course_id)
  const progressByCourse = new Map<string, { completed: number; total: number }>()

  if (enrolledCourseIds.length > 0) {
    const [{ data: modules }, { data: lessons }] = await Promise.all([
      supabase.from('modules').select('id, course_id, video_url, slides').in('course_id', enrolledCourseIds),
      supabase.from('lessons').select('id, course_id').in('course_id', enrolledCourseIds),
    ])

    const videoModulesByCourse = new Map<string, string[]>()
    const moduleToCourse = new Map<string, string>()
    for (const m of modules ?? []) {
      if (!m.video_url && !(m.slides && m.slides.length > 0)) continue
      moduleToCourse.set(m.id, m.course_id)
      videoModulesByCourse.set(m.course_id, [...(videoModulesByCourse.get(m.course_id) ?? []), m.id])
    }
    const allVideoModuleIds = [...moduleToCourse.keys()]

    const lessonsByCourse = new Map<string, string[]>()
    const lessonToCourse = new Map<string, string>()
    for (const l of lessons ?? []) {
      lessonToCourse.set(l.id, l.course_id)
      lessonsByCourse.set(l.course_id, [...(lessonsByCourse.get(l.course_id) ?? []), l.id])
    }
    const allLessonIds = [...lessonToCourse.keys()]

    const [{ data: modProgress }, { data: lessonProgress }] = await Promise.all([
      allVideoModuleIds.length > 0
        ? supabase.from('module_progress').select('module_id').eq('user_id', userId).eq('completed', true).in('module_id', allVideoModuleIds)
        : Promise.resolve({ data: [] }),
      allLessonIds.length > 0
        ? supabase.from('lesson_progress').select('lesson_id').eq('user_id', userId).eq('completed', true).in('lesson_id', allLessonIds)
        : Promise.resolve({ data: [] }),
    ])

    const completedModulesByCourse = new Map<string, number>()
    for (const p of modProgress ?? []) {
      const courseId = moduleToCourse.get(p.module_id)
      if (courseId) completedModulesByCourse.set(courseId, (completedModulesByCourse.get(courseId) ?? 0) + 1)
    }
    const completedLessonsByCourse = new Map<string, number>()
    for (const p of lessonProgress ?? []) {
      const courseId = lessonToCourse.get(p.lesson_id)
      if (courseId) completedLessonsByCourse.set(courseId, (completedLessonsByCourse.get(courseId) ?? 0) + 1)
    }

    for (const courseId of enrolledCourseIds) {
      const videoTotal = videoModulesByCourse.get(courseId)?.length ?? 0
      if (videoTotal > 0) {
        progressByCourse.set(courseId, { completed: completedModulesByCourse.get(courseId) ?? 0, total: videoTotal })
      } else {
        const lessonTotal = lessonsByCourse.get(courseId)?.length ?? 0
        if (lessonTotal > 0) {
          progressByCourse.set(courseId, { completed: completedLessonsByCourse.get(courseId) ?? 0, total: lessonTotal })
        }
      }
    }
  }

  const totalUnits = [...progressByCourse.values()].reduce((sum, p) => sum + p.total, 0)
  const totalCompleted = [...progressByCourse.values()].reduce((sum, p) => sum + p.completed, 0)
  const avgProgress = totalUnits > 0 ? Math.round((totalCompleted / totalUnits) * 100) : 0

  const stats = [
    { value: String(enrolledCount ?? 0), label: 'Cursos inscritos', sub: 'activos' },
    { value: String(completedLessons ?? 0), label: 'Lecciones completadas', sub: 'en total' },
    { value: `${avgProgress}%`, label: 'Progreso medio', sub: 'en todos los cursos' },
    { value: String(certificates?.length ?? 0), label: 'Certificados', sub: 'obtenidos' },
  ]

  return (
    <div className="max-w-5xl">
      <div className="relative mb-12 pb-10 border-b border-lino/50 overflow-hidden">
        <Watermark text={`${avgProgress}%`} className="text-[13rem] -right-6 -top-14 md:text-[15rem]" />
        <span className="relative block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-3">
          Seguimiento
        </span>
        <h1 className="relative font-display text-[clamp(2.25rem,5vw,3.75rem)] font-medium text-tinta leading-[1.05] tracking-[-0.02em] mb-4">
          Mi progreso
        </h1>
        <p className="relative font-sans text-base text-cuero leading-relaxed max-w-[52ch]">
          Tu avance formativo, historial de cursos y certificados.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-blanco border border-lino/50 p-5">
            <div className="font-display text-3xl font-medium text-tinta leading-none mb-1">
              {stat.value}
            </div>
            <div className="font-mono text-[10px] text-cuero uppercase tracking-[0.1em] mb-0.5">
              {stat.label}
            </div>
            <div className="font-mono text-[9px] text-cuero/50 uppercase tracking-[0.08em]">
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="font-display text-xl font-medium text-tinta tracking-[-0.01em] mb-6">
          Historial de cursos
        </h2>

        {enrollments && enrollments.length > 0 ? (
          <div className="space-y-3">
            {enrollments.map((e) => {
              const course = e.courses as { title: string; duration_minutes: number; status: string; slug: string } | null
              const progress = progressByCourse.get(e.course_id)
              const isComplete = progress && progress.total > 0 && progress.completed >= progress.total
              return (
                <a
                  key={e.course_id}
                  href={course?.slug ? `/campus/cursos/${course.slug}` : '/campus/cursos'}
                  className="flex items-center justify-between bg-blanco border border-lino/50 px-6 py-4 hover:border-tinta/30 transition-colors duration-200 cursor-pointer group"
                >
                  <div>
                    <span className="block font-sans text-sm font-medium text-tinta">
                      {course?.title ?? 'Curso'}
                    </span>
                    <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.08em]">
                      Inscrito {new Date(e.enrolled_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {progress && progress.total > 0 ? (
                      <div className="flex items-center gap-2">
                        <ProgressDial total={progress.total} completed={progress.completed} markClassName="w-2.5 h-2.5" />
                        <span className={`font-mono text-[9px] uppercase tracking-[0.1em] ${isComplete ? 'text-acento' : 'text-cuero'}`}>
                          {isComplete ? 'Completado' : `${progress.completed}/${progress.total}`}
                        </span>
                      </div>
                    ) : (
                      <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.1em] border border-lino/60 px-2 py-1">
                        Sin empezar
                      </span>
                    )}
                    <span className="font-mono text-[13px] text-cuero/40 group-hover:text-tinta transition-colors">→</span>
                  </div>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="border border-lino/40 bg-blanco px-6 py-12 flex flex-col items-center justify-center text-center">
            <p className="font-sans text-sm text-cuero/60 max-w-[36ch] leading-relaxed">
              Aún no estás inscrito en ningún curso.
            </p>
            <a
              href="/campus/cursos"
              className="mt-6 inline-flex items-center font-mono text-[11px] font-medium text-tinta uppercase tracking-[0.08em] border border-tinta px-5 min-h-[40px] hover:bg-tinta hover:text-papel transition-colors duration-200 cursor-pointer"
            >
              Ver catálogo de cursos
            </a>
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-xl font-medium text-tinta tracking-[-0.01em] mb-6">
          Certificados
        </h2>

        {certificates && certificates.length > 0 ? (
          <div className="space-y-3">
            {certificates.map((cert) => {
              const course = cert.courses as { title: string; slug: string } | null
              return (
                <div
                  key={cert.id}
                  className="flex items-center justify-between bg-blanco border border-lino/50 px-6 py-4"
                >
                  <div>
                    <span className="block font-sans text-sm font-medium text-tinta">
                      {course?.title ?? 'Curso'}
                    </span>
                    <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.08em]">
                      {cert.code} · {new Date(cert.issued_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <a
                    href={`/campus/certificado/${cert.id}`}
                    className="font-mono text-[10px] text-acento border border-acento/40 px-3 py-1.5 uppercase tracking-[0.08em] hover:bg-acento hover:text-tinta transition-colors duration-200 shrink-0"
                  >
                    Ver diploma →
                  </a>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="border border-lino/40 bg-blanco px-6 py-12 flex flex-col items-center justify-center text-center">
            <p className="font-sans text-sm text-cuero/60 max-w-[36ch] leading-relaxed">
              Los certificados se generan al completar un curso.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
