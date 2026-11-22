import { requireAdmin } from '@/lib/auth/admin'
import { getSeguimiento } from '@/lib/admin/seguimiento'

export const dynamic = 'force-dynamic'

// Evita inyección de fórmulas al abrir el CSV en Excel/Sheets
function cell(v: string | number | null | undefined): string {
  let s = v == null ? '' : String(v)
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return `"${s.replace(/"/g, '""')}"`
}

const fecha = (iso: string | null | undefined) => (iso ? iso.slice(0, 10) : '')

export async function GET() {
  await requireAdmin()
  const cursos = await getSeguimiento()

  const head = [
    'Curso', 'Nombre', 'Email', 'Inscrito', 'Completados', 'Total', 'Progreso %',
    'Última actividad', 'Terminado', 'Nº certificado', 'Fecha certificado',
  ]
  const lines = [head.map(cell).join(',')]
  for (const c of cursos) {
    for (const a of c.alumnos) {
      lines.push(
        [
          c.title, a.name, a.email, fecha(a.enrolledAt), a.completed, a.total,
          a.total ? Math.round((a.completed / a.total) * 100) : 0,
          fecha(a.lastActivity), a.finished ? 'Sí' : 'No',
          a.certificate?.code ?? '', fecha(a.certificate?.issuedAt),
        ].map(cell).join(','),
      )
    }
  }

  // BOM para que Excel respete los acentos
  return new Response('﻿' + lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="alumnos-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
