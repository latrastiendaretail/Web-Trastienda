/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // 'unsafe-eval' solo hace falta en desarrollo (React reconstruye stack
      // traces con eval). Next.js/React no lo usan en producción.
      // clerk.accounts.dev = instancia Development (local); clerk.latrastiendaretail.es
      // = Frontend API custom domain de la instancia Production. Se mantienen ambos
      // para que dev y prod funcionen con el mismo next.config.mjs.
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== 'production' ? " 'unsafe-eval'" : ''} https://clerk.accounts.dev https://*.clerk.accounts.dev https://clerk.latrastiendaretail.es https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com https://js.stripe.com https://app.cal.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.clerk.accounts.dev https://clerk.latrastiendaretail.es",
      "font-src 'self' https://fonts.gstatic.com https://*.clerk.accounts.dev https://clerk.latrastiendaretail.es",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://clerk.accounts.dev https://*.clerk.accounts.dev https://clerk.latrastiendaretail.es https://accounts.latrastiendaretail.es https://challenges.cloudflare.com https://js.stripe.com https://*.stripe.com https://hooks.stripe.com https://app.cal.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.clerk.accounts.dev https://clerk.accounts.dev https://clerk.latrastiendaretail.es https://api.clerk.com https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://merchant-ui-api.stripe.com https://*.stripe.com https://app.cal.com https://us.i.posthog.com https://us-assets.i.posthog.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.latrastiendaretail.es' }],
        destination: 'https://latrastiendaretail.es/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
