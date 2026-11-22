import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Redis } from '@upstash/redis'
import { env } from '@/lib/env'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${env('CRON_SECRET')}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('posts').select('id').limit(1)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  // Redis es secundario (límite de peticiones): si no responde, avisamos pero no marcamos el cron como caído
  let redisOk = true
  try {
    const redis = new Redis({ url: env('KV_REST_API_URL')!, token: env('KV_REST_API_TOKEN')! })
    await redis.set('cron:keep-alive', new Date().toISOString())
  } catch (err) {
    redisOk = false
    console.error('[keep-alive] Redis no responde', err)
  }

  return NextResponse.json({ ok: true, redis: redisOk, pingedAt: new Date().toISOString() })
}
