import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { MapPin, Calendar, Users, ShieldCheck, CreditCard } from 'lucide-react'
import { processPayment } from './actions'

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
    <div className="bg-surface min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Secure Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Payment Form (Left) */}
          <div className="flex-1 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
                <ShieldCheck className="h-6 w-6 text-green-500 mr-2" />
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={user.email} disabled className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" placeholder="+62 812 3456 7890" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
                <CreditCard className="h-6 w-6 text-blue-500 mr-2" />
                Payment Method
              </h2>
              
              <form action={processPayment}>
                <input type="hidden" name="destination_id" value={destination_id} />
                <input type="hidden" name="booking_date" value={date} />
                <input type="hidden" name="guests" value={guests} />
                <input type="hidden" name="total_price" value={total_price} />
                
                <div className="space-y-4 mb-8">
                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="payment_method" value="credit_card" className="w-5 h-5 text-primary focus:ring-primary" required />
                    <span className="ml-3 font-medium text-gray-700">Credit / Debit Card</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="payment_method" value="bank_transfer" className="w-5 h-5 text-primary focus:ring-primary" required />
                    <span className="ml-3 font-medium text-gray-700">Virtual Account (Bank Transfer)</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="payment_method" value="ewallet" className="w-5 h-5 text-primary focus:ring-primary" required />
                    <span className="ml-3 font-medium text-gray-700">GoPay / OVO / Dana</span>
                  </label>
                </div>

                <button type="submit" className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 cursor-pointer">
                  Pay Rp {Number(total_price).toLocaleString('id-ID')}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary (Right) */}
          <div className="lg:w-[400px]">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
              <div className="h-32 bg-gray-200 relative">
                 {detail.image_url ? (
                   <img src={detail.image_url} alt={detail.title} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">No Image</div>
                 )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-1">{detail.title}</h3>
                <p className="text-sm text-gray-500 mb-6 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" /> {detail.location}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-3 text-primary" />
                    <span className="font-medium">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 mr-3 text-primary" />
                    <span className="font-medium">{guests} {Number(guests) === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Rp {Number(detail.price).toLocaleString('id-ID')} x {guests}</span>
                    <span>Rp {Number(total_price).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes & Fees</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-dashed border-gray-200">
                    <span className="font-bold text-foreground text-lg">Total</span>
                    <span className="font-bold text-primary text-xl">Rp {Number(total_price).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
