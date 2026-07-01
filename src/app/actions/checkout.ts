'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function createCheckoutSession(courseId: string): Promise<never> {
  const { userId } = await auth()
  if (!userId) redirect('/campus/login')

  const supabase = await createServerClient()

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

  // Get user email to pre-fill Stripe Checkout
  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId)
  const email = user.emailAddresses[0]?.emailAddress

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: course.stripe_price_id, quantity: 1 }],
    customer_email: email,
    success_url: `${baseUrl}/compra/exito?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/campus/cursos/${course.slug}`,
    metadata: {
      user_id: userId,
      course_id: courseId,
    },
    payment_intent_data: {
      metadata: {
        user_id: userId,
        course_id: courseId,
      },
    },
  })

  redirect(session.url!)
}

export async function createEmbeddedCheckoutSession(courseId: string): Promise<{ clientSecret: string }> {
  const { userId } = await auth()
  if (!userId) redirect('/campus/login')

  const supabase = await createServerClient()

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

  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId)
  const email = user.emailAddresses[0]?.emailAddress

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded_page',
    mode: 'payment',
    line_items: [{ price: course.stripe_price_id, quantity: 1 }],
    customer_email: email,
    return_url: `${baseUrl}/compra/exito?session_id={CHECKOUT_SESSION_ID}`,
    metadata: { user_id: userId, course_id: courseId },
    payment_intent_data: { metadata: { user_id: userId, course_id: courseId } },
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

  await supabase.from('purchases').insert({
    user_id: userId,
    course_id: courseId,
    stripe_session_id: `free_${userId}_${courseId}`,
    amount_cents: 0,
    currency: 'eur',
    status: 'completed',
    customer_email: email,
  }).select().maybeSingle()

  await supabase.from('enrollments').insert({ user_id: userId, course_id: courseId })

  if (email && process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'
    const safeTitle = course.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    await resend.emails.send({
      from: 'La Trastienda <onboarding@resend.dev>',
      to: [email],
      subject: `Ya tienes acceso a "${safeTitle}"`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111">
          <h2 style="margin-bottom:8px">Tu acceso está listo</h2>
          <p style="color:#444;margin-bottom:24px">
            Ya puedes acceder a <strong>${safeTitle}</strong>. Entra con tu cuenta y empieza cuando quieras.
          </p>
          <a href="${baseUrl}/campus/cursos/${course.slug}"
             style="display:inline-block;background:#111;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">
            Ir al curso →
          </a>
          <p style="color:#888;font-size:12px;margin-top:32px">La Trastienda · Formación en Retail</p>
        </div>
      `,
    }).catch(err => console.error('[enrollFree] email error', err))
  }

  redirect(`/compra/exito?course_slug=${course.slug}&course_title=${encodeURIComponent(course.title)}&email=${encodeURIComponent(email ?? '')}`)
}
