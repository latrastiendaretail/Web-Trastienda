import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export async function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()
  // TEMP DEBUG: verificar proyecto + claims del anon key, sin exponer secretos.
  console.log('[debug-supabase-project] url matches:', url.includes('mcelvuusxpikmolmxodi'), 'anon key prefix:', anonKey.slice(0, 15), 'anon key len:', anonKey.length, 'dots:', anonKey.split('.').length - 1)
  return createClient<Database>(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
  )
}
