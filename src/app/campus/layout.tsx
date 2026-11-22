'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useClerk, useUser } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'

const navLinks = [
  { href: '/campus', label: 'Inicio', exact: true },
  { href: '/campus/cursos', label: 'Cursos' },
  { href: '/campus/progreso', label: 'Mi progreso' },
]

function TopBar({ currentPath }: { currentPath: string }) {
  const { signOut } = useClerk()
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await signOut()
    router.push('/')
  }

  const isActive = (link: (typeof navLinks)[number]) =>
    link.exact ? currentPath === link.href : currentPath.startsWith(link.href)

  return (
    <header className="sticky top-0 z-30 bg-papel/95 backdrop-blur-sm border-b border-lino">
      <div className="mx-auto max-w-[1080px] px-6 md:px-10 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <a href="/" className="block shrink-0" aria-label="La Trastienda">
            <Image
              src="/images/Logos/imagotipov2.svg"
              alt="La Trastienda"
              width={110}
              height={36}
              className="object-contain"
              priority
            />
          </a>
          <nav className="hidden md:flex items-center gap-7" aria-label="Campus">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive(link) ? 'page' : undefined}
                className={`font-sans text-[15px] py-5 border-b-2 transition-colors duration-200 ${
                  isActive(link)
                    ? 'text-tinta border-acento'
                    : 'text-tinta/65 hover:text-tinta border-transparent'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-5">
          {user?.primaryEmailAddress && (
            <span className="font-sans text-[14px] text-tinta/60 truncate max-w-[220px]">
              {user.primaryEmailAddress.emailAddress}
            </span>
          )}
          {isLoaded && !isSignedIn ? (
            <a
              href="/campus/login"
              className="font-sans text-[14px] font-medium text-tinta underline-offset-4 hover:underline min-h-[44px] inline-flex items-center"
            >
              Iniciar sesión
            </a>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="font-sans text-[14px] text-tinta/70 hover:text-tinta underline-offset-4 hover:underline transition-colors duration-200 cursor-pointer min-h-[44px]"
            >
              Cerrar sesión
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center text-tinta cursor-pointer"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
            {open ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-lino bg-papel px-6 py-3">
          <nav className="flex flex-col" aria-label="Campus">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link) ? 'page' : undefined}
                className={`font-sans text-[16px] min-h-[48px] flex items-center ${
                  isActive(link) ? 'text-tinta font-medium' : 'text-tinta/70'
                }`}
              >
                {link.label}
              </a>
            ))}
            {isLoaded && !isSignedIn ? (
              <a href="/campus/login" className="font-sans text-[16px] min-h-[48px] flex items-center text-tinta font-medium">
                Iniciar sesión
              </a>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="font-sans text-[16px] min-h-[48px] flex items-center text-tinta/70 text-left cursor-pointer"
              >
                Cerrar sesión
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default function CampusLayout({ children }: { children: React.ReactNode }) {
  const currentPath = usePathname()

  // Login: sin barra, todavía no hay sesión.
  if (currentPath === '/campus/login') {
    return <>{children}</>
  }

  // Vista previa por enlace: sin navegación ni datos de sesión.
  if (currentPath.startsWith('/campus/preview/')) {
    return (
      <div className="min-h-screen bg-papel">
        <main className="mx-auto max-w-[1080px] px-6 md:px-10 py-12">{children}</main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-papel">
      <TopBar currentPath={currentPath} />
      <main className="mx-auto max-w-[1080px] px-6 md:px-10 py-12 md:py-16">{children}</main>
    </div>
  )
}
