import { createServerClient } from '@/lib/supabase/server'

export default async function CursosPage() {
  const supabase = await createServerClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, order_index')
    .order('order_index')

  const { data: courses } = await supabase
    .from('courses')
    .select('id, category_id, title, slug, tagline, description, duration_minutes, status, order_index')
    .in('status', ['published', 'coming_soon'])
    .order('order_index')

  const coursesByCategory = (categories ?? []).map((cat) => ({
    ...cat,
    courses: (courses ?? []).filter((c) => c.category_id === cat.id),
  }))

  return (
    <div className="max-w-4xl">
      <div className="mb-12">
        <span className="block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-3">
          Formación
        </span>
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-3">
          Cursos
        </h1>
        <p className="font-sans text-base text-cuero leading-relaxed max-w-[52ch]">
          Todo el catálogo formativo en sector Retail.
        </p>
      </div>

      {coursesByCategory.length === 0 ? (
        <p className="font-sans text-sm text-cuero/60">No hay categorías disponibles.</p>
      ) : (
        <div className="space-y-10">
          {coursesByCategory.map((cat) => (
            <div key={cat.id}>
              <div className="font-mono text-[10px] text-cuero uppercase tracking-[0.14em] mb-4 pb-3 border-b border-lino/40">
                {cat.name}
              </div>

              {cat.courses.length === 0 ? (
                <div className="flex items-center justify-between bg-blanco border border-lino/50 px-6 py-5 opacity-40 select-none">
                  <span className="font-sans text-sm text-cuero">Cursos en preparación</span>
                  <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.1em] border border-lino/60 px-2 py-1">
                    Próximamente
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {cat.courses.map((course) => {
                    const isPublished = course.status === 'published'
                    const Tag = isPublished ? 'a' : 'div'
                    return (
                      <Tag
                        key={course.id}
                        {...(isPublished ? { href: `/campus/cursos/${course.slug}` } : {})}
                        className={`flex items-center justify-between bg-blanco border border-lino/50 px-6 py-5 ${
                          !isPublished
                            ? 'opacity-50 select-none'
                            : 'hover:border-tinta/30 transition-colors duration-200 cursor-pointer'
                        }`}
                      >
                        <div>
                          <span className="block font-sans text-sm font-medium text-tinta">
                            {course.title}
                          </span>
                          {course.tagline ? (
                            <span className="block font-sans text-[11px] text-cuero mt-0.5 leading-relaxed max-w-[52ch]">
                              {course.tagline}
                            </span>
                          ) : course.duration_minutes > 0 ? (
                            <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.08em]">
                              {course.duration_minutes}min
                            </span>
                          ) : null}
                        </div>
                        <span className={`font-mono text-[9px] uppercase tracking-[0.1em] border px-2 py-1 shrink-0 ${
                          isPublished ? 'text-acento border-acento/40' : 'text-cuero border-lino/60'
                        }`}>
                          {isPublished ? 'Disponible →' : 'Próximamente'}
                        </span>
                      </Tag>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
