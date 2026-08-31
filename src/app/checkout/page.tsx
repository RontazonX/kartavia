import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import CheckoutForm from './CheckoutForm'

export default async function CheckoutPage(props: { searchParams: Promise<{ destination_id: string; date: string; guests: string; total_price: string }> }) {
  const searchParams = await props.searchParams;
  const { destination_id, date, guests, total_price } = searchParams;
  
  if (!destination_id || !date || !guests || !total_price) {
    redirect('/explore')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/checkout?destination_id=${destination_id}&date=${date}&guests=${guests}&total_price=${total_price}`)
  }

  const { data: detail } = await supabase
    .from('destinations')
    .select('title, location, image_url, price')
    .eq('id', destination_id)
    .single()

  if (!detail) {
    notFound()
  }

  return (
    <CheckoutForm 
      user={user} 
      detail={detail} 
      destination_id={destination_id} 
      date={date} 
      guests={guests} 
      total_price={total_price} 
    />
  )
}
