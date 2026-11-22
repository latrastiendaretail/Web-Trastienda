import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import CourseCard from '@/components/campus/CourseCard'

interface Props {
  searchParams: Promise<{ categoria?: string }>
}

export default async function CursosPage({ searchParams }: Props) {
  const { categoria } = await searchParams
  const { userId } = await auth()
  const supabase = await createServerClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, order_index')
    .order('order_index')

  const { data: courses } = await supabase
    .from('courses')
    .select('id, category_id, title, slug, tagline, description, duration_minutes, status, order_index, price_cents')
    .in('status', ['published', 'coming_soon'])
    .order('order_index')

  const courseIds = (courses ?? []).map((c) => c.id)

  // Module counts per course + user enrollments — service client, RLS bypass, read-only aggregation.
  const service = createServiceClient()
  const [{ data: modules }, { data: enrollments }] = await Promise.all([
    courseIds.length > 0
      ? service.from('modules').select('course_id, is_bonus').in('course_id', courseIds)
      : Promise.resolve({ data: [] }),
    userId && courseIds.length > 0
      ? service.from('enrollments').select('course_id').eq('user_id', userId).in('course_id', courseIds)
      : Promise.resolve({ data: [] }),
  ])

  const moduleCountByCourse = new Map<string, number>()
  for (const m of modules ?? []) {
    if (m.is_bonus) continue
    moduleCountByCourse.set(m.course_id, (moduleCountByCourse.get(m.course_id) ?? 0) + 1)
  }
  const enrolledSet = new Set((enrollments ?? []).map((e) => e.course_id))

  const categoryById = new Map((categories ?? []).map((c) => [c.id, c]))
  // Categorías con al menos un curso — evita chips de filtro que llevarían a una lista vacía.
  const activeCategories = (categories ?? []).filter((cat) =>
    (courses ?? []).some((c) => c.category_id === cat.id),
  )

  const statusOrder: Record<string, number> = { published: 0, coming_soon: 1, draft: 2 }
  const allCourses = (courses ?? [])
    .filter((c) => !categoria || (c.category_id ? categoryById.get(c.category_id) : undefined)?.slug === categoria)
    // Inscritos primero, luego disponibles, luego próximamente — dentro de cada
    // grupo se respeta el orden editorial (order_index).
    .sort((a, b) => {
      const enrolledDiff = Number(enrolledSet.has(b.id)) - Number(enrolledSet.has(a.id))
      if (enrolledDiff !== 0) return enrolledDiff
      const statusDiff = (statusOrder[a.status] ?? 2) - (statusOrder[b.status] ?? 2)
      if (statusDiff !== 0) return statusDiff
      return a.order_index - b.order_index
    })

  const totalCourses = (courses ?? []).length
  const enrolledCount = enrolledSet.size

  return (
    <div>
      <header className="mb-10">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-3">
          Cursos
        </h1>
        <p className="font-sans text-[17px] text-tinta/70 leading-relaxed max-w-[56ch]">
          Formación para trabajar en retail.
          {enrolledCount > 0 && ` Tienes ${enrolledCount} ${enrolledCount === 1 ? 'curso' : 'cursos'} en marcha.`}
        </p>
      </header>

      {/* Filtro por categoría — chips, sin JS: querystring server-rendered */}
      {activeCategories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <a
            href="/campus/cursos"
            className={`font-sans text-[14px] px-4 min-h-[40px] inline-flex items-center border transition-colors duration-200 cursor-pointer ${
              !categoria
                ? 'bg-tinta text-papel border-tinta'
                : 'text-tinta/70 border-lino hover:border-tinta/40 hover:text-tinta'
            }`}
          >
            Todos ({totalCourses})
          </a>
          {activeCategories.map((cat) => {
            const count = (courses ?? []).filter((c) => c.category_id === cat.id).length
            const isActive = categoria === cat.slug
            return (
              <a
                key={cat.id}
                href={`/campus/cursos?categoria=${cat.slug}`}
                className={`font-sans text-[14px] px-4 min-h-[40px] inline-flex items-center border transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-tinta text-papel border-tinta'
                    : 'text-tinta/70 border-lino hover:border-tinta/40 hover:text-tinta'
                }`}
              >
                {cat.name} ({count})
              </a>
            )
          })}
        </div>
      )}

      {allCourses.length === 0 ? (
        <p className="font-sans text-[16px] text-tinta/70">No hay cursos en esta categoría todavía.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses.map((course) => {
            const cat = course.category_id ? categoryById.get(course.category_id) : undefined
            return (
              <CourseCard
                key={course.id}
                slug={course.slug}
                title={course.title}
                tagline={course.tagline}
                category={cat?.name}
                status={course.status}
                priceCents={course.price_cents}
                moduleCount={moduleCountByCourse.get(course.id)}
                durationMinutes={course.duration_minutes}
                enrolled={enrolledSet.has(course.id)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
