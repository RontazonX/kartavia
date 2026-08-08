'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const firstName = formData.get('fname') as string
  const lastName = formData.get('lname') as string
  const phone = formData.get('phone') as string
  const newPassword = formData.get('newPassword') as string

  const { error } = await supabase.auth.updateUser({
    data: {
      first_name: firstName,
      last_name: lastName,
      phone: phone,
    }
  })

  if (error) {
    return { error: error.message }
  }

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
