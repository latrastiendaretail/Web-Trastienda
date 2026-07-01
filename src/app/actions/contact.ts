'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'

const _rl = new Map<string, { n: number; reset: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = _rl.get(ip)
  if (!entry || entry.reset < now) {
    _rl.set(ip, { n: 1, reset: now + 60 * 60 * 1000 })
    return true
  }
  if (entry.n >= 3) return false
  entry.n++
  return true
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

export type ContactResult =
  | { success: true }
  | { success: false; error: string }

export async function submitContact(formData: FormData): Promise<ContactResult> {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anon'
  if (!checkRateLimit(ip)) return { success: false, error: 'Demasiados intentos. Inténtalo más tarde.' }

  const honeypot = (formData.get('website') as string) ?? ''
  if (honeypot.length > 0) return { success: true }

  const name    = (formData.get('name')     as string | null)?.trim() ?? ''
  const email   = (formData.get('email')    as string | null)?.trim().toLowerCase() ?? ''
  const message = (formData.get('message')  as string | null)?.trim() ?? ''
  const audience = (formData.get('audience') as string | null)?.trim() ?? 'no especificado'

  if (!name)                  return { success: false, error: 'El nombre es obligatorio' }
  if (!email)                 return { success: false, error: 'El email es obligatorio' }
  if (!isValidEmail(email))   return { success: false, error: 'Introduce un email válido' }
  if (!message)               return { success: false, error: 'El mensaje es obligatorio' }

  if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL_TO) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Web La Trastienda <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL_TO],
      subject: `Contacto web — ${name} (${audience})`,
      text: [
        `Nuevo mensaje desde el formulario de contacto de latrastienda.es`,
        '',
        `Nombre:  ${name}`,
        `Email:   ${email}`,
        `Perfil:  ${audience}`,
        '',
        `Mensaje:`,
        message,
        '',
        `Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}`,
      ].join('\n'),
    })
  }

  return { success: true }
}
