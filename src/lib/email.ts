import { Resend } from 'resend'

/**
 * Remitente de los correos transaccionales.
 * Por defecto usa el dominio de pruebas de Resend; en producción configura
 * RESEND_FROM con un dominio propio verificado (SPF/DKIM).
 */
export const MAIL_FROM = process.env.RESEND_FROM ?? 'La Trastienda <onboarding@resend.dev>'
export const MAIL_REPLY_TO = process.env.RESEND_REPLY_TO ?? 'latrastienda.retail@gmail.com'

let _resend: Resend | null = null

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export function baseUrl(): string {
  return process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'
}
