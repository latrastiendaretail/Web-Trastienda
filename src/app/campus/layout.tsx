'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useClerk, useUser } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'

const sidebarLinks = [
  { href: '/campus', label: 'Inicio', exact: true },
  { href: '/campus/cursos', label: 'Cursos' },
  { href: '/campus/progreso', label: 'Mi progreso' },
]

function NavIcon({ href }: { href: string }) {
  const cls = 'w-[15px] h-[15px] shrink-0'
  if (href === '/campus')
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  if (href === '/campus/cursos')
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    )
  if (href === '/campus/progreso')
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    )
  return null
}

function Sidebar({
  currentPath,
  onClose,
}: {
  currentPath: string
  onClose?: () => void
}) {
  const { signOut } = useClerk()
  const { user } = useUser()
  const router = useRouter()

  async function handleLogout() {
    await signOut()
    router.push('/')
  }

  return (
    <div className="flex flex-col h-full bg-tinta">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-papel/[0.08]">
        <a href="/" className="block cursor-pointer">
          <Image
            src="/images/Logos/imagotipov2.svg"
            alt="La Trastienda"
            width={120}
            height={40}
            className="object-contain brightness-0 invert"
            priority
          />
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Campus navigation">
        {sidebarLinks.map((link) => {
          const isActive = link.exact
            ? currentPath === link.href
            : currentPath.startsWith(link.href)
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 min-h-[44px] font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-200 cursor-pointer ${
                isActive
                  ? 'bg-papel/10 text-papel'
                  : 'text-papel/50 hover:text-papel hover:bg-papel/5'
              }`}
            >
              <NavIcon href={link.href} />
              {link.label}
            </a>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-6 border-t border-papel/[0.08] space-y-3">
        {user?.primaryEmailAddress && (
          <p className="px-3 font-sans text-[10px] text-papel/30 truncate">
            {user.primaryEmailAddress.emailAddress}
          </p>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center w-full px-3 min-h-[44px] font-mono text-[11px] text-papel/40 uppercase tracking-[0.08em] hover:text-papel/70 transition-colors duration-200 cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default function CampusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const currentPath = usePathname()

  // Login (y cualquier ruta pública futura) no lleva sidebar ni "cerrar sesión":
  // todavía no hay sesión que cerrar.
  if (currentPath === '/campus/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-papel flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 fixed left-0 top-0 bottom-0 z-20">
        <Sidebar currentPath={currentPath} />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-tinta/60"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      {sidebarOpen && (
        <aside className="md:hidden fixed left-0 top-0 bottom-0 w-56 z-50">
          <Sidebar currentPath={currentPath} onClose={() => setSidebarOpen(false)} />
        </aside>
      )}

      {/* Main */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-lino/40 bg-papel">
          <a href="/" className="block cursor-pointer">
            <Image
              src="/images/Logos/imagotipov2.svg"
              alt="La Trastienda"
              width={110}
              height={36}
              className="object-contain"
            />
          </a>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-tinta cursor-pointer"
            aria-label="Abrir menú"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </header>

        <main className="flex-1 px-6 md:px-10 py-10">{children}</main>
      </div>
    </div>
  )
}
