import { requireAdmin } from '@/lib/auth/admin'
import { createServiceClient } from '@/lib/supabase/service'
import PreviewLinkForm from './PreviewLinkForm'

export default async function AdminEnlacesPage() {
  await requireAdmin()

  const supabase = createServiceClient()
  const { data: courses } = await supabase.from('courses').select('slug, title').order('order_index')

  return (
    <div>
      <div className="mb-10">
        <span className="block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-3">Admin</span>
        <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em]">
          Enlaces de vista previa
        </h1>
        <p className="font-sans text-sm text-cuero mt-2 max-w-[60ch]">
          Genera un enlace para que alguien vea un curso (vídeos, PDF y fichas) sin iniciar sesión. Es de solo lectura,
          no da acceso a /admin, no guarda progreso y caduca solo. Quien tenga el enlace ve el curso completo: compártelo
          solo con personas de confianza.
        </p>
      </div>
      <PreviewLinkForm courses={courses ?? []} />
    </div>
  )
}
