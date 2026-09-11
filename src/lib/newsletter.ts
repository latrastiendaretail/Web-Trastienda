import { createServiceClient } from '@/lib/supabase/service'
import { getResend, MAIL_FROM, MAIL_REPLY_TO, baseUrl } from '@/lib/email'
import { renderNewsletterConfirmEmail } from '@/emails/newsletterConfirm'

/** Validez del enlace de confirmación de la newsletter. */
const CONFIRM_TOKEN_TTL_MS = 48 * 60 * 60 * 1000

function confirmTokenExpiry(): string {
  return new Date(Date.now() + CONFIRM_TOKEN_TTL_MS).toISOString()
}

export function confirmUrl(token: string): string {
  return `${baseUrl()}/api/newsletter/confirmar?token=${token}`
}

export function unsubscribeUrl(token: string): string {
  return `${baseUrl()}/api/newsletter/baja?token=${token}`
}

/**
 * Alta en newsletter con doble opt-in. Idempotente:
 *  - contacto ya 'subscribed'  → no hace nada
 *  - contacto 'pending'         → reenvía el correo de confirmación
 *  - contacto nuevo o 'unsubscribed' → crea/resetea a 'pending' y envía confirmación
 * Guarda la prueba de consentimiento (texto, origen, sesión, IP).
 */
export async function handleNewsletterSignup(opts: {
  email: string
  consentText: string
  consentSource?: string
  stripeSessionId?: string | null
  ip?: string | null
}): Promise<void> {
  const email = opts.email.trim().toLowerCase()
  if (!email) return

  const supabase = createServiceClient()

  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id, status, confirm_token, unsubscribe_token')
    .eq('email', email)
    .maybeSingle()

  if (existing?.status === 'subscribed') return

  let confirmToken = existing?.confirm_token ?? crypto.randomUUID()
  let unsubToken = existing?.unsubscribe_token ?? crypto.randomUUID()

  if (existing && existing.status === 'unsubscribed') {
    // Re-consentimiento: token nuevo, vuelve a 'pending'
    confirmToken = crypto.randomUUID()
    unsubToken = crypto.randomUUID()
    await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'pending',
        consent_text: opts.consentText,
        consent_source: opts.consentSource ?? 'checkout',
        consent_ip: opts.ip ?? null,
        stripe_session_id: opts.stripeSessionId ?? null,
        confirm_token: confirmToken,
        confirm_token_expires_at: confirmTokenExpiry(),
        unsubscribe_token: unsubToken,
        confirmed_at: null,
        unsubscribed_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
  } else if (!existing) {
    const { error } = await supabase.from('newsletter_subscribers').insert({
      email,
      status: 'pending',
      consent_text: opts.consentText,
      consent_source: opts.consentSource ?? 'checkout',
      consent_ip: opts.ip ?? null,
      stripe_session_id: opts.stripeSessionId ?? null,
      confirm_token: confirmToken,
      confirm_token_expires_at: confirmTokenExpiry(),
      unsubscribe_token: unsubToken,
    })
    // Carrera con otra entrega del webhook: si ya existe, seguimos y reenviamos confirmación
    if (error && error.code !== '23505') {
      console.error('[newsletter] insert error', error)
      return
    }
  } else if (existing.status === 'pending') {
    // Reenvío: token nuevo con caducidad fresca (el anterior puede haber expirado)
    confirmToken = crypto.randomUUID()
    await supabase
      .from('newsletter_subscribers')
      .update({
        confirm_token: confirmToken,
        confirm_token_expires_at: confirmTokenExpiry(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
  }

  const resend = getResend()
  if (!resend) return

  const { subject, html } = renderNewsletterConfirmEmail({
    confirmUrl: confirmUrl(confirmToken),
    unsubscribeUrl: unsubscribeUrl(unsubToken),
  })

  await resend.emails
    .send({ from: MAIL_FROM, replyTo: MAIL_REPLY_TO, to: [email], subject, html })
    .catch((err) => console.error('[newsletter] confirm email error', err))
}
