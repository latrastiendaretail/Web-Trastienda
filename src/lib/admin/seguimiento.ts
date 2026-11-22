import { clerkClient } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/service'

export interface AlumnoRow {
  userId: string
  name: string
  email: string
  enrolledAt: string
  completed: number
  total: number
  /** Fecha del último bloque/lección completado */
  lastActivity: string | null
  finished: boolean
  certificate: { id: string; code: string; issuedAt: string } | null
}

export interface CursoSeguimiento {
  courseId: string
  title: string
  slug: string
  total: number
  alumnos: AlumnoRow[]
}

/**
 * Seguimiento de alumnos por curso. Mismo criterio de progreso que el campus:
 * si el curso tiene módulos con vídeo/diapositivas cuenta módulos; si no, lecciones.
 * Solo server-side; el llamador debe haber comprobado requireAdmin().
 */
export async function getSeguimiento(): Promise<CursoSeguimiento[]> {
  const supabase = createServiceClient()

  const [{ data: courses }, { data: enrollments }, { data: modules }, { data: lessons }, { data: certs }] =
    await Promise.all([
      supabase.from('courses').select('id, title, slug, order_index').order('order_index'),
      supabase.from('enrollments').select('user_id, course_id, enrolled_at'),
      supabase.from('modules').select('id, course_id, video_url, slides'),
      supabase.from('lessons').select('id, course_id'),
      supabase.from('certificates').select('id, user_id, course_id, code, issued_at'),
    ])

  const userIds = [...new Set((enrollments ?? []).map((e) => e.user_id))]

  const [{ data: modProgress }, { data: lessonProgress }] = await Promise.all([
    supabase.from('module_progress').select('user_id, module_id, completed_at').eq('completed', true),
    supabase.from('lesson_progress').select('user_id, lesson_id, completed_at').eq('completed', true),
  ])

  // Unidades que cuentan por curso
  const unitsByCourse = new Map<string, { kind: 'module' | 'lesson'; ids: Set<string> }>()
  for (const c of courses ?? []) {
    const mods = (modules ?? [])
      .filter((m) => m.course_id === c.id && (m.video_url || (m.slides && m.slides.length > 0)))
      .map((m) => m.id)
    if (mods.length > 0) {
      unitsByCourse.set(c.id, { kind: 'module', ids: new Set(mods) })
    } else {
      const ls = (lessons ?? []).filter((l) => l.course_id === c.id).map((l) => l.id)
      unitsByCourse.set(c.id, { kind: 'lesson', ids: new Set(ls) })
    }
  }

  // Datos de Clerk (nombre y email)
  const people = new Map<string, { name: string; email: string }>()
  if (userIds.length > 0) {
    const clerk = await clerkClient()
    for (let i = 0; i < userIds.length; i += 100) {
      const { data } = await clerk.users.getUserList({ userId: userIds.slice(i, i + 100), limit: 100 })
      for (const u of data) {
        people.set(u.id, {
          name: [u.firstName, u.lastName].filter(Boolean).join(' '),
          email: u.emailAddresses[0]?.emailAddress ?? '',
        })
      }
    }
  }

  return (courses ?? [])
    .map((c) => {
      const units = unitsByCourse.get(c.id)!
      const rows: AlumnoRow[] = (enrollments ?? [])
        .filter((e) => e.course_id === c.id)
        .map((e) => {
          const done = (units.kind === 'module' ? modProgress : lessonProgress) ?? []
          const mine = done.filter((p) => {
            const unitId = units.kind === 'module' ? (p as { module_id: string }).module_id : (p as { lesson_id: string }).lesson_id
            return p.user_id === e.user_id && units.ids.has(unitId)
          })
          const dates = mine.map((p) => p.completed_at).filter(Boolean) as string[]
          const lastActivity = dates.length ? dates.sort().at(-1)! : null
          const cert = (certs ?? []).find((x) => x.user_id === e.user_id && x.course_id === c.id)
          const person = people.get(e.user_id)
          return {
            userId: e.user_id,
            name: person?.name || '',
            email: person?.email || '',
            enrolledAt: e.enrolled_at,
            completed: mine.length,
            total: units.ids.size,
            lastActivity,
            finished: units.ids.size > 0 && mine.length >= units.ids.size,
            certificate: cert ? { id: cert.id, code: cert.code, issuedAt: cert.issued_at } : null,
          }
        })
        // Terminados primero, luego por avance
        .sort((a, b) => Number(b.finished) - Number(a.finished) || b.completed - a.completed)
      return { courseId: c.id, title: c.title, slug: c.slug, total: units.ids.size, alumnos: rows }
    })
    .filter((c) => c.alumnos.length > 0)
}
