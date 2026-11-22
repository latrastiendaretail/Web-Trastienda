export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import { handleNewsletterSignup } from '@/lib/newsletter'
import { NEWSLETTER_CONSENT_TEXT } from '@/lib/legal'
import { sendAccessEmail } from '@/lib/accessEmail'
import { env } from '@/lib/env'

async function grantCourseAccess(session: Stripe.Checkout.Session): Promise<NextResponse> {
  const userId = session.metadata?.user_id
  const courseId = session.metadata?.course_id

  if (!userId || !courseId) {
    // Sesión de otro producto de la misma cuenta de Stripe: se ignora (200 evita reintentos)
    console.warn('[stripe webhook] sesión sin metadata user_id/course_id, ignorada', session.id)
    return NextResponse.json({ received: true, ignored: true })
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

  // Email de acceso: una sola vez, sin tumbar el webhook si falla (el cron lo reintenta)
  const { data: purchaseRow } = await supabase
    .from('purchases')
    .select('id')
    .eq('stripe_session_id', session.id)
    .maybeSingle()
  if (purchaseRow) {
    const result = await sendAccessEmail(purchaseRow.id)
    if (result === 'failed' || result === 'skipped') {
      console.error('[stripe webhook] correo de acceso no enviado', { purchase: purchaseRow.id, result })
    }
  }

  return NextResponse.json({ received: true })
}

/**
 * Revoca el acceso a un curso: matrícula, certificado y marca la compra.
 * Se dispara en reembolso total y en disputa/contracargo.
 */
async function revokeAccessByPaymentIntent(
  paymentIntentId: string | null,
  reason: 'refunded' | 'disputed',
): Promise<void> {
  if (!paymentIntentId) return

  const supabase = createServiceClient()
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id, user_id, course_id')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .maybeSingle()

  if (!purchase) return

  await supabase
    .from('purchases')
    .update({ status: 'refunded' })
    .eq('id', purchase.id)

  await supabase
    .from('enrollments')
    .delete()
    .eq('user_id', purchase.user_id)
    .eq('course_id', purchase.course_id)

  await supabase
    .from('certificates')
    .delete()
    .eq('user_id', purchase.user_id)
    .eq('course_id', purchase.course_id)

  console.info(`[stripe webhook] ${reason} → acceso revocado`, {
    user: purchase.user_id,
    course: purchase.course_id,
  })
}

const MAX_WEBHOOK_BYTES = 1_000_000 // 1 MB — los eventos de Stripe son muy pequeños

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (body.length > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
  }

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const webhookSecret = env('STRIPE_WEBHOOK_SECRET')
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

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      // Solo revocar en reembolso total, no parcial.
      if (charge.amount_refunded >= charge.amount) {
        const pi = typeof charge.payment_intent === 'string' ? charge.payment_intent : null
        await revokeAccessByPaymentIntent(pi, 'refunded').catch((err) =>
          console.error('[stripe webhook] refund handler error', err),
        )
      }
      return NextResponse.json({ received: true })
    }

    case 'charge.dispute.created': {
      const dispute = event.data.object as Stripe.Dispute
      const pi = typeof dispute.payment_intent === 'string' ? dispute.payment_intent : null
      await revokeAccessByPaymentIntent(pi, 'disputed').catch((err) =>
        console.error('[stripe webhook] dispute handler error', err),
      )
      return NextResponse.json({ received: true })
    }

    default:
      return NextResponse.json({ received: true })
  }
}
