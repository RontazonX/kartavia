import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Calendar, Users, CheckCircle, Clock } from 'lucide-react'
import Image from 'next/image'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch bookings with related destination
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      destinations (
        title,
        location,
        image_url
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-surface dark:bg-slate-900 min-h-screen py-10 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground dark:text-white mb-8">My Bookings</h1>
        
        {!bookings || bookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl text-center shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <h2 className="text-xl font-semibold mb-2 dark:text-white">No bookings yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't planned your next adventure.</p>
            <Link prefetch={false} href="/explore" className="inline-block bg-primary text-white font-medium px-6 py-3 rounded-full hover:bg-primary-dark transition-colors">
              Explore Jogja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col h-full hover:shadow-md transition-all">
                <div className="h-40 bg-gray-200 relative">
                   {booking.destinations?.image_url ? (
                     <Image width={800} height={600} src={booking.destinations.image_url} alt={booking.destinations.title} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                     </div>
                   )}
                   {booking.status === 'paid' ? (
                     <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-green-600 flex items-center shadow-sm">
                       <CheckCircle className="h-3 w-3 mr-1" /> Paid
                     </div>
                   ) : (
                     <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-orange-500 flex items-center shadow-sm">
                       <Clock className="h-3 w-3 mr-1" /> Pending
                     </div>
                   )}
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg text-foreground dark:text-white mb-1 line-clamp-1">{booking.destinations?.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> <span className="truncate">{booking.destinations?.location}</span>
                  </p>
                  
                  <div className="bg-surface dark:bg-slate-900 rounded-xl p-3 flex flex-col gap-2 mb-4 mt-auto">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-700 pt-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
                    <span className="font-bold text-foreground dark:text-white">Rp {Number(booking.total_price).toLocaleString('id-ID')}</span>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <div className="mt-4">
                      <Link prefetch={false} href={`/checkout/pay/${booking.id}`} className="block text-center bg-brand-50 text-brand-600 hover:bg-brand-100 font-medium py-2 rounded-lg transition-colors">
                        Pay Now
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
