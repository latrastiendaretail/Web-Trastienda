import { notFound } from 'next/navigation'
import { clerkClient } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/service'
import { assignCourse, revokeCourse } from '@/app/actions/admin'

interface Props {
  params: Promise<{ userId: string }>
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { userId } = await params

  const clerk = await clerkClient()
  let user: Awaited<ReturnType<typeof clerk.users.getUser>>
  try {
    user = await clerk.users.getUser(userId)
  } catch {
    notFound()
  }

  const email = user.emailAddresses[0]?.emailAddress ?? '—'
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || null
  const displayName = name ?? email

  const supabase = createServiceClient()

  const [
    { data: courses },
    { data: enrollments },
    { data: allModules },
    { data: moduleProgress },
  ] = await Promise.all([
    supabase
      .from('courses')
      .select('id, title, slug, status')
      .in('status', ['published', 'coming_soon'])
      .order('order_index'),
    supabase.from('enrollments').select('course_id, enrolled_at').eq('user_id', userId),
    supabase.from('modules').select('id, course_id, video_url'),
    supabase
      .from('module_progress')
      .select('module_id, completed')
      .eq('user_id', userId)
      .eq('completed', true),
  ])

  const enrolledCourseIds = new Set((enrollments ?? []).map((e) => e.course_id))
  const completedModuleIds = new Set((moduleProgress ?? []).map((p) => p.module_id))

  const modulesByCourse = (allModules ?? []).reduce<
    Record<string, { id: string; hasVideo: boolean }[]>
  >((acc, m) => {
    if (!acc[m.course_id]) acc[m.course_id] = []
    acc[m.course_id].push({ id: m.id, hasVideo: m.video_url !== null })
    return acc
  }, {})

  return (
    <div>
      <a
        href="/admin/usuarios"
        className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200"
      >
        ← Usuarios
      </a>

      <div className="mt-6 mb-10">
        <span className="block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-3">
          Alumno
        </span>
        <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-1">
          {displayName}
        </h1>
        {name && <p className="font-mono text-[11px] text-cuero">{email}</p>}
        <p className="font-mono text-[10px] text-cuero/50 mt-1">ID Clerk: {userId}</p>
      </div>

      <h2 className="font-display text-lg font-medium text-tinta tracking-[-0.01em] mb-4">
        Acceso a cursos
      </h2>

      {(courses ?? []).length === 0 ? (
        <p className="font-sans text-sm text-cuero/60">No hay cursos publicados.</p>
      ) : (
        <div className="space-y-3">
          {(courses ?? []).map((course) => {
            const enrolled = enrolledCourseIds.has(course.id)
            const courseModules = modulesByCourse[course.id] ?? []
            const videoModules = courseModules.filter((m) => m.hasVideo)
            const completedCount = videoModules.filter((m) => completedModuleIds.has(m.id)).length
            const totalCount = videoModules.length
            const isComingSoon = course.status === 'coming_soon'

            return (
              <div
                key={course.id}
                className="flex items-center justify-between bg-blanco border border-lino/50 px-6 py-5 gap-6"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-sans text-sm font-medium text-tinta">{course.title}</span>
                    {isComingSoon && (
                      <span className="font-mono text-[9px] text-cuero border border-lino/60 px-1.5 py-0.5 uppercase tracking-[0.08em] shrink-0">
                        Próximamente
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {enrolled ? (
                      <>
                        <span className="font-mono text-[9px] text-acento border border-acento/40 px-1.5 py-0.5 uppercase tracking-[0.08em]">
                          Con acceso
                        </span>
                        {totalCount > 0 && (
                          <span className="font-mono text-[10px] text-cuero">
                            {completedCount}/{totalCount} módulos completados
                            {' '}
                            ({Math.round((completedCount / totalCount) * 100)}%)
                          </span>
                        )}
                        {totalCount === 0 && (
                          <span className="font-mono text-[10px] text-cuero/50">Sin progreso registrado</span>
                        )}
                      </>
                    ) : (
                      <span className="font-mono text-[9px] text-cuero/40 border border-lino/40 px-1.5 py-0.5 uppercase tracking-[0.08em]">
                        Sin acceso
                      </span>
                    )}
                  </div>
                </div>

                <form
                  action={
                    enrolled
                      ? revokeCourse.bind(null, userId, course.id)
                      : assignCourse.bind(null, userId, course.id)
                  }
                >
                  <button
                    type="submit"
                    className={`font-mono text-[10px] uppercase tracking-[0.08em] px-5 min-h-[36px] shrink-0 transition-colors duration-200 ${
                      enrolled
                        ? 'border border-lino/60 text-cuero hover:border-red-400 hover:text-red-500'
                        : 'bg-tinta text-papel hover:bg-acento hover:text-tinta'
                    }`}
                  >
                    {enrolled ? 'Quitar acceso' : 'Dar acceso'}
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
