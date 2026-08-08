'use server'

import { createClient } from '@/utils/supabase/server'

export async function getBookedSlots(destinationId: string, date: string) {
  const supabase = await createClient()
  
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('time_slot, guests')
    .eq('destination_id', destinationId)
    .eq('booking_date', date)

  if (error) {
    console.error('Error fetching bookings:', error.message || error)
    return {}
  }

  // Aggregate guests by time_slot
  const bookedCounts: Record<string, number> = {}
  bookings.forEach(b => {
    bookedCounts[b.time_slot] = (bookedCounts[b.time_slot] || 0) + b.guests
  })

  return bookedCounts
}
