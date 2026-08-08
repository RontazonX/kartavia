'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createDestination(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const location = formData.get('location') as string
  const category = formData.get('category') as string
  const price = parseFloat(formData.get('price') as string)
  const duration = formData.get('duration') as string
  const description = formData.get('description') as string
  const highlightsString = formData.get('highlights') as string
  
  const highlights = highlightsString.split(',').map(h => h.trim()).filter(h => h.length > 0)
  
  const imageUrlInput = formData.get('image_url') as string
  const imageUrl = imageUrlInput || null

  const { error } = await supabase.from('destinations').insert({
    title,
    location,
    category,
    price,
    duration,
    description,
    highlights: JSON.stringify(highlights),
    image_url: imageUrl,
    rating: 0,
    reviews_count: 0
  })

  if (error) {
    console.error(error)
  }

  revalidatePath('/admin/destinations')
  revalidatePath('/explore')
  revalidatePath('/')
  redirect('/admin/destinations')
}

export async function updateDestination(id: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const location = formData.get('location') as string
  const category = formData.get('category') as string
  const price = parseFloat(formData.get('price') as string)
  const duration = formData.get('duration') as string
  const description = formData.get('description') as string
  const highlightsString = formData.get('highlights') as string
  
  const highlights = highlightsString.split(',').map(h => h.trim()).filter(h => h.length > 0)
  
  const imageUrlInput = formData.get('image_url') as string
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {
    title,
    location,
    category,
    price,
    duration,
    description,
    highlights: JSON.stringify(highlights)
  }
  
  if (imageUrlInput) {
    updateData.image_url = imageUrlInput
  }

  const { error } = await supabase.from('destinations').update(updateData).eq('id', id)

  if (error) {
    console.error(error)
  }

  revalidatePath('/admin/destinations')
  revalidatePath('/explore')
  revalidatePath(`/detail/${id}`)
  revalidatePath('/')
  redirect('/admin/destinations')
}

export async function deleteDestination(id: string) {
  const supabase = await createClient()
  
  await supabase.from('bookings').delete().eq('destination_id', id)
  await supabase.from('reviews').delete().eq('destination_id', id)
  const { error } = await supabase.from('destinations').delete().eq('id', id)
  
  if (error) console.error(error)
  
  revalidatePath('/admin/destinations')
  revalidatePath('/explore')
  revalidatePath('/')
}
