import { requireAdmin } from '@/lib/auth/admin'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-papel)' }}>
      <div className="border-b border-lino/50" style={{ backgroundColor: 'var(--color-blanco)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-8">
          <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.16em]">
            La Trastienda · Admin
          </span>
          <nav className="flex gap-6">
            <a
              href="/admin/usuarios"
              className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.12em] transition-colors duration-200"
            >
              Usuarios
            </a>
            <a
              href="/admin/blog/nuevo"
              className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.12em] transition-colors duration-200"
            >
              Blog
            </a>
          </nav>
          <div className="ml-auto">
            <a
              href="/campus"
              className="font-mono text-[10px] text-cuero/50 hover:text-cuero uppercase tracking-[0.1em] transition-colors duration-200"
            >
              ← Campus
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {children}
      </div>
    </div>
  )
}
