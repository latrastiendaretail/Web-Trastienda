export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import { getResend, MAIL_FROM, MAIL_REPLY_TO, baseUrl } from '@/lib/email'
import { renderCourseAccessEmail } from '@/emails/courseAccess'
import { handleNewsletterSignup } from '@/lib/newsletter'
import { NEWSLETTER_CONSENT_TEXT } from '@/lib/legal'

const CAMPUS_UNSUB = 'mailto:latrastienda.retail@gmail.com?subject=Baja%20de%20avisos%20del%20campus'

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: 'Tarjeta',
  klarna: 'Klarna (pago aplazado)',
  sepa_debit: 'Domiciliación SEPA',
  link: 'Link',
  paypal: 'PayPal',
  bizum: 'Bizum',
}

async function resolvePaymentMethod(paymentIntentId: string | null): Promise<string> {
  if (!paymentIntentId) return 'Tarjeta'
  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId, { expand: ['latest_charge'] })
    const charge = pi.latest_charge as Stripe.Charge | null
    const type = charge?.payment_method_details?.type
    if (!type) return 'Tarjeta'
    return PAYMENT_METHOD_LABELS[type] ?? type.charAt(0).toUpperCase() + type.slice(1)
  } catch {
    return 'Tarjeta'
  }
}

async function grantCourseAccess(session: Stripe.Checkout.Session): Promise<NextResponse> {
  const userId = session.metadata?.user_id
  const courseId = session.metadata?.course_id

  if (!userId || !courseId) {
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
  }

  // Sólo conceder acceso si el pago está confirmado (Klarna/aplazados pueden llegar sin pagar)
  if (session.payment_status !== 'paid') {
    return NextResponse.json({ received: true, pending_payment: true })
  }

  const supabase = createServiceClient()
  const paymentIntentId = (session.payment_intent as string) ?? null

  // Registrar la compra — ignorar duplicado (entrega idempotente del webhook)
  const { error: purchaseError } = await supabase.from('purchases').insert({
    user_id: userId,
    course_id: courseId,
    stripe_session_id: session.id,
    stripe_payment_intent_id: paymentIntentId,
    amount_cents: session.amount_total ?? 0,
    currency: session.currency ?? 'eur',
    status: 'completed',
    customer_email: session.customer_details?.email ?? null,
  })

  if (purchaseError && purchaseError.code !== '23505') {
    console.error('[stripe webhook] purchase insert error', purchaseError)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  // Conceder matrícula si no existe
  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()

  if (!existingEnrollment) {
    const { error: enrollError } = await supabase
      .from('enrollments')
      .insert({ user_id: userId, course_id: courseId })
    if (enrollError) {
      console.error('[stripe webhook] enrollment insert error', enrollError)
      return NextResponse.json({ error: 'Enrollment error' }, { status: 500 })
    }
  }

  // Alta en newsletter (doble opt-in) si marcó la casilla en el checkout
  if (session.metadata?.newsletter_opt_in === 'true' && session.customer_details?.email) {
    await handleNewsletterSignup({
      email: session.customer_details.email,
      consentText: session.metadata.newsletter_consent_text || NEWSLETTER_CONSENT_TEXT,
      consentSource: 'checkout',
      stripeSessionId: session.id,
    }).catch((err) => console.error('[stripe webhook] newsletter error', err))
  }

  // Email de acceso — sólo una vez (dedupe con access_email_sent_at)
  const customerEmail = session.customer_details?.email
  const resend = getResend()
  if (customerEmail && resend) {
    const { data: purchaseRow } = await supabase
      .from('purchases')
      .select('id, access_email_sent_at')
      .eq('stripe_session_id', session.id)
      .maybeSingle()

    if (purchaseRow && !purchaseRow.access_email_sent_at) {
      const { data: course } = await supabase
        .from('courses')
        .select('title, slug')
        .eq('id', courseId)
        .single()

      if (course) {
        const { count: moduleCount } = await supabase
          .from('modules')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', courseId)

        const amount = ((session.amount_total ?? 0) / 100).toLocaleString('es-ES', {
          style: 'currency',
          currency: (session.currency ?? 'eur').toUpperCase(),
        })

        const { subject, html } = renderCourseAccessEmail({
          firstName: session.customer_details?.name?.split(' ')[0] ?? '',
          courseTitle: course.title,
          courseUrl: `${baseUrl()}/campus/cursos/${course.slug}`,
          moduleCount: moduleCount ?? 0,
          amount,
          date: new Date().toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid' }),
          paymentMethod: await resolvePaymentMethod(paymentIntentId),
          unsubscribeUrl: CAMPUS_UNSUB,
        })

        const { error: sendError } = await resend.emails
          .send({ from: MAIL_FROM, replyTo: MAIL_REPLY_TO, to: [customerEmail], subject, html })
          .then((r) => ({ error: r.error }))
          .catch((err) => ({ error: err }))

        if (!sendError) {
          await supabase
            .from('purchases')
            .update({ access_email_sent_at: new Date().toISOString() })
            .eq('id', purchaseRow.id)
        } else {
          console.error('[stripe webhook] email error', sendError)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}

async function revokeOnRefund(charge: Stripe.Charge): Promise<void> {
  const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : null
  if (!paymentIntentId) return

  const supabase = createServiceClient()
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id, user_id, course_id')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .maybeSingle()

  if (!purchase) return

  await supabase.from('purchases').update({ status: 'refunded' }).eq('id', purchase.id)
  await supabase
    .from('enrollments')
    .delete()
    .eq('user_id', purchase.user_id)
    .eq('course_id', purchase.course_id)

  console.info('[stripe webhook] refund → acceso revocado', {
    user: purchase.user_id,
    course: purchase.course_id,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[stripe webhook] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
      return grantCourseAccess(event.data.object as Stripe.Checkout.Session)

    case 'charge.refunded':
      await revokeOnRefund(event.data.object as Stripe.Charge).catch((err) =>
        console.error('[stripe webhook] refund handler error', err),
      )
      return NextResponse.json({ received: true })

    default:
      return NextResponse.json({ received: true })
  }
}
