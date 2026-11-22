import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import ActivatingAccess from '@/components/campus/ActivatingAccess'

// Contiene datos de compra en la URL: nunca indexar.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ session_id?: string; course_slug?: string }>
}

export default async function CompraExitoPage({ searchParams }: Props) {
  const { session_id, course_slug } = await searchParams
  const { userId } = await auth()
  const supabase = createServiceClient()

  let courseId = ''
  let courseName = ''
  let courseSlug = ''
  let customerEmail = ''
  // true si hay constancia de pago/alta, aunque la matrícula aún no esté creada
  let paid = false

  if (course_slug) {
    // Curso gratuito (o pago ya registrado): se confirma leyendo el estado real, no la URL.
    const { data: course } = await supabase
      .from('courses')
      .select('id, title, slug')
      .eq('slug', course_slug)
      .maybeSingle()
    if (!course) redirect('/campus')
    courseId = course.id
    courseName = course.title
    courseSlug = course.slug

    if (userId) {
      const { data: purchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', course.id)
        .eq('status', 'completed')
        .limit(1)
        .maybeSingle()
      paid = !!purchase
    }
  } else if (session_id) {
    // Pago Stripe. La concesión de acceso la hace SOLO el webhook (firmado, idempotente);
    // esta página únicamente muestra el estado.
    let session: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>> | null = null
    try {
      session = await stripe.checkout.sessions.retrieve(session_id)
    } catch {
      redirect('/campus')
    }
    if (!session || session.payment_status !== 'paid') redirect('/campus')

    // El comprador solo puede ver su propia sesión.
    if (userId && session.metadata?.user_id && session.metadata.user_id !== userId) {
      redirect('/campus')
    }

    paid = true
    customerEmail = session.customer_details?.email ?? ''
    courseId = session.metadata?.course_id ?? ''
    if (courseId) {
      const { data: course } = await supabase
        .from('courses')
        .select('title, slug')
        .eq('id', courseId)
        .maybeSingle()
      courseName = course?.title ?? ''
      courseSlug = course?.slug ?? ''
    }
  } else {
    redirect('/campus')
  }

  let enrolled = false
  if (userId && courseId) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle()
    enrolled = !!enrollment
  }

  // Sin matrícula ni constancia de pago: no hay nada que confirmar
  if (!enrolled && !paid && courseSlug) redirect(`/campus/cursos/${courseSlug}`)

  const activating = !!userId && !enrolled && paid

  return (
    <div className="min-h-screen bg-papel flex items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full">
        <div className="border border-lino bg-blanco px-8 py-10">
          <h1 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] font-medium text-tinta leading-[1.15] tracking-[-0.02em] mb-4">
            {activating
              ? 'Pago recibido'
              : courseName
                ? `Ya tienes acceso a «${courseName}»`
                : 'Pago procesado correctamente'}
          </h1>

          {activating ? (
            <div className="mb-8">
              <ActivatingAccess />
            </div>
          ) : (
            <p className="font-sans text-[16px] text-tinta/75 leading-relaxed mb-8">
              {customerEmail
                ? `Te hemos enviado la confirmación a ${customerEmail}. `
                : 'Te hemos enviado la confirmación por correo. '}
              {userId ? 'Tu acceso al curso está activo.' : 'Inicia sesión para empezar el curso.'}
            </p>
          )}

          <div className="flex flex-col gap-3">
            {!userId ? (
              <a
                href={`/campus/login${courseSlug ? `?redirect_url=${encodeURIComponent(`/campus/cursos/${courseSlug}`)}` : ''}`}
                className="font-sans text-[15px] font-medium text-papel bg-tinta px-6 min-h-[48px] flex items-center justify-center hover:bg-acento hover:text-tinta transition-colors duration-200"
              >
                Iniciar sesión
              </a>
            ) : (
              courseSlug &&
              !activating && (
                <a
                  href={`/campus/cursos/${courseSlug}`}
                  className="font-sans text-[15px] font-medium text-papel bg-tinta px-6 min-h-[48px] flex items-center justify-center hover:bg-acento hover:text-tinta transition-colors duration-200"
                >
                  Ir al curso
                </a>
              )
            )}
            <a
              href="/campus/cursos"
              className="font-sans text-[15px] text-tinta/65 hover:text-tinta text-center min-h-[44px] flex items-center justify-center transition-colors duration-200"
            >
              Ver todos los cursos
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
