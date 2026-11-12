import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/service'
import BloqueView from '@/components/campus/BloqueView'

interface Props {
  params: Promise<{ slug: string; modulo: string }>
}

export default async function BloquePage({ params }: Props) {
  const { slug, modulo } = await params
  const { userId } = await auth()
  if (!userId) notFound()

  const supabase = createServiceClient()
  const { data: course } = await supabase.from('courses').select('id').eq('slug', slug).single()
  if (!course) notFound()

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', course.id)
    .maybeSingle()
  if (!enrollment) notFound()

  return <BloqueView slug={slug} modulo={modulo} userId={userId} />
}
