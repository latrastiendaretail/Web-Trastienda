import { createServerClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'

export default async function CampusDashboard() {
  const { userId } = await auth()
  const supabase = await createServerClient()

  const [{ count: enrolledCount }, { count: completedCount }, { data: recentCourses }] =
    await Promise.all([
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
        .from('courses')
        .select('id, title, status, duration_minutes')
        .eq('status', 'published')
        .order('order_index')
        .limit(3),
    ])

  const stats = [
    { value: String(enrolledCount ?? 0), label: 'Cursos inscritos' },
    { value: String(completedCount ?? 0), label: 'Lecciones completadas' },
    { value: '0', label: 'Certificados' },
    { value: recentCourses && recentCourses.length > 0 ? '—' : '—', label: 'Próximo curso' },
  ]

  return (
    <div className="max-w-4xl">
      <div className="mb-12">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-3">
          Bienvenido al Campus
        </h1>
        <p className="font-sans text-base text-cuero leading-relaxed max-w-[52ch]">
          Aquí encontrarás toda tu formación en sector Retail.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-blanco border border-lino/50 p-5">
            <div className="font-display text-3xl font-medium text-tinta leading-none mb-1">
              {stat.value}
            </div>
            <div className="font-mono text-[10px] text-cuero uppercase tracking-[0.1em]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-2xl font-medium text-tinta tracking-[-0.01em]">
            Catálogo de cursos
          </h2>
          <a
            href="/campus/cursos"
            className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer"
          >
            Ver todos →
          </a>
        </div>

        {recentCourses && recentCourses.length > 0 ? (
          <div className="space-y-3">
            {recentCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between bg-blanco border border-lino/50 px-6 py-4"
              >
                <span className="font-sans text-sm font-medium text-tinta">{course.title}</span>
                <span className="font-mono text-[9px] text-acento uppercase tracking-[0.1em] border border-acento/40 px-2 py-1 shrink-0">
                  Disponible
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-lino/50 bg-blanco px-6 py-10 text-center">
            <p className="font-sans text-sm text-cuero/60 max-w-[40ch] mx-auto leading-relaxed">
              Los cursos estarán disponibles próximamente. Te notificaremos cuando estén listos.
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
