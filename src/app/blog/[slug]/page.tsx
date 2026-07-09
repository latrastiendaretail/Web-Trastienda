import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { BlogHeader } from '@/components/blog/BlogHeader'

export const dynamic = 'force-dynamic'

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

  if (!post) return { title: 'Post no encontrado' }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `/blog/${slug}`,
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    const isInternal = match[2].startsWith('/')
    parts.push(
      <a
        key={key++}
        href={match[2]}
        {...(!isInternal && { target: '_blank', rel: 'noopener noreferrer' })}
        className="underline hover:no-underline"
        style={{ color: 'var(--color-acento)' }}
      >
        {match[1]}
      </a>,
    )
    lastIndex = linkPattern.lastIndex
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

function renderContent(content: string) {
  return content.split('\n\n').map((block, i) => {
    const trimmed = block.trim()

    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={i} className="font-display text-xl md:text-2xl font-medium mt-10 mb-4" style={{ color: 'var(--color-tinta)' }}>
          {renderInline(trimmed.slice(4))}
        </h3>
      )
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="font-display text-2xl md:text-3xl font-medium mt-12 mb-5" style={{ color: 'var(--color-tinta)' }}>
          {renderInline(trimmed.slice(3))}
        </h2>
      )
    }

    return (
      <p key={i} className="font-sans text-lg leading-relaxed mb-6" style={{ color: 'var(--color-tinta)' }}>
        {block.split('\n').map((line, j, arr) => (
          j < arr.length - 1 ? [...renderInline(line), <br key={`br${j}`} />] : renderInline(line)
        ))}
      </p>
    )
  })
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
        <BlogHeader />

        {/* Back */}
        <div className="max-w-[700px] mx-auto px-6 pt-10">
          <Link
            href="/blog"
            className="font-mono text-xs uppercase tracking-[0.14em] transition-colors cursor-pointer"
            style={{ color: 'var(--color-cuero)' }}
          >
            ← Blog
          </Link>
        </div>

        {/* Header */}
        <header className="max-w-[700px] mx-auto px-6 pt-8 pb-12">
          {post.published_at && (
            <time
              dateTime={post.published_at}
              className="font-mono text-xs uppercase tracking-[0.14em] block mb-6"
              style={{ color: 'var(--color-cuero)' }}
            >
              {formatDate(post.published_at)}
            </time>
          )}
          <h1
            className="font-display text-3xl md:text-4xl font-medium leading-[1.15]"
            style={{ color: 'var(--color-tinta)' }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="font-sans text-lg md:text-xl mt-5 leading-relaxed" style={{ color: 'var(--color-cuero)' }}>
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Content */}
        <article className="max-w-[700px] mx-auto px-6 pb-14 border-t" style={{ borderColor: 'var(--color-lino)' }}>
          <div className="pt-10">{renderContent(post.content)}</div>
        </article>

        {/* Footer del post */}
        {post.linkedin_url && (
          <div className="max-w-[700px] mx-auto px-6 pb-16">
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
