import { requireAdmin } from '@/lib/auth/admin'
import { createServiceClient } from '@/lib/supabase/service'
import { setCoursePrice, removeCoursePrice, setCourseStatus } from '@/app/actions/products'

export default async function AdminProductosPage() {
  await requireAdmin()

  const supabase = createServiceClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, slug, status, price_cents, stripe_price_id')
    .order('order_index')

  return (
    <div>
      <div className="mb-10">
        <span className="block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-3">
          Admin
        </span>
        <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em]">
          Productos y precios
        </h1>
        <p className="font-sans text-sm text-cuero mt-2">
          Asigna precio a un curso para activar el flujo de compra con Stripe.
          Dejar sin precio = acceso gratuito solo por admin.
        </p>
      </div>

      {(courses ?? []).length === 0 ? (
        <p className="font-sans text-sm text-cuero/60">No hay cursos publicados.</p>
      ) : (
        <div className="space-y-3">
          {(courses ?? []).map((course) => (
            <div
              key={course.id}
              className="bg-blanco border border-lino/50 px-6 py-5"
            >
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-sans text-sm font-medium text-tinta">{course.title}</span>
                    <span className={`font-mono text-[9px] border px-1.5 py-0.5 uppercase tracking-[0.08em] ${
                      course.status === 'published'
                        ? 'text-acento border-acento/40'
                        : course.status === 'coming_soon'
                        ? 'text-cuero border-lino/60'
                        : 'text-cuero/40 border-lino/40'
                    }`}>
                      {course.status === 'published' ? 'Disponible' : course.status === 'coming_soon' ? 'Próximamente' : 'Borrador'}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-cuero">
                    {course.price_cents
                      ? <>
                          <span className="text-acento font-medium">
                            {(course.price_cents / 100).toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR',
                              minimumFractionDigits: 0,
                            })}
                          </span>
                          {' · '}
                          <span className="text-cuero/60 text-[9px] font-mono">{course.stripe_price_id}</span>
                        </>
                      : <span className="text-cuero/40">Sin precio — acceso solo por admin</span>
                    }
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap shrink-0">
                  {/* Status toggle */}
                  {course.status !== 'draft' && (
                    <form
                      action={setCourseStatus.bind(
                        null,
                        course.id,
                        course.status === 'published' ? 'coming_soon' : 'published',
                      )}
                    >
                      <button
                        type="submit"
                        className="font-mono text-[10px] uppercase tracking-[0.08em] px-4 min-h-[36px] border border-lino/60 text-cuero hover:border-tinta hover:text-tinta transition-colors duration-200 shrink-0"
                      >
                        {course.status === 'published' ? '→ Próximamente' : '→ Disponible'}
                      </button>
                    </form>
                  )}

                  {/* Set / update price */}
                  <form
                    action={async (fd: FormData) => {
                      'use server'
                      const euros = parseFloat(fd.get('price') as string)
                      if (!isNaN(euros)) await setCoursePrice(course.id, euros)
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center border border-lino/60 bg-papel">
                      <span className="font-mono text-[11px] text-cuero px-3 border-r border-lino/60">€</span>
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        min="0.50"
                        placeholder="0.00"
                        defaultValue={course.price_cents ? (course.price_cents / 100).toFixed(2) : ''}
                        className="font-mono text-[11px] text-tinta bg-transparent px-3 py-2 w-24 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="font-mono text-[10px] uppercase tracking-[0.08em] px-4 min-h-[36px] bg-tinta text-papel hover:bg-acento hover:text-tinta transition-colors duration-200 shrink-0"
                    >
                      {course.price_cents ? 'Actualizar' : 'Activar precio'}
                    </button>
                  </form>

                  {/* Remove price */}
                  {course.price_cents && (
                    <form action={removeCoursePrice.bind(null, course.id)}>
                      <button
                        type="submit"
                        className="font-mono text-[10px] uppercase tracking-[0.08em] px-4 min-h-[36px] border border-lino/60 text-cuero hover:border-red-400 hover:text-red-500 transition-colors duration-200 shrink-0"
                      >
                        Quitar precio
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 border border-lino/40 bg-blanco px-6 py-5">
        <p className="font-mono text-[10px] text-cuero uppercase tracking-[0.1em] mb-2">Webhook Stripe</p>
        <p className="font-sans text-[12px] text-cuero leading-relaxed">
          URL del webhook:{' '}
          <code className="font-mono text-[11px] bg-papel px-2 py-0.5 border border-lino/40">
            {process.env.NEXT_PUBLIC_URL ?? 'https://tu-dominio.com'}/api/webhooks/stripe
          </code>
        </p>
        <p className="font-sans text-[11px] text-cuero/60 mt-1">
          Evento a escuchar: <code className="font-mono">checkout.session.completed</code>
        </p>
      </div>
    </div>
  )
}
