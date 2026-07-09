'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createPost } from '@/app/actions/posts'

const initialState = undefined as Awaited<ReturnType<typeof createPost>> | undefined

export default function NuevoPostPage() {
  const [result, action, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => createPost(formData),
    initialState,
  )
  const router = useRouter()

  useEffect(() => {
    if (result?.success) {
      router.push(`/blog/${result.slug}`)
    }
  }, [result, router])

  return (
    <main className="min-h-screen flex items-start justify-center px-6 py-20" style={{ backgroundColor: 'var(--color-papel)' }}>
      <div className="w-full max-w-2xl">
        <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--color-acento)' }}>
          Admin
        </p>
        <h1 className="font-display text-4xl font-medium mb-10" style={{ color: 'var(--color-tinta)' }}>
          Nuevo post
        </h1>

        <form action={action} className="flex flex-col gap-6">
          {/* SEO overrides — opcional, si no se rellenan se derivan del contenido */}
          <div className="grid gap-4 p-4 border" style={{ borderColor: 'var(--color-lino)' }}>
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--color-acento)' }}>
              SEO (opcional — si se deja vacío, se deriva del texto)
            </p>
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="font-sans text-xs font-medium" style={{ color: 'var(--color-tinta)' }}>
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                maxLength={120}
                className="w-full rounded-none border px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--color-blanco)', borderColor: 'var(--color-lino)', color: 'var(--color-tinta)', '--tw-ring-color': 'var(--color-acento)' } as React.CSSProperties}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="excerpt" className="font-sans text-xs font-medium" style={{ color: 'var(--color-tinta)' }}>
                Excerpt / meta description
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                maxLength={200}
                className="w-full rounded-none border px-4 py-2.5 font-sans text-sm resize-y focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--color-blanco)', borderColor: 'var(--color-lino)', color: 'var(--color-tinta)', '--tw-ring-color': 'var(--color-acento)' } as React.CSSProperties}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="slug" className="font-sans text-xs font-medium" style={{ color: 'var(--color-tinta)' }}>
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                placeholder="que-hace-un-mando-intermedio-en-retail"
                className="w-full rounded-none border px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--color-blanco)', borderColor: 'var(--color-lino)', color: 'var(--color-tinta)', '--tw-ring-color': 'var(--color-acento)' } as React.CSSProperties}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="cover_image" className="font-sans text-xs font-medium" style={{ color: 'var(--color-tinta)' }}>
                URL portada (og:image) <span className="font-normal" style={{ color: 'var(--color-cuero)' }}>(opcional)</span>
              </label>
              <input
                id="cover_image"
                name="cover_image"
                type="url"
                className="w-full rounded-none border px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--color-blanco)', borderColor: 'var(--color-lino)', color: 'var(--color-tinta)', '--tw-ring-color': 'var(--color-acento)' } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Contenido */}
          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="font-sans text-sm font-medium" style={{ color: 'var(--color-tinta)' }}>
              Texto del post <span style={{ color: 'var(--color-acento)' }}>*</span>
            </label>
            <p className="font-sans text-xs" style={{ color: 'var(--color-cuero)' }}>
              Pega el texto completo. Si no rellenaste el Title arriba, la primera línea hará de título.
              Usa &quot;## &quot; al inicio de una línea para un H2 y &quot;### &quot; para un H3.
            </p>
            <textarea
              id="content"
              name="content"
              required
              rows={16}
              placeholder={'## Un subtítulo así\n\nTexto del párrafo…'}
              className="w-full rounded-none border px-4 py-3 font-sans text-sm leading-relaxed resize-y focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--color-blanco)',
                borderColor: 'var(--color-lino)',
                color: 'var(--color-tinta)',
                '--tw-ring-color': 'var(--color-acento)',
              } as React.CSSProperties}
            />
          </div>

          {/* URL LinkedIn */}
          <div className="flex flex-col gap-2">
            <label htmlFor="linkedin_url" className="font-sans text-sm font-medium" style={{ color: 'var(--color-tinta)' }}>
              URL de LinkedIn <span className="font-normal" style={{ color: 'var(--color-cuero)' }}>(opcional)</span>
            </label>
            <input
              id="linkedin_url"
              name="linkedin_url"
              type="url"
              placeholder="https://www.linkedin.com/posts/..."
              className="w-full rounded-none border px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--color-blanco)',
                borderColor: 'var(--color-lino)',
                color: 'var(--color-tinta)',
                '--tw-ring-color': 'var(--color-acento)',
              } as React.CSSProperties}
            />
          </div>

          {/* Error */}
          {result && !result.success && (
            <p className="font-sans text-sm" style={{ color: '#c0392b' }}>
              {result.error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="self-start px-8 py-3 font-sans text-sm font-medium transition-opacity disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-tinta)', color: 'var(--color-papel)' }}
          >
            {isPending ? 'Publicando…' : 'Publicar'}
          </button>
        </form>
      </div>
    </main>
  )
}
