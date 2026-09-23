import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export async function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim()
  // TEMP DEBUG: verificar qué proyecto Supabase usa producción, sin exponer la URL completa.
  console.log('[debug-supabase-project] matches expected ref:', url.includes('mcelvuusxpikmolmxodi'))
  return createClient<Database>(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
  )
}
