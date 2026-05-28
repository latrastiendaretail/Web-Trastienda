import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Blog — La Trastienda',
  description: 'Reflexiones, aprendizajes y perspectivas sobre el sector retail, la formación y el impacto social. Por el equipo de La Trastienda.',
  openGraph: {
    title: 'Blog — La Trastienda',
    description: 'Reflexiones sobre retail, formación e impacto social.',
    type: 'website',
  },
}

export const revalidate = 3600

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPage() {
  const supabase = await createServerClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, published_at, linkedin_url')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-papel)' }}>
      {/* Header */}
      <section className="border-b" style={{ borderColor: 'var(--color-lino)' }}>
        <div className="max-w-4xl mx-auto px-6 py-20">
          <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--color-acento)' }}>
            Blog
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-medium leading-tight mb-6" style={{ color: 'var(--color-tinta)' }}>
            El comercio,<br />desde dentro.
          </h1>
          <p className="font-sans text-lg max-w-xl" style={{ color: 'var(--color-cuero)' }}>
            Reflexiones sobre retail, formación profesional e impacto social.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        {!posts || posts.length === 0 ? (
          <p className="font-sans text-base" style={{ color: 'var(--color-cuero)' }}>
            Próximamente.
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--color-lino)' }}>
            {posts.map((post) => (
              <article key={post.id} className="py-10 group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1 min-w-0">
                      {post.published_at && (
                        <time
                          dateTime={post.published_at}
                          className="font-mono text-xs tracking-widest uppercase block mb-3"
                          style={{ color: 'var(--color-cuero)' }}
                        >
                          {formatDate(post.published_at)}
                        </time>
                      )}
                      <h2
                        className="font-display text-2xl md:text-3xl font-medium leading-snug mb-3 transition-colors"
                        style={{ color: 'var(--color-tinta)' }}
                      >
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="font-sans text-base leading-relaxed line-clamp-3" style={{ color: 'var(--color-cuero)' }}>
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <span
                      className="hidden md:block shrink-0 font-sans text-sm font-medium mt-1 transition-transform group-hover:translate-x-1"
                      style={{ color: 'var(--color-acento)' }}
                    >
                      Leer →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
