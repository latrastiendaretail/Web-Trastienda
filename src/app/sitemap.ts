import type { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase/server'

const BASE_URL = 'https://latrastiendaretail.es'

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1 },
  { url: `${BASE_URL}/ltt-consulting`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE_URL}/blog`, changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE_URL}/inscripcion`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE_URL}/aviso-legal`, changeFrequency: 'yearly', priority: 0.2 },
  { url: `${BASE_URL}/privacidad`, changeFrequency: 'yearly', priority: 0.2 },
  { url: `${BASE_URL}/terminos`, changeFrequency: 'yearly', priority: 0.2 },
  { url: `${BASE_URL}/cookies`, changeFrequency: 'yearly', priority: 0.2 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, published_at')
    .eq('status', 'published')

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.published_at ?? undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...STATIC_ROUTES, ...postRoutes]
}
