'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function processPayment(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const destinationId = formData.get('destination_id') as string
  const bookingDate = formData.get('booking_date') as string
  const guests = parseInt(formData.get('guests') as string, 10)
  const totalPrice = parseFloat(formData.get('total_price') as string)
  const paymentMethod = formData.get('payment_method') as string

  if (!destinationId || !bookingDate || !guests || isNaN(totalPrice) || !paymentMethod) {
    throw new Error('Invalid booking data')
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      destination_id: destinationId,
      booking_date: bookingDate,
      guests,
      total_price: totalPrice,
      status: 'pending'
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
  revalidatePath('/admin/bookings')
  redirect(`/checkout/pay/${data.id}`)
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
