import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Redis compartido vía integración Upstash (Vercel Marketplace).
// La integración usa el prefijo KV_ (no UPSTASH_), así que Redis.fromEnv()
// no sirve aquí — hay que pasar las credenciales explícitas.
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Sliding window: cuota real compartida entre todas las instancias
// serverless (sustituye el Map en memoria, inefectivo en Vercel).
export const contactRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'ratelimit:contact',
  analytics: true,
})

export const leadsRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'ratelimit:leads',
  analytics: true,
})
