'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import { baseUrl } from '@/lib/email'
import { sendAccessEmail } from '@/lib/accessEmail'
import { NEWSLETTER_CONSENT_TEXT } from '@/lib/legal'

/** Metadata + opciones comunes a las sesiones de checkout. */
function checkoutExtras(userId: string, courseId: string, newsletterOptIn: boolean) {
  const metadata: Record<string, string> = {
    user_id: userId,
    course_id: courseId,
    newsletter_opt_in: newsletterOptIn ? 'true' : 'false',
  }
  if (newsletterOptIn) metadata.newsletter_consent_text = NEWSLETTER_CONSENT_TEXT.slice(0, 480)
  return {
    metadata,
    customer_creation: 'always' as const,
    billing_address_collection: 'auto' as const,
    invoice_creation: { enabled: true },
    payment_intent_data: { metadata: { user_id: userId, course_id: courseId } },
  }
}


/** Si ya hay un pago completado de este curso, no se cobra otra vez: el acceso se está activando. */
async function redirectIfAlreadyPaid(userId: string, courseId: string, slug: string) {
  const supabase = createServiceClient()
  const { data: paid } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('status', 'completed')
    .limit(1)
    .maybeSingle()
  if (paid) redirect(`/compra/exito?course_slug=${encodeURIComponent(slug)}`)
}

export async function createCheckoutSession(
  courseId: string,
  newsletterOptIn = false,
): Promise<never> {
  const { userId } = await auth()
  if (!userId) redirect('/campus/login')

  const supabase = createServiceClient()

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug, price_cents, stripe_price_id')
    .eq('id', courseId)
    .single()

  if (course?.price_cents == null || !course.stripe_price_id) {
    throw new Error('Este curso no está disponible para compra')
  }

  // Already enrolled → skip checkout (service client: userId verified by Clerk)
  const serviceClient = createServiceClient()
  const { data: enrollment } = await serviceClient
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()

  if (enrollment) redirect(`/campus/cursos/${course.slug}`)
  await redirectIfAlreadyPaid(userId, courseId, course.slug)

  // Get user email to pre-fill Stripe Checkout
  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId)
  const email = user.emailAddresses[0]?.emailAddress

  const base = baseUrl()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: course.stripe_price_id, quantity: 1 }],
    customer_email: email,
    success_url: `${base}/compra/exito?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/campus/cursos/${course.slug}`,
    ...checkoutExtras(userId, courseId, newsletterOptIn),
  })

  redirect(session.url!)
}

export async function createEmbeddedCheckoutSession(
  courseId: string,
  newsletterOptIn = false,
): Promise<{ clientSecret: string }> {
  const { userId } = await auth()
  if (!userId) redirect('/campus/login')

  const supabase = createServiceClient()

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug, price_cents, stripe_price_id')
    .eq('id', courseId)
    .single()

  if (course?.price_cents == null || !course.stripe_price_id) {
    throw new Error('Este curso no está disponible para compra')
  }

  const serviceClient = createServiceClient()
  const { data: enrollment } = await serviceClient
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()

  if (enrollment) redirect(`/campus/cursos/${course.slug}`)
  await redirectIfAlreadyPaid(userId, courseId, course.slug)

  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId)
  const email = user.emailAddresses[0]?.emailAddress

  const base = baseUrl()

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded_page',
    mode: 'payment',
    line_items: [{ price: course.stripe_price_id, quantity: 1 }],
    customer_email: email,
    return_url: `${base}/compra/exito?session_id={CHECKOUT_SESSION_ID}`,
    ...checkoutExtras(userId, courseId, newsletterOptIn),
  })

  return { clientSecret: session.client_secret! }
}

export async function enrollFree(courseId: string): Promise<never> {
  const { userId } = await auth()
  if (!userId) redirect('/campus/login')

  const supabase = createServiceClient()

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug, price_cents')
    .eq('id', courseId)
    .single()

  if (!course || course.price_cents !== 0) {
    throw new Error('Este curso no es gratuito')
  }

  // Already enrolled → go directly
  const { data: existing } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()

  if (existing) redirect(`/campus/cursos/${course.slug}`)

  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId)
  const email = user.emailAddresses[0]?.emailAddress ?? null

  const { data: purchase } = await supabase
    .from('purchases')
    .insert({
      user_id: userId,
      course_id: courseId,
      stripe_session_id: `free_${userId}_${courseId}`,
      amount_cents: 0,
      currency: 'eur',
      status: 'completed',
      customer_email: email,
    })
    .select('id')
    .maybeSingle()

  // 23505 = ya matriculado (doble clic / pestañas): no es un error para el alumno
  const { error: enrollError } = await supabase.from('enrollments').insert({ user_id: userId, course_id: courseId })
  if (enrollError && enrollError.code !== '23505') {
    console.error('[enrollFree] enrollment error', enrollError)
    throw new Error('No se ha podido activar el acceso. Inténtalo de nuevo.')
  }

  if (purchase?.id) await sendAccessEmail(purchase.id)

  redirect(`/compra/exito?course_slug=${encodeURIComponent(course.slug)}`)
}
