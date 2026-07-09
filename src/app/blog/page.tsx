import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { BlogHeader } from '@/components/blog/BlogHeader'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Reflexiones, aprendizajes y perspectivas sobre el sector retail, la formación y el impacto social. Por el equipo de La Trastienda.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — La Trastienda',
    description: 'Reflexiones sobre retail, formación e impacto social.',
    url: '/blog',
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
      <BlogHeader />

      {/* Hero */}
      <section className="border-b" style={{ borderColor: 'var(--color-lino)' }}>
        <div className="max-w-[980px] mx-auto px-6 py-16 md:py-20">
          <p
            className="font-mono text-xs uppercase tracking-[0.2em] mb-5"
            style={{ color: 'var(--color-acento)' }}
          >
            Blog
          </p>
          <h1
            className="font-display text-4xl md:text-5xl font-medium leading-[1.1] mb-5"
            style={{ color: 'var(--color-tinta)' }}
          >
            El comercio,<br />desde dentro.
          </h1>
          <p className="font-sans text-lg max-w-xl leading-relaxed" style={{ color: 'var(--color-cuero)' }}>
            Reflexiones sobre retail, formación profesional e impacto social.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="max-w-[980px] mx-auto px-6">
        {!posts || posts.length === 0 ? (
          <p className="font-sans text-base py-16" style={{ color: 'var(--color-cuero)' }}>
            Próximamente.
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--color-lino)' }}>
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block py-10 cursor-pointer">
                <div className="flex items-center justify-between gap-6 mb-4">
                  {post.published_at && (
                    <time
                      dateTime={post.published_at}
                      className="font-mono text-xs uppercase tracking-[0.14em]"
                      style={{ color: 'var(--color-cuero)' }}
                    >
                      {formatDate(post.published_at)}
                    </time>
                  )}
                  <span
                    className="shrink-0 font-sans text-sm font-medium transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: 'var(--color-acento)' }}
                  >
                    Leer →
                  </span>
                </div>
                <h2
                  className="font-display text-2xl md:text-3xl font-medium leading-snug mb-3"
                  style={{ color: 'var(--color-tinta)' }}
                >
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="font-sans text-base leading-relaxed line-clamp-2 max-w-[64ch]" style={{ color: 'var(--color-cuero)' }}>
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
      <div className="h-16" />
    </main>
  )
}
