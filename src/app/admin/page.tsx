import { createClient } from '@/utils/supabase/server'
import { Users, MapPin, DollarSign, ArrowUp, ArrowDown, Eye } from 'lucide-react'
import RevenueChart from '@/components/admin/RevenueChart'
import AnalyticsChart from '@/components/admin/AnalyticsChart'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { count: destCount } = await supabase.from('destinations').select('*', { count: 'exact', head: true })
  const { count: bookCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true })
  
  const { data: bookings } = await supabase.from('bookings').select('*, destinations(title)')
  const totalRevenue = bookings?.reduce((acc, curr) => acc + Number(curr.total_price), 0) || 0
  
  // Sort bookings by date descending for recent bookings
  const recentBookings = [...(bookings || [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-8">
        {/* Card 1 */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-7.5 shadow-sm transition-colors">
          <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 h-12 w-12 text-brand-500 mb-4">
            <Eye className="h-6 w-6" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="font-bold text-black dark:text-white text-2xl">
                3.456K
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-success-500">
              0.43%
              <ArrowUp className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-7.5 shadow-sm transition-colors">
          <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 h-12 w-12 text-brand-500 mb-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="font-bold text-black dark:text-white text-2xl">
                Rp {(totalRevenue / 1000000).toFixed(1)}M
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Profit</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-success-500">
              4.35%
              <ArrowUp className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-7.5 shadow-sm transition-colors">
          <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 h-12 w-12 text-brand-500 mb-4">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="font-bold text-black dark:text-white text-2xl">
                {destCount}
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Destinations</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-success-500">
              2.59%
              <ArrowUp className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-7.5 shadow-sm transition-colors">
          <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 h-12 w-12 text-brand-500 mb-4">
            <Users className="h-6 w-6" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="font-bold text-black dark:text-white text-2xl">
                {bookCount}
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bookings</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-error-500">
              0.95%
              <ArrowDown className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5 mb-8">
        <div className="col-span-12 xl:col-span-8">
          <RevenueChart data={bookings || []} />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <AnalyticsChart data={bookings || []} />
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 pt-6 pb-2.5 shadow-sm sm:px-7.5 xl:pb-1 transition-colors">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Recent Bookings
        </h4>

        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-t-lg bg-gray-50 dark:bg-slate-800 sm:grid-cols-5 border-b border-gray-200 dark:border-slate-700">
            <div className="p-4">
              <h5 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">Destination</h5>
            </div>
            <div className="p-4 text-center">
              <h5 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">Date</h5>
            </div>
            <div className="p-4 text-center">
              <h5 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">Guests</h5>
            </div>
            <div className="hidden p-4 text-center sm:block">
              <h5 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">Price</h5>
            </div>
            <div className="hidden p-4 text-center sm:block">
              <h5 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">Status</h5>
            </div>
          </div>

          {recentBookings.length > 0 ? (
            recentBookings.map((booking, key) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 ${
                  key === recentBookings.length - 1 ? '' : 'border-b border-gray-100 dark:border-slate-800'
                }`}
                key={booking.id}
              >
                <div className="flex items-center gap-3 p-4">
                  <p className="hidden text-black dark:text-white font-medium sm:block">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(booking.destinations as any)?.title}
                  </p>
                </div>

                <div className="flex items-center justify-center p-4">
                  <p className="text-black dark:text-white">{new Date(booking.booking_date).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center justify-center p-4">
                  <p className="text-gray-600 dark:text-gray-400">{booking.guests}</p>
                </div>

                <div className="hidden items-center justify-center p-4 sm:flex">
                  <p className="text-black dark:text-white font-medium">Rp {Number(booking.total_price).toLocaleString('id-ID')}</p>
                </div>

                <div className="hidden items-center justify-center p-4 sm:flex">
                  {booking.status === 'paid' ? (
                    <p className="text-success-600 bg-success-50 rounded-full px-3 py-1 text-sm font-medium">Paid</p>
                  ) : booking.status === 'cancelled' ? (
                    <p className="text-error-600 bg-error-50 rounded-full px-3 py-1 text-sm font-medium">Cancelled</p>
                  ) : (
                    <p className="text-warning-600 bg-warning-50 rounded-full px-3 py-1 text-sm font-medium capitalize">{booking.status}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No recent bookings found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
