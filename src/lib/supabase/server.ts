import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export async function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
  )
}
