import Link from 'next/link'
import ManageCookiesButton from '@/components/ManageCookiesButton'

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

const legalLinks = [
  { href: '/privacidad', label: 'Privacidad' },
  { href: '/terminos', label: 'Términos' },
  { href: '/cookies', label: 'Cookies' },
  { href: '/aviso-legal', label: 'Aviso Legal' },
]

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-papel">
      {/* Nav */}
      <nav className="border-b border-lino/40 bg-papel sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-lg font-medium text-tinta hover:text-acento transition-colors duration-200"
          >
            La Trastienda
          </Link>
          <Link
            href="/"
            className="font-sans text-[10px] text-cuero uppercase tracking-[0.12em] hover:text-tinta transition-colors duration-200"
          >
            ← Inicio
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="py-20 md:py-28 border-b border-lino/40">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <span className="block font-sans text-[9px] text-cuero uppercase tracking-[0.16em] mb-6">
            Legal
          </span>
          <h1
            className="font-display font-medium text-tinta leading-[1.05] tracking-[-0.02em] mb-6"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
          >
            {title}
          </h1>
          <p className="font-sans text-[10px] text-cuero/70 uppercase tracking-[0.1em]">
            Última actualización: {lastUpdated}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-tinta py-8 border-t border-papel/5">
        <div className="max-w-4xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="block font-display text-lg font-medium text-papel leading-none">
              La Trastienda
            </span>
            <span className="block font-sans text-[9px] text-papel/40 uppercase tracking-[0.14em] mt-1">
              Retail con propósito
            </span>
          </div>
          <div className="flex flex-wrap gap-5">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-[9px] text-papel/40 hover:text-papel/70 uppercase tracking-[0.1em] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <ManageCookiesButton className="font-sans text-[9px] text-papel/40 hover:text-papel/70 uppercase tracking-[0.1em] transition-colors duration-200" />
          </div>
          <p className="font-sans text-[9px] text-papel/30 tracking-[0.06em]">
            © 2026 La Trastienda
          </p>
        </div>
      </footer>
    </div>
  )
}
