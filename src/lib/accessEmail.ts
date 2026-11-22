import { clerkClient } from '@clerk/nextjs/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import { getResend, MAIL_FROM, MAIL_REPLY_TO, baseUrl } from '@/lib/email'
import { renderCourseAccessEmail } from '@/emails/courseAccess'

const CAMPUS_UNSUB = 'mailto:latrastienda.retail@gmail.com?subject=Baja%20de%20avisos%20del%20campus'

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: 'Tarjeta',
  klarna: 'Klarna (pago aplazado)',
  sepa_debit: 'Domiciliación SEPA',
  link: 'Link',
  paypal: 'PayPal',
  bizum: 'Bizum',
}

async function resolvePaymentMethod(paymentIntentId: string | null, amountCents: number): Promise<string> {
  if (!paymentIntentId) return amountCents === 0 ? '—' : 'Tarjeta'
  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId, { expand: ['latest_charge'] })
    const type = (pi.latest_charge as Stripe.Charge | null)?.payment_method_details?.type
    if (!type) return 'Tarjeta'
    return PAYMENT_METHOD_LABELS[type] ?? type.charAt(0).toUpperCase() + type.slice(1)
  } catch {
    return 'Tarjeta'
  }
}

export type AccessEmailResult = 'sent' | 'already_sent' | 'skipped' | 'failed'

/**
 * Envía el correo de acceso de una compra, una sola vez.
 * Reserva el envío de forma atómica (access_email_sent_at) para que dos entregas
 * simultáneas del webhook no manden dos correos, y libera la reserva si falla,
 * de modo que el cron de reintento (/api/cron/access-emails) lo vuelva a intentar.
 * Nunca lanza: devuelve el resultado.
 */
export async function sendAccessEmail(purchaseId: string): Promise<AccessEmailResult> {
  const supabase = createServiceClient()
  try {
    const resend = getResend()
    if (!resend) return 'skipped'

    const { data: purchase } = await supabase
      .from('purchases')
      .select('id, user_id, course_id, customer_email, amount_cents, currency, stripe_payment_intent_id, created_at, status')
      .eq('id', purchaseId)
      .maybeSingle()
    if (!purchase || purchase.status !== 'completed' || !purchase.customer_email) return 'skipped'

    // Reserva atómica: solo uno gana
    const { data: claimed } = await supabase
      .from('purchases')
      .update({ access_email_sent_at: new Date().toISOString() })
      .eq('id', purchase.id)
      .is('access_email_sent_at', null)
      .select('id')
    if (!claimed || claimed.length === 0) return 'already_sent'

    const release = () =>
      supabase.from('purchases').update({ access_email_sent_at: null }).eq('id', purchase.id)

    const { data: course } = await supabase
      .from('courses')
      .select('title, slug')
      .eq('id', purchase.course_id)
      .single()
    if (!course) {
      await release()
      return 'failed'
    }

    const { count: moduleCount } = await supabase
      .from('modules')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', purchase.course_id)

    let firstName = ''
    try {
      const clerk = await clerkClient()
      firstName = (await clerk.users.getUser(purchase.user_id)).firstName ?? ''
    } catch {
      /* sin nombre: el correo saluda "Hola de nuevo" */
    }

    const free = purchase.amount_cents === 0
    const amount = free
      ? 'Gratuito'
      : (purchase.amount_cents / 100).toLocaleString('es-ES', {
          style: 'currency',
          currency: purchase.currency.toUpperCase(),
        })

    const { subject, html } = renderCourseAccessEmail({
      firstName,
      courseTitle: course.title,
      courseUrl: `${baseUrl()}/campus/cursos/${course.slug}`,
      moduleCount: moduleCount ?? 0,
      amount,
      date: new Date(purchase.created_at).toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid' }),
      paymentMethod: await resolvePaymentMethod(purchase.stripe_payment_intent_id, purchase.amount_cents),
      unsubscribeUrl: CAMPUS_UNSUB,
    })

    const result = await resend.emails
      .send({ from: MAIL_FROM, replyTo: MAIL_REPLY_TO, to: [purchase.customer_email], subject, html })
      .catch((err: unknown) => ({ data: null, error: err }))

    if (result.error) {
      console.error('[access email] error de envío', purchase.id, result.error)
      await release()
      return 'failed'
    }
    return 'sent'
  } catch (err) {
    console.error('[access email] error inesperado', purchaseId, err)
    // Intento de liberar la reserva para que el cron reintente
    await supabase.from('purchases').update({ access_email_sent_at: null }).eq('id', purchaseId)
    return 'failed'
  }
}
