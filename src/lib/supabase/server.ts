import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'
import type { Database } from './types'

export async function createServerClient() {
  let clerkToken: string | null = null

  try {
    const { getToken } = await auth()
    clerkToken = await getToken({ template: 'supabase' })
  } catch {
    // No active session or template not configured — use anon key only
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    clerkToken
      ? { global: { headers: { Authorization: `Bearer ${clerkToken}` } } }
      : undefined,
  )
}
