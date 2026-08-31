'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function processPayment(prevState: any, formData: FormData): Promise<{ success: boolean; bookingId?: string; method?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  const destinationId = formData.get('destination_id') as string
  const bookingDate = formData.get('booking_date') as string
  const guests = parseInt(formData.get('guests') as string, 10)
  const totalPrice = parseFloat(formData.get('total_price') as string)
  const paymentMethod = formData.get('payment_method') as string

  if (!destinationId || !bookingDate || !guests || isNaN(totalPrice) || !paymentMethod) {
    return { success: false, error: 'Invalid booking data' }
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      destination_id: destinationId,
      date: bookingDate,
      guests,
      total_price: totalPrice,
      status: 'pending'
    })
    .select('id')
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, bookingId: data.id, method: paymentMethod }
}

export async function confirmPayment(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'paid' })
    .eq('id', bookingId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
  revalidatePath('/admin/bookings')
  redirect('/checkout/success')
}
