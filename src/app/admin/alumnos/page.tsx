import { requireAdmin } from '@/lib/auth/admin'
import { getSeguimiento } from '@/lib/admin/seguimiento'

export const dynamic = 'force-dynamic'

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export default async function AdminAlumnosPage() {
  await requireAdmin()
  const cursos = await getSeguimiento()

  const totalAlumnos = cursos.reduce((s, c) => s + c.alumnos.length, 0)
  const totalTerminados = cursos.reduce((s, c) => s + c.alumnos.filter((a) => a.finished).length, 0)
  const totalCertificados = cursos.reduce((s, c) => s + c.alumnos.filter((a) => a.certificate).length, 0)

  return (
    <div>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-2">
            Alumnos y certificados
          </h1>
          <p className="font-sans text-[16px] text-tinta/70">
            {totalAlumnos} inscripciones · {totalTerminados} terminadas · {totalCertificados} certificados emitidos
          </p>
        </div>
        <a
          href="/admin/alumnos/export"
          className="font-sans text-[15px] font-medium text-papel bg-tinta px-5 min-h-[44px] inline-flex items-center hover:bg-acento hover:text-tinta transition-colors duration-200"
        >
          Descargar CSV
        </a>
      </header>

      {cursos.length === 0 && <p className="font-sans text-[16px] text-tinta/70">Todavía no hay inscripciones.</p>}

      {cursos.map((c) => (
        <section key={c.courseId} className="mb-14" aria-labelledby={`c-${c.courseId}`}>
          <h2 id={`c-${c.courseId}`} className="font-display text-2xl font-medium text-tinta mb-1">
            {c.title}
          </h2>
          <p className="font-sans text-[14px] text-tinta/60 mb-4">
            {c.alumnos.length} {c.alumnos.length === 1 ? 'alumno' : 'alumnos'} · {c.alumnos.filter((a) => a.finished).length} han terminado · {c.total} {c.total === 1 ? 'unidad' : 'unidades'} en el curso
          </p>

          <div className="overflow-x-auto border border-lino bg-blanco">
            <table className="w-full text-left font-sans text-[14px] min-w-[860px]">
              <thead>
                <tr className="border-b border-tinta/30 text-tinta/70">
                  <th className="font-medium px-4 py-3">Alumno</th>
                  <th className="font-medium px-4 py-3">Inscrito</th>
                  <th className="font-medium px-4 py-3">Progreso</th>
                  <th className="font-medium px-4 py-3">Última actividad</th>
                  <th className="font-medium px-4 py-3">Certificado</th>
                </tr>
              </thead>
              <tbody>
                {c.alumnos.map((a) => {
                  const pct = a.total ? Math.round((a.completed / a.total) * 100) : 0
                  return (
                    <tr key={a.userId} className="border-b border-lino last:border-b-0 align-top">
                      <td className="px-4 py-3">
                        <div className="font-medium text-tinta">{a.name || a.email || a.userId}</div>
                        {a.name && <div className="text-tinta/60">{a.email}</div>}
                      </td>
                      <td className="px-4 py-3 text-tinta/75 whitespace-nowrap">{fmt(a.enrolledAt)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-1 w-20 bg-lino" role="img" aria-label={`${pct}%`}>
                            <div className="h-full bg-acento" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-tinta/75 tabular-nums">
                            {a.completed}/{a.total}
                          </span>
                          {a.finished && <span className="text-acento-deep font-medium">Terminado</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-tinta/75 whitespace-nowrap">{fmt(a.lastActivity)}</td>
                      <td className="px-4 py-3">
                        {a.certificate ? (
                          <>
                            <div className="font-medium text-tinta tabular-nums select-all">{a.certificate.code}</div>
                            <div className="text-tinta/60">Emitido el {fmt(a.certificate.issuedAt)}</div>
                          </>
                        ) : a.finished ? (
                          <span className="text-tinta/60">Terminado, aún sin emitir</span>
                        ) : (
                          <span className="text-tinta/40">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  )
}
