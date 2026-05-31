'use client'

import { useSignIn } from '@clerk/nextjs/legacy'
import { useAuth } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'

function LoginForm() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // After login, go back to where the user was trying to go
  const redirectUrl = searchParams.get('redirect_url') ?? '/campus'

  useEffect(() => {
    if (isSignedIn) router.replace(redirectUrl)
  }, [isSignedIn, router, redirectUrl])

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
      {/* Logo */}
      <a href="/" className="block mb-12 cursor-pointer">
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

export default function CampusLoginPage() {
  return (
    <main className="min-h-screen bg-papel flex flex-col items-center justify-center px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  )
}
