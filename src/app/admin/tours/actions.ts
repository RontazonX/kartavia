'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createTour(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const location = formData.get('location') as string
  const category = 'Tour'
  const price = parseFloat(formData.get('price') as string)
  const duration = formData.get('duration') as string
  const description = formData.get('description') as string
  const highlightsString = formData.get('highlights') as string
  const adminEcoScore = parseInt((formData.get('admin_eco_score') as string) || '0', 10)
  const partnerIdInput = formData.get('partner_id') as string
  const partnerId = partnerIdInput || null
  
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
    admin_eco_score: adminEcoScore,
    partner_id: partnerId,
    highlights: JSON.stringify(highlights),
    image_url: imageUrl,
    rating: 0,
    reviews_count: 0
  })

  if (error) {
    console.error(error)
  }

  revalidatePath('/admin/tours')
  revalidatePath('/explore')
  revalidatePath('/')
  redirect('/admin/tours')
}

export async function updateTour(id: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const location = formData.get('location') as string
  const category = 'Tour'
  const price = parseFloat(formData.get('price') as string)
  const duration = formData.get('duration') as string
  const description = formData.get('description') as string
  const highlightsString = formData.get('highlights') as string
  const adminEcoScore = parseInt((formData.get('admin_eco_score') as string) || '0', 10)
  const partnerIdInput = formData.get('partner_id') as string
  const partnerId = partnerIdInput || null
  
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
    admin_eco_score: adminEcoScore,
    partner_id: partnerId,
    highlights: JSON.stringify(highlights)
  }
  
  if (imageUrlInput && imageUrlInput.trim() !== '') {
    updateData.image_url = imageUrlInput
  }

  const { error } = await supabase.from('destinations').update(updateData).eq('id', id)

  if (error) {
    console.error(error)
  }

  revalidatePath('/admin/tours')
  revalidatePath(`/detail/${id}`)
  revalidatePath('/explore')
  revalidatePath('/')
  redirect('/admin/tours')
}

export async function deleteTour(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('destinations').delete().eq('id', id)
  
  if (error) {
    console.error(error)
  }
  
  revalidatePath('/admin/tours')
}
