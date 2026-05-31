import { clerkClient } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/service'

export default async function AdminUsuariosPage() {
  const clerk = await clerkClient()
  const { data: users } = await clerk.users.getUserList({ limit: 200, orderBy: '-created_at' })

  const supabase = createServiceClient()
  const { data: allEnrollments } = await supabase.from('enrollments').select('user_id, course_id')

  const countByUser = (allEnrollments ?? []).reduce<Record<string, number>>((acc, e) => {
    acc[e.user_id] = (acc[e.user_id] ?? 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div className="mb-10">
        <span className="block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-3">
          Panel de administración
        </span>
        <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em]">
          Usuarios
        </h1>
        <p className="font-sans text-sm text-cuero mt-2">{users.length} cuenta{users.length !== 1 ? 's' : ''} registradas</p>
      </div>

      <div className="border border-lino/50">
        <div className="grid grid-cols-[1fr_120px_140px] gap-4 px-6 py-3 border-b border-lino/40" style={{ backgroundColor: 'var(--color-lino)', opacity: 1 }}>
          <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em]">Usuario</span>
          <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em]">Cursos</span>
          <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em]"></span>
        </div>

        {users.length === 0 && (
          <div className="px-6 py-12 text-center bg-blanco">
            <p className="font-sans text-sm text-cuero/60">No hay usuarios registrados.</p>
          </div>
        )}

        {users.map((user) => {
          const email = user.emailAddresses[0]?.emailAddress ?? '—'
          const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || null
          const isAdmin = (user.publicMetadata as { role?: string })?.role === 'admin'
          const enrolled = countByUser[user.id] ?? 0

          return (
            <div
              key={user.id}
              className="grid grid-cols-[1fr_120px_140px] gap-4 items-center px-6 py-4 border-b border-lino/30 last:border-b-0 bg-blanco"
            >
              <div className="min-w-0">
                {name && (
                  <span className="block font-sans text-sm font-medium text-tinta truncate">{name}</span>
                )}
                <span className="font-mono text-[10px] text-cuero truncate block">{email}</span>
                {isAdmin && (
                  <span className="inline-block mt-1 font-mono text-[9px] text-acento border border-acento/40 px-1.5 py-0.5 uppercase tracking-[0.08em]">
                    Admin
                  </span>
                )}
              </div>

              <span className="font-mono text-[11px] text-cuero tabular-nums">
                {enrolled} {enrolled === 1 ? 'curso' : 'cursos'}
              </span>

              <a
                href={`/admin/usuarios/${user.id}`}
                className="font-mono text-[10px] text-tinta border border-tinta px-4 py-2 uppercase tracking-[0.08em] hover:bg-tinta hover:text-papel transition-colors duration-200 text-center"
              >
                Gestionar →
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
