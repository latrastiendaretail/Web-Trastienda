import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { env } from '@/lib/env'

// Redis compartido vía integración Upstash (Vercel Marketplace).
// La integración usa el prefijo KV_ (no UPSTASH_), así que Redis.fromEnv()
// no sirve aquí — hay que pasar las credenciales explícitas.
const redis = new Redis({
  url: env('KV_REST_API_URL')!,
  token: env('KV_REST_API_TOKEN')!,
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

/**
 * Comprueba el límite. Si Redis no responde (base borrada, red, credenciales), deja
 * pasar la petición en vez de romper el formulario: el honeypot y las validaciones
 * siguen protegiendo, y el fallo queda en los logs.
 */
export async function withinLimit(limiter: Ratelimit, key: string): Promise<boolean> {
  try {
    const { success } = await limiter.limit(key)
    return success
  } catch (err) {
    console.error('[ratelimit] Redis no disponible, se permite la petición', err)
    return true
  }
}
