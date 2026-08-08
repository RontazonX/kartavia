'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitWasteReport(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to submit a report.' }
  }

  const destinationId = formData.get('destination_id') as string
  const description = formData.get('description') as string
  const file = formData.get('image') as File

  if (!file || file.size === 0) {
    return { error: 'Please select an image to upload.' }
  }

  try {
    // 1. Upload image to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('waste-reports')
      .upload(`public/${fileName}`, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('waste-reports')
      .getPublicUrl(`public/${fileName}`)

    // 2. Insert record to database
    const { error: insertError } = await supabase
      .from('waste_reports')
      .insert({
        destination_id: destinationId,
        user_id: user.id,
        image_url: publicUrl,
        description: description,
        status: 'pending'
      })

    if (insertError) throw insertError

    return { success: true }
  } catch (err: any) {
    console.error('Error submitting waste report:', err)
    return { error: err.message || 'An unexpected error occurred.' }
  }
}
