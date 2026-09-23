import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, Calendar, Users, CheckCircle, Clock } from 'lucide-react'
import QRCode from 'react-qr-code'

export default async function ETicketPage({ params }: { params: { id: string } }) {
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
        location,
        image_url
      )
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!booking) {
    return (
      <div className="bg-surface dark:bg-slate-900 min-h-screen py-10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Ticket Not Found</h1>
          <Link href="/dashboard" className="text-primary hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const isUsed = booking.status === 'used'
  const isPaid = booking.status === 'paid'
  const isPending = booking.status === 'pending'

  return (
    <div className="bg-surface dark:bg-slate-900 min-h-screen py-10 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Bookings
          </Link>
        </div>

        <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border ${isUsed ? 'border-gray-200 dark:border-slate-700 opacity-80' : 'border-primary/20'} overflow-hidden relative`}>
          
          {/* Header Section */}
          <div className="h-48 relative">
            {booking.destinations?.image_url ? (
              <Image width={800} height={600} src={booking.destinations.image_url} alt={booking.destinations.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-700"></div>
            )}
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
              <div className="bg-white/20 backdrop-blur-md self-start px-3 py-1 rounded-full text-white text-xs font-medium mb-2 border border-white/30">
                E-Ticket
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">{booking.destinations?.title}</h1>
              <p className="text-white/90 flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-1" /> {booking.destinations?.location}
              </p>
            </div>
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {isUsed ? (
                <div className="bg-slate-100 dark:bg-slate-700 text-slate-500 px-4 py-2 rounded-full font-bold flex items-center shadow-sm">
                  <CheckCircle className="w-4 h-4 mr-2" /> USED
                </div>
              ) : isPaid ? (
                <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold flex items-center shadow-sm">
                  <CheckCircle className="w-4 h-4 mr-2" /> VALID
                </div>
              ) : (
                <div className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold flex items-center shadow-sm">
                  <Clock className="w-4 h-4 mr-2" /> PENDING
                </div>
              )}
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            
            {/* Details */}
            <div className="flex-1 space-y-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Booking ID</p>
                <p className="font-mono text-lg font-medium text-foreground dark:text-white break-all">
                  {booking.id}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</p>
                  <p className="font-medium text-foreground dark:text-white flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Guests</p>
                  <p className="font-medium text-foreground dark:text-white flex items-center">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    {booking.guests} Person(s)
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-100 dark:border-slate-700 pt-4 mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Status</p>
                <p className="font-medium text-foreground dark:text-white">
                  {isPaid || isUsed ? 'Paid successfully' : 'Awaiting payment'}
                </p>
                <p className="text-lg font-bold text-foreground dark:text-white mt-1">
                  Rp {Number(booking.total_price).toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center md:border-l md:border-gray-100 dark:md:border-slate-700 md:pl-8">
              {isPaid ? (
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                  <QRCode value={booking.id} size={150} />
                  <p className="text-xs text-center text-gray-500 mt-4 max-w-[150px]">
                    Present this QR code at the entrance
                  </p>
                </div>
              ) : isUsed ? (
                <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-xl border border-gray-200 dark:border-slate-600 flex flex-col items-center justify-center w-[184px] h-[218px]">
                  <CheckCircle className="w-12 h-12 text-slate-400 mb-2" />
                  <p className="text-sm text-center font-medium text-slate-500 dark:text-slate-400">
                    Ticket has been used
                  </p>
                </div>
              ) : (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/50 flex flex-col items-center justify-center w-[184px] h-[218px]">
                  <Clock className="w-12 h-12 text-orange-400 mb-2" />
                  <p className="text-sm text-center text-orange-600 dark:text-orange-400 font-medium">
                    Please complete payment to view QR code
                  </p>
                  <Link href={`/checkout/pay/${booking.id}`} className="mt-3 text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg">
                    Pay Now
                  </Link>
                </div>
              )}
            </div>

          </div>
          
          {/* Decorative cutouts for ticket look */}
          <div className="absolute top-48 -left-4 w-8 h-8 bg-surface dark:bg-slate-900 rounded-full"></div>
          <div className="absolute top-48 -right-4 w-8 h-8 bg-surface dark:bg-slate-900 rounded-full"></div>
          
        </div>
      </div>
    </div>
  )
}
