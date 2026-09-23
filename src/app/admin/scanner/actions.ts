'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function checkTicket(bookingId: string) {
  const supabase = await createClient()

  // First verify admin auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  const { data: adminData } = await supabase.from('admins').select('*').eq('email', user.email).single()
  if (!adminData) return { error: 'Unauthorized' }

  // Fetch booking
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      *,
      destinations (title),
      users (email, raw_user_meta_data)
    `)
    .eq('id', bookingId)
    .single()

  if (error || !booking) {
    return { error: 'Ticket not found. Invalid Booking ID.' }
  }

  return { data: booking }
}

export async function markTicketUsed(bookingId: string) {
  const supabase = await createClient()

  // Verify admin auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  const { data: adminData } = await supabase.from('admins').select('*').eq('email', user.email).single()
  if (!adminData) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'used' })
    .eq('id', bookingId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/scanner')
  revalidatePath(`/dashboard/ticket/${bookingId}`)
  return { success: true }
}
