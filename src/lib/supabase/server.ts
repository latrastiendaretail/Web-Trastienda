import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export async function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()
  // TEMP DEBUG: verificar proyecto + claims del anon key, sin exponer secretos.
  try {
    const payload = JSON.parse(Buffer.from(anonKey.split('.')[1], 'base64').toString('utf8'))
    console.log('[debug-supabase-project] url matches:', url.includes('mcelvuusxpikmolmxodi'), 'anon ref:', payload.ref, 'anon role:', payload.role, 'anon iat:', payload.iat)
  } catch (e) {
    console.log('[debug-supabase-project] could not decode anon key', e)
  }
  return createClient<Database>(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
  )
}
