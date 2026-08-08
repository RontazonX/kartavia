import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { QrCode, CreditCard, Wallet, ShieldCheck, ChevronRight } from 'lucide-react'
import { confirmPayment } from '../../actions'
import PaymentForm from './PaymentForm'

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the booking details
  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      *,
      destinations (
        title,
        price
      )
    `)
    .eq('id', resolvedParams.id)
    .single()

  if (!booking) {
    redirect('/dashboard')
  }

  if (booking.status === 'paid') {
    redirect('/checkout/success')
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
          <p className="text-gray-500">Complete your payment to confirm your booking.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Destination</p>
                  <p className="font-semibold text-gray-900">{booking.destinations.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="font-medium text-gray-800">{new Date(booking.booking_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Guests</p>
                  <p className="font-medium text-gray-800">{booking.guests} Person(s)</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center mb-6">
                <span className="font-medium text-gray-700">Total Price</span>
                <span className="text-xl font-bold text-brand-600">Rp {Number(booking.total_price).toLocaleString('id-ID')}</span>
              </div>
              
              <div className="flex items-center text-xs text-gray-500 justify-center">
                 <ShieldCheck className="h-4 w-4 mr-1 text-green-500" /> Secure encrypted payment
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="md:col-span-2">
            <PaymentForm bookingId={booking.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
