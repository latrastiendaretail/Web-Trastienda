'use server'

import { createServerClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

export type LeadResult =
  | { success: true }
  | { success: false; error: string }

export async function submitLead(formData: FormData): Promise<LeadResult> {
  // Honeypot: bots rellenan este campo oculto, humanos no
  const honeypot = (formData.get('website') as string) ?? ''
  if (honeypot.length > 0) return { success: true } // fingir éxito para no dar pistas

  const email = (formData.get('email') as string | null)?.trim().toLowerCase() ?? ''

  if (!email) return { success: false, error: 'El email es obligatorio' }
  if (!isValidEmail(email)) return { success: false, error: 'Introduce un email válido' }

  const supabase = await createServerClient()
  const { error } = await supabase.from('leads').insert({ email, source: 'inscripcion' })

  if (error) {
    if (error.code === '23505') {
      // Unique violation → ya registrado, no revelar que existe
      return { success: true }
    }
    return { success: false, error: 'Error al guardar. Inténtalo de nuevo.' }
  }

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Campus <onboarding@resend.dev>',
      to: ['davidemiguelsanchez@gmail.com'],
      subject: 'Nuevo alumno interesado — La Trastienda',
      text: `Nuevo registro en la lista de espera:\n\nEmail: ${email}\nFecha: ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}`,
    })
  }

  return { success: true }
}
