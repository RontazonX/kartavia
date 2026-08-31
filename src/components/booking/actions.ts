'use server'

import { createClient } from '@/utils/supabase/server'

export async function getBookedSlots(destinationId: string, date: string) {
  const supabase = await createClient()
  
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('guests')
    .eq('destination_id', destinationId)
    .eq('date', date)

  if (error) {
    console.error('Error fetching bookings:', error.message || error)
    return {}
  }

  // Aggregate all guests for the date
  let totalBooked = 0
  bookings.forEach(b => {
    totalBooked += b.guests
  })

  return totalBooked
}
