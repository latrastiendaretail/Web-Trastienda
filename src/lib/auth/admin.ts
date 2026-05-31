import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function requireAdmin(): Promise<string> {
  const user = await currentUser()
  const role = (user?.publicMetadata as { role?: string } | undefined)?.role
  if (!user || role !== 'admin') {
    redirect('/campus')
  }
  return user.id
}
