import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Browsing campus catalog is public; content consumption requires login
const isProtectedRoute = createRouteMatcher([
  '/campus/cursos/:slug/bloque(.*)',
  '/campus/progreso(.*)',
  '/campus/certificado(.*)',
  '/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
