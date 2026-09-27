import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Redis } from '@upstash/redis'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('posts').select('id').limit(1)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  })
  await redis.set('cron:keep-alive', new Date().toISOString())

  return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() })
}
