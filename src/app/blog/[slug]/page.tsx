import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerClient()
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, published_at, cover_image')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) return { title: 'Post no encontrado — La Trastienda' }

  return {
    title: `${post.title} — La Trastienda`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? undefined,
    },
  }
}

export async function generateStaticParams() {
  const supabase = await createServerClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .eq('status', 'published')

  return (posts ?? []).map((p) => ({ slug: p.slug }))
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function renderContent(content: string) {
  return content.split('\n\n').map((paragraph, i) => (
    <p key={i} className="font-sans text-lg leading-relaxed mb-6" style={{ color: 'var(--color-tinta)' }}>
      {paragraph.split('\n').map((line, j, arr) => (
        j < arr.length - 1 ? [line, <br key={j} />] : line
      ))}
    </p>
  ))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'La Trastienda',
    },
    publisher: {
      '@type': 'Organization',
      name: 'La Trastienda',
    },
    ...(post.cover_image && { image: post.cover_image }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
            .replace(/</g, '\\u003c')
            .replace(/>/g, '\\u003e')
            .replace(/\//g, '\\u002f'),
        }}
      />
      <main className="min-h-screen" style={{ backgroundColor: 'var(--color-papel)' }}>
        {/* Back */}
        <div className="max-w-4xl mx-auto px-6 pt-10">
          <Link
            href="/blog"
            className="font-sans text-sm transition-colors"
            style={{ color: 'var(--color-cuero)' }}
          >
            ← Blog
          </Link>
        </div>

        {/* Header */}
        <header className="max-w-4xl mx-auto px-6 pt-10 pb-12 border-b" style={{ borderColor: 'var(--color-lino)' }}>
          {post.published_at && (
            <time
              dateTime={post.published_at}
              className="font-mono text-xs tracking-widest uppercase block mb-6"
              style={{ color: 'var(--color-cuero)' }}
            >
              {formatDate(post.published_at)}
            </time>
          )}
          <h1
            className="font-display text-4xl md:text-5xl font-medium leading-tight"
            style={{ color: 'var(--color-tinta)' }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="font-sans text-xl mt-4 leading-relaxed" style={{ color: 'var(--color-cuero)' }}>
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Content */}
        <article className="max-w-2xl mx-auto px-6 py-14">
          {renderContent(post.content)}
        </article>

        {/* Footer del post */}
        {post.linkedin_url && (
          <div className="max-w-2xl mx-auto px-6 pb-16">
            <div className="border-t pt-8" style={{ borderColor: 'var(--color-lino)' }}>
              <a
                href={post.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm font-medium transition-colors"
                style={{ color: 'var(--color-acento)' }}
              >
                Ver post original en LinkedIn →
              </a>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
