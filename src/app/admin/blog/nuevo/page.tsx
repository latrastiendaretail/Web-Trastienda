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
          {/* Contenido */}
          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="font-sans text-sm font-medium" style={{ color: 'var(--color-tinta)' }}>
              Texto del post <span style={{ color: 'var(--color-acento)' }}>*</span>
            </label>
            <p className="font-sans text-xs" style={{ color: 'var(--color-cuero)' }}>
              Pega el texto completo. La primera línea será el título.
            </p>
            <textarea
              id="content"
              name="content"
              required
              rows={16}
              placeholder={'Primera línea → título\n\nResto del texto…'}
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
