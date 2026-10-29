import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/campus/cursos/:slug/bloque(.*)',
  '/campus/progreso(.*)',
  '/campus/certificado(.*)',
  '/admin(.*)',
])

// signInUrl fijo: NEXT_PUBLIC_CLERK_SIGN_IN_URL en producción llegó con un BOM
// delante (U+FEFF), y el redirect relativo resultante entraba en bucle.
export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect()
  },
  { signInUrl: '/campus/login' },
)

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
