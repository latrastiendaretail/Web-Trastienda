export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { baseUrl } from '@/lib/email'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const home = baseUrl()

  if (!token) return NextResponse.redirect(`${home}/newsletter/baja?error=1`)

  const supabase = createServiceClient()
  const { data: sub } = await supabase
    .from('newsletter_subscribers')
    .select('id')
    .eq('unsubscribe_token', token)
    .maybeSingle()

  if (sub) {
    await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', sub.id)
  }

  return NextResponse.redirect(`${home}/newsletter/baja`)
}
