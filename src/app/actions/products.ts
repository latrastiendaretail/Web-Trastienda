'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'
import { createServiceClient } from '@/lib/supabase/service'
import { stripe } from '@/lib/stripe'

export async function setCourseStatus(
  courseId: string,
  status: 'published' | 'coming_soon',
): Promise<void> {
  await requireAdmin()
  const supabase = createServiceClient()
  await supabase.from('courses').update({ status }).eq('id', courseId)
  revalidatePath('/admin/productos')
  revalidatePath('/campus/cursos')
}

export async function setCoursePrice(courseId: string, priceEuros: number): Promise<void> {
  await requireAdmin()

  if (priceEuros <= 0) return

  const supabase = createServiceClient()
  const { data: course } = await supabase
    .from('courses')
    .select('id, title, stripe_product_id, stripe_price_id')
    .eq('id', courseId)
    .single()

  if (!course) return

  try {
    const priceCents = Math.round(priceEuros * 100)

    if (course.stripe_price_id) {
      await stripe.prices.update(course.stripe_price_id, { active: false })
    }

    let stripeProductId = course.stripe_product_id
    if (!stripeProductId) {
      const product = await stripe.products.create({
        name: course.title,
        metadata: { course_id: courseId },
      })
      stripeProductId = product.id
    }

    const stripePrice = await stripe.prices.create({
      product: stripeProductId,
      unit_amount: priceCents,
      currency: 'eur',
    })

    await supabase
      .from('courses')
      .update({
        price_cents: priceCents,
        stripe_product_id: stripeProductId,
        stripe_price_id: stripePrice.id,
      })
      .eq('id', courseId)

    revalidatePath('/admin/productos')
    revalidatePath('/campus/cursos')
  } catch (err) {
    console.error('[setCoursePrice]', err)
  }
}

export async function removeCoursePrice(courseId: string): Promise<void> {
  await requireAdmin()

  const supabase = createServiceClient()
  const { data: course } = await supabase
    .from('courses')
    .select('stripe_price_id')
    .eq('id', courseId)
    .single()

  try {
    if (course?.stripe_price_id) {
      await stripe.prices.update(course.stripe_price_id, { active: false })
    }

    await supabase
      .from('courses')
      .update({ price_cents: null, stripe_price_id: null })
      .eq('id', courseId)

    revalidatePath('/admin/productos')
    revalidatePath('/campus/cursos')
  } catch (err) {
    console.error('[removeCoursePrice]', err)
  }
}
