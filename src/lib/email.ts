import { Resend } from 'resend'
import { env } from '@/lib/env'

/**
 * Remitente de los correos transaccionales.
 * Por defecto usa el dominio de pruebas de Resend, que SOLO entrega a la cuenta
 * dueña de Resend. En producción configura RESEND_FROM con un dominio propio
 * verificado (SPF/DKIM), si no los alumnos no recibirán nada.
 */
export const MAIL_FROM = env('RESEND_FROM') ?? 'La Trastienda <onboarding@resend.dev>'
export const MAIL_REPLY_TO = env('RESEND_REPLY_TO') ?? 'latrastienda.retail@gmail.com'

/** true si el remitente es el de pruebas de Resend (no entrega a clientes). */
export const MAIL_FROM_IS_SANDBOX = MAIL_FROM.includes('@resend.dev')

let _resend: Resend | null = null

export function getResend(): Resend | null {
  const key = env('RESEND_API_KEY')
  if (!key) return null
  if (!_resend) _resend = new Resend(key)
  return _resend
}

export function baseUrl(): string {
  const url = env('NEXT_PUBLIC_URL')
  if (url) return url.replace(/\/$/, '')
  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_URL no está configurada en producción')
  }
  return 'http://localhost:3000'
}
