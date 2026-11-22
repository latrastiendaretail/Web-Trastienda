import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'
import { auth } from '@clerk/nextjs/server'
import { ProgressDial } from '@/components/campus/academia/icons'

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
    { value: String(enrolledCount ?? 0), label: 'Cursos' },
    { value: String(completedLessons ?? 0), label: 'Lecciones completadas' },
    { value: `${avgProgress}%`, label: 'Progreso medio' },
    { value: String(certificates?.length ?? 0), label: 'Certificados' },
  ]

  return (
    <div className="max-w-[760px] mx-auto">
      <header className="mb-10">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-3">
          Mi progreso
        </h1>
        <p className="font-sans text-[17px] text-tinta/70 leading-relaxed">Tus cursos, tu avance y tus certificados.</p>
      </header>

      <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6 border-y border-lino py-7 mb-14">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dd className="font-display text-[34px] font-medium text-tinta leading-none mb-1.5">{stat.value}</dd>
            <dt className="font-sans text-[14px] text-tinta/65">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <section className="mb-14" aria-labelledby="historial">
        <h2 id="historial" className="font-display text-2xl font-medium text-tinta mb-4">
          Mis cursos
        </h2>

        {enrollments && enrollments.length > 0 ? (
          <div className="border-t border-lino">
            {enrollments.map((e) => {
              const course = e.courses as { title: string; duration_minutes: number; status: string; slug: string } | null
              const progress = progressByCourse.get(e.course_id)
              const isComplete = progress && progress.total > 0 && progress.completed >= progress.total
              return (
                <a
                  key={e.course_id}
                  href={course?.slug ? `/campus/cursos/${course.slug}` : '/campus/cursos'}
                  className="flex items-center justify-between gap-5 border-b border-lino py-5 group cursor-pointer"
                >
                  <div className="min-w-0">
                    <span className="block font-sans text-[17px] font-medium text-tinta group-hover:text-acento-deep transition-colors duration-200">
                      {course?.title ?? 'Curso'}
                    </span>
                    <span className="font-sans text-[14px] text-tinta/60">
                      Inscrito el {new Date(e.enrolled_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {progress && progress.total > 0 ? (
                      <>
                        <ProgressDial total={progress.total} completed={progress.completed} className="hidden sm:block" />
                        <span className="font-sans text-[14px] text-tinta/70 w-24 text-right">
                          {isComplete ? 'Completado' : `${progress.completed} de ${progress.total}`}
                        </span>
                      </>
                    ) : (
                      <span className="font-sans text-[14px] text-tinta/60">Sin empezar</span>
                    )}
                  </div>
                </a>
              )
            })}
          </div>
        ) : (
          <p className="font-sans text-[16px] text-tinta/70">
            Aún no estás inscrito en ningún curso.{' '}
            <a href="/campus/cursos" className="text-tinta underline underline-offset-4">Ver cursos</a>
          </p>
        )}
      </section>

      <section aria-labelledby="certificados">
        <h2 id="certificados" className="font-display text-2xl font-medium text-tinta mb-4">
          Certificados
        </h2>

        {certificates && certificates.length > 0 ? (
          <div className="border-t border-lino">
            {certificates.map((cert) => {
              const course = cert.courses as { title: string; slug: string } | null
              return (
                <div key={cert.id} className="flex items-center justify-between gap-5 border-b border-lino py-5">
                  <div className="min-w-0">
                    <span className="block font-sans text-[17px] font-medium text-tinta">{course?.title ?? 'Curso'}</span>
                    <span className="font-sans text-[14px] text-tinta/60">
                      {cert.code} · {new Date(cert.issued_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <a
                    href={`/campus/certificado/${cert.id}`}
                    className="font-sans text-[15px] font-medium text-tinta underline underline-offset-4 hover:text-acento-deep shrink-0"
                  >
                    Ver certificado
                  </a>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="font-sans text-[16px] text-tinta/70">Recibirás tu certificado al completar un curso.</p>
        )}
      </section>
    </div>
  )
}
