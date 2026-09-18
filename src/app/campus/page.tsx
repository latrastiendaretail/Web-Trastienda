import { createServiceClient } from '@/lib/supabase/service'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import CourseCard from '@/components/campus/CourseCard'
import { ProgressDial, Watermark, AccentPulse } from '@/components/campus/academia/icons'

export default async function CampusDashboard() {
  const { userId } = await auth()
  if (!userId) redirect('/campus/login')
  const supabase = createServiceClient()
  const user = await currentUser()
  const firstName = user?.firstName ?? null

  const [{ count: enrolledCount }, { data: myEnrollments }, { data: catalogCourses }] = await Promise.all([
    supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('enrollments')
      .select('course_id, enrolled_at, courses(id, title, tagline, status, duration_minutes, slug, price_cents)')
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false }),
    supabase
      .from('courses')
      .select('id, title, tagline, status, duration_minutes, slug, price_cents')
      .eq('status', 'published')
      .order('order_index'),
  ])

  const enrollments = myEnrollments ?? []
  const enrolledCourseIds = enrollments.map((e) => e.course_id)
  const enrolledSet = new Set(enrolledCourseIds)

  // Progreso por curso inscrito — mismo criterio que /campus/progreso, aquí solo
  // para decidir qué mostrar en "Continúa donde lo dejaste" (dato real, no relleno).
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
    const lessonsByCourse = new Map<string, string[]>()
    const lessonToCourse = new Map<string, string>()
    for (const l of lessons ?? []) {
      lessonToCourse.set(l.id, l.course_id)
      lessonsByCourse.set(l.course_id, [...(lessonsByCourse.get(l.course_id) ?? []), l.id])
    }

    const [{ data: modProgress }, { data: lessonProgress }] = await Promise.all([
      [...moduleToCourse.keys()].length > 0
        ? supabase.from('module_progress').select('module_id').eq('user_id', userId).eq('completed', true).in('module_id', [...moduleToCourse.keys()])
        : Promise.resolve({ data: [] }),
      [...lessonToCourse.keys()].length > 0
        ? supabase.from('lesson_progress').select('lesson_id').eq('user_id', userId).eq('completed', true).in('lesson_id', [...lessonToCourse.keys()])
        : Promise.resolve({ data: [] }),
    ])

    const completedModulesByCourse = new Map<string, number>()
    for (const p of modProgress ?? []) {
      const cId = moduleToCourse.get(p.module_id)
      if (cId) completedModulesByCourse.set(cId, (completedModulesByCourse.get(cId) ?? 0) + 1)
    }
    const completedLessonsByCourse = new Map<string, number>()
    for (const p of lessonProgress ?? []) {
      const cId = lessonToCourse.get(p.lesson_id)
      if (cId) completedLessonsByCourse.set(cId, (completedLessonsByCourse.get(cId) ?? 0) + 1)
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

  const totalUnits = [...progressByCourse.values()].reduce((s, p) => s + p.total, 0)
  const totalCompleted = [...progressByCourse.values()].reduce((s, p) => s + p.completed, 0)
  const avgProgress = totalUnits > 0 ? Math.round((totalCompleted / totalUnits) * 100) : 0

  // Cursos en curso: inscritos y no completados al 100% (o sin progreso medible todavía).
  const continueCourses = enrollments
    .filter((e) => {
      const p = progressByCourse.get(e.course_id)
      return !p || p.completed < p.total
    })
    .slice(0, 2)

  // Catálogo destacado: cursos publicados en los que aún no está inscrito.
  const suggested = (catalogCourses ?? []).filter((c) => !enrolledSet.has(c.id)).slice(0, 3)

  return (
    <div className="max-w-6xl">
      {/* Hero — tono distinto (tinta) para separar Inicio del resto del campus */}
      <div className="relative -mx-6 md:-mx-10 -mt-10 px-6 md:px-10 pt-10 pb-12 mb-12 bg-tinta overflow-hidden">
        <Watermark text="LT" tone="light" className="text-[15rem] -right-6 -top-16 md:text-[19rem]" />
        <div className="relative flex items-center gap-2.5 mb-4">
          <AccentPulse />
          <span className="font-mono text-[9px] text-acento-soft uppercase tracking-[0.16em]">
            Campus · La Trastienda
          </span>
        </div>
        <h1 className="relative font-display text-[clamp(2.25rem,5vw,3.5rem)] font-medium text-papel leading-[1.05] tracking-[-0.02em] mb-4 max-w-[20ch]">
          {firstName ? `Hola, ${firstName}.` : 'Bienvenido al Campus.'}
        </h1>
        <div className="relative flex flex-wrap items-center gap-x-8 gap-y-3">
          <span className="font-sans text-sm text-papel/80">
            <strong className="font-display text-xl font-medium text-papel mr-1.5">{enrolledCount ?? 0}</strong>
            {(enrolledCount ?? 0) === 1 ? 'curso inscrito' : 'cursos inscritos'}
          </span>
          {totalUnits > 0 && (
            <span className="font-sans text-sm text-papel/80">
              <strong className="font-display text-xl font-medium text-acento-soft mr-1.5">{avgProgress}%</strong>
              progreso medio
            </span>
          )}
          <a
            href="/campus/progreso"
            className="font-mono text-[10px] text-papel/50 hover:text-papel uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer"
          >
            Ver seguimiento completo →
          </a>
        </div>
      </div>

      {/* Continúa donde lo dejaste */}
      {continueCourses.length > 0 && (
        <div className="mb-14">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-2xl font-medium text-tinta tracking-[-0.01em]">
              Continúa donde lo dejaste
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {continueCourses.map((e) => {
              const course = e.courses as { id: string; title: string; slug: string } | null
              const progress = progressByCourse.get(e.course_id)
              if (!course) return null
              return (
                <a
                  key={e.course_id}
                  href={`/campus/cursos/${course.slug}`}
                  className="flex items-center justify-between gap-5 bg-blanco border border-lino/50 px-6 py-5 hover:border-tinta/30 transition-colors duration-200 cursor-pointer group"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.12em] block mb-1.5">
                      {progress && progress.total > 0 ? `${progress.completed} de ${progress.total}` : 'Sin empezar'}
                    </span>
                    <span className="font-sans text-[15px] font-medium text-tinta leading-snug truncate block">
                      {course.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {progress && progress.total > 0 && (
                      <ProgressDial total={progress.total} completed={progress.completed} markClassName="w-2.5 h-2.5" />
                    )}
                    <span className="font-mono text-[13px] text-cuero/40 group-hover:text-tinta transition-colors">
                      Continuar →
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* Catálogo */}
      <div>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl font-medium text-tinta tracking-[-0.01em]">
            {suggested.length > 0 ? 'Sigue formándote' : 'Catálogo de cursos'}
          </h2>
          <a
            href="/campus/cursos"
            className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer"
          >
            Ver todos →
          </a>
        </div>

        {suggested.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {suggested.map((course) => (
              <CourseCard
                key={course.id}
                slug={course.slug}
                title={course.title}
                tagline={course.tagline}
                status={course.status}
                priceCents={course.price_cents}
                durationMinutes={course.duration_minutes}
                enrolled={false}
              />
            ))}
          </div>
        ) : (
          <div className="border border-lino/50 bg-blanco px-6 py-10 text-center">
            <p className="font-sans text-sm text-cuero/60 max-w-[40ch] mx-auto leading-relaxed">
              {enrolledCount && enrolledCount > 0
                ? 'Estás al día con el catálogo disponible. Nuevos cursos, próximamente.'
                : 'Los cursos estarán disponibles próximamente. Te notificaremos cuando estén listos.'}
            </p>
            <a
              href="/campus/cursos"
              className="mt-5 inline-flex items-center font-mono text-[11px] font-medium text-tinta uppercase tracking-[0.08em] border border-tinta px-5 min-h-[40px] hover:bg-tinta hover:text-papel transition-colors duration-200 cursor-pointer"
            >
              Ver catálogo completo
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
