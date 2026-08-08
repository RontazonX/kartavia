'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateBookingStatus(bookingId: string, newStatus: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', bookingId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/kanban')
  revalidatePath('/admin/bookings')
  revalidatePath('/admin')
  revalidatePath('/dashboard')
  return { success: true }
}
