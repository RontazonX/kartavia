'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const dataToUpdate: any = {}
  
  if (formData.has('fname')) dataToUpdate.first_name = formData.get('fname') as string
  if (formData.has('lname')) dataToUpdate.last_name = formData.get('lname') as string
  if (formData.has('phone')) dataToUpdate.phone = formData.get('phone') as string
  if (formData.has('dob')) dataToUpdate.dob = formData.get('dob') as string
  if (formData.has('gender')) dataToUpdate.gender = formData.get('gender') as string
  if (formData.has('address')) dataToUpdate.address = formData.get('address') as string
  if (formData.has('dietary')) dataToUpdate.dietary = formData.get('dietary') as string
  if (formData.has('accommodation')) dataToUpdate.accommodation = formData.get('accommodation') as string
  
  if (formData.has('interests')) {
    const interestsStr = formData.get('interests') as string
    if (interestsStr) {
      try {
        dataToUpdate.interests = JSON.parse(interestsStr)
      } catch (e) {
        dataToUpdate.interests = []
      }
    }
  }

  const avatarUrl = formData.get('avatarUrl') as string
  if (avatarUrl) {
    dataToUpdate.avatar_url = avatarUrl
  }

  const { error } = await supabase.auth.updateUser({
    data: dataToUpdate
  })

  if (error) {
    return { error: error.message }
  }

  const newPassword = formData.get('newPassword') as string
  if (newPassword && newPassword.trim().length > 0) {
    if (newPassword.length < 6) {
      return { error: 'Password must be at least 6 characters' }
    }
    const { error: pwError } = await supabase.auth.updateUser({ password: newPassword })
    if (pwError) {
      return { error: pwError.message }
    }
  }

  revalidatePath('/', 'layout')
  return { success: true, message: 'Profile updated successfully!' }
}
