import { requireAdmin } from '@/lib/auth/admin'
import { createServiceClient } from '@/lib/supabase/service'

export default async function AdminSlidesPage() {
  await requireAdmin()

  const supabase = createServiceClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, slug, modules(id, title, order_index, is_bonus, slides)')
    .order('order_index')

  return (
    <div>
      <div className="mb-10">
        <span className="block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-3">
          Admin
        </span>
        <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em]">
          Diapositivas por módulo
        </h1>
        <p className="font-sans text-sm text-cuero mt-2">
          Sube imágenes de diapositivas e intercala vídeos de YouTube en cada módulo.
        </p>
      </div>

      <div className="space-y-8">
        {(courses ?? []).map((course) => {
          const modules = [...(course.modules ?? [])].sort((a, b) => a.order_index - b.order_index)
          if (modules.length === 0) return null

          return (
            <div key={course.id}>
              <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.12em] mb-3 block">
                {course.title}
              </span>
              <div className="space-y-2">
                {modules.map((mod) => {
                  const count = (mod.slides ?? []).length
                  return (
                    <a
                      key={mod.id}
                      href={`/admin/slides/${mod.id}`}
                      className="flex items-center justify-between bg-blanco border border-lino/50 px-6 py-4 hover:border-acento/50 transition-colors duration-200"
                    >
                      <span className="font-sans text-[13px] text-tinta">
                        {mod.is_bonus ? 'Bonus Track' : `Bloque ${mod.order_index}`} — {mod.title}
                      </span>
                      <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.1em]">
                        {count > 0 ? `${count} diapositivas` : 'Sin diapositivas'} →
                      </span>
                    </a>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
