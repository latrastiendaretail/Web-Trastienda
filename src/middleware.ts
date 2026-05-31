import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { type NextFetchEvent, NextRequest, NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/campus/cursos/:slug/bloque(.*)',
  '/campus/progreso(.*)',
  '/campus/certificado(.*)',
  '/admin(.*)',
])

const clerk = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

// Wrap Clerk so pk_test_ keys don't crash public pages in production.
// Protected routes fall back to a login redirect if Clerk fails.
export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  try {
    return await clerk(req, event)
  } catch {
    if (isProtectedRoute(req)) {
      return NextResponse.redirect(new URL('/campus/login', req.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
