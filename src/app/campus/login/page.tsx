'use client'

import { useSignIn } from '@clerk/nextjs/legacy'
import { useAuth } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'

function LoginForm() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // After login, go back to where the user was trying to go
  const redirectUrl = searchParams.get('redirect_url') ?? '/campus'

  useEffect(() => {
    if (isSignedIn) router.replace(redirectUrl)
  }, [isSignedIn, router, redirectUrl])

  async function handleGoogleLogin() {
    if (!isLoaded) return
    setError(null)
    setGoogleLoading(true)
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: redirectUrl,
      })
    } catch (err: unknown) {
      const e = err as { errors?: { message: string }[] }
      setError(e?.errors?.[0]?.message ?? 'Error al conectar con Google')
      setGoogleLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded) return
    setError(null)
    setLoading(true)
    try {
      const result = await signIn.create({ identifier: email, password })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push(redirectUrl)
      } else {
        setError(`Estado inesperado: ${result.status}. Contacta con el administrador.`)
      }
    } catch (err: unknown) {
      const e = err as { errors?: { message: string }[] }
      setError(e?.errors?.[0]?.message ?? 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo (solo mobile/tablet, desktop ya lo muestra el panel izq) */}
      <a href="/" className="block mb-12 cursor-pointer lg:hidden">
        <span className="block font-display text-2xl font-medium text-tinta tracking-tight leading-none">
          La Trastienda
        </span>
        <span className="block font-sans text-[9px] text-acento uppercase tracking-[0.16em] mt-1">
          Campus
        </span>
      </a>

      <div className="mb-8">
        <h1 className="font-display text-[2rem] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-2">
          Acceder
        </h1>
        <p className="font-sans text-sm text-cuero">
          Introduce tus credenciales para entrar al campus.
        </p>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading || loading || !isLoaded}
        className="w-full flex items-center justify-center gap-3 font-sans text-[11px] font-medium text-tinta uppercase tracking-[0.08em] border border-lino py-4 hover:border-tinta transition-colors duration-200 cursor-pointer min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {googleLoading ? 'Redirigiendo...' : 'Continuar con Google'}
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-lino/60" />
        <span className="font-mono text-[9px] text-cuero/50 uppercase tracking-[0.1em]">o</span>
        <div className="flex-1 h-px bg-lino/60" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block font-sans text-[10px] text-cuero uppercase tracking-[0.1em] mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-lino bg-transparent pb-3 font-sans text-base text-tinta placeholder:text-lino focus:border-tinta focus:outline-none transition-colors duration-200"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block font-sans text-[10px] text-cuero uppercase tracking-[0.1em] mb-2"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-lino bg-transparent pb-3 font-sans text-base text-tinta placeholder:text-lino focus:border-tinta focus:outline-none transition-colors duration-200"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="font-sans text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !isLoaded}
          className="w-full font-sans text-[11px] font-medium text-papel bg-tinta uppercase tracking-[0.08em] py-4 hover:bg-acento hover:text-tinta transition-colors duration-200 cursor-pointer min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Accediendo...' : 'Acceder al Campus'}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-lino/40 flex items-center justify-between">
        <a
          href="/"
          className="font-sans text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer"
        >
          ← Volver a la web
        </a>
        <span className="font-sans text-[10px] text-cuero/50">
          Secured by <strong className="font-medium">Clerk</strong>
        </span>
      </div>
    </div>
  )
}

const features = [
  {
    title: 'Formación práctica en Retail',
    desc: 'Cursos diseñados por profesionales del sector, sin relleno teórico.',
  },
  {
    title: 'A tu ritmo',
    desc: 'Vídeos y módulos disponibles cuando quieras, desde cualquier dispositivo.',
  },
  {
    title: 'Certificado al terminar',
    desc: 'Acredita lo aprendido con un certificado descargable por curso.',
  },
]

export default function CampusLoginPage() {
  return (
    <main className="min-h-screen bg-papel flex">
      {/* Presentación del producto */}
      <div className="hidden lg:flex lg:w-1/2 bg-tinta flex-col justify-between px-14 py-14 xl:px-20">
        <a href="/" className="block cursor-pointer">
          <Image
            src="/images/Logos/imagotipov2.svg"
            alt="La Trastienda"
            width={130}
            height={44}
            className="object-contain brightness-0 invert"
            priority
          />
        </a>

        <div className="max-w-[38ch]">
          <span className="block font-sans text-[10px] text-acento uppercase tracking-[0.16em] mb-4">
            Campus
          </span>
          <h1 className="font-display text-[clamp(2rem,3vw,2.75rem)] font-medium text-papel leading-[1.15] tracking-[-0.02em] mb-6">
            La formación de Retail que tu equipo necesita.
          </h1>
          <ul className="space-y-5">
            {features.map((f) => (
              <li key={f.title} className="flex gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-acento shrink-0" aria-hidden />
                <div>
                  <p className="font-sans text-sm font-medium text-papel">{f.title}</p>
                  <p className="font-sans text-sm text-papel/50 leading-relaxed">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-mono text-[10px] text-papel/30 uppercase tracking-[0.1em]">
          La Trastienda © {new Date().getFullYear()}
        </p>
      </div>

      {/* Formulario */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
