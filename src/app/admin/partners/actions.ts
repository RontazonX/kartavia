'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPartner(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const location = formData.get('location') as string
  const instagram_handle = formData.get('instagram_handle') as string
  const logo_url = formData.get('logo_url') as string
  const banner_url = formData.get('banner_url') as string

  const { error } = await supabase.from('partners').insert({
    name,
    description,
    location,
    instagram_handle,
    logo_url,
    banner_url
  })

  if (error) {
    console.error(error)
  }

  revalidatePath('/admin/partners')
  revalidatePath('/explore')
  revalidatePath('/')
  redirect('/admin/partners')
}

export async function updatePartner(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const location = formData.get('location') as string
  const instagram_handle = formData.get('instagram_handle') as string
  const logo_url = formData.get('logo_url') as string
  const banner_url = formData.get('banner_url') as string

  const { error } = await supabase.from('partners').update({
    name,
    description,
    location,
    instagram_handle,
    logo_url,
    banner_url
  }).eq('id', id)

  if (error) {
    console.error(error)
  }

  revalidatePath('/admin/partners')
  revalidatePath(`/partner/${id}`)
  revalidatePath('/explore')
  revalidatePath('/')
  redirect('/admin/partners')
}

export async function deletePartner(id: string) {
  const supabase = await createClient()
  
  // Unlink destinations first
  await supabase.from('destinations').update({ partner_id: null }).eq('partner_id', id)
  
  const { error } = await supabase.from('partners').delete().eq('id', id)
  
  if (error) console.error(error)
  
  revalidatePath('/admin/partners')
}
