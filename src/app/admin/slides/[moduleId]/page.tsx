import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import { createServiceClient } from '@/lib/supabase/service'
import { extractVideoId } from '@/lib/youtube'
import { uploadSlideImages, addSlideVideo, removeSlideItem, moveSlideItem, type RawSlide } from '@/app/actions/slides'

interface Props {
  params: Promise<{ moduleId: string }>
}

export default async function AdminModuleSlidesPage({ params }: Props) {
  await requireAdmin()
  const { moduleId } = await params

  const supabase = createServiceClient()
  const { data: mod } = await supabase
    .from('modules')
    .select('id, title, order_index, is_bonus, slides, courses(title, slug)')
    .eq('id', moduleId)
    .single()

  if (!mod) notFound()

  const course = mod.courses as unknown as { title: string; slug: string } | null
  const slides = (mod.slides ?? []) as RawSlide[]

  const signedByPath = new Map<string, string>()
  const imagePaths = slides.filter((s): s is string => typeof s === 'string')
  if (imagePaths.length > 0) {
    const signed = await Promise.all(
      imagePaths.map((p) => supabase.storage.from('campus-resources').createSignedUrl(p, 60 * 10)),
    )
    imagePaths.forEach((p, i) => {
      const url = signed[i].data?.signedUrl
      if (url) signedByPath.set(p, url)
    })
  }

  return (
    <div>
      <a
        href="/admin/slides"
        className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200"
      >
        ← Diapositivas
      </a>

      <div className="mt-6 mb-10">
        <span className="block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-3">
          {course?.title} · {mod.is_bonus ? 'Bonus Track' : `Bloque ${mod.order_index}`}
        </span>
        <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em]">
          {mod.title}
        </h1>
      </div>

      {/* Lista ordenada */}
      <div className="space-y-3 mb-10">
        {slides.length === 0 && (
          <p className="font-sans text-sm text-cuero/60">Todavía no hay diapositivas en este módulo.</p>
        )}
        {slides.map((item, index) => {
          const isVideo = typeof item !== 'string'
          const thumb = typeof item === 'string' ? signedByPath.get(item) : null
          const videoId = isVideo ? extractVideoId((item as { url: string }).url) : null

          return (
            <div
              key={index}
              className="flex items-center gap-4 bg-blanco border border-lino/50 px-5 py-4"
            >
              <span className="font-mono text-[10px] text-cuero/60 w-6 shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="w-24 aspect-video bg-tinta shrink-0 overflow-hidden flex items-center justify-center">
                {isVideo ? (
                  videoId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://i.ytimg.com/vi/${videoId}/default.jpg`}
                      alt="Miniatura vídeo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-mono text-[8px] text-red-400 px-1 text-center">URL inválida</span>
                  )
                ) : thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-mono text-[8px] text-papel/40">sin vista previa</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span className="font-mono text-[9px] text-acento uppercase tracking-[0.1em] block mb-1">
                  {isVideo ? 'Vídeo YouTube' : 'Imagen'}
                </span>
                <span className="font-sans text-[12px] text-tinta truncate block">
                  {isVideo ? (item as { url: string }).url : item}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <form action={moveSlideItem.bind(null, moduleId, index, -1)}>
                  <button
                    type="submit"
                    disabled={index === 0}
                    className="font-mono text-[11px] text-cuero hover:text-tinta uppercase disabled:opacity-20 disabled:cursor-not-allowed w-8 h-8 border border-lino/60 flex items-center justify-center"
                  >
                    ↑
                  </button>
                </form>
                <form action={moveSlideItem.bind(null, moduleId, index, 1)}>
                  <button
                    type="submit"
                    disabled={index === slides.length - 1}
                    className="font-mono text-[11px] text-cuero hover:text-tinta uppercase disabled:opacity-20 disabled:cursor-not-allowed w-8 h-8 border border-lino/60 flex items-center justify-center"
                  >
                    ↓
                  </button>
                </form>
                <form action={removeSlideItem.bind(null, moduleId, index)}>
                  <button
                    type="submit"
                    className="font-mono text-[10px] text-cuero hover:text-red-500 uppercase tracking-[0.08em] px-3 h-8 border border-lino/60 hover:border-red-400 transition-colors duration-200"
                  >
                    Quitar
                  </button>
                </form>
              </div>
            </div>
          )
        })}
      </div>

      {/* Añadir imágenes */}
      <div className="border border-lino/40 bg-blanco px-6 py-5 mb-6">
        <p className="font-mono text-[10px] text-cuero uppercase tracking-[0.1em] mb-3">
          Añadir diapositivas (imagen)
        </p>
        <p className="font-sans text-[11px] text-cuero/70 mb-4 leading-relaxed">
          Exporta el .pptx a PNG/JPG (Archivo → Exportar → Cambiar tipo de archivo → imagen, todas las
          diapositivas) y sube aquí los archivos. Se añaden al final del orden actual.
        </p>
        <form
          action={async (fd: FormData) => {
            'use server'
            await uploadSlideImages(moduleId, fd)
          }}
          className="flex items-center gap-3 flex-wrap"
        >
          <input
            name="images"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            required
            className="font-sans text-[12px] text-tinta"
          />
          <button
            type="submit"
            className="font-mono text-[10px] uppercase tracking-[0.08em] px-4 min-h-[36px] bg-tinta text-papel hover:bg-acento hover:text-tinta transition-colors duration-200 shrink-0"
          >
            Subir
          </button>
        </form>
      </div>

      {/* Añadir vídeo */}
      <div className="border border-lino/40 bg-blanco px-6 py-5">
        <p className="font-mono text-[10px] text-cuero uppercase tracking-[0.1em] mb-3">
          Intercalar vídeo de YouTube
        </p>
        <form
          action={async (fd: FormData) => {
            'use server'
            const url = (fd.get('url') as string)?.trim()
            if (url) await addSlideVideo(moduleId, url)
          }}
          className="flex items-center gap-3 flex-wrap"
        >
          <input
            name="url"
            type="url"
            placeholder="https://youtu.be/..."
            required
            className="flex-1 min-w-[240px] font-mono text-[11px] text-tinta bg-papel border border-lino/60 px-3 py-2.5 focus:outline-none"
          />
          <button
            type="submit"
            className="font-mono text-[10px] uppercase tracking-[0.08em] px-4 min-h-[36px] bg-tinta text-papel hover:bg-acento hover:text-tinta transition-colors duration-200 shrink-0"
          >
            Añadir al final
          </button>
        </form>
      </div>
    </div>
  )
}
