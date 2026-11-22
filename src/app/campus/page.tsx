import { createServiceClient } from '@/lib/supabase/service'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import CourseCard from '@/components/campus/CourseCard'
import { ProgressDial } from '@/components/campus/academia/icons'

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
    <div>
      <header className="mb-14">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-3">
          {firstName ? `Hola, ${firstName}` : 'Bienvenido al campus'}
        </h1>
        <p className="font-sans text-[17px] text-tinta/70 leading-relaxed">
          {(enrolledCount ?? 0) === 0
            ? 'Aún no estás inscrito en ningún curso.'
            : `Tienes ${enrolledCount} ${enrolledCount === 1 ? 'curso' : 'cursos'}${totalUnits > 0 ? ` y llevas un ${avgProgress}% completado` : ''}.`}
        </p>
      </header>

      {continueCourses.length > 0 && (
        <section className="mb-16" aria-labelledby="continua">
          <h2 id="continua" className="font-display text-2xl font-medium text-tinta mb-5">
            Continúa donde lo dejaste
          </h2>
          <div className="border-y border-lino divide-y divide-lino">
            {continueCourses.map((e) => {
              const course = e.courses as { id: string; title: string; slug: string } | null
              const progress = progressByCourse.get(e.course_id)
              if (!course) return null
              return (
                <a
                  key={e.course_id}
                  href={`/campus/cursos/${course.slug}`}
                  className="flex items-center justify-between gap-6 py-5 group cursor-pointer"
                >
                  <div className="min-w-0">
                    <span className="font-sans text-[18px] font-medium text-tinta group-hover:text-acento-deep transition-colors duration-200 block truncate">
                      {course.title}
                    </span>
                    <span className="font-sans text-[14px] text-tinta/60">
                      {progress && progress.total > 0
                        ? `${progress.completed} de ${progress.total} completados`
                        : 'Sin empezar'}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 shrink-0">
                    {progress && progress.total > 0 && (
                      <ProgressDial total={progress.total} completed={progress.completed} className="hidden sm:block" />
                    )}
                    <span className="font-sans text-[15px] font-medium text-tinta">Continuar</span>
                  </div>
                </a>
              )
            })}
          </div>
        </section>
      )}

      <section aria-labelledby="catalogo">
        <div className="flex items-baseline justify-between mb-6">
          <h2 id="catalogo" className="font-display text-2xl font-medium text-tinta">
            {suggested.length > 0 ? 'Más cursos' : 'Catálogo'}
          </h2>
          <a href="/campus/cursos" className="font-sans text-[15px] text-tinta/70 hover:text-tinta underline underline-offset-4 transition-colors duration-200">
            Ver todos
          </a>
        </div>

        {suggested.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <p className="font-sans text-[16px] text-tinta/70 leading-relaxed max-w-[52ch]">
            {enrolledCount && enrolledCount > 0
              ? 'Ya tienes todo el catálogo disponible. Avisaremos cuando haya cursos nuevos.'
              : 'Los cursos estarán disponibles pronto.'}
          </p>
        )}
      </section>
    </div>
  )
}
