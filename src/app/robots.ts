import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = 'https://latrastiendaretail.es'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/campus', '/api', '/sso-callback', '/compra/exito'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
