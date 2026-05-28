import { createServerClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'

export default async function ProgresoPage() {
  const { userId } = await auth()
  const supabase = await createServerClient()

  const [
    { count: enrolledCount },
    { count: completedLessons },
    { data: enrollments },
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
      .select('course_id, enrolled_at, courses(title, duration_minutes, status)')
      .eq('user_id', userId ?? 'NONE')
      .order('enrolled_at', { ascending: false }),
  ])

  const stats = [
    { value: String(enrolledCount ?? 0), label: 'Cursos inscritos', sub: 'activos' },
    { value: String(completedLessons ?? 0), label: 'Lecciones completadas', sub: 'en total' },
    { value: '0%', label: 'Progreso medio', sub: 'en todos los cursos' },
    { value: '0', label: 'Certificados', sub: 'obtenidos' },
  ]

  return (
    <div className="max-w-4xl">
      <div className="mb-12">
        <span className="block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-3">
          Seguimiento
        </span>
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-3">
          Mi progreso
        </h1>
        <p className="font-sans text-base text-cuero leading-relaxed max-w-[52ch]">
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
              const course = e.courses as { title: string; duration_minutes: number; status: string } | null
              return (
                <div
                  key={e.course_id}
                  className="flex items-center justify-between bg-blanco border border-lino/50 px-6 py-4"
                >
                  <div>
                    <span className="block font-sans text-sm font-medium text-tinta">
                      {course?.title ?? 'Curso'}
                    </span>
                    <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.08em]">
                      Inscrito {new Date(e.enrolled_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.1em] border border-lino/60 px-2 py-1 shrink-0">
                    En progreso
                  </span>
                </div>
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
        <div className="border border-lino/40 bg-blanco px-6 py-12 flex flex-col items-center justify-center text-center">
          <p className="font-sans text-sm text-cuero/60 max-w-[36ch] leading-relaxed">
            Los certificados se generan al completar un curso.
          </p>
        </div>
      </div>
    </div>
  )
}
