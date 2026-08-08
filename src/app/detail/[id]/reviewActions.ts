'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to review' }
  }

  const destinationId = formData.get('destination_id') as string
  const rating = parseInt(formData.get('rating') as string, 10)
  const comment = formData.get('comment') as string

  if (!destinationId || !rating || !comment) {
    return { error: 'Missing fields' }
  }

  const { error: insertError } = await supabase.from('reviews').insert({
    user_id: user.id,
    destination_id: destinationId,
    rating,
    comment
  })

  if (insertError) {
    return { error: insertError.message }
  }

  // Update destination average rating
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('destination_id', destinationId)

  if (reviews && reviews.length > 0) {
    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0)
    const averageRating = (totalRating / reviews.length).toFixed(1)
    
    await supabase.from('destinations').update({
      rating: parseFloat(averageRating),
      reviews_count: reviews.length
    }).eq('id', destinationId)
  }

  revalidatePath(`/detail/${destinationId}`)
  return { success: true }
}
