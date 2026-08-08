'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function submitBooking(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const destinationId = formData.get('destination_id') as string
  const bookingDate = formData.get('booking_date') as string
  const guests = parseInt(formData.get('guests') as string, 10)
  const totalPrice = parseFloat(formData.get('total_price') as string)

  if (!destinationId || !bookingDate || !guests || isNaN(totalPrice)) {
    return { error: 'Invalid booking data' }
  }

  const { error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      destination_id: destinationId,
      booking_date: bookingDate,
      guests,
      total_price: totalPrice,
      status: 'confirmed'
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
