import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const host = url ? new URL(url).hostname : null
  return NextResponse.json({ supabaseHost: host })
}
