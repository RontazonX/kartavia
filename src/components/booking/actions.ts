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

export async function getBulkBookedSlots(destinationIds: string[], dates: string[]) {
  const supabase = await createClient()
  
  if (!destinationIds.length || !dates.length) return {}

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('destination_id, date, guests')
    .in('destination_id', destinationIds)
    .in('date', dates)

  if (error) {
    console.error('Error fetching bulk bookings:', error.message || error)
    return {}
  }

  // Aggregate: result[destinationId][date] = totalBooked
  const result: Record<string, Record<string, number>> = {}
  
  destinationIds.forEach(id => {
    result[id] = {}
    dates.forEach(d => result[id][d] = 0)
  })

  bookings.forEach(b => {
    if (result[b.destination_id] && result[b.destination_id][b.date] !== undefined) {
      result[b.destination_id][b.date] += (b.guests || 1)
    }
  })

  return result
}

