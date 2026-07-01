import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'

interface Props {
  searchParams: Promise<{ session_id?: string; course_slug?: string; course_title?: string; email?: string }>
}

export default async function CompraExitoPage({ searchParams }: Props) {
  const { session_id, course_slug, course_title, email: freeEmail } = await searchParams

  let courseName = ''
  let courseSlug = ''
  let customerEmail = ''

  if (course_slug) {
    // Free enrollment flow
    courseName = course_title ? decodeURIComponent(course_title) : ''
    courseSlug = course_slug
    customerEmail = freeEmail ? decodeURIComponent(freeEmail) : ''
  } else if (session_id) {
    // Paid Stripe flow
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      if (session.payment_status !== 'paid') redirect('/campus')
      customerEmail = session.customer_details?.email ?? ''
      const courseId = session.metadata?.course_id
      const userId = session.metadata?.user_id
      if (courseId) {
        const supabase = createServiceClient()
        const [{ data: course }] = await Promise.all([
          supabase.from('courses').select('title, slug').eq('id', courseId).single(),
          userId
            ? supabase
                .from('enrollments')
                .upsert({ user_id: userId, course_id: courseId }, { onConflict: 'user_id,course_id', ignoreDuplicates: true })
            : Promise.resolve(),
        ])
        courseName = course?.title ?? ''
        courseSlug = course?.slug ?? ''
      }
    } catch {
      redirect('/campus')
    }
  } else {
    redirect('/campus')
  }

  return (
    <div className="min-h-screen bg-papel flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full">
        <div className="border border-lino/50 bg-blanco px-8 py-10">
          <div className="font-mono text-[9px] text-acento uppercase tracking-[0.16em] mb-4">
            Compra completada
          </div>

          <h1 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-4">
            {courseName ? `Ya tienes acceso a "${courseName}"` : 'Pago procesado correctamente'}
          </h1>

          <p className="font-sans text-sm text-cuero leading-relaxed mb-8">
            {customerEmail
              ? `Hemos enviado la confirmación a ${customerEmail}.`
              : 'Tu pago ha sido procesado.'}{' '}
            Tu acceso al curso está activo ahora mismo.
          </p>

          <div className="flex flex-col gap-3">
            {courseSlug && (
              <a
                href={`/campus/cursos/${courseSlug}`}
                className="font-mono text-[11px] font-medium text-papel bg-tinta px-5 min-h-[44px] flex items-center justify-center uppercase tracking-[0.08em] hover:bg-acento hover:text-tinta transition-colors duration-200"
              >
                Ir al curso →
              </a>
            )}
            <a
              href="/campus/cursos"
              className="font-mono text-[11px] text-cuero hover:text-tinta uppercase tracking-[0.08em] text-center transition-colors duration-200"
            >
              Ver todos los cursos
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
