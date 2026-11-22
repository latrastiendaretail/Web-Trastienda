export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { sendAccessEmail } from '@/lib/accessEmail'
import { MAIL_FROM_IS_SANDBOX } from '@/lib/email'
import { env } from '@/lib/env'

/**
 * Reintenta los correos de acceso que no llegaron a enviarse (Resend caído,
 * clave mal configurada, remitente sin verificar…). Solo compras de los últimos 14 días.
 */
export async function GET(request: Request) {
  if (request.headers.get('authorization') !== `Bearer ${env('CRON_SECRET')}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  // Margen de 10 min: no pisar el envío del webhook recién recibido
  const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString()

  const { data: rows, error } = await supabase
    .from('purchases')
    .select('id')
    .eq('status', 'completed')
    .is('access_email_sent_at', null)
    .not('customer_email', 'is', null)
    .gte('created_at', since)
    .lte('created_at', cutoff)
    .limit(50)

  if (error) {
    console.error('[cron access-emails] query error', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  const counts = { sent: 0, failed: 0, skipped: 0, already_sent: 0 }
  for (const row of rows ?? []) counts[await sendAccessEmail(row.id)]++

  if (MAIL_FROM_IS_SANDBOX && (rows?.length ?? 0) > 0) {
    console.error('[cron access-emails] RESEND_FROM sin configurar: el remitente de pruebas no entrega a clientes')
  }
  return NextResponse.json({ ok: true, pending: rows?.length ?? 0, ...counts })
}
